import rest_auth.serializers

class LoginSerializer(rest_auth.serializers.LoginSerializer):
    def get_fields(self):
        fields = super(LoginSerializer, self).get_fields()
        fields['email'] = fields['username']
        del fields['username']
        return fields

    def validate(self, attrs):
        attrs['username'] = attrs['email']
        del attrs['email']
        return super(LoginSerializer, self).validate(attrs)
