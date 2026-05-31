FROM python:3.11

WORKDIR /app

COPY server/ .

RUN pip install --no-cache-dir \
    Django==5.2.1 \
    djangorestframework==3.16.0 \
    djangorestframework_simplejwt==5.5.0 \
    django-cors-headers==4.7.0 \
    dj-database-url==3.0.1 \
    python-decouple==3.8 \
    python-dotenv==1.1.1 \
    PyJWT==2.9.0 \
    bcrypt==4.3.0 \
    requests==2.32.4 \
    cloudinary==1.41.0 \
    django-cloudinary-storage==0.3.0 \
    python-slugify==8.0.4 \
    channels==4.1.0 \
    daphne==4.1.2 \
    sqlparse==0.5.3 \
    asgiref==3.11.1 \
    pytest==8.2.2 \
    pytest-django==4.8.0


ENV DJANGO_SETTINGS_MODULE=motoket.settings
ENV PYTHONPATH=/app


CMD ["python", "manage.py", "test", "api", "--verbosity=2"]