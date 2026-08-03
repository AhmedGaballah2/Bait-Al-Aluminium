from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .forms import NewArrivalForm
from .models import NewArrival
from .serializers import NewArrivalSerializer


def _filter_queryset_by_search(queryset, search_query, fields):
    if not search_query or not fields:
        return queryset

    from django.db.models import Q
    query = Q()
    for field in fields:
        query |= Q(**{f"{field}__icontains": search_query})
    return queryset.filter(query)


def _paginate_queryset(request, queryset, per_page=15):
    paginator = Paginator(queryset, per_page)
    page_number = request.GET.get('page')
    return paginator.get_page(page_number)


@login_required
def dashboard_new_arrivals(request):
    new_arrivals = NewArrival.objects.order_by('-created_at')
    search_query = request.GET.get('search', '').strip()
    queryset = _filter_queryset_by_search(new_arrivals, search_query, ['title'])
    page_obj = _paginate_queryset(request, queryset)

    context = {
        'search_query': search_query,
        'page_obj': page_obj,
        'active_page': 'new_arrivals',
        'result_count': queryset.count(),
    }
    return render(request, 'new_arrivals/dashboard/new_arrivals_list.html', context)


@login_required
def add_new_product(request):
    if request.method == 'POST':
        form = NewArrivalForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('new_arrivals:dashboard_new_arrivals')
    else:
        form = NewArrivalForm()

    return render(request, 'new_arrivals/add_new_product.html', {'form': form})


@login_required
def new_product_details(request, pk):
    new_arrival = get_object_or_404(NewArrival, pk=pk)
    return render(request, 'new_arrivals/new_product_details.html', {'new_arrival': new_arrival})


@login_required
def edit_new_product(request, pk):
    new_arrival = get_object_or_404(NewArrival, pk=pk)

    if request.method == 'POST':
        form = NewArrivalForm(request.POST, request.FILES, instance=new_arrival)
        if form.is_valid():
            form.save()
            return redirect('new_arrivals:dashboard_new_arrivals')
    else:
        form = NewArrivalForm(instance=new_arrival)

    return render(request, 'new_arrivals/edit_new_product.html', {'form': form})


@login_required
def delete_new_product(request, pk):
    new_arrival = get_object_or_404(NewArrival, pk=pk)
    if request.method == 'POST':
        new_arrival.delete()
        return redirect('new_arrivals:dashboard_new_arrivals')
    return redirect('new_arrivals:dashboard_new_arrivals')


@api_view(['GET'])
@permission_classes([AllowAny])
def new_arrivals_list(request):
    new_arrivals = NewArrival.objects.filter(is_active=True)
    serializer = NewArrivalSerializer(new_arrivals, many=True)
    return Response(serializer.data)
