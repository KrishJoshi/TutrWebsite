"""
Django settings for LHR70 project.

Generated by 'django-admin startproject' using Django 1.9.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'w7528&6z!567xx^kv5084od&#9v5iufrs09*x_%(-4d8k_&lyv'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.flatpages',
    'django.contrib.sitemaps',
    'rest_framework',
    'core',
    'filer',
    'easy_thumbnails',
    'mptt',
    'tinymce',
    'ckeditor',
    'ckeditor_uploader',
    'axes',
]

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.contrib.flatpages.middleware.FlatpageFallbackMiddleware',
    'axes.middleware.FailedLoginMiddleware',
]

ROOT_URLCONF = 'LHR70.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'debug': DEBUG,
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'LHR70.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators
validators = 'django.contrib.auth.password_validation'
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': '%s.UserAttributeSimilarityValidator' % validators,
    },
    {
        'NAME': '%s.MinimumLengthValidator' % validators,
    },
    {
        'NAME': '%s.CommonPasswordValidator' % validators,
    },
    {
        'NAME': '%s.NumericPasswordValidator' % validators,
    },
]

TINYMCE_DEFAULT_CONFIG = {
    'theme': "advanced",
    'theme_advanced_toolbar_location' : "top",
    'theme_advanced_buttons1': "formatselect,bold,italic,separator,bullist,separator,link,unlink,separator,undo,redo,",
    'theme_advanced_buttons2': "",
    'theme_advanced_buttons3': "",
    'theme_advanced_blockformats': 'p,h2',
}

# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

SITE_ID = 1

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# CKEditor settings

CKEDITOR_JQUERY_URL = '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'
CKEDITOR_UPLOAD_PATH = 'uploads/'
CKEDITOR_IMAGE_BACKEND = 'pillow'
CKEDITOR_ALLOW_NONIMAGE_FILES = False
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'Custom',
        'format_tags': 'p;h2',
        'toolbar_Custom': [
            ['Format', 'Bold', 'Italic', 'Underline', 'Strike'],
            ['BulletedList', 'NumberedList'],
            ['Image', 'Link', 'Unlink'],
            ['RemoveFormat', 'Source', 'Iframe']
        ]
    },
}

AXES_LOGIN_FAILURE_LIMIT = 5
AXES_COOLOFF_TIME = 1

try:
    from .local_settings import *
except ImportError:
    pass
