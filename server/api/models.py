import uuid
from django.db import models
from django.contrib.auth.hashers import make_password
from django.utils import timezone
import requests
from cloudinary.models import CloudinaryField
from django.utils.text import slugify

# Create your models here.
class User(models.Model):
    
    first_name = models.CharField(max_length=15, null=False)
    last_name = models.CharField(max_length=15, null=False)
    image_url = models.CharField(max_length=200, null=True)
    email = models.EmailField(max_length=100, unique=True, null=False, default=None)
    role=models.CharField(null=False, default='Buyer', max_length=6)
    password = models.CharField(max_length=100, null=False)
    is_admin= models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)\
    
    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_') and not self.password.startswith('$2b$'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Vehicle(models.Model):
    id = models.AutoField(primary_key=True)
    make = models.CharField(max_length=100, null=False)
    model = models.CharField(max_length=100, null=False)
    year = models.IntegerField(null=False)
    # engine_size = models.CharField(max_length=100, null=False)
    fuel_type = models.CharField(max_length=100, null=False)
    transmission = models.CharField(max_length=100, null=False)
    body_type = models.CharField(max_length=100, null=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    description = models.TextField(null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    region = models.CharField(max_length=100, null=False, default="Nairobi,Kenya")
    mileage = models.IntegerField(null=True, blank=True)  
    condition = models.CharField(max_length=50, null=True, blank=True) 
    color = models.CharField(max_length=50, null=True, blank=True)
    features = models.JSONField(default=list, blank=True)  
    contact_name = models.CharField(max_length=100, null=True, blank=True)
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    is_featured=models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.make} {self.model}"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            # First save to get an ID
            if not self.id:
                super().save(*args, **kwargs)
                
            # Now generate slug with the ID
            self.slug = slugify(
                f"{self.year}-{self.make}-{self.model}-"
                f"{self.color}-{self.region}-{self.id}"
            )
        
        super().save(*args, **kwargs)


class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, related_name='images', on_delete=models.CASCADE)
    image = CloudinaryField('image', default=None)  
    public_id = models.CharField(max_length=255, blank=True)

class FavouritedVehicle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favourites")
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    favourite_date = models.DateTimeField(default=timezone.now)
    
class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Refunded', 'Refunded'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('Credit Card', 'Credit Card'),
        ('PayPal', 'PayPal'),
        ('Mpesa', 'Mpesa'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    amount = models.DecimalField(max_digits=10, decimal_places=2)  
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='Pending')  
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES) 
    transaction_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now) 

    def __str__(self):
        return f"Payment of {self.amount} by {self.user.username} - {self.status}"    
    
class Chat(models.Model):
    initiator = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, related_name="initiator_chat"
    )
    acceptor = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, related_name="acceptor_name",null=True,
    blank=True,
    )
    short_id = models.CharField(max_length=255, default=uuid.uuid4, unique=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name="chats",null=True, default=None)


    def get_other_user(self, user):
        if user == self.initiator:
            return self.acceptor
        elif user == self.acceptor:
            return self.initiator
        return None
    
    class Meta:
        unique_together = ("initiator", "acceptor", "vehicle")

class ChatMessage(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    text = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)


    