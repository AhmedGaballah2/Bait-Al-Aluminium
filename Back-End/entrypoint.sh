#!/bin/sh
set -e

# نقل الـmedia الموجودة في الـimage إلى Railway Volume
cp -an /app/media_initial/. /app/media/

# إعطاء appuser صلاحية التعامل مع الصور
chown -R appuser:appuser /app/media

# تشغيل Django/Gunicorn
exec su -s /bin/sh appuser -c \
    "gunicorn core.wsgi:application --bind 0.0.0.0:8000"