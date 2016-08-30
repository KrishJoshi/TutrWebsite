# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-30 02:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_auto_20160830_0058'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='baseuser',
            name='availability',
        ),
        migrations.AddField(
            model_name='baseuser',
            name='availability_from',
            field=models.CharField(blank=True, max_length=30, verbose_name='Availability From'),
        ),
        migrations.AddField(
            model_name='baseuser',
            name='availability_to',
            field=models.CharField(blank=True, max_length=30, verbose_name='Availability To'),
        ),
    ]