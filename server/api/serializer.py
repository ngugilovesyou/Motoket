from django.conf import settings
from .models import  FavouritedVehicle, User, Vehicle, VehicleImage, Chat, ChatMessage
from rest_framework import serializers
from django.contrib.auth import get_user_model

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id','first_name', 'last_name', 'email', 'password', 'role','favourites', 'created_at', 'updated_at')
#         extra_kwargs = {'password': {'write_only': True}}
        
class UserSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'role', 
                'favourites', 'created_at', 'updated_at', 'image_url')
        extra_kwargs = {
            'password': {'write_only': True},
            'image_url': {'read_only': True}
        }
    
    def get_image_url(self, obj):
        if not obj.image_url:
            return None
            
        cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', 'your_cloud_name')
        
        # Define transformations for different contexts
        transformations = {
            'thumbnail': 'c_fill,w_100,h_100,f_auto,q_auto',  # For small thumbnails
            'profile': 'c_fill,w_300,h_300,f_auto,q_auto',    # Standard profile size
            'large': 'c_limit,w_800,h_800,f_auto,q_auto'     # For full-size display
        }
        
        # Get requested transformation from context (default to 'profile')
        transform_type = self.context.get('transform', 'profile')
        
        # Check if it's already a full URL
        if obj.image_url.startswith(('http://', 'https://')):
            return obj.image_url
            
        # Check if it's a Cloudinary public_id
        if '/' in obj.image_url or '.' in obj.image_url:
            # Handle full Cloudinary URLs or public_ids
            if obj.image_url.startswith(f'https://res.cloudinary.com/{cloud_name}/'):
                return obj.image_url
            return f"https://res.cloudinary.com/{cloud_name}/image/upload/{transformations[transform_type]}/{obj.image_url}"
            
        return None  
        
class VehicleImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = VehicleImage
        fields = ['id', 'image_url']

    def get_image_url(self, obj):
        cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', 'YOUR_CLOUD_NAME')
        
        transformations = {
            'main': 'c_fill,w_800,h_600,f_auto,q_auto',  # For main display
            'thumb': 'c_fill,w_100,h_75,f_auto,q_auto',  # For thumbnails
            'modal': 'c_limit,w_1200,h_900,f_auto,q_auto'  # For modal/fullscreen
        }
        
        # Get requested transformation from context (default to 'main')
        transform_type = self.context.get('transform', 'main')
        
        # Return full Cloudinary URL with transformations
        return f"https://res.cloudinary.com/{cloud_name}/image/upload/{transformations[transform_type]}/{obj.image}"
    
class VehicleSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            'id', 'make', 'model', 'year', 'fuel_type',
            'transmission', 'body_type', 'price', 'description',
            'region', 'mileage', 'condition', 'color', 'features','is_featured',
            'contact_name', 'contact_phone', 'contact_email','slug',
            'created_at', 'updated_at', 'images'
        ]
        read_only_fields = ['id', 'created_at', 'user']
    
    def get_images(self, obj):
        # Get the transformation type from context (default to 'main')
        transform_type = self.context.get('image_transform', 'main')
        
        # Serialize images with the requested transformation
        images = obj.images.all()
        return VehicleImageSerializer(
            images, 
            many=True,
            context={'transform': transform_type}
        ).data
    
class FavouriteSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)
    class Meta:
        model = FavouritedVehicle
        fields = ['id', 'user', 'vehicle', 'favourite_date']
        
class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    sender_name = serializers.CharField(source='sender.first_name', read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['sender_id', 'sender_name', 'text', 'created_at']



User = get_user_model()

class ChatSerializer(serializers.ModelSerializer):
    initiator = serializers.StringRelatedField() 

    class Meta:
        model = Chat
        fields = ['short_id', 'initiator']   

class FullChatSerializer(serializers.ModelSerializer):
    initiator = serializers.StringRelatedField()
    acceptor = serializers.StringRelatedField()
    messages = MessageSerializer(many=True, read_only=True)
    vehicle = VehicleSerializer() 

    class Meta:
        model = Chat
        fields = ['short_id', 'initiator', 'acceptor', 'messages', 'vehicle']
           