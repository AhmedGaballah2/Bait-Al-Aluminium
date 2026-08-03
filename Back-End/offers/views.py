from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from products.decorators import rate_limit
from products.utils import get_client_ip, verify_turnstile

from .forms import OfferForm
from .models import Offer, OfferReview
from .serializers import OfferReviewSerializer, OfferSerializer


def _filter_queryset_by_search(queryset, search_query, fields):
    if not search_query or not fields:
        return queryset

    query = Q()
    for field in fields:
        query |= Q(**{f"{field}__icontains": search_query})
    return queryset.filter(query)


def _paginate_queryset(request, queryset, per_page=15):
    paginator = Paginator(queryset, per_page)
    page_number = request.GET.get('page')
    return paginator.get_page(page_number)


@login_required
def dashboard_offers(request):
    offers = Offer.objects.order_by('-created_at')
    search_query = request.GET.get('search', '').strip()
    queryset = _filter_queryset_by_search(offers, search_query, ['title', 'subTitle', 'description'])
    page_obj = _paginate_queryset(request, queryset)

    context = {
        'search_query': search_query,
        'page_obj': page_obj,
        'active_page': 'offers',
        'result_count': queryset.count(),
    }
    return render(request, 'offers/dashboard/offers_list.html', context)


@login_required
def dashboard_offer_reviews(request):
    reviews = OfferReview.objects.select_related('offer').order_by('-created_at')
    search_query = request.GET.get('search', '').strip()
    queryset = _filter_queryset_by_search(reviews, search_query, ['name', 'email', 'comment', 'offer__title'])
    page_obj = _paginate_queryset(request, queryset)

    context = {
        'search_query': search_query,
        'page_obj': page_obj,
        'active_page': 'offer_reviews',
        'result_count': queryset.count(),
    }
    return render(request, 'offers/dashboard/offer_reviews_list.html', context)


@login_required
def add_offer(request):
    if request.method == 'POST':
        form = OfferForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('offers:dashboard_offers')
    else:
        form = OfferForm()

    return render(request, 'offers/add_offer.html', {'form': form})


@login_required
def edit_offer(request, pk):
    offer = get_object_or_404(Offer, pk=pk)
    if request.method == 'POST':
        form = OfferForm(request.POST, request.FILES, instance=offer)
        if form.is_valid():
            form.save()
            return redirect('offers:dashboard_offers')
    else:
        form = OfferForm(instance=offer)

    return render(request, 'offers/edit_offer.html', {'form': form})


@login_required
def delete_offer(request, pk):
    offer = get_object_or_404(Offer, pk=pk)
    if request.method == 'POST':
        offer.delete()
        return redirect('offers:dashboard_offers')
    return redirect('offers:dashboard_offers')


@login_required
def offer_details(request, pk):
    offer = get_object_or_404(Offer, pk=pk)
    approved_reviews = offer.reviews.filter(approved=True).order_by('-created_at')
    return render(request, 'offers/offer_details.html', {'offer': offer, 'approved_reviews': approved_reviews})


@api_view(['GET'])
@permission_classes([AllowAny])
def offers_list(request):
    offers = Offer.objects.filter(is_active=True)
    serializer = OfferSerializer(offers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def offer_detail(request, pk):
    try:
        offer = Offer.objects.get(pk=pk)
    except Offer.DoesNotExist:
        return Response({'error': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = OfferSerializer(offer)
    return Response(serializer.data)


class OfferReviewAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, offer_id):
        reviews = OfferReview.objects.filter(offer_id=offer_id, approved=True)
        serializer = OfferReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @rate_limit(key_prefix='review', limit=settings.RATE_LIMIT_REVIEWS_PER_HOUR)
    def post(self, request, offer_id):
        turnstile_token = request.data.get('turnstile_token')
        client_ip = get_client_ip(request)

        if not verify_turnstile(turnstile_token, remote_ip=client_ip):
            return Response({'error': 'فشل التحقق الأمني، حاول تاني.'}, status=403)

        data = request.data.copy()
        data['offer'] = offer_id

        serializer = OfferReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


@login_required
def offer_review_detail(request, pk):
    review = get_object_or_404(OfferReview.objects.select_related('offer'), pk=pk)
    if request.method == 'POST':
        action = request.POST.get('action')
        review.approved = action == 'publish'
        review.save()
        return redirect('offers:offer_review_detail', pk=review.pk)

    return render(request, 'offers/offer_review_detail.html', {'review': review})
