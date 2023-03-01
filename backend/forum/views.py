from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, get_list_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, exceptions

from .models import Question, Answer, QuestionTag
from .serializers import QuestionSerializer, TagQuestionsSerializer, AnswerSerializer
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count

User = get_user_model()


class Questions(generics.ListCreateAPIView):
    queryset = Question.objects.all().select_related('user').prefetch_related('tags')
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'tags__name']
    ordering_fields = ['title', 'date_modified']


class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all().select_related('user').prefetch_related('tags')
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = User.objects.get(username=request.user)
        if instance.user == user:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise exceptions.PermissionDenied()


class TagList(generics.ListAPIView):
    serializer_class = TagQuestionsSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    permission_classes = [IsAuthenticated]
    search_fields = ['name']

    def get_queryset(self):
        tags = QuestionTag.objects.filter(questions__isnull=False).annotate(count=Count('questions')).order_by(
            '-count').prefetch_related('questions')  # ? orders by no. of questions
        return tags


class QuestionsByTag(generics.ListAPIView):
    serializer_class = QuestionSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['title', 'date_modified']
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'slug'

    def get_queryset(self):
        slug = self.kwargs.get(self.lookup_url_kwarg)
        return get_list_or_404(Question, tags__slug=slug)


class AnswerOfQuestion(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        question = get_object_or_404(Question, slug=slug)
        user = User.objects.get(username=request.user.username)
        serializer = AnswerSerializer(data=request.data)
        if serializer.is_valid():
            Answer.objects.create(
                question=question,
                user=user,
                content=serializer.validated_data.get('content'),
            )
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnswerDetail(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        answer = get_object_or_404(Answer, id=pk)
        user = User.objects.get(username=request.user.username)
        serializer = AnswerSerializer(data=request.data)
        if serializer.is_valid():
            if answer.user == user:
                answer.content = serializer.validated_data.get('content')
                answer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                raise exceptions.PermissionDenied()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        answer = get_object_or_404(Answer, id=pk)
        user = User.objects.get(username=request.user.username)
        if answer.user == user:
            answer.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise exceptions.PermissionDenied()
