import traceback
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..models import User
from ..serializer import UserSerializer


@api_view(["GET"])
def get_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error during user retrieval:", e)
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_admin(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        print("user is", user)
        user_data = {
            "id": user.id,
            "email": user.email,
        }
        return Response(user_data, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error during user retrieval:", e)
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def check_email(request):
    email = request.GET.get('email')
    try:
        user = User.objects.get(email=email)
        exists = True
        user_data = UserSerializer(user).data
    except User.DoesNotExist:
        exists = False
        user_data = None

    return Response({"exists": exists, "user": user_data})


@api_view(['PATCH'])
def update_firebase_uid(request):
    """Update a user's firebase_uid based on their email."""
    email = request.data.get('email')
    firebase_uid = request.data.get('firebase_uid')

    if not email or not firebase_uid:
        return Response(
            {"error": "Both email and firebase_uid are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    user.firebase_uid = firebase_uid
    user.save()
    return Response({"message": "Firebase UID updated successfully"})


@api_view(['DELETE'])
def delete_user(request, user_id):
    if not user_id:
        return Response({"error": "Please fill in all fields"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)