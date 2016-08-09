from django.contrib import admin
from django.forms import ModelForm
from tinymce.widgets import TinyMCE

from core.models import Gift, GiftImage


class GiftAdminForm(ModelForm):

    class Meta:
        model = Gift
        exclude = []
        widgets = {
            'description': TinyMCE,
            'included': TinyMCE,
            'terms': TinyMCE,
        }


class GiftImageInline(admin.TabularInline):
    model = GiftImage


class GiftAdmin(admin.ModelAdmin):
    form = GiftAdminForm

    list_filter = ('merchant', 'to_be_displayed', 'active')

    list_display = ('merchant', 'title', 'to_be_displayed', 'published')

    fields = ('title', 'slug', 'merchant', 'description', 'included', 'terms',
              ('image', 'image_thumbnail'), ('logo_module', 'logo_full'),
              'to_be_displayed', 'embargo_date', 'expiry_date', 'importance',
              'active')

    prepopulated_fields = {"slug": ("title",)}

    inlines = [GiftImageInline]
