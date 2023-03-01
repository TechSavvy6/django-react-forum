from django.urls import path
from .views import (
    Questions,
    QuestionDetail,
    TagList,
    QuestionsByTag,
    AnswerOfQuestion,
    AnswerDetail,
)
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('questions/', csrf_exempt(Questions.as_view()), name="questions"),
    path('questions/<str:slug>/', csrf_exempt(QuestionDetail.as_view()), name="questions_detail"),
    path('questions/<str:slug>/answer/', csrf_exempt(AnswerOfQuestion.as_view()), name="answer_of_question"),
    path('answers/<str:pk>/', csrf_exempt(AnswerDetail.as_view()), name="answers_detail"),
    path('tags/', csrf_exempt(TagList.as_view()), name="tags"),
    path('tags/<str:slug>/', csrf_exempt(QuestionsByTag.as_view()), name="questions_by_tag")
]
