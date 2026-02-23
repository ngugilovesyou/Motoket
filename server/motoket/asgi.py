import os

# ✅ Must be first
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'motoket.settings')

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

# Import only after settings are set
from api.routing import websocket_urlpatterns
from api.middleware import AsyncJWTAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AsyncJWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})
