# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-27 08:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20160525_0853'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='featuredstory',
            name='dummy_content',
        ),
        migrations.AddField(
            model_name='featuredstory',
            name='ready_to_publish',
            field=models.BooleanField(default=False, help_text="Tick when you're finished editing and are happy for the Story to go live.<br/>It will not actually go live until the embargo date"),
        ),
    ]
