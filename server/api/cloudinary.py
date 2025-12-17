# import cloudinary
# import cloudinary.uploader
# from cloudinary.utils import cloudinary_url
# from django.conf import settings
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .models import VehicleImage, Vehicle, User

from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import VehicleImage, Vehicle, User
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from django.contrib.auth.hashers import check_password, make_password

# Configuration       
cloudinary.config( 
    cloud_name = settings.CLOUDINARY_CLOUD_NAME, 
    api_key =settings.CLOUDINARY_API_KEY , 
    api_secret = settings.CLOUDINARY_API_SECRET,
    secure=True
)

@api_view(['POST'])
def post_vehicle(request, user_id):
    try:
        # 1. Get user and validate
        user = User.objects.get(id=user_id)
        
        # 2. Create vehicle without images first
        vehicle = Vehicle(
            make=request.data.get('make'),
            model=request.data.get('model'),
            year=request.data.get('year'),
            fuel_type=request.data.get('fuel_type'),
            transmission=request.data.get('transmission'),
            body_type=request.data.get('body_type'),
            price=request.data.get('price'),
            description=request.data.get('description'),
            region=request.data.get('region'),
            mileage=request.data.get('mileage'),
            condition=request.data.get('condition'),
            color=request.data.get('color'),
            features=request.data.get('features', []),  # Default empty list
            contact_name=request.data.get('contact_name'),
            contact_phone=request.data.get('contact_phone'),
            contact_email=request.data.get('contact_email'),
            user=user
        )
        
        vehicle.save()

        # 3. Handle image uploads to Cloudinary
        uploaded_images = []
        if 'images' in request.FILES:
            for image in request.FILES.getlist('images'):
                upload_result = cloudinary.uploader.upload(
                    image,
                    folder=f"vehicles/{vehicle.id}/",
                    transformation=[
                        {'width': 1200, 'crop': 'scale'},
                        {'quality': 'auto'}
                    ]
                )
                
                # Create VehicleImage record
                VehicleImage.objects.create(
                    vehicle=vehicle,
                    image=upload_result['public_id'],  # Using Cloudinary public_id
                    public_id=upload_result['public_id']
                )
                
                uploaded_images.append(upload_result['secure_url'])

        return Response({
            'message': 'Vehicle created successfully',
            'vehicle_id': vehicle.id,
            'image_urls': uploaded_images
        }, status=status.HTTP_201_CREATED)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
def image_posting(request):
    try:
        image = request.FILES.get('image')
        vehicle_id = request.data.get('vehicle_id')

        if not image or not vehicle_id:
            return Response({"error": "Image and vehicle_id are required"}, status=400)

        vehicle = Vehicle.objects.get(id=vehicle_id)

        upload_result = cloudinary.uploader.upload(image)
        image_url = upload_result.get('secure_url')

        # Save to DB
        VehicleImage.objects.create(vehicle=vehicle, image_url=image_url)

        return Response({"image_url": image_url}, status=200)

    except Vehicle.DoesNotExist:
        return Response({"error": "Vehicle not found"}, status=404)
    except Exception as e:
        return Response({"error": f"Invalid image: {str(e)}"}, status=400)

@api_view(['PATCH'])
def update_profile(request, user_id):
    """
    Combined profile update function that handles:
    1. Image upload to Cloudinary
    2. Password changes with verification
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        # Get data from request
        image = request.FILES.get('image')  # For file uploads
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        updated_fields = []
        response_data = {}
        
        # Handle image update with Cloudinary upload
        if image:
            try:
                # Upload image to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    image,
                    folder="profile_images",  # Optional: organize in folders
                    transformation=[
                        {'width': 400, 'height': 400, 'crop': 'fill'},  # Resize and crop
                        {'quality': 'auto'},  # Optimize quality
                        {'fetch_format': 'auto'}  # Optimize format
                    ]
                )
                
                # Get the secure URL from Cloudinary
                image_url = upload_result.get('secure_url')
                
                if image_url:
                    user.image_url = image_url
                    updated_fields.append('profile image')
                    response_data['image_url'] = image_url
                else:
                    return Response({
                        "error": "Failed to upload image to Cloudinary"
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            except Exception as cloudinary_error:
                return Response({
                    "error": f"Image upload failed: {str(cloudinary_error)}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Handle password update
        if new_password:
            # Check if current password is provided
            if not current_password:
                return Response({
                    "error": "Current password is required to set a new password"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify current password
            if not check_password(current_password, user.password):
                return Response({
                    "error": "Current password is incorrect"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate new password
            if len(new_password) < 8:
                return Response({
                    "error": "New password must be at least 8 characters long"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if new password is different from current
            if check_password(new_password, user.password):
                return Response({
                    "error": "New password must be different from current password"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Additional password validation (optional)
            if not any(char.isdigit() for char in new_password):
                return Response({
                    "error": "Password must contain at least one number"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not any(char.isupper() for char in new_password):
                return Response({
                    "error": "Password must contain at least one uppercase letter"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Update password
            user.password = make_password(new_password)
            updated_fields.append('password')
        
        # Check if any updates were made
        if not updated_fields:
            return Response({
                "error": "No valid fields provided for update. Please provide an image or password change."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save the user
        user.save()
        
        # Prepare success response
        response_data.update({
            "message": f"Profile updated successfully. Updated: {', '.join(updated_fields)}",
            "updated_fields": updated_fields,
            "user_id": user.id
        })
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "error": f"Failed to update profile: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(["POST"])
def profile_image(request, user_id):
    try:
        image = request.FILES.get('image')
        if not image or not user_id:
            return Response({"error": "Image and user_id are required"}, status=400)
        user = User.objects.get(id=user_id)
        upload_result = cloudinary.uploader.upload(image)
        image_url = upload_result.get('secure_url')
        user.image_url = image_url
        return Response({"image_url": image_url}, status=200)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
        