import pytz
from datetime import datetime

from django.db import models
from filer.fields.image import FilerImageField

from .common import BN


class Gift(models.Model):
    """
    Model to store information about the available Gifts.  These won't be
    assigned to Stories in this system, it's just for display on the Gifts page
    """

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    merchant = models.CharField(max_length=100)

    description = models.TextField()
    included = models.TextField(**BN)
    terms = models.TextField()

    image = FilerImageField(related_name='image')
    image_thumbnail = FilerImageField(related_name='image_thumbnail')

    logo_module = FilerImageField(related_name='logo_module',
                                  verbose_name="Module logo")
    logo_full = FilerImageField(related_name='logo_full',
                                verbose_name="Main logo")

    importance = models.IntegerField(default=50)
    to_be_displayed = models.BooleanField(default=False,
                                          verbose_name='Homepage')

    active = models.BooleanField(default=True)

    embargo_date = models.DateTimeField(**BN)
    expiry_date = models.DateTimeField(**BN)

    class Meta:
        ordering = ('importance',)

    def __unicode__(self):
        return "%s - %s" % (self.merchant, self.title)

    @property
    def item_type(self):
        return "gift"

    @property
    def display_as(self):
        return "feature_gift" if self.importance == 1 else "gift"

    @property
    def is_published(self):
        return self.published()

    def published(self):
        """
        A property that deterimines whether or not the Gift is published
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

        return False
    published.boolean = True


class GiftImage(models.Model):
    gift = models.ForeignKey(Gift)
    image = FilerImageField(**BN)

    def save(self, *args, **kwargs):
        """
        If the image is removed, delete the object.
        This solves a bug with the serializer of the Gift
        """

        if not self.image:
            self.delete()
        else:
            return super(GiftImage, self).save(*args, **kwargs)
