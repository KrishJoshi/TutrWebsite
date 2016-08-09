# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-11 15:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20160511_1342'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='tierablestory',
            options={'verbose_name': 'Story - Tierable', 'verbose_name_plural': 'Stories - Tierable'},
        ),
        migrations.RemoveField(
            model_name='curatedstory',
            name='curated_image',
        ),
        migrations.AddField(
            model_name='curatedstory',
            name='verified',
            field=models.BooleanField(default=False),
        ),
    ]
