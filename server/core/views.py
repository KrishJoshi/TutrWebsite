from rest_framework import viewsets
from core.serializers import UserDetailsView
from accounts.models import BaseUser
from rest_framework import permissions
from api.permissions import IsOwnerOrReadOnly

from rest_framework.views import APIView
from rest_framework.response import Response
class UserView(APIView):
	def get(self, request,role=None, format=None):
        	users = BaseUser.objects.all()
        	if role:
					users = BaseUser.objects.filter(role=role)
        	serializer = UserDetailsView(users, many=True)
        	return Response(serializer.data)
