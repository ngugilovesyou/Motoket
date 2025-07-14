import os
import json
import socketio
import uvicorn
from asgiref.sync import sync_to_async

# ✅ MUST BE SET BEFORE ANY DJANGO IMPORTS
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'motoket.settings')

# ✅ Now safe to import Django stuff
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.core.asgi import get_asgi_application

from api.models import Chat, ChatMessage  # or your correct import path
from api.serializer import MessageSerializer
from utils import config  # assuming config.REDIS_URL is defined here

# ✅ Socket.IO setup with Redis Manager
mgr = socketio.AsyncRedisManager(config.REDIS_URL)
sio = socketio.AsyncServer(
    async_mode="asgi",
    client_manager=mgr,
    cors_allowed_origins="*"
)

# ✅ Wrap Django ASGI app
django_asgi_app = get_asgi_application()
app = socketio.ASGIApp(sio, django_asgi_app)

# ✅ Socket.IO event handlers
# @sio.on("connect")
# async def connect(sid, env, auth):
#     if auth:
#         chat_id = auth.get("chat_id")
#         print("SocketIO connected:", sid)
#         await sio.enter_room(sid, chat_id)
#         await sio.emit("connect", f"Connected as {sid}", room=sid)
#     else:
#         raise ConnectionRefusedError("No auth")
# @sio.on("connect")
# async def connect(sid, env):
#     print("SocketIO connected:", sid)
#     await sio.enter_room(sid, "lobby")
#     await sio.emit("connect", f"Connected as {sid}", room=sid)

@sio.on("connect")
async def connect(sid, environ, auth):
    user_id = auth.get("user_id") if auth else None
    chat_id = auth.get("chat_id") if auth else None

    if not user_id or not chat_id:
        raise ConnectionRefusedError("Authentication and chat_id are required")

    user = await sync_to_async(User.objects.get)(pk=user_id)
    chat = await sync_to_async(Chat.objects.get)(short_id=chat_id)

    # Check user is part of the chat (initiator or acceptor)
    if user != chat.initiator and user != chat.acceptor:
        raise ConnectionRefusedError("User not authorized for this chat")

    await sio.enter_room(sid, chat_id)
    await sio.emit("connect", f"Connected as {user.username}", room=sid)
    print(f"{user.username} connected and joined room {chat_id}")

def store_and_return_message(data):
    data = json.loads(data)
    sender = get_object_or_404(User, pk=data["sender_id"])
    chat = get_object_or_404(Chat, short_id=data["chat_id"])

    message_instance = ChatMessage.objects.create(
        sender=sender,
        chat=chat,
        text=data["text"]
    )
    serialized = MessageSerializer(message_instance).data
    serialized["chat"] = data["chat_id"]
    serialized["sender"] = str(serialized["sender"])
    return serialized

@sio.on("message")
async def handle_message(sid, data):
    print("Received message from:", sid)
    message = await sync_to_async(store_and_return_message)(data)
    await sio.emit("new_message", message, room=message["chat"])

@sio.on("disconnect")
async def disconnect(sid):
    print("SocketIO disconnected:", sid)

# ✅ If you run this file directly
if __name__ == "__main__":
    uvicorn.run("api.sockets:app", host="0.0.0.0", port=8000, reload=True)
