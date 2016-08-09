from django.contrib import admin

from core.models import Plaque


class PlaqueAdmin(admin.ModelAdmin):
    list_display = ('title', 'published',)
    excludes = []
    prepopulated_fields = {"slug": ("title",)}

