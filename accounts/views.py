from django.shortcuts import render,redirect
from .models import CUser
from django.contrib.auth import login,authenticate,logout
from django.contrib import messages
from django.shortcuts import render,redirect,get_object_or_404
from django.templatetags.static import static
from json import dumps
import json
from items.models import Product,CartItem
from django.core import serializers
from django.http import JsonResponse
from django.db import models
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
import os
from PIL import Image
from django.conf import settings

import phonenumbers

def process_phone_number(raw_phone):
    try:
        parsed_phone = phonenumbers.parse(raw_phone, None)
        formatted_phone = phonenumbers.format_number(parsed_phone, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
        return formatted_phone
    except phonenumbers.NumberParseException:
        return None

# Create your views here.
def sign_up(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        raw_phone = request.POST.get('phone')
        password = request.POST.get('psw')
        password_repeat = request.POST.get('psw-repeat')
        phone = process_phone_number(raw_phone)
        if not phone:
            messages.error(request, "incorrect phone number")
            return redirect('sign_up')


        # Check if passwords match
        if password != password_repeat:
            messages.error(request, "Passwords do not match.")
            return redirect('sign_up')

        # Check if username or email is already taken
        if CUser.objects.filter(username=username).exists() or CUser.objects.filter(email=email).exists():
            messages.error(request, "Username or email is already taken.")
            return redirect('sign_up')

        # Create a new user
        user = CUser.objects.create_user(username=username, email=email, password=password)

        # Additional fields (customize as needed)
        user.phone = phone
        user.save()


        # Redirect to home (change to your desired URL)
        return redirect('sign_in')
    return render(request,'account/signup.html')



def sign_in(request):
    if request.method == 'POST':
        username = request.POST.get('uname','')
        password = request.POST.get('psw','')
        try:
            user = CUser.objects.get(username=username)
            if user.check_password(password) :
                # User is authenticated and active
                login(request, user)
                
                return redirect('home')

            else:
                # Invalid password
                messages.error(request, 'Invalid  password.')
        except CUser.DoesNotExist:
            # User matching query does not exist
            messages.error(request, 'Invalid login credentials')

    return render(request, 'account/signin.html')

def log_out(request):
    logout(request)
    # Redirect to the desired page after logout
    return redirect('home')

def profile_picture(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'User not authenticated'})
        
    
        # Assuming the FormData is sent as 'multipart/form-data'
        profile_image = request.FILES['profile_image']

        # Generate a unique filename for the image
        filename = f"profile_{request.user.id}.png"
        filepath = 'media/profile_pics/'+ filename
        print(filepath)

        # Resize and save the image
        with Image.open(profile_image) as image:
            image.thumbnail((300, 300))  # Resize the image if needed
            image.save(filepath)

        # Update the user's profile_picture field with the filename
        user = request.user
        user.profile_picture = "profile_pics/"+filename
        user.save()

        # Add your logic here to process the data, save to the database, etc.

        return JsonResponse({'success': True, 'message': 'Data processed successfully'})


@login_required(login_url='/sign_in')
def account(request,username):
        target_user = get_object_or_404(CUser, username=username)
        followers =target_user.followers.all()
        followings = target_user.following.all()
        products =  Product.objects.filter(user=target_user)
        productsSERIA = serializers.serialize("json",products)
        targetSERIA=serializers.serialize('json',[target_user])
        is_following = request.user.following.filter(pk=target_user.pk).exists()
        context={'products':products,
                 'is_following':is_following,
                 'productsSERIA':productsSERIA,
                 'target_user':target_user,
                 'targetSERIA':targetSERIA,
                 'products_counts':products.count(),
                 'followers_counts':followers.count(),
                 'followings_counts':followings.count(),}

        return render(request, 'account/account.html',context)


def follow_user(request, userid):
    user_to_follow = get_object_or_404(CUser, id=userid)
    current_user = request.user

    # Add the user_to_follow to the current_user's following list
    current_user.following.add(user_to_follow)

    # Add the current_user to the user_to_follow's followers list
    user_to_follow.followers.add(current_user)

    return JsonResponse({'status': 'success'})

def unfollow_user(request, userid):
    user_to_unfollow = CUser.objects.get(id=userid)
    current_user = request.user

    current_user.following.remove(user_to_unfollow)
    user_to_unfollow.followers.remove(current_user)

    return JsonResponse({'status': 'success'})
