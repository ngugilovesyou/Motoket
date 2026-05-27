from django.urls import path

from ..views import (
    get_user_vehicles,
    update_vehicle,
    delete_vehicle,
    get_all_vehicles,
    get_featured_vehicles,
    get_vehicle_details,
)
from ..cloudinary import post_vehicle

urlpatterns = [
    path('api/<int:user_id>/post_vehicle/', post_vehicle, name='post_vehicle'),
    path('api/<int:user_id>/user_vehicles/', get_user_vehicles, name='get_user_vehicles'),
    path('api/<int:user_id>/<int:vehicle_id>/update/', update_vehicle, name='update_vehicle'),
    path('api/<int:user_id>/<int:vehicle_id>/delete-vehicle/', delete_vehicle, name='delete_vehicle'),
    path('api/all_vehicles/', get_all_vehicles, name='get_all_vehicles'),
    path('api/featured_vehicles/', get_featured_vehicles, name='featured_vehicles'),
    path('api/get_vehicle_details/<slug:slug>/', get_vehicle_details, name='get_vehicle_details'),
]