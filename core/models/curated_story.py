import pytz
import re
import itertools
from datetime import datetime

from django.db import models
from django.db.models import Manager
from django.utils.translation import ugettext_lazy as _
from django.utils.text import Truncator, slugify
from django.core.exceptions import ValidationError
from django.contrib.sites.models import Site

from .help import CuratedStoryHelp as CStoryHelp
from .person import Person
from .story import BaseStory, Story
from .tag import Tag
from .common import BN, HEATHROW_TERMINALS, GIFT_TIERS


class CuratedStoryManager(Manager):

    def create_from_stories(self, story_list):
        """
        Create 1 or more CuratedStories objects using the Stories passed in
        via the story_list.  The story_list can be any iterable of Story
        objects (e.g. a simple list, a queryset, etc).
        """

        created_stories = []
        problem_stories = []

        for story in story_list:

            # Try and get an existing CuratedStory
            qs = self.filter(story=story)
            if len(qs) == 1:
                # CuratedStory already exists, continue to the next story
                continue
            else:
                # The CuratedStory doesn't exist, now check to see if there's
                # already a CuratedStory for the same Person
                qs = self.filter(person=story.person)
                if len(qs) == 0:
                    # Good, we can create one, do so, and set it's primary key
                    # to the original story
                    curated_story = CuratedStory()
                    curated_story.story = story
                else:
                    # The person already has a CuratedStory, we can't allow
                    # this, so add to the problem list
                    problem_stories.append(story)
                    continue

            # Get all of the fields in the model (CuratedStory) to iterate over
            fields = CuratedStory._meta.get_fields()

            for field in fields:
                # Get the value of the current field from the new CuratedStory
                # object, and the Story object (defaulting it to any default
                # that the CuratedStory has)
                attr_name = field.attname
                current_value = getattr(curated_story, attr_name)
                story_field_value = getattr(story, attr_name, current_value)

                if current_value != story_field_value:
                    # If the values differ, set the value on the CuratedStory
                    setattr(curated_story, attr_name, story_field_value)

            # Save the CuratedStory
            curated_story.save()
            created_stories.append(curated_story)

        # Now update all Stories that have had CuratedStories created from them
        stories = Story.objects.filter(curatedstory__in=created_stories)
        stories.update(status='a')

        return len(created_stories), len(problem_stories)

    def create_from_story(self, story):
        """
        Simple wrapper for create_from_stories that can operate on a single
        Story, rather than a list/queryset
        """
        created, problem = self.create_from_stories([story])
        if created == 1 and problem == 0:
            return True
        else:
            return False


class BaseFeaturedStory(BaseStory):
    class Meta:
        abstract = True

    title = models.CharField(max_length=255, help_text=CStoryHelp.title, **BN)
    slug = models.SlugField(unique=True, help_text=CStoryHelp.slug, **BN)
    importance = models.IntegerField(default=50,
                                     help_text=CStoryHelp.importance)
    tags = models.ManyToManyField(Tag, blank=True)
    embargo_date = models.DateTimeField(help_text=CStoryHelp.embargo, **BN)
    expiry_date = models.DateTimeField(help_text=CStoryHelp.expiry, **BN)

    ready_to_publish = models.BooleanField(default=False,
                                           help_text=CStoryHelp.ready)

    @property
    def short_details(self):
        t = Truncator(self.details)
        return t.words(20)

    @property
    def is_published(self):
        return self.published()

    def published(self):
        """
        A property that deterimines whether or not the Story is published
        (visible to users on the site).  Blank embargo and expiration dates are
        not treated as restricting.
        """

        now = pytz.utc.localize(datetime.now())

        if self.embargo_date:
            live_already = now >= self.embargo_date
        else:
            live_already = True

        if self.expiry_date:
            still_in_date = now <= self.expiry_date
        else:
            still_in_date = True

        return live_already and still_in_date
    published.boolean = True


class FeaturedStory(BaseFeaturedStory):
    class Meta:
        verbose_name_plural = _("Story - Featured")
        verbose_name_plural = _("Stories - Featured")

    content_url = models.CharField(max_length=512, **BN)
    youtube_id = models.CharField(max_length=32, **BN)
    soundcloud_id = models.IntegerField(**BN)
    person_name = models.CharField(max_length=50, **BN)

    @property
    def display_as(self):
        return "featured"

    @property
    def item_type(self):
        return "featured"

    @property
    def is_published(self):
        return self.published()

    def published(self):
        if self.ready_to_publish:
            return super(FeaturedStory, self).published()
        return False
    published.boolean = True

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        # Make sure our slug is unique across both Curated and Featured stories
        orig_slug = self.slug
        for i in itertools.count(1):
            if not CuratedStory.objects.filter(slug=self.slug).exists():
                break

            self.slug = '%s-%d' % (orig_slug, i)

        super(FeaturedStory, self).save(*args, **kwargs)

    def clean(self):
        # Set a blank content_url to none
        if not self.content_url:
            self.content_url = None
            self.youtube_id = None
            self.soundcloud_id = None

        if self.content_url is not None:
            # We have a content url, try and get the youtube/soundcloud id
            youtube_regexp = r'.*youtube\.com\/.*\?v=([^"&?\/ ]{11})'
            soundcloud_regexp = r'.*soundcloud.com/tracks/([0-9]+).*'

            result = re.search(youtube_regexp, self.content_url)
            if result is not None:
                # Matched the youtube regex, get the id and continue to save
                self.youtube_id = result.group(1)
                self.soundcloud_id = None
            else:
                # Didn't match youtube, try soundcloud ...
                result = re.search(soundcloud_regexp, self.content_url)
                if result is not None:
                    # Matched, get the soundcloud id and save
                    self.soundcloud_id = result.group(1)
                    self.youtube_id = None
                else:
                    # Doesn't match youtube or soundcloud, raise an error
                    message = 'Cannot find youtube or soundcloud id in url'
                    raise ValidationError({'content_url': message})


class CuratedStory(BaseFeaturedStory):

    class Meta:
        verbose_name_plural = _("Story - Accepted")
        verbose_name_plural = _("Stories - Accepted")

    objects = CuratedStoryManager()

    story = models.OneToOneField(Story, primary_key=True)
    person = models.ForeignKey(Person, help_text=CStoryHelp.person)

    submitted_at = models.DateTimeField(auto_now_add=True,
                                        help_text=CStoryHelp.submitted_at)

    pull_quote = models.CharField(max_length=255,
                                  help_text=CStoryHelp.pull_quote,
                                  **BN)

    gift_tier = models.CharField(max_length=2, choices=GIFT_TIERS,
                                 help_text=CStoryHelp.gift_tier, **BN)

    headline_story = models.BooleanField(default=False)

    to_be_displayed = models.BooleanField(default=False,
                                          help_text=CStoryHelp.to_be_displayed)

    verified = models.BooleanField(default=False)

    dummy_content = models.BooleanField(default=False)

    def __unicode__(self):
        return "Story: %s - %s" % (self.person.name, self.destination)

    def clean(self):
        if self.headline_story and not self.image and not self.pull_quote:
            message = 'Headlines stories need either a quote or an image'
            raise ValidationError({'headline_story': message})

    def save(self, *args, **kwargs):

        # Set a blank pull_quote/title/slug to none, for cleanliness
        if not self.pull_quote:
            self.pull_quote = None
        if not self.title:
            self.title = None
        if not self.slug:
            self.slug = None

        # Make sure we can only have 1 headline story that is a quote,
        # and 1 headline story that is a snippet.
        try:
            # Try to find other stories of the same type (image/quote)
            # that are also headline_stories, and un-headline them
            if self.headline_story:
                obj = CuratedStory.objects.exclude(pk=self.pk)
                if self.image:
                    existing = obj.exclude(image='').get(headline_story=True)
                else:
                    existing = obj.get(headline_story=True, image='',
                                       pull_quote__isnull=False)

                existing.headline_story = False
                existing.save()
        except CuratedStory.DoesNotExist:
            pass

        if not self.slug and self.title:
            self.slug = slugify(self.title)

        # Make sure our slug is unique across both Curated and Featured stories
        orig_slug = self.slug
        for i in itertools.count(1):
            if not FeaturedStory.objects.filter(slug=self.slug).exists():
                break

            self.slug = '%s-%d' % (orig_slug, i)

        return super(CuratedStory, self).save(*args, **kwargs)

    @property
    def short_details(self):
        if self.pull_quote is not None:
            return self.pull_quote

        t = Truncator(self.details)
        return t.words(20)

    @property
    def person_name(self):
        """
        Simple property in order to show the attached Person's full
        name on the Admin site
        """

        return self.person.name

    @property
    def display_as(self):
        return self.display_type()

    def display_type(self):
        if self.image:
            return "image"

        return "quote" if self.pull_quote is not None else "snippet"
    display_type.short_description = "Type"

    @property
    def item_type(self):
        return "story"

    @property
    def is_published(self):
        return self.published()

    def published(self):
        if self.to_be_displayed and self.ready_to_publish and self.verified:
            return super(CuratedStory, self).published()
        return False
    published.boolean = True

    @property
    def url(self):
        if self.slug is None:
            return ""

        site = Site.objects.all()[0]
        return "%s/story/%s" % (site.domain, self.slug)


class TierableStory(CuratedStory):
    """
    A proxy class to our CuratedStories that are for an independant 3rd party
    to assign a gift tier to.  We can't register the same CuratedStory model
    in the admin site more than once, so here we create a proxy so that we can,
    and limit the queryset to only those that have a null tier
    """

    class Meta:
        proxy = True
        verbose_name = _("Story - Tierable")
        verbose_name_plural = _("Stories - Tierable")

    def queryset(self, request):
        return self.model.objects.filter(gift_tier__is_null=True)
