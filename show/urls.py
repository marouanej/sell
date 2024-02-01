from django.contrib import admin
from django.urls import path
import show.views as sh
urlpatterns = [
    path('',sh.home ),
]
