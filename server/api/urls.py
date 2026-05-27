# server/api/urls.py
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .cloudinary import image_posting



urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include('api.urls.auth_urls')),
    path('', include('api.urls.user_urls')),
    path('', include('api.urls.vehicle_urls')),
    path('', include('api.urls.favourite_urls')),
    path('', include('api.urls.payment_urls')),
    path('', include('api.urls.chat_urls')),
 
    # Cloudinary image upload (standalone endpoint)
    path('api/post_image', image_posting, name='post_image'),
]
# urlpatterns = [
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('api/post_image', image_posting, name='post_image'),
#     path('api/<int:user_id>/post_vehicle/', post_vehicle, name='post_vehicle'),
#     path('api/<int:user_id>/update_profile/', update_profile, name='update_profile'),
    


# ]

# urlpatterns = [
#     path('home', home, name='home'),
#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
#     path('api/register/', register_user, name='register_user'),
#     path('api/login/', login_user, name='login_user'),
#     path('api/login-admin/', login_admin, name='login_admin'),
#     path('api/<int:user_id>/get_user/', get_user,name='get_user'),
#     path('api/<int:user_id>/get_admin/', get_admin,name='get_admin'),
#     path('api/users/check/', check_email, name='check_email'),
#     path('api/users/update-firebase/', update_firebase_uid, name='update-firebase'),
#     path('api/<int:user_id>/update_profile/', update_profile, name='update_profile'),
#     path('api/<int:user_id>/delete/', delete_user, name='delete_user'),
#     path('api/logout/', logout_user, name='logout_user'),
#     path('api/<int:user_id>/post_vehicle/', post_vehicle, name='post_vehicle'),
#     path('api/<int:user_id>/user_vehicles/', get_user_vehicles, name='get_user_vehicles'),
#     path('api/<int:user_id>/<int:vehicle_id>/update/', update_vehicle, name='update_vehicle'),
#     path('api/<int:user_id>/<int:vehicle_id>/delete-vehicle/', delete_vehicle, name='delete_vehicle'),
#     path('api/all_vehicles/', get_all_vehicles, name='get_all_vehicles'),
#     path("api/featured_vehicles/", get_featured_vehicles, name="featured_vehicles"),
#     path('api/get_vehicle_details/<slug:slug>/', get_vehicle_details, name='get_vehicle_details'),
#     path('api/<int:user_id>/<int:vehicle_id>/favourite/', favourite_vehicle, name='favourite_vehicle'),
#     path('api/<int:user_id>/user-favourite/', user_favourite, name='user_favourite'),
#     path('api/<int:user_id>/<int:vehicle_id>/unfavourite/', unfavourite_vehicle, name="unfavourite_vehicle"),
#     path('api/<int:user_id>/<int:vehicle_id>/is_favourited/', is_favorited, name='is_favorited'),
#     path("api/paypal/create-order/", create_paypal_order, name="create_paypal_order"),
#     path("api/paypal/capture-order/", capture_paypal_order, name="capture_paypal_order"),
#     path('api/make_payment/', make_payment, name='make_payment'),
#     path('api/callback_payment/', callback_payment, name='callback_payment'),
#     path('api/payment_status/', payment_status, name='payment_status'),
#     path('api/post_image', image_posting, name='post_image'),
#     path('api/create_chat/', create_chat, name='create_chat'),
#     path('api/send_message/', send_message, name='send_message'),
#     path('api/join_chat/', join_chat, name='join_chat'),
#     path('api/seller_chats/', seller_chats, name='seller_chats'),
#     path("api/<int:user_id>/admin_chats/", admin_chats, name="admin_chats"),
#     path("api/chat_messages/<str:chat_id>/", chat_messages, name="chat_messages"),
# ]
