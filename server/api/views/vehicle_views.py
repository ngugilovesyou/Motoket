import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Prefetch

from ..models import User, Vehicle, VehicleImage
from ..serializer import VehicleSerializer

logger = logging.getLogger(__name__)


def parse_bool(value):
    """Helper: parse truthy string/bool values into a Python bool."""
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in ["true", "1", "yes"]
    return False


def _apply_vehicle_filters(vehicles, params):
    """Shared filtering logic used by get_all_vehicles and get_featured_vehicles."""
    make = params.get('make')
    if make:
        vehicles = vehicles.filter(make__iexact=make.strip())

    model = params.get('model')
    if model:
        vehicles = vehicles.filter(model__iexact=model.strip())

    price_min = params.get('priceMin')
    if price_min:
        try:
            vehicles = vehicles.filter(price__gte=float(price_min))
        except ValueError:
            logger.warning(f"Invalid priceMin value: {price_min}")

    price_max = params.get('priceMax')
    if price_max:
        try:
            vehicles = vehicles.filter(price__lte=float(price_max))
        except ValueError:
            logger.warning(f"Invalid priceMax value: {price_max}")

    year_min = params.get('yearMin')
    if year_min:
        try:
            vehicles = vehicles.filter(year__gte=int(year_min))
        except ValueError:
            logger.warning(f"Invalid yearMin value: {year_min}")

    year_max = params.get('yearMax')
    if year_max:
        try:
            vehicles = vehicles.filter(year__lte=int(year_max))
        except ValueError:
            logger.warning(f"Invalid yearMax value: {year_max}")

    mileage_max = params.get('mileageMax')
    if mileage_max:
        try:
            vehicles = vehicles.filter(mileage__lte=int(mileage_max))
        except ValueError:
            logger.warning(f"Invalid mileageMax value: {mileage_max}")

    fuel_type = params.get('fuelType')
    if fuel_type:
        vehicles = vehicles.filter(fuel_type__iexact=fuel_type.strip())

    transmission = params.get('transmission')
    if transmission:
        vehicles = vehicles.filter(transmission__iexact=transmission.strip())

    location = params.get('location')
    if location:
        vehicles = vehicles.filter(region__icontains=location.strip())

    condition = params.get('condition')
    if condition:
        vehicles = vehicles.filter(condition__iexact=condition.strip())

    body_type = params.get('bodyType')
    if body_type:
        vehicles = vehicles.filter(body_type__iexact=body_type.strip())

    color = params.get('color')
    if color:
        vehicles = vehicles.filter(color__icontains=color.strip())

    search = params.get('search')
    if search:
        term = search.strip()
        vehicles = vehicles.filter(
            Q(make__icontains=term) |
            Q(model__icontains=term) |
            Q(description__icontains=term) |
            Q(body_type__icontains=term) |
            Q(fuel_type__icontains=term) |
            Q(region__icontains=term)
        )

    return vehicles


def _apply_vehicle_sort(vehicles, sort, default_order=('-is_featured', '-created_at')):
    """Shared sorting logic."""
    sort_map = {
        'price_asc': ('price',),
        'price_desc': ('-price',),
        'year_desc': ('-year', '-created_at'),
        'year_asc': ('year', 'created_at'),
        'mileage_asc': ('mileage',),
        'mileage_desc': ('-mileage',),
        'newest': ('-created_at',),
        'oldest': ('created_at',),
    }
    order = sort_map.get(sort, default_order)
    return vehicles.order_by(*order)


def _paginate_vehicles(vehicles, params):
    """Shared pagination logic. Returns (page, limit, total_count, vehicles_page)."""
    try:
        page = max(int(params.get('page', 1)), 1)
    except (ValueError, TypeError):
        page = 1

    try:
        limit = min(max(int(params.get('limit', 15)), 1), 100)
    except (ValueError, TypeError):
        limit = 15

    total_count = vehicles.count()
    start = (page - 1) * limit
    end = start + limit
    return page, limit, total_count, vehicles[start:end]


@api_view(['GET'])
def get_user_vehicles(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        vehicles = Vehicle.objects.filter(user=user)
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def update_vehicle(request, user_id, vehicle_id):
    try:
        user = User.objects.get(id=user_id)
        vehicle = Vehicle.objects.get(id=vehicle_id, user=user)

        description = request.data.get('description')
        price = request.data.get('price')
        new_image_urls = request.data.get('image_urls')

        if description:
            vehicle.description = description
        if price:
            vehicle.price = price
        if 'is_featured' in request.data:
            vehicle.is_featured = parse_bool(request.data.get('is_featured'))
        if new_image_urls:
            if isinstance(new_image_urls, str):
                new_image_urls = [new_image_urls]
            for url in new_image_urls:
                VehicleImage.objects.create(vehicle=vehicle, image_url=url)

        vehicle.save()
        return Response({"message": "Vehicle updated successfully"}, status=status.HTTP_200_OK)
    except Vehicle.DoesNotExist:
        return Response({"error": "Vehicle not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_vehicle(request, user_id, vehicle_id):
    try:
        user = User.objects.get(id=user_id)
        vehicle = Vehicle.objects.get(id=vehicle_id, user=user)
        vehicle.delete()
        return Response({"message": "Vehicle deleted successfully"}, status=status.HTTP_200_OK)
    except Vehicle.DoesNotExist:
        return Response({"error": "Vehicle not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_all_vehicles(request):
    try:
        vehicles = Vehicle.objects.select_related('user').prefetch_related(
            Prefetch('images', queryset=VehicleImage.objects.all())
        )
        vehicles = _apply_vehicle_filters(vehicles, request.query_params)

        is_featured = request.query_params.get('is_featured')
        if is_featured is not None:
            vehicles = vehicles.filter(is_featured=is_featured.lower() == 'true')

        sort = request.query_params.get('sort', '')
        vehicles = _apply_vehicle_sort(vehicles, sort, default_order=('-is_featured', '-created_at'))

        page, limit, total_count, vehicles_page = _paginate_vehicles(vehicles, request.query_params)
        total_pages = (total_count + limit - 1) // limit

        serializer = VehicleSerializer(vehicles_page, many=True)
        return Response({
            "success": True,
            "count": total_count,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": limit,
            "has_next": page < total_pages,
            "has_previous": page > 1,
            "vehicles": serializer.data,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in get_all_vehicles: {str(e)}", exc_info=True)
        return Response({
            "success": False,
            "error": "An error occurred while fetching vehicles",
            "details": str(e) if request.user.is_staff else None,
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_featured_vehicles(request):
    try:
        vehicles = Vehicle.objects.select_related('user').prefetch_related(
            Prefetch('images', queryset=VehicleImage.objects.all())
        ).filter(is_featured=True)

        vehicles = _apply_vehicle_filters(vehicles, request.query_params)

        sort = request.query_params.get('sort', '')
        vehicles = _apply_vehicle_sort(vehicles, sort, default_order=('-created_at',))

        page, limit, total_count, vehicles_page = _paginate_vehicles(vehicles, request.query_params)
        total_pages = (total_count + limit - 1) // limit

        serializer = VehicleSerializer(vehicles_page, many=True)
        return Response({
            "success": True,
            "count": total_count,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": limit,
            "has_next": page < total_pages,
            "has_previous": page > 1,
            "vehicles": serializer.data,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in get_featured_vehicles: {str(e)}", exc_info=True)
        return Response({
            "success": False,
            "error": "An error occurred while fetching featured vehicles",
            "details": str(e) if request.user.is_staff else None,
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_vehicle_details(request, slug):
    try:
        vehicle = Vehicle.objects.prefetch_related('images').get(slug=slug)
        serializer = VehicleSerializer(vehicle)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Vehicle.DoesNotExist:
        return Response({"error": "Vehicle not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)