from django.contrib import admin
from django.urls import path
from . import views as mess



urlpatterns = [
    path('messenger/<int:user_id>/',mess.messenger,name='messenger'),
    path('change_password',mess.change_password,name='change_password'),
    path('profile_info',mess.profile_info,name='profile_info'),
    path('account_info',mess.account_info,name='account_info'),
]