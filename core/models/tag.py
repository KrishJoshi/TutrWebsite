from django.db import models

from .common import BN


class Tag(models.Model):
    """
    """

    name = models.CharField(max_length=20, **BN)

    def __unicode__(self):
        return "%s" % self.name
