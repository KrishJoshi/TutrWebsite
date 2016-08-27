from rest_framework import serializers
from api.models import Subjects

class SubjectsSerializer(serializers.ModelSerializer):
	class Meta:
		model = Subjects
		fields = ('name', 'createdAt', 'updatedAt')
		
		
