from django.contrib import admin

# Register your models here.
from .models import Product,CartItem,Keyword
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from accounts.models import CUser

admin.site.register(CUser)
admin.site.register(User,UserAdmin)
admin.site.register(Product)
admin.site.register(CartItem)
admin.site.register(Keyword)