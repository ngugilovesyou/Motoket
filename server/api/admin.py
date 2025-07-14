from django.contrib import admin
from .models import User, Vehicle, Payment, Chat, ChatMessage

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name',  'email', 'image_url', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', )
    list_filter = ( 'created_at', 'updated_at')
    ordering = ('-created_at',)

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('make', 'model', 'year', 'price', 'fuel_type', 'transmission', 'user', 'created_at','is_featured')
    search_fields = ('make', 'model', 'fuel_type', 'transmission', 'body_type')
    list_filter = ('year', 'fuel_type', 'transmission', 'body_type', 'user')
    ordering = ('-created_at',)
    list_editable = ('price',)
    
    # def display_all_images(self, obj):
    #     return ", ".join([img.images for img in obj.images.all()])

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'payment_method', 'created_at', 'updated_at')
    search_fields = ('user', 'amount', 'payment_method')
    list_filter = ('user', 'payment_method', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    
@admin.register(Chat) 
class ChatAdmin(admin.ModelAdmin):
    list_display= ('initiator', 'acceptor') 
@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('chat', 'sender', 'text','get_receiver_username', 'created_at')
    def get_receiver_username(self, obj):
        return obj.chat.acceptor.username if obj.chat.acceptor else 'None'
    get_receiver_username.short_description = 'Receiver'