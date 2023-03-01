from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth import get_user_model

from django.dispatch import receiver
from django.db.models.signals import post_save

User = get_user_model()

User._meta.get_field('email')._unique = True
User._meta.get_field('email').blank = False
User._meta.get_field('email').null = False


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name='profile', on_delete=models.CASCADE)
    image = models.ImageField(upload_to="technota_api/profile_pictures",
                              default="media/technota_api/profile_pictures/avatar.png")
    bio = models.TextField(null=True, blank=True)
    skills = ArrayField(
        models.CharField(max_length=10), null=True, blank=True
    )

    def save(self, *args, **kwargs):
        super().save()

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
