"""
Django settings. Environment specific values are loaded from the environment.
"""

import sys
import os
import re

from core.env_utils import parse_emails, bool_value

SECRET_KEY = '^3x)#n#+ss1*lc3rb**m+9c1ic5irzxose_2@7i6s%7&nsdg35'


SETTINGS_DIR = os.path.dirname(os.path.dirname(__file__))
BASE_DIR = os.path.join(SETTINGS_DIR, '../')
CLIENT_BASE_DIR = os.path.join(BASE_DIR, '../client')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True #bool_value(os.environ.get('DJANGO_DEBUG'))
#DEV = bool_value(os.environ.get('DJANGO_DEV'))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(SETTINGS_DIR, 'db.sqlite3'),
    }
}
# Honor the 'Host' header
ALLOWED_HOSTS = ['*']

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',
    'rest_framework',
    'accounts',
    'django.contrib.sites',
    'rest_framework.authtoken',
    'rest_auth',
    'allauth',
    'allauth.account',
    'rest_auth.registration',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
    'api',
    ]
SITE_ID = 1

ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True   
ACCOUNT_USERNAME_REQUIRED = False
SOCIALACCOUNT_EMAIL_REQUIRED = ACCOUNT_EMAIL_REQUIRED
SOCIALACCOUNT_QUERY_EMAIL = ACCOUNT_EMAIL_REQUIRED
ACCOUNT_USER_MODEL_EMAIL_FIELD  = 'email'
AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    "django.contrib.auth.backends.ModelBackend",

    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend",
)
SOCIALACCOUNT_PROVIDERS = {'facebook':{'METHOD': 'js_sdk','SCOPE': ['email', 'publish_stream'],'FIELDS': [
            'id',
            'email',
            'name',
            'first_name',
            'last_name',
            'gender',
            ],'VERSION': 'v2.7'}}
MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.BrokenLinkEmailsMiddleware',
)

ROOT_URLCONF = 'core.urls'

WSGI_APPLICATION = 'core.wsgi.application'

# Internationalization
# https://docs.djangoproject.com/en/dev/topics/i18n/
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/dev/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
#STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

# Static file and template locations
DJANGO_TEMPLATE_DIRS = (
    os.path.join(CLIENT_BASE_DIR, 'app'),
)

STATICFILES_DIRS = (
    os.path.join(CLIENT_BASE_DIR, 'app'),
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': DJANGO_TEMPLATE_DIRS,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                #'django.core.context_processors.request'
              
            ],
        },
    },
]

# Custom user
AUTH_USER_MODEL = 'accounts.BaseUser'

# REST API
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    )
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'stream': sys.stdout
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins', 'console'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
REST_AUTH_SERIALIZERS = {
        'USER_DETAILS_SERIALIZER': 'core.serializers.UserDetailsView',
        }
REST_AUTH_REGISTER_SERIALIZERS = {
        'REGISTER_SERIALIZER': 'core.serializers.RegisterSerializer',

        }
########## EMAIL CONFIGURATION
# SAMPLE CONFIGURATION FOR GMAIL SETUP
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
SITE_ID = 1
ACCOUNT_EMAIL_VERIFICATION = 'optional'
########## END EMAIL CONFIGURATION

#REST_SESSION_LOGIN = False


########## MANAGER CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#admins
ADMINS = (
    ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS
########## END MANAGER CONFIGURATION
