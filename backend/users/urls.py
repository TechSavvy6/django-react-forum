from django.urls import path
from .views import (edit_skills, edit_bio, edit_profile_picture, user_profile,
                    is_user_active, GetUsersBySkills, GetUserQuestions)
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('skills/', edit_skills, name="edit_skills"),
    path('bio/', edit_bio, name="edit_bio"),
    path('profile-picture/', edit_profile_picture, name="edit_profile_picture"),
    path('user-profile/<str:username>/', user_profile, name="user_profile"),
    path('is-user-active/<str:username>/', is_user_active, name="is_user_active"),
    path('users-by-skills/<str:skill>/', csrf_exempt(GetUsersBySkills.as_view()), name="get_users_by_skills"),
    path('questions/<str:username>/', csrf_exempt(GetUserQuestions.as_view()), name="get_user_questions"),
]
