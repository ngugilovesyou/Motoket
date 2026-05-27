from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from ..views import home, register_user, login_user, login_admin, logout_user

urlpatterns = [
    path('home', home, name='home'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register_user, name='register_user'),
    path('api/login/', login_user, name='login_user'),
    path('api/login-admin/', login_admin, name='login_admin'),
    path('api/logout/', logout_user, name='logout_user'),
]