"""
Test cases for the core Models
"""

from django.test import TestCase

from core.models import Person, Story, CuratedStory, Gift
from common import LhrTests


class ModelTests(LhrTests):
    """
    Test case for Models
    """

    def setUp(self):
        """
        """

        pass

    def tearDown(self):
        # Reminder, this will delete any created models
        super(ModelTests, self).tearDown()

    def testSingleCuratedStoryCreation(self):
        p = self._create_person()
        s = self._create_story(p)

        res = CuratedStory.objects.create_from_story(s)
        self.assertTrue(res)

        c = CuratedStory.objects.get(story=s)
        self.assertEquals(c.story, s)

        story_fields = Story._meta.get_fields()

        for field in story_fields:
            # CuratedStories don't have and id or status
            if field in ('id', 'status'):
                curated_value = getattr(c, attr_name)
                story_value = getattr(s, attr_name)
                self.assertEquals(curated_value, story_value)

    def testMultipleCuratedStoryCreation(self):
        p1 = self._create_person()
        p2 = self._create_person()
        s1 = self._create_story(p1)
        s2 = self._create_story(p2)

        stories = Story.objects.all()
        created, problems = CuratedStory.objects.create_from_stories(stories)
        curated_stories_from_db = CuratedStory.objects.all()

        self.assertEquals(created, 2)
        self.assertEquals(problems, 0)

    def testDuplicateCuratedStoryCreation(self):
        p1 = self._create_person()
        p2 = self._create_person()
        s1 = self._create_story(p1)
        s2 = self._create_story(p2)

        CuratedStory.objects.create_from_story(s1)

        stories = Story.objects.all()
        created, problems = CuratedStory.objects.create_from_stories(stories)

        self.assertEquals(created, 1)
        self.assertEquals(problems, 0)
