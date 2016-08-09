from django.utils.translation import ugettext_lazy as _
from django.db import models

from .common import BN


class Person(models.Model):
    """
    Model to store information about the person submitting a story.
    A Person can submit multiple Stories, and email address is used
    as the primary key
    """

    class Meta:
        verbose_name_plural = _("People")

    email_address = models.EmailField(primary_key=True, max_length=255)

    title = models.CharField(max_length=10)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    address_line_1 = models.CharField(max_length=50, **BN)
    address_line_2 = models.CharField(max_length=50, **BN)
    address_line_3 = models.CharField(max_length=50, **BN)
    town = models.CharField(max_length=50, **BN)
    county = models.CharField(max_length=50, **BN)
    postcode = models.CharField(max_length=10, **BN)
    country = models.CharField(max_length=50, **BN)

    uk_resident = models.BooleanField(default=False)
    agree_marketting = models.BooleanField(default=False)

    rewards_number = models.CharField(max_length=50, **BN)

    def __unicode__(self):
        return "%s - %s - %s" % (self.name, self.email_address, self.country)

    @property
    def name(self):
        return "%s %s" % (self.first_name, self.last_name)
