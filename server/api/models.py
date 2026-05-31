import uuid
from django.db import models
from django.contrib.auth.hashers import make_password,check_password
from django.utils import timezone
import requests
from cloudinary.models import CloudinaryField
from django.utils.text import slugify
from django.db.models import Q, Count, Prefetch
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class User(models.Model):
    
    first_name = models.CharField(max_length=15, null=False)
    last_name = models.CharField(max_length=15, null=False)
    image_url = models.CharField(max_length=200, null=True)
    email = models.EmailField(max_length=100, unique=True, null=False, default=None)
    firebase_uid = models.CharField(max_length=128, unique=True, null=True,  blank=True)
    role=models.CharField(null=False, default='Buyer', max_length=6)
    is_admin = models.BooleanField(default=False)
    password = models.CharField(max_length=100, null=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
        
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Vehicle(models.Model):
    
    
    FUEL_TYPE_CHOICES = [
        ('Gasoline', 'Gasoline'),
        ('Diesel', 'Diesel'),
        ('Electric', 'Electric'),
        ('Hybrid', 'Hybrid'),
        ('Plug-in Hybrid', 'Plug-in Hybrid'),
    ]
    
    TRANSMISSION_CHOICES = [
        ('Automatic', 'Automatic'),
        ('Manual', 'Manual'),
        ('CVT', 'CVT'),
    ]
    
    CONDITION_CHOICES = [
        ('New', 'New'),
        ('Used', 'Used'),
        ('Certified Pre-Owned', 'Certified Pre-Owned'),
    ]
    
    BODY_TYPE_CHOICES = [
        ('Sedan', 'Sedan'),
        ('SUV', 'SUV'),
        ('Truck', 'Truck'),
        ('Coupe', 'Coupe'),
        ('Convertible', 'Convertible'),
        ('Hatchback', 'Hatchback'),
        ('Wagon', 'Wagon'),
        ('Van', 'Van'),
        ('Minivan', 'Minivan'),
    ]
    
    
    id = models.AutoField(primary_key=True)
    make = models.CharField(max_length=100, null=False, db_index=True)
    model = models.CharField(max_length=100, null=False, db_index=True)
    year = models.IntegerField(
        null=False, 
        db_index=True,
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(2030)
        ]
    )
    
    # Specifications
    fuel_type = models.CharField(
        max_length=100, 
        null=False, 
        choices=FUEL_TYPE_CHOICES,
        db_index=True
    )
    transmission = models.CharField(
        max_length=100, 
        null=False, 
        choices=TRANSMISSION_CHOICES,
        db_index=True
    )
    body_type = models.CharField(
        max_length=100, 
        null=False, 
        choices=BODY_TYPE_CHOICES,
        db_index=True
    )
    
    # Pricing
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=False,
        db_index=True,
        validators=[MinValueValidator(0)]
    )
    original_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Original price before discount (optional)"
    )
    
    # Details
    description = models.TextField(null=False)
    mileage = models.IntegerField(
        null=True, 
        blank=True,
        db_index=True,
        validators=[MinValueValidator(0)],
        help_text="Mileage in kilometers"
    )
    condition = models.CharField(
        max_length=50, 
        null=True, 
        blank=True,
        choices=CONDITION_CHOICES,
        db_index=True
    )
    color = models.CharField(max_length=50, null=True, blank=True)
    
    
    # Location
    region = models.CharField(
        max_length=100, 
        null=False, 
        default="Nairobi, Kenya",
        db_index=True
    )
    
    # Additional features
    features = models.JSONField(
        default=list, 
        blank=True,
        help_text="List of vehicle features (e.g., ['Sunroof', 'Leather Seats'])"
    )
    
    # Contact information
    contact_name = models.CharField(max_length=100, null=True, blank=True)
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    
    # Relationships
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    
    # Status flags
    is_featured = models.BooleanField(
        default=False, 
        db_index=True,
        help_text="Featured vehicles appear first in listings"
    )
    is_sold = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Mark as sold to hide from main listings"
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Active listings are visible to users"
    )
    
    # Analytics (NEW - for tracking engagement)
    view_count = models.IntegerField(
        default=0,
        help_text="Number of times this listing has been viewed"
    )
    save_count = models.IntegerField(
        default=0,
        help_text="Number of times this listing has been saved/favorited"
    )
    
    # SEO
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    meta_title = models.CharField(max_length=200, null=True, blank=True)
    meta_description = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now, )
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
        indexes = [
            models.Index(fields=['make', 'model']),
            models.Index(fields=['price', '-created_at']),
            models.Index(fields=['year', '-created_at']),
            models.Index(fields=['-is_featured', '-created_at']),
        ]
        verbose_name = 'Vehicle'
        verbose_name_plural = 'Vehicles'
    
    def __str__(self):
        return f"{self.year} {self.make} {self.model}"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        if is_new:
            super().save(*args, **kwargs)  
        if not self.slug:
            self.slug = slugify(f"{self.year}-{self.make}-{self.model}-{self.color or 'vehicle'}-{self.pk}")
        if not self.meta_title:
            self.meta_title = f"{self.year} {self.make} {self.model} for Sale"
        if not self.meta_description:
            self.meta_description = f"{self.year} {self.make} {self.model} for sale in {self.region}. {self.description}"[:300]
        if is_new:
            Vehicle.objects.filter(pk=self.pk).update(
                slug=self.slug, meta_title=self.meta_title, meta_description=self.meta_description
            )
            self.refresh_from_db()
        else:
            super().save(*args, **kwargs)

    
    def increment_view_count(self):
        """Increment the view count atomically"""
        self.view_count = models.F('view_count') + 1
        self.save(update_fields=['view_count'])
        self.refresh_from_db()  
    
    def increment_save_count(self):
        """Increment the save count atomically"""
        self.save_count = models.F('save_count') + 1
        self.save(update_fields=['save_count'])
        self.refresh_from_db()
    
    def decrement_save_count(self):
        """Decrement the save count atomically"""
        if self.save_count > 0:
            self.save_count = models.F('save_count') - 1
            self.save(update_fields=['save_count'])
            self.refresh_from_db()
    
    @property
    def main_image(self):
        """Get the first image or None"""
        return self.images.first()
    
    @property
    def has_discount(self):
        """Check if vehicle has a discount"""
        if self.original_price and self.original_price > self.price:
            return True
        return False
    
    @property
    def discount_percentage(self):
        """Calculate discount percentage"""
        if self.has_discount:
            discount = ((self.original_price - self.price) / self.original_price) * 100
            return round(discount, 1)
        return 0
    
    @property
    def is_new(self):
        """Check if listing is new (less than 7 days old)"""
        from datetime import timedelta
        return self.created_at >= timezone.now() - timedelta(days=7)


class VehicleImage(models.Model):
    """
    Enhanced VehicleImage model with ordering support
    """
    vehicle = models.ForeignKey(
        Vehicle, 
        related_name='images', 
        on_delete=models.CASCADE
    )
    image = CloudinaryField('image', default=None)
    public_id = models.CharField(max_length=255, blank=True)
    alt_text = models.CharField(
        max_length=200, 
        null=True, 
        blank=True,
        help_text="Alternative text for accessibility"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order (0 is first)"
    )
    created_at = models.DateTimeField(default=timezone.now, )
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Vehicle Image'
        verbose_name_plural = 'Vehicle Images'
    
    def __str__(self):
        return f"Image for {self.vehicle}"
    
    def save(self, *args, **kwargs):
        """Auto-generate alt text if not provided"""
        if not self.alt_text and self.vehicle:
            self.alt_text = f"{self.vehicle.year} {self.vehicle.make} {self.vehicle.model}"
        super().save(*args, **kwargs)


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
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)


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
    updated_at = models.DateTimeField(default=timezone.now)


    