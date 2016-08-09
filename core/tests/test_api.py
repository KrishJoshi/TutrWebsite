"""
Test cases for the core API
"""

from collections import OrderedDict
import uuid

from django.test import TestCase
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework.test import APIClient
from rest_framework.utils.serializer_helpers import ReturnList, ReturnDict

from core.models import Person, Story, CuratedStory, FeaturedStory, Gift, Tag
from common import LhrTests


class ApiTests(LhrTests):
    """
    Base class test case for an API, offers some utility and auto-test methods
    """

    endpoint = None
    allowed_methods_to_autotest = []
    disallowed_methods_to_autotest = []

    @classmethod
    def setUpClass(cls):
        """
        Create an admin user that can be logged in as to test the API
        """

        super(ApiTests, cls).setUpClass()
        User.objects.create_superuser('admin', 'admin@example.com', 'password')

    def setUp(self):
        """
        Set up, use the API client
        """

        self.client = APIClient()

    def tearDown(self):
        # Reminder, this will delete any created models
        super(ApiTests, self).tearDown()

    def testMethodsAllowed(self):
        """
        Auto test the class's allowed methods, make sure they return a 200 OK
        """

        if self.endpoint is not None:
            for method in self.allowed_methods_to_autotest:
                client_method = getattr(self.client, method)
                response = client_method(self.endpoint)
                self.assertEquals(response.status_code, 200)

    def testMethodsNotAllowed(self):
        """
        Auto test the class's disallowed methods, make sure they return a 200
        405 Method Not Allowed
        """

        expected_message = 'Method "%s" not allowed.'

        if self.endpoint is not None:
            for method in self.disallowed_methods_to_autotest:
                client_method = getattr(self.client, method)
                response = client_method(self.endpoint)
                self.assertEquals(response.status_code, 405)
                detail = response.data['detail']
                self.assertEquals(detail, expected_message % method.upper())


class StoryApiTests(ApiTests):
    """
    Test the Story API, inherit from teh ApiTests class
    """

    endpoint = '/api/story'

    # Can't auto-test POST, as we need correct data
    allowed_methods_to_autotest = ['head', 'options', 'get']
    disallowed_methods_to_autotest = ['put', 'patch', 'delete']

    def testStorySubmission(self):
        """
        Submit a correctly structured Story (with Person data) in a json object
        Make sure that we can query the database directly for it afterwards
        """

        self.assertEquals(Person.objects.count(), 0)
        self.assertEquals(Story.objects.count(), 0)

        story_data = {
            "person": {
                "email_address": "foo@example.com",
                "title": "Mr",
                "first_name": "Foo",
                "last_name": "Bar",
                "address_line_1": "123 Wibble St.",
                "address_line_2": "",
                "address_line_3": "",
                "town": "Somewhere",
                "county": "Nowhere",
                "postcode": "AB12 3CD",
                "country": "UK",
                "rewards_number": "abc123"
            },
            "trip_year": 2015,
            "heathrow_origin": True,
            "destination": "Everywhere",
            "terminal": "T1",
            "details": "Nulla vitae elit libero, a pharetra augue."
        }

        # Try and save
        response = self.client.post(self.endpoint, story_data, format='json')

        # We should get back a HTTP 201 Created response
        self.assertEquals(response.status_code, 201)
        # We should now have 1 Person object
        self.assertEquals(Person.objects.count(), 1)
        # And we should have 1 Story object
        self.assertEquals(Story.objects.count(), 1)

        # Check the details of the created models
        person = Person.objects.all()[0]
        story = Story.objects.all()[0]
        person_data = story_data.pop('person')

        # Iterate over all the fields we submitted and check the stored Person
        # data matches
        for field in person_data.keys():
            submitted_value = person_data[field]
            stored_value = getattr(person, field)
            self.assertEquals(submitted_value, stored_value)

        # Same for the story data we submitted, check it was stored correctly
        for field in story_data.keys():
            submitted_value = story_data[field]
            stored_value = getattr(story, field)
            self.assertEquals(submitted_value, stored_value)

    def testBadRequest(self):
        """
        Make sure that bad/incomplete data for both Person and Story
        don't result in either objects being created in the database
        """

        self.assertEquals(Person.objects.count(), 0)
        self.assertEquals(Story.objects.count(), 0)

        # Missing Person data
        story_data = {
            "trip_year": 2015,
            "heathrow_origin": True,
            "destination": "Everywhere",
            "terminal": "T1",
            "details": "Nulla vitae elit libero, a pharetra augue."
        }

        # Try and save
        response = self.client.post(self.endpoint, story_data, format='json')

        # We should get back a HTTP 400 Bad Request
        self.assertEquals(response.status_code, 400)
        # No Person or Story objects should have been created
        self.assertEquals(Person.objects.count(), 0)
        self.assertEquals(Story.objects.count(), 0)

        # Missing Story data
        story_data = {
            "person": {
                "email_address": "foo@example.com",
                "title": "Mr",
                "first_name": "Foo",
                "last_name": "Bar",
                "address_line_1": "123 Wibble St.",
                "address_line_2": "",
                "address_line_3": "",
                "town": "Somewhere",
                "county": "Nowhere",
                "postcode": "AB12 3CD",
                "country": "UK",
                "rewards_number": "abc123"
            }
        }

        # Try and save
        response = self.client.post(self.endpoint, story_data, format='json')

        # We should get back a HTTP 400 Bad Request
        self.assertEquals(response.status_code, 400)
        # No Person or Story objects should have been created
        self.assertEquals(Person.objects.count(), 0)
        self.assertEquals(Story.objects.count(), 0)

    def testDuplicatePerson(self):
        """
        If one person (primary key, email address) submits more than one story
        we should not create a duplicate Person in the database, but attach
        that same Person to both Stories
        """

        self.assertEquals(Person.objects.count(), 0)
        self.assertEquals(Story.objects.count(), 0)

        story_data = {
            "person": {
                "email_address": "foo@example.com",
                "title": "Mr",
                "first_name": "Foo",
                "last_name": "Bar",
                "address_line_1": "123 Wibble St.",
                "address_line_2": "",
                "address_line_3": "",
                "town": "Somewhere",
                "county": "Nowhere",
                "postcode": "AB12 3CD",
                "country": "UK",
                "rewards_number": "abc123"
            },
            "trip_year": 2015,
            "heathrow_origin": True,
            "destination": "Everywhere",
            "terminal": "T1",
            "details": "Nulla vitae elit libero, a pharetra augue."
        }

        # Save it
        response = self.client.post(self.endpoint, story_data, format='json')

        # Modify the Story info slightly, and re-save it
        story_data['terminal'] = "T2"
        story_data['year'] = 2016
        story_data['destination'] = 'The Moon'
        response = self.client.post(self.endpoint, story_data, format='json')

        # We should now have 2 Story objects, but only 1 person
        self.assertEquals(Person.objects.count(), 1)
        self.assertEquals(Story.objects.count(), 2)

    def testGetStoryList(self):
        """
        Making a GET request to /api/story should result in a list of
        Curated Story objects.  But NOT Story objects.
        """

        person = self._create_person()
        story = self._create_story(person)

        # Request the list of stories, which should be empty (since none
        # are yet curated/published)
        response = self.client.get(self.endpoint, format='json')
        stories = response.data
        self.assertIs(type(stories), ReturnList)
        self.assertEquals(len(stories), 0)

        # Publish the story that we created
        curated_story = self._publish_story(story)

        # Now we should get back 1 curated story
        response = self.client.get(self.endpoint, format='json')
        stories = response.data
        self.assertIs(type(stories), ReturnList)
        self.assertEquals(len(stories), 1)
        self.assertIs(type(stories[0]), OrderedDict)

    def testGetMissingStory404(self):
        """
        Making a GET request to /api/story/id for an invalid CuratedStory
        id, should result in a 404
        """

        # Create a Story, but don't publish it
        person = self._create_person()
        story = self._create_story(person)

        # Try to get the unpublished Story by id, we should get a 404
        response = self.client.get('%s/%s' % (self.endpoint, story.pk),
                                   format='json')
        self.assertEquals(response.status_code, 404)

    def testGetStory(self):
        """
        Test getting a published CuratedStory by id
        """

        person = self._create_person()
        story = self._create_story(person)
        curated_story = self._publish_story(story)
        slug = curated_story.slug
        response = self.client.get('%s/%s' % (self.endpoint, slug),
                                   format='json')

        self.assertEquals(response.status_code, 200)
        self.assertIs(type(response.data), ReturnDict)

        # The API should only return the person's name, not full details
        self.assertEquals(response.data['person_name'], person.name)

    def testGetNotDisplayedStory(self):
        """
        Try and get (by id) a known CuratedStory that is not set
        to_be_displayed, we shoudl get a 404
        """

        person = self._create_person()
        story = self._create_story(person)
        curated_story = self._publish_story(story)
        curated_story.to_be_displayed = False
        curated_story.save()

        response = self.client.get('%s/%s' % (self.endpoint,
                                   curated_story.slug),
                                   format='json')
        self.assertEquals(response.status_code, 404)

    def testGetUnpublishedStory(self):
        """
        Try and get (by id) a known CuratedStory that is not set
        ready_to_publish, we shoudl get a 404
        """
        person = self._create_person()
        story = self._create_story(person)
        curated_story = self._publish_story(story)
        curated_story.ready_to_publish = False
        curated_story.save()
        slug = curated_story.slug

        response = self.client.get('%s/%s' % (self.endpoint, slug),
                                   format='json')
        self.assertEquals(response.status_code, 404)

    def testGetStoryListMixed(self):
        """
        Check that a mixture of published, unpublished, and not-yet-published
        stories return as they should
        """

        # Create 3 people, and stories
        person1 = self._create_person()
        story1 = self._create_story(person1)
        person2 = self._create_person()
        story2 = self._create_story(person2)
        person3 = self._create_person()
        story3 = self._create_story(person3)

        # Publish one of the stories
        curated_story = self._publish_story(story2)

        response = self.client.get(self.endpoint, format='json')
        stories = response.data

        # We should get a list of 1 story back (the published one)
        self.assertIs(type(stories), ReturnList)
        self.assertEquals(len(stories), 1)

        # Publish another one of the stories
        curated_story = self._publish_story(story3)
        # But set it to not yet ready_to_publish
        curated_story.ready_to_publish = False
        curated_story.save()

        # Get the stories
        response = self.client.get(self.endpoint, format='json')
        stories = response.data

        # We should still only have list with 1 story
        self.assertIs(type(stories), ReturnList)
        self.assertEquals(len(stories), 1)

    def testGetStoryListByTag(self):
        """
        Supply some Tag names in the get request's parameters, and make sure
        that only stories marked with those tags are returned
        """

        # Create 2 persons, stories, and publish them
        person1 = self._create_person()
        story1 = self._create_story(person1)
        person2 = self._create_person()
        story2 = self._create_story(person2)

        curated_story1 = self._publish_story(story1)
        curated_story2 = self._publish_story(story2)

        # Create 2 new Tags
        music_tag = Tag.objects.create(name='music')
        romance_tag = Tag.objects.create(name='romance')

        # Give one of the stories both tags, and the other, only one
        curated_story1.tags = Tag.objects.all()
        curated_story1.save()
        curated_story2.tags = [romance_tag]
        curated_story2.save()

        # Check that we still get both stories if providing a wrong tag
        get_params = {'tags_priority': 'incorrect_tag'}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 2)

        # Check that we get both story for the music tag
        get_params = {'tags_priority': 'music'}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 2)
        # and that the first item returned is the one with the music tag
        self.assertEquals(stories[0]['pk'], curated_story1.pk)

        # Check that we get both stories for the romance tag
        get_params = {'tags_priority': 'romance'}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 2)
        # and that the first item returned is the one with the romance tag
        self.assertEquals(stories[0]['pk'], curated_story2.pk)

        # Check that we get both stories for a list of both tags
        get_params = {'tags_priority': ['music', 'romance']}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 2)

        # Check a combo of 1 correct and one wrong tag
        get_params = {'tags_priority': ['music', 'incorrect_tag']}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 2)
        # and that the first item returned is the one with the music tag
        self.assertEquals(stories[0]['pk'], curated_story1.pk)

    def testGetStoryListFilterByAttribute(self):
        """
        Supply some attribute values in the get request's parameters, and make
        sure that only stories with those attribute values are returned
        """

        # Create 2 persons, stories, and publish them
        person1 = self._create_person()
        story1 = self._create_story(person1)
        person2 = self._create_person()
        story2 = self._create_story(person2)

        curated_story1 = self._publish_story(story1)
        curated_story2 = self._publish_story(story2)

        # Set 2 different terminals one each story
        curated_story1.terminal = 'T1'
        curated_story1.save()
        curated_story2.terminal = 'T2'
        curated_story2.save()

        # Make sure we get one story for T1
        get_params = {'terminal': 'T1'}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 1)

        # Make sure we get one story for T2
        get_params = {'terminal': 'T2'}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 1)

        # Make sure we get no stories for T3
        get_params = {'terminal': 'T3'}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 0)

    def testGetStoryListFilterByAttribute(self):
        """
        Supply some Tag names in the get request's parameters, and make sure
        that only stories marked with those tags are returned
        """

        # Create 3 persons, stories, and publish them
        person1 = self._create_person()
        story1 = self._create_story(person1)
        person2 = self._create_person()
        story2 = self._create_story(person2)
        person3 = self._create_person()
        story3 = self._create_story(person3)

        curated_story1 = self._publish_story(story1)
        curated_story2 = self._publish_story(story2)
        curated_story3 = self._publish_story(story3)

        # Create some tags
        music_tag = Tag.objects.create(name='music')
        romance_tag = Tag.objects.create(name='romance')

        # Assign each story some tags, and a terminal
        curated_story1.tags = [romance_tag]
        curated_story1.terminal = 'T1'
        curated_story1.save()

        curated_story2.tags = Tag.objects.all()
        curated_story2.terminal = 'T2'
        curated_story2.save()

        curated_story3.tags = [romance_tag]
        curated_story3.terminal = 'T2'
        curated_story3.save()

        # Make sure we get back the correct results
        get_params = {'terminal': 'T1', 'tags': 'romance'}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 1)

        # Make sure we get back the correct results
        get_params = {'terminal': 'T2', 'tags': 'romance'}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 2)

        # Make sure we get back the correct results
        get_params = {'terminal': 'T2', 'tags': 'music'}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 1)

        # Make sure we get back the correct results
        get_params = {'terminal': 'T2', 'tags': 'incorrect'}
        response = self.client.get(self.endpoint, get_params, format='json')
        stories = response.data
        self.assertEquals(len(stories), 0)


class LoggedInStoryApiTests(StoryApiTests):
    """
    Test case for API as logged-in user
    Extends the StoryApiTests class, to run the exact same tests as a logged-
    out user, but overrides (or adds new) tests specifically to test the
    changes for logged-in users
    """

    def setUp(self):
        """
        Set up, use the APIClient, and login
        """

        self.client = APIClient()
        self.client.login(username='admin', password='password')

    def tearDown(self):
        """
        Tear down, log out
        """

        self.client.logout()

    def testGetUnpublishedStory(self):
        """
        For a logged-in user, a CuratedStory marked as to_be_displayed, but not
        ready_to_publish, should still be returned
        """

        person = self._create_person()
        story = self._create_story(person)
        curated_story = self._publish_story(story)
        curated_story.ready_to_publish = False
        curated_story.save()

        response = self.client.get('%s/%s' % (self.endpoint,
                                   curated_story.slug), format='json')

        self.assertEquals(response.status_code, 200)

        story = response.data
        self.assertIs(type(story), ReturnDict)

    def testGetStoryListMixed(self):
        """
        Check that a mixture of published, unpublished, and not-yet-published
        stories return as they should
        """

        # Create 3 people, and stories
        person1 = self._create_person()
        story1 = self._create_story(person1)
        person2 = self._create_person()
        story2 = self._create_story(person2)
        person3 = self._create_person()
        story3 = self._create_story(person3)

        # Publish one of the stories
        curated_story = self._publish_story(story2)

        response = self.client.get(self.endpoint, format='json')
        stories = response.data

        # We should get a list of 1 story back (the published one)
        self.assertIs(type(stories), ReturnList)
        self.assertEquals(len(stories), 1)

        # Publish another one of the stories
        curated_story = self._publish_story(story3)
        # But set it to not yet ready_to_publish
        curated_story.ready_to_publish = False
        curated_story.save()

        response = self.client.get(self.endpoint, format='json')
        stories = response.data

        # We should now get a list of 2 stories
        self.assertIs(type(stories), ReturnList)
        self.assertEquals(len(stories), 2)


class GiftApiTests(ApiTests):

    endpoint = '/api/gift'

    # This is a GET-only endpoint, make sure it can't perform unsafe methods
    allowed_methods_to_autotest = ['head', 'options', 'get']
    disallowed_methods_to_autotest = ['post', 'put', 'patch', 'delete']

    def testGetGiftList(self):
        """
        Making a GET request to /api/gift should result in a list of Gift
        """

        # Request the list of gift, which should be empty
        response = self.client.get(self.endpoint, format='json')
        gifts = response.data
        self.assertIs(type(gifts), ReturnList)
        self.assertEquals(len(gifts), 0)

        # Create a gift
        gift = self._create_gift()

        # Now we should get back 1 gift in the list
        response = self.client.get(self.endpoint, format='json')
        gifts = response.data
        self.assertIs(type(gifts), ReturnList)
        self.assertEquals(len(gifts), 1)
        self.assertIs(type(gifts[0]), OrderedDict)

    def testGetMissingGift404(self):
        """
        Making a GET request to /api/gift/id for an invalid Gift id, should
        result in a 404
        """

        # Request a particular Gift that doesn't exist
        response = self.client.get('%s/%s' % (self.endpoint, 1),
                                   format='json')
        self.assertEquals(response.status_code, 404)

    def testGetGift(self):
        """
        Create a Gift in the database, and test that we get it back from the
        API in the correct form
        """

        gift = self._create_gift()
        response = self.client.get('%s/%s' % (self.endpoint, gift.slug),
                                   format='json')

        self.assertEquals(response.status_code, 200)
        self.assertIs(type(response.data), ReturnDict)


class HomepageApiTests(ApiTests):
    """
    Test the Story API, inherit from teh ApiTests class
    """

    endpoint = '/api/home'

    # Can't auto-test POST, as we need correct data
    allowed_methods_to_autotest = ['head', 'options', 'get']
    disallowed_methods_to_autotest = ['post', 'put', 'patch', 'delete']

    def _createStories(self, count):
        for _ in xrange(count):
            person = self._create_person()
            story = self._create_story(person)
            self._publish_story(story)

    def _createFeaturedStories(self, count):
        for _ in xrange(count):
            FeaturedStory.objects.create

    def testHeroStories(self):
        """
        """

        self._createStories(50)
        self._createFeaturedStories(10)

        stories = CuratedStory.objects.all()
        for story in stories[0:10]:
            story.image = self._create_image()
            story.save()

        for story in stories[10:20]:
            story.pull_quote = story.details[:40]
            story.save()

        response = self.client.get(self.endpoint, format='json')

    def testBadRequest(self):
        """
        Make sure that bad/incomplete data for both Person and Story
        don't result in either objects being created in the database
        """

        pass


class LoggedInHomepageApiTests(HomepageApiTests):
    """
    Test case for API as logged-in user
    Extends the HomepageApiTests class, to run the exact same tests as a
    logged-out user, but overrides (or adds new) tests specifically to test the
    changes for logged-in users
    """

    def setUp(self):
        """
        Set up, use the APIClient, and login
        """

        self.client = APIClient()
        self.client.login(username='admin', password='password')

    def tearDown(self):
        """
        Tear down, log out
        """

        self.client.logout()
