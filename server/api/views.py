from rest_framework import viewsets
from api.serializers import SubjectsSerializer
from api.models import Subjects
from rest_framework import permissions
from api.permissions import IsOwnerOrReadOnly
class SubjectsViewSet(viewsets.ModelViewSet):
    queryset = Subjects.objects.all()
    serializer_class = SubjectsSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,  IsOwnerOrReadOnly,)
