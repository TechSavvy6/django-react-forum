from django.contrib.auth import get_user_model
from rest_framework import serializers, exceptions
from .models import Question, Answer, QuestionTag
from users.serializers import UserSerializer

User = get_user_model()


class QuestionTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionTag
        read_only_fields = ['slug']
        fields = ['id', 'name', 'slug']


class AnswerSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Answer
        fields = ['id', 'user', 'content', 'date_created', 'date_modified']


class QuestionSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    tags = QuestionTagSerializer(many=True)
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        read_only_fields = ['slug']
        fields = [
            'id', 'title', 'content', 'slug',  'date_created',
            'date_modified',
            'tags',
            'user',
            'answers'
        ]

    def create(self, validated_data):
        user = User.objects.get(username=self.context['request'].user)
        validated_tags = validated_data.pop('tags')
        question = Question.objects.create(
            **validated_data,
            slug="...",
            user=user
        )
        for tag_data in validated_tags:
            tags = QuestionTag.objects.filter(name=tag_data.get('name'))
            if not tags.exists():
                tag = QuestionTag.objects.create(name=tag_data.get('name').strip().lower())
                question.tags.add(tag)
            else:
                for tag in tags:
                    question.tags.add(tag)
        question.save()
        return question

    def update(self, instance, validated_data):
        user = User.objects.get(username=self.context['request'].user)
        validated_tags = validated_data.pop('tags')

        if instance.user == user:
            for item in validated_data:
                if Question._meta.get_field(item):
                    setattr(instance, item, validated_data.get(item))

            instance.tags.clear()

            for tag_data in validated_tags:
                tags = QuestionTag.objects.filter(name=tag_data.get('name'))
                if not tags.exists():
                    tag = QuestionTag.objects.create(name=tag_data.get('name').strip().lower())
                    instance.tags.add(tag)
                else:
                    for tag in tags:
                        instance.tags.add(tag)
            instance.save()
        else:
            raise exceptions.PermissionDenied()

        return instance


class TagQuestionsSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = QuestionTag
        read_only_fields = ['slug']
        fields = ['id', 'name', 'questions', 'slug']
