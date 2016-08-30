# -*- coding: utf-8 -*-
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.mail import send_mail
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password,
                     is_staff, is_superuser, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email,
                          is_staff=is_staff, is_active=True,
                          is_superuser=is_superuser,
                          date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        return self._create_user(email, password, False, False,
                                 **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, True, True,
                                 **extra_fields)

GENDER_CHOICES = (
    (u'Male', u'Male'),
    (u'Female', u'Female'),
    )

ROLE_CHOICES = (
    (u'Tutor', u'Tutor'),
    (u'Student', u'Student'),
    )
def upload_to(instance, filename):
    return 'user_profile_image/{}/{}'.format(instance.user_id, filename)

class BaseUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(max_length=40, unique=False)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    gender= models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    hourrate = models.CharField(_('Hour Rate'), max_length=30, blank=True)
    subjects = models.CharField(_('Subjects'), max_length=30, blank=True)
    education = models.CharField(_('education'), max_length=30, blank=True)
    degree = models.CharField(_('degree'), max_length=30, blank=True)
    postcode = models.CharField(_('postcode'), max_length=30, blank=True)
    location = models.CharField(_('location'), max_length=30, blank=True)
    name_of_university = models.CharField(_('name of University'), max_length=30, blank=True)
    availability_from = models.DateTimeField(_('Available From'),  default=timezone.now)
    availability_to = models.DateTimeField(_('Available To'),  default=timezone.now)
    about = models.CharField(_('About Me'), max_length=30, blank=True)
    role = models.FilePathField(max_length=10, choices=ROLE_CHOICES, default='Student')
    avatar = models.URLField(_('image'), max_length=200, default = 'http://simpleicon.com/wp-content/uploads/user-2.png')
  
    is_staff = models.BooleanField(_('staff status'), default=False,
                                   help_text=_('Designates whether the user can log into this admin '
                                               'site.'))
    is_active = models.BooleanField(_('active'), default=True,
                                    help_text=_('Designates whether this user should be treated as '
                                                'active. Unselect this instead of deleting accounts.'))
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        "Returns the short name for the user."
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)
from django.dispatch import receiver
from allauth.socialaccount.signals import pre_social_login
@receiver(pre_social_login)
def CreateProfile(sender, request, sociallogin, **kwargs):
	"""
	This function catches the signal for social login and print the extra information
	"""
	print "LOGS: Caught the signal--> Printing extra data of the acccount: \n", sociallogin.account.extra_data
