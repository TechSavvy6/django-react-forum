from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, get_list_or_404
from .serializers import (UserSkillsSerializer, UserProfilePictureSerializer,
                          UserBioSerializer, UserSerializer, IsUserActiveSerializer)
from django.contrib.auth import get_user_model
from rest_framework import generics
from forum.serializers import QuestionSerializer
from forum.models import Question

User = get_user_model()


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_skills(request):
    user = User.objects.get(username=request.user.username)
    serializer = UserSkillsSerializer(data=request.data)

    if serializer.is_valid():
        user.profile.skills = serializer.validated_data.get('skills')
        user.profile.save()
        return Response(user.profile.skills, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_bio(request):
    user = User.objects.get(username=request.user.username)
    serializer = UserBioSerializer(data=request.data)
    if serializer.is_valid():
        user.profile.bio = serializer.validated_data.get('bio')
        user.profile.save()
        return Response({"bio": user.profile.bio}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile_picture(request):
    user = User.objects.get(username=request.user.username)
    serializer = UserProfilePictureSerializer(data=request.data)

    if serializer.is_valid():
        user.profile.image = serializer.validated_data.get('image')
        user.profile.save()
        return Response({"image": user.profile.image.url}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET'])
def user_profile(request, username):
    user = get_object_or_404(User, username=username)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['GET'])
def is_user_active(request, username):
    user = get_object_or_404(User, username=username)
    serializer = IsUserActiveSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


class GetUsersBySkills(generics.ListAPIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = "skill"

    def get_queryset(self):
        skill = self.kwargs.get(self.lookup_url_kwarg)
        return User.objects.filter(profile__skills__icontains=skill).order_by('id')


class GetUserQuestions(generics.ListAPIView):
    serializer_class = QuestionSerializer
    lookup_url_kwarg = "username"

    def get_queryset(self):
        username = self.kwargs.get(self.lookup_url_kwarg)
        return get_list_or_404(Question, user__username=username)
