# server/api/views/mpesa_payment_views.py
import base64
from datetime import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Payment, User
import re
import requests
from django.conf import settings

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
