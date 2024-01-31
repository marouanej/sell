# forms.py
from collections.abc import Mapping
from typing import Any
from django import forms
from django.core.files.base import File
from django.db.models.base import Model
from django.forms.utils import ErrorList
from .models import CUser
from django.forms import ImageField, FileInput

class ChangePasswordForm(forms.Form):
    old_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'custom-input'}))
    new_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'custom-input'}))
    confirm_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'custom-input'}))
    def clean(self):
        cleaned_data = super().clean()
        new_password = cleaned_data.get('new_password')
        confirm_password = cleaned_data.get('confirm_password')

        if new_password != confirm_password:
            raise forms.ValidationError("New passwords do not match.")
class ProfileInformationForm(forms.ModelForm):
    class Meta:
        model = CUser
        fields = ['username','first_name', 'last_name', 'email']

class AccountInformationForm(forms.ModelForm):
    profile_picture=ImageField(widget=FileInput)
    class Meta:
        model = CUser
        fields = ['profile_picture', 'phone']
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        if instance.pk and 'profile_picture' in self.changed_data:
            # Delete the previous profile picture
            previous_picture = CUser.objects.get(pk=instance.pk).profile_picture
            previous_picture.delete(save=False)

        if commit:
            instance.save()
        return instance
    
        