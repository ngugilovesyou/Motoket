"""
ASGI config for motoket project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os


from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'motoket.settings')

django_asgi_app = get_asgi_application()

import socketio
from api.sockets import sio
application = socketio.ASGIApp(sio, django_asgi_app)
