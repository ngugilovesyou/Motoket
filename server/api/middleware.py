import jwt
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from .models import User

class AsyncJWTAuthMiddleware(BaseMiddleware):
    """
    WebSocket middleware to authenticate user via JWT token in query params
    """

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token = params.get("token", [None])[0]

        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user = await database_sync_to_async(User.objects.get)(id=payload["user_id"])
                scope["user"] = user
            except Exception:
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
