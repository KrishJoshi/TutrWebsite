from __future__ import unicode_literals

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils.text import Truncator

from .person import Person
from .help import StoryHelp
from .common import BN, HEATHROW_TERMINALS, STATUSES


class BaseStory(models.Model):
    class Meta:
        abstract = True

    trip_year = models.IntegerField(help_text=StoryHelp.trip_year, **BN)
    trip_month = models.IntegerField(help_text=StoryHelp.trip_month, **BN)
    trip_day = models.IntegerField(help_text=StoryHelp.trip_day, **BN)
    heathrow_origin = models.BooleanField(default=True,
                                          help_text=StoryHelp.heathrow_origin)
    destination = models.CharField(max_length=255,
                                   help_text=StoryHelp.destination, **BN)
    terminal = models.CharField(max_length=2, choices=HEATHROW_TERMINALS,
                                help_text=StoryHelp.terminal, **BN)
    details = models.TextField()
    image = models.ImageField(upload_to="story_images",
                              help_text=StoryHelp.image,
                              **BN)


class Story(BaseStory):
    """
    User-submitted Story model.
    This is created when a user fills in a form to submittheir story.
    This will be moderated in the admin interface, and if not rejected,
    a CuratedStory object will be created using this as a template.
    """

    class Meta:
        verbose_name = _("Story - User submitted")
        verbose_name_plural = _("Stories - User submitted")

    person = models.ForeignKey(Person, help_text=StoryHelp.person)
    submitted_at = models.DateTimeField(auto_now_add=True,
                                        help_text=StoryHelp.submitted_at)
    status = models.CharField(max_length=1, default=STATUSES[0][0],
                              choices=STATUSES, help_text=StoryHelp.status)

    def __init__(self, *args, **kwargs):
        super(Story, self).__init__(*args, **kwargs)
        self.__initial_status = self.status

    def __unicode__(self):
        return "Story: %s - %s" % (self.person_name, self.destination)

    @property
    def person_name(self):
        return self.person.name

    @property
    def short_details(self):
        t = Truncator(self.details)
        return t.words(12)

    def save(self, *args, **kwargs):
        """
        Placeholder - we can use this pattern to prevent Accepted stories
        being changed to New/Rejected
        """

        if self.status != self.__initial_status:
            pass

        super(Story, self).save(*args, **kwargs)
        self.__initial_status = self.status
