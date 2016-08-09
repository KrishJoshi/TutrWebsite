import pytz
from datetime import datetime

from django.utils.translation import ugettext_lazy as _
from django.db import models

from .tag import Tag
from .common import BN


class Plaque(models.Model):
    """
    Model to store information about Plaque/maps
    """

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    url = models.URLField(null=True)
    pin_number = models.IntegerField(unique=True)
    importance = models.IntegerField(default=50)

    tags = models.ManyToManyField(Tag, blank=True)
    embargo_date = models.DateTimeField(**BN)
    expiry_date = models.DateTimeField(**BN)

    active = models.BooleanField(default=True)
    ready_to_publish = models.BooleanField(default=False)

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

        if self.active:
            if self.embargo_date:
                live_already = now >= self.embargo_date
            else:
                live_already = True

            if self.expiry_date:
                still_in_date = now <= self.expiry_date
            else:
                still_in_date = True

            return live_already and still_in_date
        else:
            return False

    published.boolean = True

    @property
    def display_as(self):
        return "plaque"

    @property
    def item_type(self):
        return "plaque"

    def __unicode__(self):
        return self.title
