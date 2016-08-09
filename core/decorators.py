from django.utils.decorators import method_decorator
from django.http import HttpResponse


def _staff_required(view):
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated() or not request.user.is_staff:
            return HttpResponse('Unauthorized', status=401)
        else:
            return view(request, *args, **kwargs)
    return wrapped

staff_required = method_decorator(_staff_required)
