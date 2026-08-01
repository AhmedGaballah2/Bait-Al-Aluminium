import requests
from django.conf import settings


def get_client_ip(request):
    """
    بترجع الـ IP الحقيقي بتاع الزائر.
    دلوقتي احنا شغالين لوكال، فهي هترجع 127.0.0.1 غالبًا وده طبيعي.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()

    return request.META.get('REMOTE_ADDR')


def verify_turnstile(token, remote_ip=None):
    """
    بتبعت الـ token اللي جاي من الفرونت إند لسيرفرات Cloudflare
    عشان تتأكد إنه صحيح ومش بوت.
    بترجع True لو تمام، False لو فيه مشكلة.
    """
    if not token:
        return False

    payload = {
        "secret": settings.TURNSTILE_SECRET_KEY,
        "response": token,
    }
    if remote_ip:
        payload["remoteip"] = remote_ip

    try:
        response = requests.post(
            settings.TURNSTILE_VERIFY_URL,
            data=payload,
            timeout=5
        )
        result = response.json()
        return result.get("success", False)
    except requests.RequestException:
        return False