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
        