from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework import serializers
from accounts.models import BaseUser

from api.models import Subjects
from api.serializers import SubjectsSerializer
class UserDetailsView(serializers.ModelSerializer):
    #subjects = SubjectsSerializer(many=True)
    class Meta:
        model = BaseUser
        fields = ('id', 'email', 'first_name', 'last_name', 'gender', 'hourrate', 'subjects', 'education', 'degree', 'postcode', 'location', 'name_of_university', 'availability_from', 'availability_to', 'about', 'role', 'avatar')
        depth = 1
    def update(self, instance, validated_data):
        submitted_subjects = self.context['request'].data['subjects']
        if submitted_subjects:
            instance.subjects = []
            for child in submitted_subjects:
                print child
                child_instance = Subjects.objects.get(id=child['id'])
                
                instance.subjects.add(child_instance)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.hourrate = validated_data.get('hourrate', instance.hourrate)
        instance.education = validated_data.get('education', instance.education)
        instance.degree = validated_data.get('degree', instance.degree)
        instance.postcode = validated_data.get('postcode', instance.postcode)
        instance.location = validated_data.get('location', instance.location)
        instance.name_of_university = validated_data.get('name_of_university', instance.name_of_university)
        instance.availability_from = validated_data.get('availability_from', instance.availability_from)
        instance.availability_to = validated_data.get('availability_to', instance.availability_to)
        instance.about = validated_data.get('about', instance.about)
        instance.role = validated_data.get('role', instance.role)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)
    role = serializers.CharField(required=True, write_only=True)

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                _("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'role': self.validated_data.get('role', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        user.role = self.validated_data.get('role', '')
        user.save()
        return user
