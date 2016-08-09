import random
import string
import uuid
import os

from django.test import TestCase
from django.core.files import File
from django.contrib.auth.models import User
from filer.models import Image

from core.models import Person, Story, CuratedStory, Gift, Tag


class LhrTests(TestCase):
    """
    Base class test case for an API, offers some utility and auto-test methods
    """

    def _create_person(self):
        """
        Generates a random email address, and creates a person record with it
        """

        def email_address():
            return "%s@example.com" % uuid.uuid4()

        p = Person(email_address=email_address(), title="Mr",
                   first_name="Foo", last_name="Bar",
                   address_line_1="123 Wibble St.", town="Somewhere",
                   county="Nowhere", postcode="AB12 3CD",
                   country="UK", rewards_number="abc123")
        p.save()
        return p

    def _create_story(self, person):
        """
        Utility function to create an example Story to test with
        """

        s = Story(person=person, trip_year=2015, heathrow_origin=True,
                  destination="Anywhere", terminal="T1",
                  details="Nulla vitae elit libero, a pharetra augue.")
        s.save()
        return s

    def _create_featured_story(self):
        """
        Utility function to create an example FeaturedStory to test with
        """

        s = FeaturedStory(trip_year=2015, heathrow_origin=True,
                          destination="Anywhere", terminal="T1",
                          details="Nulla vitae elit libero, a pharetra augue.")
        s.save()
        return s

    def _create_image(self):
        try:
            return self._image
        except:
            curdir = os.path.dirname(os.path.realpath(__file__))
            blank_image_path = os.path.join(curdir, 'blank.jpg')
            blank_image = File(open(blank_image_path, 'rb'))
            self._image = blank_image

        return self._image

    def _create_filer_image(self):
        try:
            return self._filer_image
        except:
            blank_image = self._create_image()
            user = User.objects.all()[0]
            image = Image.objects.create(owner=user,
                                         original_filename='blank.jpg',
                                         file=blank_image)
            self._filer_image = image

        return self._filer_image

    def _publish_story(self, story):
        """
        'Publishes' a Story object - ie. copies it to a CuratedStory, and
        marks it as visible on the site
        """

        # Create a CuratedStory from the story
        CuratedStory.objects.create_from_story(story)
        # Get the curated story from the DB and marks as published
        c = CuratedStory.objects.get(story=story)
        c.to_be_displayed = True
        c.ready_to_publish = True
        c.verified = True
        # We need a unique title/slug, easy to use uuid
        c.title = '%s' % uuid.uuid4()
        c.slug = '%s' % uuid.uuid4()
        c.save()

        return c

    def _create_gift(self):
        """
        Utility function to create an example Gift to test with
        """

        g = Gift(title="Free holiday",
                 slug="free-holiday",
                 merchant="Helpful Holiday Co",
                 description="Donec id elit non mi porta gravi at eget metus",
                 terms="Maecenas sed risus varius blandit sit amet non magna.",
                 image=self._create_filer_image(),
                 image_thumbnail=self._create_filer_image(),
                 logo_module=self._create_filer_image(),
                 logo_full=self._create_filer_image()
                 )
        g.save()
        return g

    def tearDown(self):
        """
        Tear down, delete any created models
        """

        CuratedStory.objects.all().delete()
        Story.objects.all().delete()
        Person.objects.all().delete()
        Gift.objects.all().delete()
        Tag.objects.all().delete()
