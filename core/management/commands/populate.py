from django.core.management.base import BaseCommand
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files import File
from django.contrib.auth.models import User
from django.utils.text import slugify
from rest_framework.test import APIClient
from filer.models import Image

from loremipsum import generate_paragraph, generate_sentence
import urllib
import random

from _data import data
from core.models import (
    Person, Story, CuratedStory, FeaturedStory, Gift, GiftImage
)


class Command(BaseCommand):
    help = 'Load random data into the system'

    def handle(self, *args, **options):
        self.wipe()
        self.add_data()

    def wipe(self):
        Story.objects.all().delete()
        CuratedStory.objects.all().delete()
        FeaturedStory.objects.all().delete()
        Person.objects.all().delete()
        GiftImage.objects.all().delete()
        Gift.objects.all().delete()

    def collect_options(self):
        self.story_count = int(raw_input('How many stories? '))

    def gen_title_slug(self):
        li = generate_sentence()
        title = ' '.join(li[2].split(' ')[:5])
        slug = slugify(title)
        return title, slug

    def gen_image(self, i, x=480, y=360):
        image_source = "https://unsplash.it/%s/%s?image=%s" % (x, y, i)
        image_dest = "/tmp/image.png"
        urllib.urlretrieve(image_source, image_dest)
        image = File(open(image_dest, 'rb'))
        return image

    def gen_filer_image(self, i, x=480, y=360):
        image_file = self.gen_image(i, x, y)
        user = User.objects.get(username='admin')
        image = Image.objects.create(owner=user,
                                     original_filename=image_file.file,
                                     file=image_file)
        return image

    def add_stories(self):
        print "adding 100 stories"
        for i, story_data in enumerate(data):
            print i
            if i < 10:
                story_data.pop('person')
                story = FeaturedStory.objects.create(**story_data)
                story.image = self.gen_image(i)
                title, slug = self.gen_title_slug()
                story.title = "To %s" % title
                story.slug = slug
                story.pull_quote = generate_sentence()[2]
            else:
                person_data = story_data.pop('person')
                person = Person.objects.create(**person_data)
                story_data['person_id'] = person.pk
                story = Story.objects.create(**story_data)

                if random.randint(1, 4) == 1:
                    story.image = self.gen_image(i)

            story.details = generate_paragraph()[2]
            story.save()

        CuratedStory.objects.create_from_stories(Story.objects.all())
        CuratedStory.objects.all().update(to_be_displayed=True, gift_tier=1)
        for story in CuratedStory.objects.all():
            title, slug = self.gen_title_slug()
            story.title = title
            story.slug = slug
            if not story.image:
                if random.randint(1, 2) == 1:
                    story.pull_quote = generate_sentence()[2]
            story.save()

    def add_gifts(self):
        print "adding 20 gifts"
        for i in xrange(20):
            print i
            g = Gift()
            title, slug = self.gen_title_slug()
            g.title = title
            g.slug = slug
            g.merchant = generate_sentence()[2][:10]
            g.description = generate_paragraph()[2]
            g.terms = generate_paragraph()[2]
            rand = random.randint(100, 200)
            g.image = self.gen_filer_image(rand)
            g.image_thumbnail = self.gen_filer_image(rand, 100, 100)
            rand = random.randint(200, 300)
            g.logo_full = self.gen_filer_image(rand)
            g.logo_module = self.gen_filer_image(rand, 60, 60)
            g.active = True
            g.to_be_displayed = i < 15
            g.importance = (i + 1)
            g.save()
            image_count = random.randint(1, 10)
            print "adding %s images to %s" % (image_count, g.slug)
            for _ in xrange(image_count):
                image_num = random.randint(300, 400)
                image = self.gen_filer_image(image_num)
                gift_image = GiftImage.objects.create(image=image, gift=g)

    def add_data(self):
        self.add_gifts()
        self.add_stories()
