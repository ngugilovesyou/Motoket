from decimal import Decimal
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings

from ..models import User, Payment

PAYPAL_API = "https://api-m.sandbox.paypal.com"


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
                    "value": "10.00",
                }
            }
        ],
    }
    res = requests.post(f"{PAYPAL_API}/v2/checkout/orders", json=order_data, headers=headers)
    return Response(res.json(), status=res.status_code)


@api_view(["POST"])
def capture_paypal_order(request):
    order_id = request.data.get("orderID")
    if not order_id:
        return Response({"error": "Missing orderID"}, status=400)

    access_token = get_access_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    res = requests.post(
        f"{PAYPAL_API}/v2/checkout/orders/{order_id}/capture",
        headers=headers,
    )
    capture_response = res.json()

    if res.status_code != 200:
        return Response(
            {"error": "Payment capture failed", "details": capture_response},
            status=res.status_code,
        )

    payment_status = capture_response.get("status")
    transaction_id = capture_response["id"]
    user_id = request.user.id
    amount = Decimal(capture_response["purchase_units"][0]["amount"]["value"])

    payment = Payment(
        user=User.objects.get(id=user_id),
        amount=amount,
        status=payment_status,
        payment_method="PayPal",
        transaction_id=transaction_id,
    )
    payment.save()

    return Response({"message": "Payment successfully captured", "payment": payment.id}, status=200)