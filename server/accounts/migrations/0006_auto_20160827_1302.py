# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-27 13:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_auto_20160827_1300'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baseuser',
            name='role',
            field=models.CharField(blank=True, choices=[('Tutor', 'Tutor'), ('Student', 'Student')], max_length=10),
        ),
    ]
