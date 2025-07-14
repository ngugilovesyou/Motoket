import os

# Redis URL for the socket.io AsyncRedisManager
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')