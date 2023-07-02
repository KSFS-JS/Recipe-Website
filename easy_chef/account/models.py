from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class Profile(models.Model):
    """
    Model that stores additional information that the default User model is missing
    Help to satisfy user stories
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_num = models.CharField(max_length=50, blank=True, default='')
    avatar = models.ImageField(upload_to='profiles/', default='default_avatar.png')
    avatar_hash = models.CharField(max_length=65535)

    def __str__(self):
        return "Id: " + str(self.user.id) + " profile"

