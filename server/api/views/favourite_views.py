from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..models import User, Vehicle, FavouritedVehicle
from ..serializer import FavouriteSerializer


@api_view(['GET'])
def user_favourite(request, user_id):
    """Get all favourite vehicles for a specific user."""
    try:
        user = User.objects.get(id=user_id)
        favourites = FavouritedVehicle.objects.filter(user=user).select_related('vehicle')
        serializer = FavouriteSerializer(favourites, many=True)
        return Response({
            'count': favourites.count(),
            'results': serializer.data,
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def favourite_vehicle(request, user_id, vehicle_id):
    try:
        user = User.objects.get(id=user_id)
        vehicle = Vehicle.objects.get(id=vehicle_id)
        fav, created = FavouritedVehicle.objects.get_or_create(user=user, vehicle=vehicle)
        if created:
            return Response({"message": "Vehicle favourited successfully."}, status=status.HTTP_201_CREATED)
        return Response({"message": "Vehicle was already favourited."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user_favourite(request, user_id):
    try:
        favourites = FavouritedVehicle.objects.filter(user_id=user_id)
        serializer = FavouriteSerializer(favourites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def unfavourite_vehicle(request, user_id, vehicle_id):
    try:
        fav = FavouritedVehicle.objects.get(user_id=user_id, vehicle_id=vehicle_id)
        fav.delete()
        return Response({"message": "Vehicle unfavourited."}, status=status.HTTP_200_OK)
    except FavouritedVehicle.DoesNotExist:
        return Response({"error": "Not favourited."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def is_favorited(request, user_id, vehicle_id):
    is_fav = FavouritedVehicle.objects.filter(user_id=user_id, vehicle_id=vehicle_id).exists()
    return Response({"is_favorited": is_fav}, status=status.HTTP_200_OK)