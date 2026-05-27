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
 
    
    path('api/post_image', image_posting, name='post_image'),
]
