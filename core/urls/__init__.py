from django.conf.urls import patterns, url, include
from django.contrib.sitemaps.views import sitemap
from django.contrib.flatpages.sitemaps import FlatPageSitemap

from core.views import IndexView
from core.sitemap import CuratedStorySitemap, FeaturedStorySitemap, GiftSitemap


sitemaps = {
    "user_stories": CuratedStorySitemap,
    "featured_stories": FeaturedStorySitemap,
    "gifts": GiftSitemap,
    "flatpages": FlatPageSitemap
}

urlpatterns = [
    # API and REST framework urls
    url(r"^api/", include("core.urls.api", namespace="api")),
    url(r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps},
        name='django.contrib.sitemaps.views.sitemap'),
    # All other pages should redirect to index as they're managed by AngularJS
    url(r"^.*$", IndexView.as_view(), name="index")
]
