#!/usr/bin/env bash

echo "⏳ Aștept $DB_HOST:$DB_PORT..."
/wait-for-it.sh "$DB_HOST:$DB_PORT" --timeout=60 --strict -- echo "✅ DB e gata"

echo "⏳ Aștept 10 secunde..."
sleep 10

echo "🧩 Migrez baza de date..."
python manage.py migrate --noinput

echo "📦 Colectez fișierele statice..."
python manage.py collectstatic --noinput

echo "👤 Creez superuser..."
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        password='admin123'
    )
"

echo "🚀 Pornesc serverul..."
exec python manage.py runserver 0.0.0.0:8000
