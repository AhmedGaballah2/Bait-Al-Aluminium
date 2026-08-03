from django.urls import path
from .views import (
    CategoryListAPIView,
    ReviewAPIView,
    get_products,
    related_products,
)

from . import views

app_name = 'products'

urlpatterns = [
    path('<int:pk>/details/', views.product_details, name='product_details'),
    path('add/', views.add_product, name='add_product'),
    path('<int:pk>/delete/', views.delete_product, name='delete_product'),
    path('<int:pk>/edit/', views.edit_product, name='edit_product'),
    path('api/products/', get_products),
    path('products/', get_products),
    path('review/<int:pk>/', views.review_detail, name='review_detail'),
    path('api/categories/', CategoryListAPIView.as_view()),
    path('api/products/<int:pk>/', views.product_detail),
    path("api/products/<int:product_id>/reviews/", ReviewAPIView.as_view()),
    path('api/products/<int:pk>/related/', related_products),
]