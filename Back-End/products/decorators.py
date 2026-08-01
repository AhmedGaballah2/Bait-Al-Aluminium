from functools import wraps
from django.core.cache import cache
from django.http import JsonResponse
from .utils import get_client_ip


def rate_limit(key_prefix, limit, period_seconds=3600):
    """
    Decorator بيحد عدد الطلبات الناجحة لكل IP خلال فترة زمنية معينة.
    شغال مع function-based views و class-based views (methods) الاتنين.
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapped_view(*args, **kwargs):
            # لو أول argument فيه META، يبقى هو الـ request (function-based view)
            # لو مفيش، يبقى أول argument هو self، والـ request هو التاني (class-based view)
            if args and hasattr(args[0], 'META'):
                request = args[0]
            else:
                request = args[1]

            ip = get_client_ip(request)
            cache_key = f"ratelimit:{key_prefix}:{ip}"

            current_count = cache.get(cache_key, 0)

            if current_count >= limit:
                return JsonResponse(
                    {"error": "لقد تجاوزت الحد المسموح به من الطلبات. برجاء المحاولة لاحقًا."},
                    status=429
                )

            response = view_func(*args, **kwargs)

            if 200 <= response.status_code < 300:
                if current_count == 0:
                    cache.set(cache_key, 1, timeout=period_seconds)
                else:
                    cache.incr(cache_key)

            return response
        return wrapped_view
    return decorator