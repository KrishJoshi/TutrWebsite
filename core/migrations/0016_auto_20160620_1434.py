# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-06-20 14:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_auto_20160620_1429'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plaque',
            name='pin_number',
            field=models.IntegerField(unique=True),
        ),
    ]
