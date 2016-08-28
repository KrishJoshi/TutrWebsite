# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-27 12:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20160827_1242'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baseuser',
            name='gender',
            field=models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=10),
        ),
        migrations.AlterField(
            model_name='baseuser',
            name='role',
            field=models.CharField(choices=[('Tutor', 'Tutor'), ('Student', 'Student')], max_length=10),
        ),
    ]