from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from .forms import ProductForm, OfferForm, NewArrivalForm
from .models import Category, NewArrival, Offer, Product, Review
from .serializers import CategorySerializer, OfferSerializer, ProductSerializer, NewArrivalSerializer, ReviewSerializer

# Create your views here.

@login_required
def products_list(request):
    products = Product.objects.all()
    offers = Offer.objects.all()
    new_arrivals = NewArrival.objects.all()

    context = {
        'products': products,
        'offers': offers,
        'new_arrivals': new_arrivals,
        'total': products.count(),
        'offerTotal': offers.count(),
        'newArrivalTotal': new_arrivals.count(),
    }

    return render(request, 'products/products_list.html', context)

@login_required
def product_details(request, pk):
    product = get_object_or_404(Product, pk=pk)

    context = {
        'product': product
    }

    return render(request, 'products/product_details.html', context)

@login_required
def add_product(request):
    if request.method == "POST":
        form = ProductForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            return redirect('products:products_list')
    else:
        form = ProductForm()

    return render(request, 'products/add_product.html', {'form': form})

@login_required
def delete_product(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        product.delete()
        return redirect('products:products_list')
    return render(request, 'products/confirm_delete.html', {'product': product})

@login_required
def edit_product(request, pk):
    product = get_object_or_404(Product, pk=pk)

    if request.method == "POST":
        form = ProductForm(request.POST, request.FILES, instance=product)
        
        if form.is_valid():
            form.save()
            return redirect('products:products_list')
    else:
        form = ProductForm(instance=product)

    return render(request, 'products/edit_product.html', {
        'form': form,
        'product': product
    })

@login_required
def add_offer(request):
    if request.method == 'POST':
        form = OfferForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            return redirect('products:products_list')
    else:
        form = OfferForm()

    return render(request, 'products/add_offer.html', {'form': form})

@login_required
def edit_offer(request, pk):
    offer = Offer.objects.get(id=pk)

    if request.method == 'POST':
        form = OfferForm(request.POST, request.FILES, instance=offer)

        if form.is_valid():
            form.save()
            return redirect('products:products_list')

    else:
        form = OfferForm(instance=offer)

    return render(request, 'products/edit_offer.html', {'form': form})

@login_required
def delete_offer(request, pk):
    offer = Offer.objects.get(id=pk)

    if request.method == 'POST':
        offer.delete()
        return redirect('products:products_list')

    return redirect('products:products_list')

@login_required
def offer_details(request, pk):
    offer = get_object_or_404(Offer, pk=pk)

    context = {
        'offer': offer
    }

    return render(request, 'products/offer_details.html', context)

@api_view(['GET'])
@permission_classes([AllowAny])
def offers_list(request):
    offers = Offer.objects.filter(is_active=True)
    serializer = OfferSerializer(offers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def new_arrivals_list(request):
    new_arrivals = NewArrival.objects.filter(is_active=True)
    serializer = NewArrivalSerializer(new_arrivals, many=True)
    return Response(serializer.data)

@login_required
def add_new_product(request):
    if request.method == 'POST':
        form = NewArrivalForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            return redirect('products:products_list')
    else:
        form = NewArrivalForm()

    return render(request, 'products/add_new_product.html', {'form': form})

@login_required
def new_product_details(request, pk):
    new_arrival = get_object_or_404(NewArrival, pk=pk)

    context = {
        'new_arrival': new_arrival
    }

    return render(request, 'products/new_product_details.html', context)

@login_required
def edit_new_product(request, pk):
    new_arrival = NewArrival.objects.get(id=pk)

    if request.method == 'POST':
        form = NewArrivalForm(request.POST, request.FILES, instance=new_arrival)

        if form.is_valid():
            form.save()
            return redirect('products:products_list')

    else:
        form = NewArrivalForm(instance=new_arrival)

    return render(request, 'products/edit_new_product.html', {'form': form})

@login_required
def delete_new_product(request, pk):
    new_arrival = NewArrival.objects.get(id=pk)

    if request.method == 'POST':
        new_arrival.delete()
        return redirect('products:products_list')

    return redirect('products:products_list')

@api_view(['GET'])
@permission_classes([AllowAny])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    
    return Response(serializer.data)

def login_view(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('products:products_list')
        else:
            return render(request, 'auth/login.html', {
                'error': 'بيانات غير صحيحة'
            })
    return render(request, 'auth/login.html')

def logout_view(request):
    logout(request)
    return redirect('products:login')

class CategoryListAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product)
    return Response(serializer.data)

class ReviewAPIView(APIView):
    def get(self, request, product_id):
        reviews = Review.objects.filter(product_id=product_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, product_id):
        data = request.data.copy()
        data["product"] = product_id

        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

@api_view(['GET'])
def related_products(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    related = Product.objects.filter(
        category=product.category
    ).exclude(id=product.id)[:6]

    serializer = ProductSerializer(related, many=True)
    return Response(serializer.data)