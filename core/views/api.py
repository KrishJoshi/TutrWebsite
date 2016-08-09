from random import shuffle

from django.http import HttpResponse, Http404, HttpResponseBadRequest
from django.db.models import Case, When, Max, BooleanField
from django.contrib.flatpages.models import FlatPage

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.exceptions import ValidationError
from rest_framework import status, serializers
from rest_framework_csv import renderers

from core.decorators import staff_required
from core.models import (
    Person, CuratedStory, FeaturedStory, Gift, Plaque
)
from core.serializers import (
    PersonPostSerializer, StorySerializer, CuratedStorySerializer,
    GiftSerializer, HomepageSerializer, FeaturedStorySerializer,
    GiftListSerializer, FlatPageSerializer, PlaqueSerializer, CsvSerializer,
    CSV_FIELDS
)


def _prioritise_queryset(queryset, order, tags=None):

    if type(order) == str:
        # Allow a list or a single string for the order
        order = [order]

    if tags is None:
        # No tags to prioritise, just return the ordered queryset
        return queryset.order_by(*order)

    # Annotate the queryset to add a True/False to each row, as to whether it
    # has a tag name that matches the given tags or not
    q = queryset.annotate(tagged=Max(Case(
        When(tags__name__in=tags, then=True),
        default=False,
        output_field=BooleanField()
    )))

    # Now need to group by primary key to condense records with mulitple tags
    # (some which may match and others not) into one MAX'd row
    q.query.group_by = ['pk']

    # Add the '-tagged' order to the start of the requested order, and sort
    order.insert(0, '-tagged')
    return q.order_by(*order)


def _get_filter_and_tags(request):
    _filter = {}
    tags = None

    for key, items in request.GET.lists():
        if key == 'tags_priority':
            # Special handling for tags, needs to be prioritsied later
            tags = items
        elif key == 'tags':
            # Intercept 'tags' and convert to 'tags__name'
            _filter['%s__name__in' % key] = items
        else:
            # Add everything else to the filter
            _filter['%s__in' % key] = items

    return _filter, tags


def _filter_order_queryset(queryset, _filter, tags, order=[], limit=None):
    q = queryset.filter(**_filter)
    data = _prioritise_queryset(q, order, tags)
    return data[:limit]


class LhrCsvRenderer(renderers.CSVRenderer):
    header = CSV_FIELDS


class CsvApi(APIView):
    renderer_classes = (LhrCsvRenderer, )

    @staff_required
    def get(self, request):
        data = CuratedStory.objects.filter(dummy_content=False)
        serializer = CsvSerializer(data, many=True)
        return Response(serializer.data)


class StoryApi(APIView):
    """
    A combined API endpoint for Stories in the system

    POST requests will create Person and Story objects as necessary in the
    database, based on the incoming data.

    GET requests will result in CuratedStories that have been published - or
    if the User is staff, CuratedStories that WILL be published, but are
    still being Curated.
    """

    def get(self, request, slug=None):
        """
        Get either a single (if primary key is supplied), or a list of
        CuratedStory models.

        CuratedStories are limited to those marked as to_be_displayed for all
        users. If the user is NOT logged into the admin interface, they are
        further filtered to remove all stories that are not is_published
        """

        single_item = slug is not None
        authenticated = request.user.is_authenticated()

        if single_item:
            try:
                # slug supplied, try to get the CuratedStory
                story = CuratedStory.objects.get(slug=slug,
                                                 to_be_displayed=True)

                # Check if the user is able to see this story
                if not authenticated and not story.is_published:
                    raise CuratedStory.DoesNotExist

                serializer = CuratedStorySerializer(story)
            except CuratedStory.DoesNotExist:
                # CuratedStory doesn't exist, check for a Featured Story
                try:
                    story = FeaturedStory.objects.get(slug=slug)
                    serializer = FeaturedStorySerializer(story)
                except FeaturedStory.DoesNotExist:

                    # Either the slug doesn't work, or it's not visible
                    # to the user, return 404
                    raise Http404("Story not found")
        else:
            # Get all CuratedStories, and filter/prioritise them as per request
            stories = CuratedStory.objects.all()
            _filter, tags = _get_filter_and_tags(request)
            data = _filter_order_queryset(stories, _filter, tags,
                                          '-submitted_at')

            if not authenticated:
                # Remove the not published stories for un-authed users
                data = filter(lambda model: model.is_published, data)

            serializer = CuratedStorySerializer(data, many=True)

        return Response(serializer.data)

    def post(self, request):
        """
        Create a new user submitted Story object.
        Will attempt to look for an existing person by the email_address (the
        model's primary key), and will create one from the submitted data if
        it couldn't be found.
        Once a Person has been found/created, will create a Story model from
        the data submitted.
        """

        # Parse the submitted request body
        data = request.data

        try:
            # Try and get the Person data from the request
            person_data = data['person']
            email = person_data['email_address']
        except KeyError:
            # If it doesn't exist as it should, return 400 Bad Request
            return HttpResponseBadRequest()

        try:
            # Try and get a Person from the email address
            person = Person.objects.get(email_address=email)
        except Person.DoesNotExist:
            # The email doesn't exist in any Person record
            # Use the serializer to create a new one from the posted data
            person_serializer = PersonPostSerializer(data=person_data)
            person_serializer.is_valid(raise_exception=True)
            person = person_serializer.save()

        # We now have a proper Person with it's primary key. Add it to the data
        # so that we can create a Story using the serializer
        data['person'] = person.pk
        story_serializer = StorySerializer(data=data)

        try:
            # Validate the story, allow it to raise an exception
            story_serializer.is_valid(raise_exception=True)
            story = story_serializer.save()
        except ValidationError:
            # If the validator failed, tidy up and delete the Person object
            # that was created, then re-raise (to give a 400 response)
            person.delete()
            raise

        return Response({'successful': True, 'pk': story.pk},
                        status=status.HTTP_201_CREATED)


class GiftApi(APIView):
    """
    A simple API endpoint for Gifts in the system

    Only GET requests are allowed, and reutrn either a list of Gifts, or
    and individual Gift is a pk is provided
    """

    def get(self, request, slug=None):
        """
        Get either a single (if primary key is supplied), or a list of
        Gift models.
        """

        if slug is not None:
            try:
                # pk supplied, try to get the Gift by id
                gift = Gift.objects.get(slug=slug, active=True)
                serializer = GiftSerializer(gift)
            except Gift.DoesNotExist:
                # No Gift with that pk found, return 404
                raise Http404("Gift not found")
        else:
            # Filter the Gifts based on the GET request
            _filter = {}

            for key, items in request.GET.lists():
                # fetch all the get params as lists, and filter each of them
                _filter['%s__in' % key] = items

            data = Gift.objects.filter(active=True, **_filter)
            
            if not request.user.is_authenticated():
                # Remove the not published stories for un-authed users
                data = filter(lambda model: model.is_published, data)

            serializer = GiftListSerializer(data, many=True)

        return Response(serializer.data)


class PlaqueApi(APIView):
    """
    A simple API endpoint for Plaques in the system

    Only GET requests are allowed, and reutrn either a list of plaques, or
    and individual plaques is a pk is provided
    """

    def get(self, request, slug=None):
        """
        Get either a single (if primary key is supplied), or a list of
        Plaques models.
        """

        if slug is not None:
            try:
                # slug supplied, try to get the Plaque by slug
                plaque = Plaque.objects.get(slug=slug, active=True)
                serializer = PlaqueSerializer(plaque)
            except Plaque.DoesNotExist:
                # No Plaque with that pk found, return 404
                raise Http404("Plaque not found")
        else:
            # Filter the Plaques based on the GET request
            _filter = {}

            for key, items in request.GET.lists():
                # fetch all the get params as lists, and filter each of them
                _filter['%s__in' % key] = items

            data = Plaque.objects.filter(active=True, **_filter)
            
            if not request.user.is_authenticated():
                # Remove the not published stories for un-authed users
                data = filter(lambda model: model.is_published, data)

            serializer = PlaqueSerializer(data, many=True)

        return Response(serializer.data)


class HomepageApi(APIView):
    """
    A dedicated API for the homepage, get-only.  This will return a blend of
    FeaturedStories, CuratedStories, and Gifts.  These will be randomised to an
    extent, but conforming to a list of ratios of content types.
    """

    # Define the ratios of the content as they should appear on the homepage
    desired_ratios = {
        'featured': 1,
        'image': 2,
        'quote': 3,
        'snippet': 3,
        'gift': 3,
        'plaque': 3
    }

    def _get_featured_stories(self, _filter, tags):
        """
        Get as many FeaturedStories as possible from the database, filter and
        order them as required
        """

        stories = FeaturedStory.objects.filter(**_filter)
        data = _prioritise_queryset(stories, ['importance'], tags)

        return data

    def _get_image_stories(self, _filter, tags, limit):
        """
        Get as CuratedStories (with images) from the database
        """

        # Get stories that have images
        stories = CuratedStory.objects.exclude(image='')
        # We only want ones marked as for the homepage, and we already have
        # the headline stories, so exclude those
        stories = stories.filter(to_be_displayed=True, headline_story=False)
        data = _filter_order_queryset(stories, _filter, tags,
                                      ['-submitted_at'], limit)

        return data

    def _get_quote_stories(self, _filter, tags, limit):
        """
        Get as CuratedStories (with pull quotes) from the database
        """

        # Filter for marked as for the homepage, exclude headline stories (they
        # have already be retrieved), and image should be empty, but pull quote
        # non-null
        stories = CuratedStory.objects.filter(image='',
                                              pull_quote__isnull=False,
                                              to_be_displayed=True,
                                              headline_story=False)
        data = _filter_order_queryset(stories, _filter, tags,
                                      ['-submitted_at'], limit)
        return data

    def _get_snippet_stories(self, _filter, tags, limit):
        """
        Get as CuratedStories (with neither image, or pull quote) from the
        database
        """

        # Filter for marked as for the homepage, exclude headline stories (they
        # have already be retrieved), and image and pull quote should be empty
        stories = CuratedStory.objects.filter(image='',
                                              pull_quote__isnull=True,
                                              to_be_displayed=True)
        data = _filter_order_queryset(stories, _filter, tags,
                                      ['-submitted_at'], limit)
        return data

    def _get_gifts(self, limit):

        gifts = Gift.objects.filter(to_be_displayed=True,
                                    importance__gt=1,
                                    active=True)
        return gifts.order_by('importance')[:limit]

    def _get_plaques(self, limit):
        plaques = Plaque.objects.filter(active=True)
        return plaques.order_by('importance')[:limit]

    def get(self, request, page_size=None, page=None):
        """
        Retrive data, and order for display on the homepage.  Come as close as
        possible to the desired ratios of content type for the homepage, but
        filter and prioritise as per the request
        """

        # This is our content that we will build and ultimately reutrn
        return_list = []

        _filter, tags = _get_filter_and_tags(request)

        # Get all the featured stories we can from the database
        featured = self._get_featured_stories(_filter, tags)

        try:
            # Try to get a published, active, importance=1 Gift
            gift = Gift.objects.get(to_be_displayed=True,
                                    importance=1,
                                    active=True)
            # If we get one, it's the first item in the return list
            return_list.append(gift)
        except Gift.DoesNotExist:
            # If we don't get the gift, the first item is a FeaturedStory
            featured = list(featured)
            if len(featured) > 0:
                return_list.append(featured.pop(0))

        headline_image = CuratedStory.objects.exclude(image='')
        headline_image = headline_image.filter(headline_story=True, **_filter)

        headline_quote = CuratedStory.objects.filter(image='',
                                                     pull_quote__isnull=False,
                                                     headline_story=True,
                                                     **_filter)
        return_list += headline_image
        return_list += headline_quote

        # We expect the featured stories to be the limiting factor here
        # So work out a limit on the other types of models, to save processing
        # in getting them out of the DB
        ratio_limit = len(featured) / self.desired_ratios['featured']
        images_limit = self.desired_ratios['image'] * ratio_limit
        quote_limit = self.desired_ratios['quote'] * ratio_limit
        snippet_limit = self.desired_ratios['snippet'] * ratio_limit
        gift_limit = self.desired_ratios['gift'] * ratio_limit
        plaque_limit = self.desired_ratios['plaque'] * ratio_limit

        images = self._get_image_stories(_filter, tags, images_limit)
        quotes = self._get_quote_stories(_filter, tags, quote_limit)
        snippets = self._get_snippet_stories(_filter, tags, snippet_limit)
        gifts = self._get_gifts(gift_limit)
        plaques = self._get_plaques(plaque_limit)

        items = {
            'featured': featured,
            'image': images,
            'quote': quotes,
            'snippet': snippets,
            'gift': gifts,
            'plaque': plaques
        }

        """
        # OK, so we limited the items brought back, but we might not have
        # FILLED that limit.  So now, work out how many sets of the desired
        # ratios we can achieve, with the items we have
        limits = []
        for item_type, data in items.items():
            if item_type == 'gift':
                # Don't worry about gifts limiting the page, they can just
                # stop appearing when they run out
                continue

            limit = len(data) / self.desired_ratios[item_type]
            limits.append(limit)

        # The max times we can create our desired ratios
        limit = min(limits)
        """
        limit = len(featured)

        # Loop for the number of times we can create our desired pattern
        for cycle in xrange(limit):
            # Create a list to store the data for this pattern iteration
            cycle_data = []
            for item_type, data in items.items():
                # Loop over the item types, get the number of each item, and
                # figure out the start/end indexes we need to pull out
                count_per_cycle = self.desired_ratios[item_type]
                start_ind = cycle * count_per_cycle
                end_ind = (cycle * count_per_cycle) + count_per_cycle
                # Add those items to our cycle data
                cycle_data += data[start_ind:end_ind]

            # The items are currrently all bunched together by type, shuffle it
            shuffle(cycle_data)
            return_list += cycle_data

        if not request.user.is_authenticated():
            # Remove the not published items for un-authed users
            return_list = filter(lambda model: model.is_published, return_list)

        serializer = HomepageSerializer(return_list, many=True)
        return Response(serializer.data)


class FlatPageApi(APIView):
    """
    A simple get-only API for the flatpage content retrieval.  For ease, we use
    djangos built-in flatpages to add/edit the flatpage content, but rather
    than use direct routing in django, we expose the data over the API, since
    otherwise it would mean mainting multiple frontend templates in the build,
    rather than just one.  And the frontend can easily handle the routing to
    get the data from the API
    """

    def get(self, request, url):
        """
        Retrieve a flatpage from it's url
        """

        try:
            # Add a leading slash if there isn't one
            url = '/%s' % url if url[0] != '/' else url
            # Add a trailing slash if there isn't one
            url = '%s/' % url if url[-1] != '/' else url

            # Get the flat page and serialize it
            flatpage = FlatPage.objects.get(url=url)
            serializer = FlatPageSerializer(flatpage)
        except FlatPage.DoesNotExist:
            # No Gift with that pk found, return 404
            raise Http404("Page not found")

        return Response(serializer.data)
