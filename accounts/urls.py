from django.contrib import admin
from django.urls import path
from . import views as acc

urlpatterns = [
    path('sign_up',acc.sign_up,name='sign_up'),
    path('account/<str:username>',acc.account,name='account'),
    path('profile_picture',acc.profile_picture,name='profile_picture'),
    path('follow_user/<int:userid>',acc.follow_user,name='follow_user'),
    path('unfollow_user/<int:userid>',acc.unfollow_user,name='unfollow_user'),
    path('sign_in',acc.sign_in,name='sign_in'),
    path('log_out',acc.log_out,name='log_out'),
    ]