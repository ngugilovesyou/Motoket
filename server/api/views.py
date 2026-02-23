import traceback
from django.shortcuts import render
import base64
from datetime import datetime, timedelta
from decimal import Decimal
import re
import jwt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
from decouple import config
from .serializer import FullChatSerializer, UserSerializer, VehicleSerializer, ChatSerializer, MessageSerializer,FavouriteSerializer
from .models import User, Vehicle,VehicleImage, Payment, Chat, ChatMessage,FavouritedVehicle
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework import status
from django.db.models import Q, Count, Prefetch
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
import cloudinary
import logging

logger = logging.getLogger(__name__)
Admin = get_user_model() 
# Create your views here.
PAYPAL_CLIENT_ID = config("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = config("PAYPAL_SECRET")
PAYPAL_API = "https://api-m.sandbox.paypal.com"

MAILBOXLAYER_API_ACCESS_KEY= config("MAILBOXLAYER_API_ACCESS_KEY")


def validate_email(email):
            api_key = 'YOUR_MAILBOXLAYER_API_KEY'
            url = f"http://apilayer.net/api/check?access_key={MAILBOXLAYER_API_ACCESS_KEY}&email={email}&smtp=1&format=1"
            response = requests.get(url)
            data = response.json()

            if data.get("format_valid") and data.get("mx_found") and data.get("smtp_check"):
                return True
            return False

def generate_jwt(user):
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow(),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token  
@api_view(['GET'])
def home(request):
    return Response({"message": "Welcome to our API"})

@api_view(['POST'])
def register_user(request):
    data = request.data

    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    confirm_password = data.get('confirm_password', '').strip()
    role = data.get('role', 'Buyer').strip()

    # Check required fields
    missing_fields = [f for f in ['first_name','last_name','email','password','role'] if not locals()[f]]
    if missing_fields:
        return Response(
            {"error": f"Please fill in all required fields: {', '.join(missing_fields)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Confirm password
    if password != confirm_password:
        return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

    # Optional: check password strength
    if len(password) < 8:
        return Response({"error": "Password must be at least 8 characters"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            role=role
        )
        user.set_password(password)  
        user.save()

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("Error during registration:", e)
        
        return Response({"error": "Something went wrong during registration"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def login_user(request):
    data = request.data
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return Response({"error": "Please fill in all fields"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
        return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

    # JWT token generation (your function)
    access_token = generate_jwt(user)

    return Response({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "image_url": user.image_url,
            "created_at": user.created_at
        },
        "token": access_token
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def login_admin(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Please fill in all fields"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

    if not check_password(password, user.password):
        return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_admin:
        return Response({"error": "You are not authorized as admin."}, status=status.HTTP_403_FORBIDDEN)

    access_token = generate_jwt(user)

    return Response({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "is_admin": user.is_admin,
        },
        "token": access_token,
    }, status=status.HTTP_200_OK)
    
@api_view(["GET"])
def get_user(request, user_id):
    if request.method == "GET":
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print("Error during user retrieval:", e)
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




@api_view(["GET"])
def get_admin(request, user_id):
    try:
        user =User.objects.get(id=user_id)
        print("user is", user)

        user_data = {
            "id": user.id,
            "email": user.email,
        }

        return Response(user_data, status=status.HTTP_200_OK)

    except Exception as e:
        print("Error during user retrieval:", e)
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def check_email(request):
    email = request.GET.get('email')
    
    try:
        # Try to get the user
        user = User.objects.get(email=email)
        exists = True
        user_data = UserSerializer(user).data
    except User.DoesNotExist:
        exists = False
        user_data = None

    return Response({
        "exists": exists,
        "user": user_data
    })

@api_view(['PATCH'])
def update_firebase_uid(request):
    """
    Update a user's firebase_uid based on their email
    """
    email = request.data.get('email')
    firebase_uid = request.data.get('firebase_uid')

    if not email or not firebase_uid:
        return Response(
            {"error": "Both email and firebase_uid are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    user.firebase_uid = firebase_uid
    user.save()

    return Response({"message": "Firebase UID updated successfully"})

@api_view(['DELETE'])  
def delete_user(request, user_id):
    if request.method == 'DELETE':
        
        if not user_id:
            return Response({"error": "Please fill in all fields"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
def logout_user(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user_vehicles(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        vehicles = Vehicle.objects.filter(user=user)
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# -----------Helper function for is_featured update----------------
def parse_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in ["true", "1", "yes"]
    return False

# -----------end of helper function----------------
    
@api_view(['PATCH'])
def update_vehicle(request, user_id, vehicle_id):
    try:
        user = User.objects.get(id=user_id)
        vehicle = Vehicle.objects.get(id=vehicle_id, user=user)
        
        
        description = request.data.get('description')
        price = request.data.get('price')
        new_image_urls = request.data.get('image_urls')  

        if description:
            vehicle.description = description
        if price:
            vehicle.price = price
        if 'is_featured' in request.data:
            vehicle.is_featured = parse_bool(request.data.get('is_featured'))

 
        if new_image_urls:
            if isinstance(new_image_urls, str):
                new_image_urls = [new_image_urls]
            for url in new_image_urls:
                VehicleImage.objects.create(vehicle=vehicle, image_url=url)
        
        vehicle.save()
        return Response({"message": "Vehicle updated successfully"}, status=status.HTTP_200_OK)

    except Vehicle.DoesNotExist:
        return Response({"error": "Vehicle not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_vehicle(request, user_id, vehicle_id):
    try:
        user = User.objects.get(id=user_id)
        vehicle = Vehicle.objects.get(id=vehicle_id, user=user)
        
        # Delete the vehicle (images will cascade delete if ForeignKey has on_delete=CASCADE)
        vehicle.delete()
        
        return Response(
            {"message": "Vehicle deleted successfully"}, 
            status=status.HTTP_200_OK
        )
    except Vehicle.DoesNotExist:
        return Response(
            {"error": "Vehicle not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(["GET"])
def get_all_vehicles(request):
   
    try:
        # Start with base queryset - optimize with select_related and prefetch_related
        vehicles = Vehicle.objects.select_related('user').prefetch_related(
            Prefetch('images', queryset=VehicleImage.objects.all())
        )
        
        # === FILTERS ===
        
        # Featured filter
        is_featured = request.query_params.get('is_featured')
        if is_featured is not None:
            is_featured_bool = is_featured.lower() == 'true'
            vehicles = vehicles.filter(is_featured=is_featured_bool)
        
        # Make filter (case-insensitive)
        make = request.query_params.get('make')
        if make:
            vehicles = vehicles.filter(make__iexact=make.strip())
        
        # Model filter (case-insensitive)
        model = request.query_params.get('model')
        if model:
            vehicles = vehicles.filter(model__iexact=model.strip())
        
        # Price range filters
        price_min = request.query_params.get('priceMin')
        if price_min:
            try:
                vehicles = vehicles.filter(price__gte=float(price_min))
            except ValueError:
                logger.warning(f"Invalid priceMin value: {price_min}")
        
        price_max = request.query_params.get('priceMax')
        if price_max:
            try:
                vehicles = vehicles.filter(price__lte=float(price_max))
            except ValueError:
                logger.warning(f"Invalid priceMax value: {price_max}")
        
        # Year range filters
        year_min = request.query_params.get('yearMin')
        if year_min:
            try:
                vehicles = vehicles.filter(year__gte=int(year_min))
            except ValueError:
                logger.warning(f"Invalid yearMin value: {year_min}")
        
        year_max = request.query_params.get('yearMax')
        if year_max:
            try:
                vehicles = vehicles.filter(year__lte=int(year_max))
            except ValueError:
                logger.warning(f"Invalid yearMax value: {year_max}")
        
        # Mileage filter
        mileage_max = request.query_params.get('mileageMax')
        if mileage_max:
            try:
                vehicles = vehicles.filter(mileage__lte=int(mileage_max))
            except ValueError:
                logger.warning(f"Invalid mileageMax value: {mileage_max}")
        
        # Fuel type filter
        fuel_type = request.query_params.get('fuelType')
        if fuel_type:
            vehicles = vehicles.filter(fuel_type__iexact=fuel_type.strip())
        
        # Transmission filter
        transmission = request.query_params.get('transmission')
        if transmission:
            vehicles = vehicles.filter(transmission__iexact=transmission.strip())
        
        # Location filter (searches in region field)
        location = request.query_params.get('location')
        if location:
            vehicles = vehicles.filter(region__icontains=location.strip())
        
        # Condition filter
        condition = request.query_params.get('condition')
        if condition:
            vehicles = vehicles.filter(condition__iexact=condition.strip())
        
        # Body type filter
        body_type = request.query_params.get('bodyType')
        if body_type:
            vehicles = vehicles.filter(body_type__iexact=body_type.strip())
        
        # Color filter
        color = request.query_params.get('color')
        if color:
            vehicles = vehicles.filter(color__icontains=color.strip())
        
        # === SEARCH FUNCTIONALITY ===
        search = request.query_params.get('search')
        if search:
            search_term = search.strip()
            vehicles = vehicles.filter(
                Q(make__icontains=search_term) |
                Q(model__icontains=search_term) |
                Q(description__icontains=search_term) |
                Q(body_type__icontains=search_term) |
                Q(fuel_type__icontains=search_term) |
                Q(region__icontains=search_term)
            )
        
        # === SORTING ===
        sort = request.query_params.get('sort', '')
        
        # Default sorting: Featured first, then newest
        if not sort or sort == '':
            vehicles = vehicles.order_by('-is_featured', '-created_at')
        elif sort == 'price_asc':
            vehicles = vehicles.order_by('price')
        elif sort == 'price_desc':
            vehicles = vehicles.order_by('-price')
        elif sort == 'year_desc':
            vehicles = vehicles.order_by('-year', '-created_at')
        elif sort == 'year_asc':
            vehicles = vehicles.order_by('year', 'created_at')
        elif sort == 'mileage_asc':
            vehicles = vehicles.order_by('mileage')
        elif sort == 'mileage_desc':
            vehicles = vehicles.order_by('-mileage')
        elif sort == 'newest':
            vehicles = vehicles.order_by('-created_at')
        elif sort == 'oldest':
            vehicles = vehicles.order_by('created_at')
        else:
            # Unknown sort parameter, use default
            vehicles = vehicles.order_by('-is_featured', '-created_at')
        
        # === PAGINATION ===
        try:
            page = int(request.query_params.get('page', 1))
            if page < 1:
                page = 1
        except (ValueError, TypeError):
            page = 1
        
        try:
            limit = int(request.query_params.get('limit', 15))
            # Enforce reasonable limits
            if limit < 1:
                limit = 15
            elif limit > 100:  # Max 100 items per page
                limit = 100
        except (ValueError, TypeError):
            limit = 15
        
        # Get total count before pagination
        total_count = vehicles.count()
        
        # Calculate pagination
        start = (page - 1) * limit
        end = start + limit
        
        # Get paginated results
        vehicles_page = vehicles[start:end]
        
        # Serialize the data
        serializer = VehicleSerializer(vehicles_page, many=True)
        
        # Calculate pagination metadata
        total_pages = (total_count + limit - 1) // limit  # Ceiling division
        has_next = page < total_pages
        has_previous = page > 1
        
        # Build response
        response_data = {
            "success": True,
            "count": total_count,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": limit,
            "has_next": has_next,
            "has_previous": has_previous,
            "vehicles": serializer.data
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in get_all_vehicles: {str(e)}", exc_info=True)
        return Response({
            "success": False,
            "error": "An error occurred while fetching vehicles",
            "details": str(e) if request.user.is_staff else None  # Only show details to staff
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_featured_vehicles(request):
    try:
        vehicles = Vehicle.objects.select_related('user').prefetch_related(
            Prefetch('images', queryset=VehicleImage.objects.all())
        ).filter(is_featured=True)  # always featured

        # === FILTERS ===
        make = request.query_params.get('make')
        if make:
            vehicles = vehicles.filter(make__iexact=make.strip())

        model = request.query_params.get('model')
        if model:
            vehicles = vehicles.filter(model__iexact=model.strip())

        price_min = request.query_params.get('priceMin')
        if price_min:
            try:
                vehicles = vehicles.filter(price__gte=float(price_min))
            except ValueError:
                pass

        price_max = request.query_params.get('priceMax')
        if price_max:
            try:
                vehicles = vehicles.filter(price__lte=float(price_max))
            except ValueError:
                pass

        year_min = request.query_params.get('yearMin')
        if year_min:
            try:
                vehicles = vehicles.filter(year__gte=int(year_min))
            except ValueError:
                pass

        year_max = request.query_params.get('yearMax')
        if year_max:
            try:
                vehicles = vehicles.filter(year__lte=int(year_max))
            except ValueError:
                pass

        fuel_type = request.query_params.get('fuelType')
        if fuel_type:
            vehicles = vehicles.filter(fuel_type__iexact=fuel_type.strip())

        transmission = request.query_params.get('transmission')
        if transmission:
            vehicles = vehicles.filter(transmission__iexact=transmission.strip())

        location = request.query_params.get('location')
        if location:
            vehicles = vehicles.filter(region__icontains=location.strip())

        condition = request.query_params.get('condition')
        if condition:
            vehicles = vehicles.filter(condition__iexact=condition.strip())

        body_type = request.query_params.get('bodyType')
        if body_type:
            vehicles = vehicles.filter(body_type__iexact=body_type.strip())

        color = request.query_params.get('color')
        if color:
            vehicles = vehicles.filter(color__icontains=color.strip())

        search = request.query_params.get('search')
        if search:
            search_term = search.strip()
            vehicles = vehicles.filter(
                Q(make__icontains=search_term) |
                Q(model__icontains=search_term) |
                Q(description__icontains=search_term) |
                Q(body_type__icontains=search_term) |
                Q(fuel_type__icontains=search_term) |
                Q(region__icontains=search_term)
            )

        # === SORTING ===
        sort = request.query_params.get('sort', '')
        if not sort or sort == '':
            vehicles = vehicles.order_by('-created_at')  # newest featured first
        elif sort == 'price_asc':
            vehicles = vehicles.order_by('price')
        elif sort == 'price_desc':
            vehicles = vehicles.order_by('-price')
        elif sort == 'year_desc':
            vehicles = vehicles.order_by('-year', '-created_at')
        elif sort == 'year_asc':
            vehicles = vehicles.order_by('year', 'created_at')
        elif sort == 'mileage_asc':
            vehicles = vehicles.order_by('mileage')
        elif sort == 'mileage_desc':
            vehicles = vehicles.order_by('-mileage')
        elif sort == 'newest':
            vehicles = vehicles.order_by('-created_at')
        elif sort == 'oldest':
            vehicles = vehicles.order_by('created_at')

        # === PAGINATION ===
        page = max(int(request.query_params.get('page', 1)), 1)
        limit = min(max(int(request.query_params.get('limit', 15)), 1), 100)
        total_count = vehicles.count()
        start = (page - 1) * limit
        end = start + limit
        vehicles_page = vehicles[start:end]

        serializer = VehicleSerializer(vehicles_page, many=True)

        total_pages = (total_count + limit - 1) // limit
        response_data = {
            "success": True,
            "count": total_count,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": limit,
            "has_next": page < total_pages,
            "has_previous": page > 1,
            "vehicles": serializer.data
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in get_featured_vehicles: {str(e)}", exc_info=True)
        return Response({
            "success": False,
            "error": "An error occurred while fetching featured vehicles",
            "details": str(e) if request.user.is_staff else None
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_vehicle_details(request, slug):
    try:
        # Get the specific vehicle with its related images
        vehicle = Vehicle.objects.prefetch_related('images').get(slug=slug)
        
        # Serialize the vehicle
        serializer = VehicleSerializer(vehicle)
        
        # Return the vehicle details
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Vehicle.DoesNotExist:
        return Response({"error": "Vehicle not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_favourite(request, user_id):
    """
    Get all favorite vehicles for a specific user
    """
    try:
        # Get the user and their favorites with vehicle data pre-fetched
        user = User.objects.get(id=user_id)
        favourites = FavouritedVehicle.objects.filter(user=user).select_related('vehicle')
        
        # Serialize the data
        serializer = FavouriteSerializer(favourites, many=True)
        
        return Response({
            'count': favourites.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
@api_view(['POST'])
def favourite_vehicle(request, user_id, vehicle_id):
    try:
        user = User.objects.get(id=user_id)
        vehicle = Vehicle.objects.get(id=vehicle_id)
        
        # Check if already favorited
        fav, created = FavouritedVehicle.objects.get_or_create(user=user, vehicle=vehicle)

        if created:
            return Response({"message": "Vehicle favorited successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Vehicle was already favorited."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_user_favourite(request, user_id):
    try:
        # Get the user's favourite vehicles
        favourites = FavouritedVehicle.objects.filter(user_id=user_id)
        serializer=FavouriteSerializer(favourites)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
def unfavourite_vehicle(request, user_id, vehicle_id):
    try:
        fav = FavouritedVehicle.objects.get(user_id=user_id, vehicle_id=vehicle_id)
        fav.delete()
        return Response({"message": "Vehicle unfavorited."}, status=status.HTTP_200_OK)
    except FavouritedVehicle.DoesNotExist:
        return Response({"error": "Not favorited."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def is_favorited(request, user_id, vehicle_id):
    is_fav = FavouritedVehicle.objects.filter(user_id=user_id, vehicle_id=vehicle_id).exists()
    return Response({"is_favorited": is_fav}, status=200)
        
def get_access_token():
    res = requests.post(
        f"{PAYPAL_API}/v1/oauth2/token",
        auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET),
        data={"grant_type": "client_credentials"},
    )
    return res.json().get("access_token")

@api_view(["POST"])
def create_paypal_order(request):
    access_token = get_access_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    order_data = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": "10.00"  
                }
            }
        ]
    }
    res = requests.post(f"{PAYPAL_API}/v2/checkout/orders", json=order_data, headers=headers)
    return Response(res.json(), status=res.status_code)

@api_view(["POST"])
def capture_paypal_order(request):
    order_id = request.data.get("orderID")
    if not order_id:
        return Response({"error": "Missing orderID"}, status=400)

    # Step 1: Capture payment
    access_token = get_access_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    # Step 2: Make the capture API call to PayPal
    res = requests.post(f"{PAYPAL_API}/v2/checkout/orders/{order_id}/capture", headers=headers)
    capture_response = res.json()

    if res.status_code != 200:
        return Response({"error": "Payment capture failed", "details": capture_response}, status=res.status_code)

    # Step 3: Extract data from PayPal capture response
    payment_status = capture_response.get("status")  
    transaction_id = capture_response["id"]  

    user_id = request.user.id  
    amount = Decimal(capture_response["purchase_units"][0]["amount"]["value"])

    # Step 4: Save data into the Payment model
    payment = Payment(
        user=User.objects.get(id=user_id),
        amount=amount,
        status=payment_status,  
        payment_method="PayPal", 
        transaction_id=transaction_id,
    )
    payment.save()

    return Response({"message": "Payment successfully captured", "payment": payment.id}, status=200)

def fetch_access_token():
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET

    credentials = f"{consumer_key}:{consumer_secret}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()
    
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    headers = {"Authorization": f"Basic {encoded_credentials}"}

    try:
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            return response.json().get("access_token")
        else:
            return None
    except requests.exceptions.RequestException as e:
        print("Network error during token fetch:", e)
    except ValueError:
        print("Failed to decode token JSON. Raw response:", response.text)
    return None



@api_view(['POST'])
def make_payment(request):
    try:
        access_token = fetch_access_token()
        if not access_token:
            return Response({"error": "Failed to retrieve access token"}, status=500)

        phone_number = re.sub(r'\D', '', request.data.get("phone_number", ""))
        user_id = request.data.get("user_id", "")

        if not phone_number or not user_id :
            return Response({"error": "Phone number and user_id are required"}, status=400)
        
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        shortcode = "174379"
        passkey = settings.PASSKEY
        password = base64.b64encode((shortcode + passkey + timestamp).encode()).decode()

        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": 1,
            "PartyA": phone_number,
            "PartyB": shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": "https://27f8-197-237-161-183.ngrok-free.app/api/callback_payment",
            "AccountReference": "ROYAL ASSETS LIMITED",
            "TransactionDesc": "Payment of health awareness"
        }

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        response = requests.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            json=payload, headers=headers
        )

        res_data = response.json()
        transaction_id = res_data.get("CheckoutRequestID")
        if not transaction_id:
            return Response({"error": "No CheckoutRequestID received"}, status=500)

        Payment.objects.create(
            user=user,
            amount=1,
            transaction_id=transaction_id,
            status='Pending',
            payment_method='Mpesa'
        )

        return Response(res_data)
    except Exception as e:
        return Response({"error": f"Unexpected error: {str(e)}"}, status=500)

@api_view(['POST'])
def callback_payment(request):
    try:
        data = request.data.get("Body", {}).get("stkCallback", {})
        result_code = data.get("ResultCode")
        transaction_id = data.get("CheckoutRequestID")

        # Find the payment using the transaction ID
        payment = Payment.objects.filter(transaction_id=transaction_id).first()
        if not payment:
            return Response({"error": "Payment not found"}, status=404)

        # Extract metadata from the callback response
        metadata = data.get("CallbackMetadata", {}).get("Item", [])
        payment_data = {item['Name']: item.get("Value") for item in metadata if "Name" in item}

        if result_code == 0:
            # Payment was successful
            payment.status = "Completed"
            payment.amount = payment_data.get("Amount", payment.amount)
            txn_date = str(payment_data.get("TransactionDate"))
            if txn_date and len(txn_date) == 14:
                payment.created_at = datetime.strptime(txn_date, "%Y%m%d%H%M%S")
        elif result_code == 1:
            # Payment was canceled or failed
            payment.status = "Canceled"  # or "Failed" based on your preference

        payment.save()

        return Response({"message": "Payment status updated"}, status=200)

    except Exception as e:
        return Response({"error": f"Callback error: {str(e)}"}, status=500)


@api_view(['POST'])
def payment_status(request):
    try:
        transaction_id = request.data.get('transaction_id')
        if not transaction_id:
            return Response({"error": "Transaction ID is required"}, status=400)

        payment = Payment.objects.filter(transaction_id=transaction_id).first()
        if not payment:
            return Response({"error": "Payment not found"}, status=404)

        return Response({
            "status": payment.status,
            "amount": payment.amount,
            "currency": "KES",
            "transaction_id": payment.transaction_id,
            "payment_date": payment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        })

    except Exception as e:
        return Response({"error": f"Error fetching status: {str(e)}"}, status=500) 

@api_view(["POST"])
def create_chat(request):
    buyer_id = request.data.get("buyer_id")
    vehicle_id = request.data.get("vehicle_id")

    if not buyer_id or not vehicle_id:
        return Response({"error": "buyer_id and vehicle_id are required"}, status=400)

    vehicle = get_object_or_404(Vehicle, id=vehicle_id)

    try:
        buyer = User.objects.get(id=buyer_id)
        seller = vehicle.user 

        chat, _ = Chat.objects.get_or_create(
            initiator=buyer,
            acceptor=seller,
            vehicle=vehicle,
        )

        serializer = FullChatSerializer(chat)
        return Response(
            {"message": "Chat retrieved or created", "data": serializer.data},
            status=200,
        )

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


    
@api_view(["POST"])
def send_message(request):
    try:
        data = request.data
        sender_id = data.get("sender_id")
        if not sender_id:
            return Response({"error": "sender_id is required"}, status=400)

        sender = get_object_or_404(User, pk=sender_id)

        chat = get_object_or_404(Chat, short_id=data["chat_id"])

        message_instance = ChatMessage.objects.create(
            sender=sender,
            chat=chat,
            text=data["text"]
        )

        serialized = MessageSerializer(message_instance).data
        serialized["chat"] = chat.short_id
        serialized["sender_id"] = sender.id  

        return Response({"message": "Message sent", "data": serialized}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


    
@api_view(['POST'])
def join_chat(request):
    chat_id = request.data.get('chat_id')

    if not chat_id:
        return Response({"error": "chat_id is required"}, status=400)

    chat = get_object_or_404(Chat, short_id=chat_id)

    # If acceptor is empty, set it to the owner of the vehicle
    if chat.acceptor is None:
        chat.acceptor = chat.vehicle.user  # ← owner of the vehicle
        chat.save()
        return Response(
            {"message": "Vehicle owner joined the chat", "chat_id": chat.short_id},
            status=200,
        )
    else:
        return Response({"error": "Chat already has an acceptor"}, status=400)



@api_view(["GET"])
def seller_chats(request):
    user_id = request.GET.get("user_id")

    if not user_id:
        return Response({"error": "user_id is required"}, status=400)

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    chats = Chat.objects.filter(acceptor=user).order_by("-updated_at")
    serializer = FullChatSerializer(chats, many=True)

    return Response({"data": serializer.data}, status=200)


@api_view(["GET"])
def chat_messages(request, short_id):
    chat = get_object_or_404(Chat, short_id=short_id)
    messages = ChatMessage.objects.filter(chat=chat).order_by("created_at")
    serializer = MessageSerializer(messages, many=True)
    return Response({"data": serializer.data})


@api_view(["GET"])
def admin_chats(request, user_id):
    try:
        print("Received user_id:", user_id, type(user_id))
        admin_user = User.objects.get(id=user_id)
        

        if not admin_user.is_admin:
            return Response({"error": "Unauthorized"}, status=403)

        chats = Chat.objects.filter(acceptor=admin_user).order_by("-id")
        serialized = ChatSerializer(chats, many=True)
        return Response(serialized.data)

    except Admin.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    
    except Exception as e:
        import traceback
        traceback.print_exc()  # 👈 log full stack trace
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
def chat_messages(request, chat_id):
    chat = get_object_or_404(Chat, short_id=chat_id)


    messages = chat.messages.order_by("created_at")
    serialized = MessageSerializer(messages, many=True)
    return Response(serialized.data)    

@api_view(["GET"])
def get_unread_count(request, chat_id):
    chat = get_object_or_404(Chat, short_id=chat_id)
    count = chat.unread_counts.get(str(request.user.id), 0)
    return Response({"unread": count})
