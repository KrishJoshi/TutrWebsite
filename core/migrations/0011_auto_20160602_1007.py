# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-06-02 10:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_auto_20160527_0850'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gift',
            name='to_be_displayed',
            field=models.BooleanField(default=False, verbose_name=b'Homepage'),
        ),
    ]
