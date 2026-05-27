from django.urls import path

from ..views import (
    favourite_vehicle,
    user_favourite,
    unfavourite_vehicle,
    is_favorited,
)

urlpatterns = [
    path('api/<int:user_id>/<int:vehicle_id>/favourite/', favourite_vehicle, name='favourite_vehicle'),
    path('api/<int:user_id>/user-favourite/', user_favourite, name='user_favourite'),
    path('api/<int:user_id>/<int:vehicle_id>/unfavourite/', unfavourite_vehicle, name='unfavourite_vehicle'),
    path('api/<int:user_id>/<int:vehicle_id>/is_favourited/', is_favorited, name='is_favorited'),
]