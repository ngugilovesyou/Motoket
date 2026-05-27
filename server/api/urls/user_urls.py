from django.urls import path

from ..views import get_user, get_admin, check_email, update_firebase_uid, delete_user
from ..cloudinary import update_profile

urlpatterns = [
    path('api/<int:user_id>/get_user/', get_user, name='get_user'),
    path('api/<int:user_id>/get_admin/', get_admin, name='get_admin'),
    path('api/users/check/', check_email, name='check_email'),
    path('api/users/update-firebase/', update_firebase_uid, name='update-firebase'),
    path('api/<int:user_id>/update_profile/', update_profile, name='update_profile'),
    path('api/<int:user_id>/delete/', delete_user, name='delete_user'),
]