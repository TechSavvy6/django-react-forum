from django.contrib import admin
from .models import Question, Answer, QuestionTag
# Register your models here.


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):

    list_display = [
        'title', 'date_created', 'date_modified'
    ]
    list_filter = [
        'tags'
    ]
    search_fields = [
        'title'
    ]


admin.site.register(Answer)
admin.site.register(QuestionTag)
