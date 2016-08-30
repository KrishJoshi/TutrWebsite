# -*- coding: utf-8 -*-
from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.utils.translation import ugettext_lazy
from django.views.generic import TemplateView
admin.site.site_title = ugettext_lazy('My site admin')
admin.site.site_header = ugettext_lazy('My administration')
admin.site.index_title = ugettext_lazy('Site administration')
from rest_framework import routers
from api.views import *
from accounts.FacebookLogin import FacebookLogin
router = routers.SimpleRouter()
router.register(r'subjects', SubjectsViewSet)
urlpatterns = [
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^$', TemplateView.as_view(template_name='index.html')),
                       url(r'^api/', include(router.urls)),
                       url(r'^rest-auth/', include('rest_auth.urls')),
                       url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
                       url(r'^account/', include('allauth.urls')),
                       url(r'^rest-auth/facebook/$', FacebookLogin.as_view(), name='fb_login')
                       ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


# This catch all url has to be last
