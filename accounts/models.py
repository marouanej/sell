from django.contrib.auth.models import User
from django.db import models
from items.models import Product
from django.contrib.auth.models import AbstractUser


class CUser(AbstractUser):
    # Add your custom fields here
    
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    phone= models.CharField(max_length=15, null=True, blank=True)
    user_product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    followers = models.ManyToManyField('self', related_name='following', symmetrical=False,blank=True)

    def __str__(self):
        return self.username