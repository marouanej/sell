from django.contrib import admin
from django.urls import path
from . import views as it

urlpatterns = [
    path('',it.home,name='home'),
    path('about',it.about),
    path('cart',it.cart,name='cart'),
    path('add_product', it.add_product, name='add_product'),
    path('delete_product/<int:product_id>/', it.delete_product, name='delete_product'),
    path('update_product/<int:product_id>/', it.update_product, name='update_product'),
    path('search/', it.search_products, name='search_products'),
    path('rate_product/<int:product_id>/', it.rate_product, name='rate_product'),
    path('add_to_cart/<int:product_id>/', it.add_to_cart, name='add_to_cart'),
    path('delete_from_cart/<int:product_id>/',it.delete_from_cart,name="delete_from_cart"),
    path('update_quantity/<int:product_id>/',it.update_quantity,name="update_quantity")
]
