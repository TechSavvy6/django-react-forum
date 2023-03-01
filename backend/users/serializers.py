from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from .models import UserProfile

from djoser.conf import settings
from djoser.serializers import TokenCreateSerializer

User = get_user_model()


class CustomTokenCreateSerializer(TokenCreateSerializer):
    def validate(self, attrs):
        password = attrs.get("password")
        params = {settings.LOGIN_FIELD: attrs.get(settings.LOGIN_FIELD)}
        self.user = authenticate(
            request=self.context.get("request"), **params, password=password
        )
        if not self.user:
            self.user = User.objects.filter(**params).first()
            if self.user and not self.user.check_password(password):
                self.fail("invalid_credentials")
        if self.user:
            return attrs
        self.fail("invalid_credentials")


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = ["image", "bio", "skills"]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True, many=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'profile']


class UserSkillsSerializer(serializers.Serializer):
    skills = serializers.ListField()


class UserBioSerializer(serializers.Serializer):
    bio = serializers.CharField()


class UserProfilePictureSerializer(serializers.Serializer):
    image = serializers.ImageField()


class IsUserActiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'is_active']
