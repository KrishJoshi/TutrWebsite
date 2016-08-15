# -*- coding: utf-8 -*-
from django.conf.urls import include, url
from rest_framework import routers
from api.views import *
router = routers.SimpleRouter()

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    ]
