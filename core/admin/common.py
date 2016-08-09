import ast
from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import PermissionDenied

from core.models.common import STATUSES, GIFT_TIERS


def _flatten(data):
    rdata = []
    for x in data:
        rdata += _flatten(x) if hasattr(x, '__iter__') else [x]
    return rdata


class NonSuperuserReadOnlyAdmin(admin.ModelAdmin):
    """
    A custom ModelAdmin that fills a gap left by django.

    Inherit from this ModelAdmin if you want all is_staff Users to be able to
    VIEW a model and all of it's ModelAdmin's fields in the admin interface,
    but not be able to edit anything.  You need to still give the user the 'Can
    change' permission for the model for it to appear for them in the admin
    interface, but every field will appear read only.  Users that are marked
    is_superuser can still edit models as usual, as defined by permissions in
    the ModelAdmin
    """

    def has_add_permission(self, request, obj=None):
        # Can only add if user is superuser
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        # Can only delete if user is superuser
        return request.user.is_superuser

    def get_actions(self, request):
        # Remove the delete action (if present) if user is not superuser
        actions = super(NonSuperuserReadOnlyAdmin, self).get_actions(request)
        if not request.user.is_superuser:
            if 'delete_selected' in actions:
                del actions['delete_selected']

        return actions

    def get_readonly_fields(self, request, obj):
        # Make all fields readonly if the user is not a superuser
        if not request.user.is_superuser:
            return _flatten(self.fields)

        return super(NonSuperuserReadOnlyAdmin, self).get_readonly_fields(
            request, obj)


class CustomChoiceFilter(SimpleListFilter):
    title = 'Title'
    include_all = False
    include_null = False

    def lookups(self, request, model_admin):
        return self.filter_choices
        if self.include_null:
            lookups = ((None, _('Null')),) + lookups
        if self.include_all:
            lookups = (('all', _('All')),) + lookups
        return lookups

    def choices(self, cl):
        for lookup, title in self.lookup_choices:
            if self.value() is None and lookup == self.default_value:
                selected = True
            else:
                selected = str(self.value()) == str(lookup)
            yield {
                'selected': selected,
                'query_string': cl.get_query_string({
                    self.parameter_name: lookup,
                }, []),
                'display': title,
            }

    def queryset(self, request, queryset):
        if self.value() is None:
            if self.include_null:
                query = {"%s__isnull" % self.parameter_name: True}
            else:
                query = {self.parameter_name: self.default_value}
        elif self.value() == 'all':
            query = {}
        else:
            try:
                value = ast.literal_eval(self.value())
            except:
                value = self.value()

            query = {self.parameter_name: value}

        return queryset.filter(**query)


class StatusFilter(CustomChoiceFilter):
    title = 'Status'
    parameter_name = 'status'
    filter_choices = (('all', _('All')),) + STATUSES
    default_value = 'n'


class GiftTierFilter(CustomChoiceFilter):
    title = 'Gift Tiers'
    parameter_name = 'gift_tier'
    filter_choices = (('all', _('All')), (None, _('No Tier'))) + GIFT_TIERS
    default_value = None


class VerifiedFilter(CustomChoiceFilter):
    title = 'Verified'
    parameter_name = 'verified'
    filter_choices = (('all', _('All')), (True, _('Yes')), (False, _('No')))
    default_value = False
