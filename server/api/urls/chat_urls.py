from django.urls import path

from ..views import (
    create_chat,
    send_message,
    join_chat,
    seller_chats,
    chat_messages,
    admin_chats,
)

urlpatterns = [
    path('api/create_chat/', create_chat, name='create_chat'),
    path('api/send_message/', send_message, name='send_message'),
    path('api/join_chat/', join_chat, name='join_chat'),
    path('api/seller_chats/', seller_chats, name='seller_chats'),
    path('api/<int:user_id>/admin_chats/', admin_chats, name='admin_chats'),
    path('api/chat_messages/<str:chat_id>/', chat_messages, name='chat_messages'),
]