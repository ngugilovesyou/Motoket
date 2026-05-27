from django.urls import path

from ..views import create_paypal_order, capture_paypal_order
from ..views.mpesa_payment_views import make_payment, callback_payment, payment_status

urlpatterns = [
    path('api/paypal/create-order/', create_paypal_order, name='create_paypal_order'),
    path('api/paypal/capture-order/', capture_paypal_order, name='capture_paypal_order'),
    path('api/make_payment/', make_payment, name='make_payment'),
    path('api/callback_payment/', callback_payment, name='callback_payment'),
    path('api/payment_status/', payment_status, name='payment_status'),
]