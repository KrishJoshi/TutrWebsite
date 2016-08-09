from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    url(r'^admin/?', admin.site.urls),
]

strip_slash = lambda url: url[1:] if url[0] == '/' else url

if settings.DEBUG:
    urlpatterns += [
        url(r'^%s(?P<path>.*)$' % strip_slash(settings.STATIC_URL), serve, {
            'document_root': settings.STATIC_ROOT,
        }),
        url(r'^%s(?P<path>.*)$' % strip_slash(settings.MEDIA_URL), serve, {
            'document_root': settings.MEDIA_ROOT,
        }),
    ]

urlpatterns += [
    url(r'^ckeditor/', include('ckeditor_uploader.urls')),
    url(r'', include('core.urls')),
]
