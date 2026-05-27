import traceback
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from ..models import User, Vehicle, Chat, ChatMessage
from ..serializer import FullChatSerializer, ChatSerializer, MessageSerializer


@api_view(["POST"])
def create_chat(request):
    buyer_id = request.data.get("buyer_id")
    vehicle_id = request.data.get("vehicle_id")

    if not buyer_id or not vehicle_id:
        return Response({"error": "buyer_id and vehicle_id are required"}, status=400)

    vehicle = get_object_or_404(Vehicle, id=vehicle_id)

    try:
        buyer = User.objects.get(id=buyer_id)
        seller = vehicle.user
        chat, _ = Chat.objects.get_or_create(
            initiator=buyer,
            acceptor=seller,
            vehicle=vehicle,
        )
        serializer = FullChatSerializer(chat)
        return Response(
            {"message": "Chat retrieved or created", "data": serializer.data},
            status=200,
        )
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
def send_message(request):
    try:
        data = request.data
        sender_id = data.get("sender_id")
        if not sender_id:
            return Response({"error": "sender_id is required"}, status=400)

        sender = get_object_or_404(User, pk=sender_id)
        chat = get_object_or_404(Chat, short_id=data["chat_id"])

        message_instance = ChatMessage.objects.create(
            sender=sender,
            chat=chat,
            text=data["text"],
        )
        serialized = MessageSerializer(message_instance).data
        serialized["chat"] = chat.short_id
        serialized["sender_id"] = sender.id

        return Response({"message": "Message sent", "data": serialized}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['POST'])
def join_chat(request):
    chat_id = request.data.get('chat_id')
    if not chat_id:
        return Response({"error": "chat_id is required"}, status=400)

    chat = get_object_or_404(Chat, short_id=chat_id)

    if chat.acceptor is None:
        chat.acceptor = chat.vehicle.user
        chat.save()
        return Response(
            {"message": "Vehicle owner joined the chat", "chat_id": chat.short_id},
            status=200,
        )
    return Response({"error": "Chat already has an acceptor"}, status=400)


@api_view(["GET"])
def seller_chats(request):
    user_id = request.GET.get("user_id")
    if not user_id:
        return Response({"error": "user_id is required"}, status=400)

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    chats = Chat.objects.filter(acceptor=user).order_by("-updated_at")
    serializer = FullChatSerializer(chats, many=True)
    return Response({"data": serializer.data}, status=200)


@api_view(["GET"])
def chat_messages(request, chat_id):
    chat = get_object_or_404(Chat, short_id=chat_id)
    messages = chat.messages.order_by("created_at")
    serialized = MessageSerializer(messages, many=True)
    return Response(serialized.data)


@api_view(["GET"])
def admin_chats(request, user_id):
    try:
        print("Received user_id:", user_id, type(user_id))
        admin_user = User.objects.get(id=user_id)
        if not admin_user.is_admin:
            return Response({"error": "Unauthorized"}, status=403)

        chats = Chat.objects.filter(acceptor=admin_user).order_by("-id")
        serialized = ChatSerializer(chats, many=True)
        return Response(serialized.data)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def get_unread_count(request, chat_id):
    chat = get_object_or_404(Chat, short_id=chat_id)
    count = chat.unread_counts.get(str(request.user.id), 0)
    return Response({"unread": count})