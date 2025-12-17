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

import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
import cloudinary

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
    if request.method == 'POST':
        
        # Get all required fields
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        role = request.data.get('role', 'Buyer')
        
        # Perform validations
        if not first_name or not last_name  or not email  or not password or not role:
            missing_fields = []
            if not first_name: missing_fields.append("first_name")
            if not last_name: missing_fields.append("last_name")
            if not email: missing_fields.append("email")
            if not password: missing_fields.append("password")
            if not role: missing_fields.append("role")
            
            return Response({
                "error": f"Please fill in all required fields: {', '.join(missing_fields)}"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
        
       
        
        try:
            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create and save user
            user = User(
                first_name=first_name,
                last_name=last_name,
                password=password, 
                email=email,
                role=role

            )
            user.save()
            
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error during user registration:", e)
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    # If not POST method
    return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def login_user(request):
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

    

    access_token = generate_jwt(user)

    return Response({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "is_admin": user.is_admin,
            "first_name": user.first_name,  
            "last_name": user.last_name, 
            "role": user.role,             
            "is_admin": user.is_admin,
            "image_url": user.image_url, 
            "created_at":user.created_at
        },
        "token": access_token,
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

@api_view(["GET"])
def get_all_vehicles(request):
    try:
        # Get the query parameter
        is_featured = request.query_params.get('is_featured')

        # Start with all vehicles
        vehicles = Vehicle.objects.all().prefetch_related('images')

        # Filter by is_featured if provided
        if is_featured is not None:
            is_featured_bool = is_featured.lower() == 'true'
            vehicles = vehicles.filter(is_featured=is_featured_bool)
        
        # Get the count of vehicles
        vehicle_count = vehicles.count()
        
        # Serialize the vehicles
        serializer = VehicleSerializer(vehicles, many=True)
        
        # Return both the vehicles and the count
        return Response({
            "count": vehicle_count,
            "vehicles": serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
    
    vehicle = get_object_or_404(Vehicle, id=vehicle_id)
    
    if not buyer_id:
        return Response({"error": "buyer_id is required"}, status=400)

    try:
        buyer = User.objects.get(id=buyer_id)
        admin = User.objects.get(is_admin=True)

        # Safely get or create, respecting unique constraint
        chat, _ = Chat.objects.get_or_create(
            initiator=buyer,
            acceptor=admin,
            vehicle=vehicle,
        )

        serializer = FullChatSerializer(chat)
        return Response({"message": "Chat retrieved or created", "data": serializer.data}, status=200)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)



    
@api_view(["POST"])
def send_message(request):
    try:
        print("SEND_MESSAGE_PAYLOAD:", request.data)

        data = request.data
        sender = get_object_or_404(User, pk=data["sender_id"])

        # Get or create the chat for this sender (assuming initiator field)
        # chat, created = Chat.objects.get_or_create(initiator=sender)
        chat = get_object_or_404(Chat, short_id=data["chat_id"])

        # Now create the message
        message_instance = ChatMessage.objects.create(
            sender=sender,
            chat=chat,
            text=data["text"]
        )

        serialized = MessageSerializer(message_instance).data
        serialized["chat"] = chat.short_id  # return the chat's short_id
        serialized["sender"] = str(serialized["sender"])

        return Response({"message": "Message sent", "data": serialized}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def join_chat(request):
    chat_id = request.data.get('chat_id')

    if not chat_id:
        return Response({"error": "chat_id is required"}, status=400)

    chat = get_object_or_404(Chat, short_id=chat_id)

    # Get the first user with is_admin=True
    try:
        admin_user = User.objects.filter(is_admin=True).first()
        if not admin_user:
            return Response({"error": "No admin user found"}, status=404)
    except User.DoesNotExist:
        return Response({"error": "Admin user not found"}, status=404)

    if chat.acceptor is None:
        chat.acceptor = admin_user
        chat.save()
        return Response({"message": "Admin joined the chat", "chat_id": chat.short_id}, status=200)
    else:
        return Response({"error": "Chat already has an acceptor"}, status=400)


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