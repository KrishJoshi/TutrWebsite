# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-18 14:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20160518_1336'),
    ]

    operations = [
        migrations.AddField(
            model_name='featuredstory',
            name='person_name',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
    ]