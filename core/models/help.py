from django.utils.translation import ugettext_lazy as _


class StoryHelp(object):
    person = _("The person that submitted the story")
    trip_year = _("The year of the trip")
    trip_month = _("The month of the trip")
    trip_day = _("The month of the trip")
    destination = _("The trip destination")
    heathrow_origin = _("True if flight originated at Heathrow, False "
                        "otherwise")
    terminal = _("The Heathrow terminal number flown from/into")
    image = _("The associated user-uploaded image")
    submitted_at = _("The date and time of submission of this story")
    status = _("Show this story on the site")


class CuratedStoryHelp(StoryHelp):
    person = _("The person that originally submitted the story.  This is "
               "non-editable.")
    submitted_at = _("The date and time of original user-submission of "
                     "this story")
    title = _("The title of this story to be displayed on the site'")
    pull_quote = _("If no image is supplied (or is to be used), populate "
                   "this with a quote from the details body")
    slug = _("A slug will be auto-generated from the Title of the Story")
    gift_tier = _("The tier of prize awarded")
    to_be_displayed = _("Tick if this is a story you will want on the "
                        "homepage.<br/>Will not appear on the homepage unless "
                        "'Ready to publish' is also ticked.")
    ready = _("Tick when you're finished editing and are happy for the Story "
              "to go live.<br/>It will not actually go live until the embargo "
              "date")
    embargo = _("If this is blank, Story will go live immediately")
    expiry = _("If this is blank, will continue to be shown indefinitely")
    importance = _("A number (0-100) that indicates how impoertant this story "
                   "is, and therefore where it should appear on the site")
    image = _("The user-uploaded image for this story.  Read-only, if you "
              "wish to use another image instead, use the Curated Image")
    curated_image = _("The image to be displayed on the site.  To use the "
                      "user-uploaded image, re-upload it here")
