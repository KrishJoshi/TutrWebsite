from django.conf.urls import url

from core.views.api import (
    StoryApi, GiftApi, CsvApi, HomepageApi, FlatPageApi, PlaqueApi
)

urlpatterns = [
    url(r'^story/?$', StoryApi.as_view()),
    url(r'^story/(?P<slug>[-\w]+)/?$', StoryApi.as_view()),
    url(r'^gift/?$', GiftApi.as_view()),
    url(r'^gift/(?P<slug>[-\w]+)/?$', GiftApi.as_view()),
    url(r'^plaque/?$', PlaqueApi.as_view()),
    url(r'^plaque/(?P<slug>[-\w]+)/?$', PlaqueApi.as_view()),
    url(r'^csv/?$', CsvApi.as_view()),
    url(r'^home/?$', HomepageApi.as_view()),
    url(r'^page/(?P<url>[-\w]+)/?$', FlatPageApi.as_view()),
]
