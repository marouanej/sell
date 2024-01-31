from django.shortcuts import render,redirect,get_object_or_404
import json
from .models import Product,CartItem,Keyword,Rating
from accounts.models import CUser
from django.core import serializers
from django.http import JsonResponse
from django.db import models
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.core.files.storage import default_storage

# Create your views here.
def home(request):
   products = Product.objects.all()
   productsSERIA = serializers.serialize("json",products)
   users=CUser.objects.all()
   usersSERIA = serializers.serialize("json",users)
   total_cart_quantity = CartItem.objects.filter(user_id=request.user.id).aggregate(total_quantity=models.Sum('quantity'))['total_quantity'] or int(0)
   context = {'products':productsSERIA,
              'users':usersSERIA,
              'total_cart_quantity':total_cart_quantity}
   return render(request , 'home.html',context)



def about(request):
    return render(request,'about.html')

def cart_price(request):
    cart_items =CartItem.objects.filter(user=request.user)
    product_price_cent=0
    for cart_item in cart_items:
        product=cart_item.product
        quantity=cart_item.quantity
        product_price_cent+=product.price*quantity
    return product_price_cent

     

@login_required(login_url='/sign_in')
def cart(request):
    # Retrieve the cart items associated with the currently logged-in user
    cart_items = CartItem.objects.filter(user=request.user)
    cart_items_SERIA = serializers.serialize("json",cart_items)
    # Extract the product IDs from the cart items
    product_ids = [cart_item.product.pk for cart_item in cart_items]
    # sum of products prices
    products_price = cart_price(request)   
    # Retrieve the corresponding products
    products_in_cart = Product.objects.filter(pk__in=product_ids)
    products_in_cart_SERIA = serializers.serialize("json",products_in_cart)
    total_cart_quantity = CartItem.objects.filter(user=request.user).aggregate(total_quantity=models.Sum('quantity'))['total_quantity'] or int(0)
    context={'total_cart_quantity':total_cart_quantity,
             'cartPrice':products_price,
             'products_in_cart': products_in_cart_SERIA,
             'cart_items':cart_items_SERIA,}

    return render(request, 'cart.html', context )


def add_to_cart(request, product_id):
    if request.method == 'POST':
        # Retrieve the product based on the product_id
        product = get_object_or_404(Product, pk=product_id)
        
        # Check if the user is authenticated (you can modify this logic)
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'User not authenticated'})
        
        # Parse the JSON data sent from the frontend
        data = json.loads(request.body)
        
        # Retrieve the selected quantity from the data
        selected_quantity = data.get('product_quantity')
        
        # Check if the item is already in the user's cart
        cart_item, created = CartItem.objects.get_or_create(user=request.user, product=product)
        
        # Update the quantity based on the selected quantity
        if not created:
            cart_item.quantity += int(selected_quantity)
            cart_item.save()
        else:
            cart_item.quantity=int(selected_quantity)
            cart_item.save() 
        
        
        # Calculate the total cart quantity
        cart_quantity = CartItem.objects.filter(user=request.user).aggregate(total_quantity=models.Sum('quantity'))['total_quantity'] or int(0)
       
        data = {
            'success': True,
            'message': 'Product added to cart',
            'cartQuantity': cart_quantity,
        }
        
        return JsonResponse(data)
    



def delete_from_cart(request, product_id):
    if request.method == 'POST':
        # Retrieve the product based on the product_id
        product = get_object_or_404(Product, pk=product_id)
        
        # Check if the user is authenticated (you can modify this logic)
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'User not authenticated'})
        
        # Parse the JSON data sent from the frontend
        data = json.loads(request.body)
        
        # Retrieve the selected quantity from the data
        selected_quantity = data.get('product_quantity')
        
        # Retrieve the cart item for the user and product
        cart_item = CartItem.objects.get(user=request.user, product=product)
        
        # Delete the cart item and update the cart quantity
        cart_item.delete()
        products_price = cart_price(request)
        # Calculate the total cart quantity
        cart_quantity = CartItem.objects.filter(user=request.user).aggregate(total_quantity=models.Sum('quantity'))['total_quantity'] or 0
        
        data = {
            'success': True,
            'message': 'Product removed from cart',
            'cartQuantity': cart_quantity,
            'cartPrice':products_price,
        }
        
        return JsonResponse(data)
    


def update_quantity(request, product_id):
    if request.method == 'POST':
        # Retrieve the product based on the product_id
        product = get_object_or_404(Product, pk=product_id)
        
        # Check if the user is authenticated (you can modify this logic)
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'User not authenticated'})
        
        # Parse the JSON data sent from the frontend
        data = json.loads(request.body)
        
        # Retrieve the selected quantity from the data
        updated_quantity = data.get('updated_quantity')
        
        # Retrieve the cart item for the user and product
        cart_item = CartItem.objects.get(user=request.user, product=product)
        
        # Delete the cart item and update the cart quantity
        if updated_quantity and updated_quantity.isdigit():
            # Convert to integer and update the cart item quantity
            cart_item.quantity = int(updated_quantity)
            cart_item.save()
        else:
            # Handle the case where updated_quantity is not a valid integer
            return JsonResponse({'success': False, 'message': 'Invalid quantity value'})
        
        products_price = cart_price(request)
        # Calculate the total cart quantity
        cart_quantity = CartItem.objects.filter(user=request.user).aggregate(total_quantity=models.Sum('quantity'))['total_quantity'] or 0
        
        data = {
            'success': True,
            'message': 'Product UPDATED',
            'cartQuantity': cart_quantity,
            'cartPrice':products_price,
        }
        
        return JsonResponse(data)


def add_product(request):

    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'User not authenticated'})
        product_image = request.FILES['product_image']
        product_name = request.POST['product_name']
        product_price = request.POST['product_price']
        product_description = request.POST['product_description']
        product_keyword_str = request.POST.get('product_keyword', '')
        product_keyword_list = [keyword.strip() for keyword in product_keyword_str.split(',')]
      
        # Retrieve or create the Keyword objects
        keywords = [Keyword.objects.get_or_create(name=keyword)[0] for keyword in product_keyword_list]
        new_product = Product(
            name=product_name,
            user=request.user,
            price=product_price,
            description=product_description,
            image=product_image
        )
        new_product.save()

        new_product.keywords.set(keywords)
        products =  Product.objects.filter(user=request.user)
        serialized_product = serializers.serialize("json", products)
        data = {
            'success': True,
            'message': 'Product UPDATED',
            'products':serialized_product,
        }

    return JsonResponse(data)




def update_product(request, product_id):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'User not authenticated'})

        try:
            product = Product.objects.get(pk=product_id, user=request.user)
        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Product not found'})

        product_image = request.FILES.get('product_image', product.image)
        product_name = request.POST.get('product_name', product.name)
        product_price = request.POST.get('product_price', product.price)
        product_description = request.POST.get('product_description', product.description)
        product_keyword_str = request.POST.get('product_keyword', '')
        product_keyword_list = [keyword.strip() for keyword in product_keyword_str.split(',')]

        # Retrieve or create the Keyword objects
        keywords = [Keyword.objects.get_or_create(name=keyword)[0] for keyword in product_keyword_list]

        # Update product attributes
        product.name = product_name
        product.price = product_price
        product.description = product_description
        default_storage.delete(product.image.path)
        product.image = product_image
        product.save()

        product.keywords.set(keywords)
        products = Product.objects.filter(user=request.user)
        serialized_product = serializers.serialize("json", products)

        data = {
            'success': True,
            'message': 'Product UPDATED',
            'products': serialized_product,
        }

        return JsonResponse(data)

    # Handle non-POST requests as needed
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

def delete_product(request,product_id):
     if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'User not authenticated'})

        try:
            product = Product.objects.get(pk=product_id, user=request.user)
        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Product not found'})
        if product.image:
            # Delete the file from storage
            default_storage.delete(product.image.path)
        product.delete()
        products = Product.objects.filter(user=request.user)
        serialized_product = serializers.serialize("json", products)

        data = {
            'success': True,
            'message': 'Product deleted',
            'products': serialized_product,
        }

        return JsonResponse(data)
     return JsonResponse({'success': False, 'message': 'Invalid request method'})



def search_products(request):
    query = request.GET.get('q', '')

    if query:
        products = Product.objects.filter(Q(keywords__name__icontains=query) | Q(user__username__icontains=query)).distinct()
    else:
        products = Product.objects.all()

    # Convert the queryset to a list of dictionaries

    # Return the data as JSON
    return JsonResponse({'query': query, 'products': serializers.serialize("json",products)})


def rate_product(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Product, pk=product_id)
        user = request.user

        # Check if the user has already rated the product
        existing_rating = Rating.objects.filter(user=user, product_id=product_id).first()

        if existing_rating:
            # User has already rated the product
            return JsonResponse({'success': False, 'message': 'You have already rated this product.'})
        
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'User not authenticated'})
        
        data = json.loads(request.body)
        user_star = data.get("user_stars")
        new_avg_rating = ((float(product.avg_rating) * int(product.total_ratings)) + int(user_star)) / (int(product.total_ratings)+1)
    
        product.avg_rating = new_avg_rating
        product.total_ratings += 1
        product.save()
        products=Product.objects.all()
        new_rating = Rating(product=product, user=user, rating=user_star)
        new_rating.save()

        serialized_product = serializers.serialize("json", products)

        data = {
            'success': True,
            'message': 'Rating submitted successfully',
            'products': serialized_product,
        }
        
        return JsonResponse(data)

    return JsonResponse({'success': False, 'message': 'Invalid request method'})