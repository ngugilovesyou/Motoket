
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import admin_chats, callback_payment, chat_messages, create_chat, favourite_vehicle, get_admin, get_user, get_user_favourite, get_vehicle_details,get_all_vehicles,capture_paypal_order, create_paypal_order, get_user_vehicles, home, is_favorited, login_admin, make_payment, payment_status,register_user,login_user,delete_user,logout_user, unfavourite_vehicle, update_vehicle, send_message, join_chat
from .cloudinary import image_posting
from .cloudinary import post_vehicle



urlpatterns = [
    path('/home', home, name='home'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register_user, name='register_user'),
    path('api/login/', login_user, name='login_user'),
    path('api/login-admin/', login_admin, name='login_admin'),
    path('api/<int:user_id>/get_user', get_user,name='get_user'),
    path('api/<int:user_id>/get_admin', get_admin,name='get_admin'),
    path('api/<int:user_id>/delete/', delete_user, name='delete_user'),
    path('api/logout/', logout_user, name='logout_user'),
    path('api/<int:user_id>/post_vehicle/', post_vehicle, name='post_vehicle'),
    path('api/<int:user_id>/user_vehicles/', get_user_vehicles, name='get_user_vehicles'),
    path('api/<int:user_id>/<int:vehicle_id>/update/', update_vehicle, name='update_vehicle'),
    path('api/all_vehicles/', get_all_vehicles, name='get_all_vehicles'),
    path('api/get_vehicle_details/<slug:slug>/', get_vehicle_details, name='get_vehicle_details'),
    path('api/<int:user_id>/<int:vehicle_id>/favourite/', favourite_vehicle, name='favourite_vehicle'),
    path('api/get-favourite/', get_user_favourite, name='get_user_favourite'),
    path('api/<int:user_id>/<int:vehicle_id>/unfavourite/', unfavourite_vehicle, name="unfavourite_vehicle"),
    path('api/<int:user_id>/<int:vehicle_id>/is_favourited/', is_favorited, name='is_favorited'),
    path("api/paypal/create-order/", create_paypal_order, name="create_paypal_order"),
    path("api/paypal/capture-order/", capture_paypal_order, name="capture_paypal_order"),
    path('api/make_payment/', make_payment, name='make_payment'),
    path('api/callback_payment/', callback_payment, name='callback_payment'),
    path('api/payment_status/', payment_status, name='payment_status'),
    path('api/post_image', image_posting, name='post_image'),
    path('api/create_chat/', create_chat, name='create_chat'),
    path('api/send_message/', send_message, name='send_message'),
    path('api/join_chat/', join_chat, name='join_chat'),
    path("api/<int:user_id>/admin_chats/", admin_chats, name="admin_chats"),
    path("api/chat_messages/<str:chat_id>/", chat_messages, name="chat_messages"),
]
