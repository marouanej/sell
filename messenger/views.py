from django.shortcuts import render,redirect
from items.models import Product,CartItem,Keyword,Rating
from accounts.models import CUser
from django.core import serializers
from django.http import JsonResponse
from django.views import View
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from accounts.forms import ChangePasswordForm, ProfileInformationForm, AccountInformationForm
# Create your views here.
def messenger(request, user_id):
    user = request.user
    
    following_list = list(user.following.exclude(id=user.id))
    followers_list = list(user.followers.exclude(id=user.id))
    

    context = {
        'following_list': following_list,
        'followers_list':followers_list,
        'change_password_form': ChangePasswordForm(),
        'profile_information_form': ProfileInformationForm(instance=request.user),
        'account_information_form': AccountInformationForm(instance=request.user),
    }

 
    return render(request, 'messenger/messenger.html', context)
def change_password(request):

    
    if request.method == 'POST':
        form = ChangePasswordForm(request.POST)
        if form.is_valid():
            old_password = form.cleaned_data['old_password']
            new_password = form.cleaned_data['new_password']

            # Check if the old password is correct
            if request.user.check_password(old_password):
                # Update the user's password
                request.user.set_password(new_password)
                request.user.save()

                # Update the session auth hash to avoid logout
                update_session_auth_hash(request, request.user)

                messages.success(request, 'Password changed successfully.')
                return redirect('messenger', user_id=request.user.pk)
            else:
                messages.error(request, 'Incorrect old password.')
        else:
            messages.error(request, 'Error changing password. Please correct the errors below.')
    else:
        form = ChangePasswordForm()

    context = {
        'change_password_form': form,
        'profile_information_form': ProfileInformationForm(instance=request.user),
        'account_information_form': AccountInformationForm(instance=request.user),
    
    }

    return render(request, 'messenger/messenger.html', context)

def profile_info(request):
    
    
    if request.method == 'POST':
        form = ProfileInformationForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile information updated successfully.')
            return redirect('messenger', user_id=request.user.pk)
    else:
        form = ProfileInformationForm(instance=request.user)

    context = {
        'change_password_form': ChangePasswordForm(),
        'profile_information_form': form,
        'account_information_form': AccountInformationForm(instance=request.user),
        
    }

    return render(request, 'messenger/messenger.html', context)

def account_info(request):
    
    
    if request.method == 'POST':
        form = AccountInformationForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Account information updated successfully.')
            return redirect('messenger', user_id=request.user.pk)
    else:
        form = AccountInformationForm(instance=request.user)

    context = {
        'change_password_form': ChangePasswordForm(),
        'profile_information_form': ProfileInformationForm(instance=request.user),
        'account_information_form': form,
        
    }

    return render(request, 'messenger/messenger.html', context)