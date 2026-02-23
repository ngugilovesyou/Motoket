import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Import models here to avoid AppRegistryNotReady
        from .models import Chat, ChatMessage, User

        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.room_group_name = f"chat_{self.chat_id}"
        self.user = self.scope.get("user")

        print(f"WebSocket connection attempt: chat_id={self.chat_id}, user={self.user}")

        if not self.user:
            print("Rejected: User not authenticated")
            await self.close(code=4001)
            return

        if not await self.verify_chat_access():
            print("Rejected: User does not have access to this chat")
            await self.close(code=4003)
            return

        await self.reset_unread_count()

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        print(f"WebSocket connected for user {self.user.id} in chat {self.chat_id}")

    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print(f"WebSocket disconnected: {close_code}")

    async def receive(self, text_data):
        from .models import ChatMessage

        try:
            data = json.loads(text_data)
            message_text = data.get("message", "").strip()
            if not message_text:
                return

            # Save message
            saved_message = await self.save_message(message_text)

            # Broadcast to group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": saved_message.text,
                    "sender_id": saved_message.sender.id,
                    "sender_name": saved_message.sender.first_name,
                    "created_at": saved_message.created_at.isoformat(),
                    "message_id": saved_message.id
                }
            )

        except Exception as e:
            print(f"Error in receive: {e}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    # -----------------------
    # Helper methods
    # -----------------------
    @sync_to_async
    def verify_chat_access(self):
        from .models import Chat
        try:
            chat = Chat.objects.get(short_id=self.chat_id)
            return self.user.id in [chat.initiator.id, chat.acceptor.id]
        except Chat.DoesNotExist:
            return False

    @sync_to_async
    def save_message(self, text):
        from .models import Chat, ChatMessage
        chat = Chat.objects.get(short_id=self.chat_id)
        return ChatMessage.objects.create(chat=chat, sender=self.user, text=text)

    @sync_to_async
    def reset_unread_count(self):
        from .models import Chat
        chat = Chat.objects.get(short_id=self.chat_id)
        if not hasattr(chat, "unread_counts") or chat.unread_counts is None:
            chat.unread_counts = {}
        chat.unread_counts[str(self.user.id)] = 0
        chat.save()
