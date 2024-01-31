from django.db import models
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Keyword(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products_media/')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    keywords = models.ManyToManyField(Keyword)
    created_at = models.DateTimeField(auto_now_add=True)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0,validators=[MaxValueValidator(limit_value=5),
            MinValueValidator(limit_value=0)])
    total_ratings = models.PositiveIntegerField(default=0)
class Rating(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # If you want to track the user who left the rating
    rating = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(5), MinValueValidator(1)])

class CartItem(models.Model):
    product= models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


