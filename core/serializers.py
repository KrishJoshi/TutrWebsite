import hashlib

from django.contrib.flatpages.models import FlatPage
from rest_framework import serializers

from .models import (
    Person, Story, CuratedStory, FeaturedStory, Gift, GiftImage, Plaque
)
from filer.fields.image import FilerImageField


CSV_FIELDS = ['person.uuid', 'person.email_address', 'person.uk_resident',
              'person.title', 'person.first_name', 'person.last_name',
              'person.rewards_number', 'person.address_line_1',
              'person.address_line_2', 'person.address_line_3', 'person.town',
              'person.county', 'person.postcode', 'person.country',
              'person.agree_marketting', 'heathrow_origin', 'destination',
              'trip_year', 'trip_month', 'trip_day', 'is_published',
              'gift_tier', 'url']


class PersonPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Person


class PersonFullSerializer(serializers.ModelSerializer):
    uuid = serializers.SerializerMethodField()

    def get_uuid(self, obj):
        return hashlib.md5(obj.email_address).hexdigest()

    class Meta:
        model = Person

        fields = ('uuid', 'email_address', 'title', 'first_name', 'last_name',
                  'address_line_1', 'address_line_2', 'address_line_3',
                  'town', 'county', 'postcode', 'country', 'rewards_number',
                  'uk_resident', 'agree_marketting')

        read_only_fields = fields


class Base64ImageField(serializers.ImageField):
    """
    A Django REST framework field for handling image-uploads through raw post
    data.  It uses base64 for encoding and decoding the contents of the file.
    """

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            # Generate file name: 12 chars of a uuid is enough for uniqueness
            file_name = str(uuid.uuid4())[:12]
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)
            complete_file_name = "%s.%s" % (file_name, file_extension, )
            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


class StorySerializer(serializers.ModelSerializer):
    person = PersonPostSerializer
    image = Base64ImageField(required=False)

    class Meta:
        model = Story
        exclude = ('submitted_at', 'status')


class CuratedStorySerializer(serializers.ModelSerializer):

    person_name = serializers.SerializerMethodField()

    def get_person_name(self, obj):
        return obj.person.name

    class Meta:
        model = CuratedStory

        fields = ('pk', 'person_name', 'trip_year', 'trip_month', 'trip_day',
                  'destination', 'terminal', 'details', 'image', 'title',
                  'pull_quote', 'slug', 'gift_tier', 'is_published',
                  'heathrow_origin')

        read_only_fields = fields


class CsvSerializer(serializers.ModelSerializer):

    person = PersonFullSerializer(read_only=True)

    class Meta:
        model = CuratedStory

        fields = ('pk', 'person', 'trip_year', 'trip_month', 'trip_day',
                  'destination', 'terminal', 'details', 'image', 'title',
                  'pull_quote', 'slug', 'gift_tier', 'is_published',
                  'heathrow_origin', 'gift_tier', 'url')

        read_only_fields = fields


class FeaturedStorySerializer(serializers.ModelSerializer):

    class Meta:
        model = FeaturedStory

        fields = ('id', 'slug', 'title', 'trip_year', 'trip_month', 'trip_day',
                  'heathrow_origin', 'destination', 'terminal', 'details',
                  'image', 'youtube_id', 'soundcloud_id', 'person_name')

        read_only_fields = fields


class GiftImageSerializer(serializers.RelatedField):

    def to_representation(self, value):
        return value.image.url


class GiftSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    image_thumbnail = serializers.ImageField()
    logo_module = serializers.ImageField()
    logo_full = serializers.ImageField()
    additional_images = GiftImageSerializer(source='giftimage_set',
                                            many=True,
                                            read_only=True)

    class Meta:
        model = Gift

        fields = ('id', 'title', 'slug', 'merchant', 'description', 'included',
                  'terms', 'image', 'image_thumbnail', 'logo_module',
                  'logo_full', 'to_be_displayed', 'additional_images',
                  'importance')

        read_only_fields = fields


class GiftListSerializer(serializers.ModelSerializer):
    image_thumbnail = serializers.ImageField()
    logo_full = serializers.ImageField()

    class Meta:
        model = Gift

        fields = ('id', 'title', 'slug', 'merchant', 'image_thumbnail',
                  'logo_full', 'to_be_displayed', 'importance')

        read_only_fields = fields


class PlaqueSerializer(serializers.ModelSerializer):

    class Meta:
        model = Plaque


class HomepageSerializer(serializers.Serializer):
    """
    A generic serializer that provides data from a variety of models (Gift,
    CuratedStory, FeaturedStory), in a basic way, such that they can be
    rendered on the homepage, and used to click through to a more detailed
    page, which will use a dedicated serializer
    """

    title = serializers.CharField()
    slug = serializers.SlugField()
    item_type = serializers.CharField()
    display_as = serializers.CharField()

    # image not relevant for quotes/snippets
    image = serializers.ImageField(required=False)

    # short_details specific only to quotes/snippets
    short_details = serializers.CharField(required=False)

    # logo/merchant/thumbnail specific only to gifts
    logo_module = serializers.ImageField(required=False)
    merchant = serializers.CharField(required=False)
    image_thumbnail = serializers.ImageField(required=False)

    # pin_number only relevant for plaques
    pin_number = serializers.IntegerField(required=False)


class FlatPageSerializer(serializers.ModelSerializer):
    """
    """

    class Meta:
        model = FlatPage

        fields = ('title', 'content')
