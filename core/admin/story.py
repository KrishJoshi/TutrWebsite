from django.http import HttpResponseRedirect
from django.contrib import admin
from django import forms
from django.core.urlresolvers import reverse
from django.contrib import messages

from ckeditor_uploader.widgets import CKEditorUploadingWidget
from tinymce.widgets import TinyMCE

from core.models import Story, CuratedStory, TierableStory, FeaturedStory
from common import (
    NonSuperuserReadOnlyAdmin, StatusFilter, GiftTierFilter, VerifiedFilter,
    _flatten
)


class StoryAdmin(NonSuperuserReadOnlyAdmin):

    ordering = ('-status',)
    list_filter = (StatusFilter,)
    list_display = ('person_name', 'destination', 'short_details',
                    'submitted_at')
    actions = ['accept', 'reject']
    fields = ('person', ('trip_year', 'trip_month', 'trip_day'),
              ('destination', 'terminal'), 'heathrow_origin', 'details',
              'image', 'status')

    readonly_fields = _flatten(fields)

    def _get_message_bit(self, rows_updated):
        """
        Get the first 'bit' of the user message when updating models
        e.g. "1 Thingy was" or "5 Thingies were"
        """

        model_name = self.model._meta.object_name
        plural_name = self.model._meta.verbose_name_plural
        if rows_updated == 1:
            message_bit = "1 %s was" % model_name
        else:
            message_bit = "%s %s were" % (rows_updated, plural_name)

        return message_bit

    def message_user_results(self, request, successes, failures, action):
        """
        Message the user following an action, to inform of how many items
        were affected by the action.
        """

        self.message_user_success(request, successes, action)
        self.message_user_failure(request, failures, action)

    def message_user_success(self, request, count, action):
        """
        Message the user following an action, to inform of how many items
        were affected by the action.
        """

        message_bit = self._get_message_bit(count)
        self.message_user(request, "%s %s." % (message_bit, action))

    def message_user_failure(self, request, count, action):
        """
        Message the user following an action, to inform of how many items
        were affected by the action.
        """

        message_bit = self._get_message_bit(count)
        level = messages.ERROR
        message = "%s could not be %s." % (message_bit, action)
        self.message_user(request, message, level=level)

    def accept(self, request, queryset):
        """
        Accept action
        Accept the Stories provided, and supply a message to the User
        saying how many were successfully accepted
        """

        created, problems = self.accept_stories(queryset)
        self.message_user_results(request, created, problems, "accepted")

    accept.short_description = "Accept selected Stories"

    def reject(self, request, queryset):
        """
        Reject action
        Reject the Stories provided, and supply a message to the User
        saying how many were successfully rejected
        """

        rejected_count = self.reject_stories(queryset)
        self.message_user_results(request, rejected_count, 0, "rejected")

    reject.short_description = "Reject selected Stories"

    def accept_stories(self, queryset):
        # Filter the queryset provided to get rid of already-accepted Stories
        stories_to_copy = queryset.exclude(status='a')

        # User the CuratedStory manager to copy (or get already-copied) Stories
        manager = CuratedStory.objects
        return manager.create_from_stories(stories_to_copy)

    def accept_story(self, story):
        """
        Wrapper for the accept_stories method, takes one Story, gets a queryset
        with it in, and runs accept_stories on it, and returns the created
        curated story
        """

        queryset = Story.objects.filter(pk=story.pk)
        return self.accept_stories(queryset)

    def reject_stories(self, queryset):
        stories_to_reject = queryset.exclude(status='a')
        rejected_count = stories_to_reject.update(status='r')
        return rejected_count

    def response_post_save_change(self, request, obj):
        """This method is called by `self.changeform_view()` when the form
        was submitted successfully and should return an HttpResponse.
        """

        # Default response
        resp = super(StoryAdmin, self).response_post_save_change(request, obj)

        # Check that you clicked the button `_save_and_copy`
        if '_accept_story' in request.POST:
            # Accept the Story, and get the copy new CuratedStory
            created, problems = self.accept_story(obj)
            if created != 1:
                msg = "Could not accept Story, one already exists for %s"
                message = msg % obj.person.name
                self.message_user(request, message, level=messages.ERROR)
                return resp

            new_obj = CuratedStory.objects.get(story=obj)

            # Get its admin url
            opts = CuratedStory._meta
            info = opts.app_label, opts.model_name
            route = 'admin:{}_{}_change'.format(*info)
            post_url = reverse(route, args=(new_obj.pk,))

            # Inform the user they are now editting the CuratedStory
            self.message_user(request, "Now editting the Curated Story")

            # And redirect to it
            return HttpResponseRedirect(post_url)
        elif '_reject_story' in request.POST:
            # Reject the stories, and return the default response
            queryset = Story.objects.filter(pk=obj.pk)
            self.reject_stories(queryset)
            return resp
        else:
            # Otherwise, just use default behavior
            return resp


class CuratedStoryAdminFrom(forms.ModelForm):

    class Meta:
        model = CuratedStory
        exclude = []
        widgets = {'details': TinyMCE}


class CuratedStoryAdmin(admin.ModelAdmin):
    form = CuratedStoryAdminFrom

    list_display = ('person_name', 'title', 'short_details', 'gift_tier',
                    'published', 'display_type')

    fields = ('person', ('trip_year', 'trip_month', 'trip_day'),
              ('destination', 'terminal'), 'heathrow_origin', 'details',
              'image', 'title', 'slug', 'pull_quote', 'tags', 'gift_tier',
              ('to_be_displayed', 'ready_to_publish'), 'headline_story',
              'verified', ('embargo_date', 'expiry_date'))

    readonly_fields = ('person', 'verified')

    prepopulated_fields = {"slug": ("title",)}

    list_filter = (GiftTierFilter,)

    def get_readonly_fields(self, request, obj=None):
        if obj:  # In edit mode
            if obj.verified:
                return ('person', 'verified', 'gift_tier')
        return ('person', 'verified')


class TierableStoryAdmin(admin.ModelAdmin):
    list_display = ('person_name', 'destination', 'short_details')

    fields = (('trip_year', 'trip_month', 'trip_day'), 'heathrow_origin',
              ('destination', 'terminal'), 'details', 'image', 'gift_tier',
              'verified')

    readonly_fields = ('trip_year', 'trip_month', 'trip_day', 'destination',
                       'heathrow_origin', 'terminal', 'details', 'image')

    list_filter = (GiftTierFilter, VerifiedFilter)


class FeaturedStoryAdminForm(forms.ModelForm):
    details = forms.CharField(widget=CKEditorUploadingWidget())

    class Meta:
        model = FeaturedStory

        exclude = []


class FeaturedStoryAdmin(admin.ModelAdmin):

    form = FeaturedStoryAdminForm

    list_display = ('title', 'destination', 'published')

    readonly_fields = ('youtube_id', 'soundcloud_id')

    prepopulated_fields = {"slug": ("title",)}

    fields = (('trip_year', 'trip_month', 'trip_day'), 'heathrow_origin',
              ('destination', 'terminal'), 'details', 'image', 'title', 'slug',
              'person_name', 'content_url', 'youtube_id', 'soundcloud_id',
              'importance', 'tags', 'ready_to_publish',
              ('embargo_date', 'expiry_date'))
