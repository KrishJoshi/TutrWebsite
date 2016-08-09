from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.contrib.flatpages.models import FlatPage

from common import NonSuperuserReadOnlyAdmin
from core.models import (
    Story, CuratedStory, TierableStory, FeaturedStory, Tag, Person, Gift,
    Plaque
)
from story import (
    StoryAdmin, CuratedStoryAdmin, TierableStoryAdmin, FeaturedStoryAdmin
)
from gift import GiftAdmin
from flatpage import PageAdmin
from plaque import PlaqueAdmin


def get_actions_replacer(orig_func):
    def fixed_get_actions(self, request):
        """
        Remove the delete action (if present) if user does not have the
        necessary permission
        """

        # Get the base actions
        actions = orig_func(self, request)
        # Get the app label and model name to form the permission name
        app_label = self.model._meta.app_label
        model_name = self.model._meta.model_name
        perm = "%s.delete_%s" % (app_label, model_name)
        # If the user does not have the specific delete perm, remove the action
        if not request.user.has_perm(perm):
            if 'delete_selected' in actions:
                del actions['delete_selected']

        return actions
    return fixed_get_actions

ModelAdmin.get_actions = get_actions_replacer(ModelAdmin.get_actions)


@admin.register(Person)
class PersonAdmin(NonSuperuserReadOnlyAdmin):
    fields = ('email_address', 'title', 'first_name', 'last_name',
              'address_line_1', 'address_line_2', 'address_line_3', 'town',
              'county', 'postcode')


admin.site.register(Plaque, PlaqueAdmin)
admin.site.register(Tag, admin.ModelAdmin)
admin.site.register(Story, StoryAdmin)
admin.site.register(CuratedStory, CuratedStoryAdmin)
admin.site.register(TierableStory, TierableStoryAdmin)
admin.site.register(FeaturedStory, FeaturedStoryAdmin)
admin.site.register(Gift, GiftAdmin)

admin.site.unregister(FlatPage)
admin.site.register(FlatPage, PageAdmin)
