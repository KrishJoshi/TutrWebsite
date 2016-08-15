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

urlpatterns = [
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^api/', include('api.urls')),
                       url(r'^$', TemplateView.as_view(template_name='index.html')),
                       #url(r'^.*$', 'core.views.home', name='home')
                       ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


# This catch all url has to be last
