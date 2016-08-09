import pytz
from datetime import datetime

from django.contrib.sitemaps import Sitemap
from core.models import CuratedStory, FeaturedStory, Gift


class CuratedStorySitemap(Sitemap):
    changefreq = "daily"

    def items(self):
        qs = CuratedStory.objects.all()
        return filter(lambda model: model.is_published, qs)

    def location(self, obj):
        return "/story/%s" % obj.url

    def priority(self, obj):
        utc = datetime.utcnow().replace(tzinfo=pytz.utc)
        delta = utc - obj.submitted_at
        days = delta.days
        if days > 99:
            days = 99
        priority = (100 - days) / 100.0
        return priority


class FeaturedStorySitemap(Sitemap):
    changefreq = "daily"

    def items(self):
        qs = FeaturedStory.objects.all()
        return filter(lambda model: model.is_published, qs)

    def location(self, obj):
        return "/story/%s" % obj.url

    def priority(self, obj):
        return int(100 - obj.importance) / 100.0


class GiftSitemap(Sitemap):
    changefreq = "daily"

    def items(self):
        qs = Gift.objects.all()
        return filter(lambda model: model.is_published, qs)

    def location(self, obj):
        return "/gift/%s" % obj.slug

    def priority(self, obj):
        return int(100 - obj.importance) / 100.0
