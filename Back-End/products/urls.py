from django.urls import path
from .views import CategoryListAPIView, get_products, ReviewAPIView, related_products
from . import views

app_name = 'products'

urlpatterns = [
    path('', views.products_list, name='products_list'),
    path('<int:pk>/details/', views.product_details, name='product_details'),
    path('add/', views.add_product, name='add_product'),
    path('<int:pk>/delete/', views.delete_product, name='delete_product'),
    path('<int:pk>/edit/', views.edit_product, name='edit_product'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('products/', get_products),
    path('add-offer/', views.add_offer, name='add_offer'),
    path('edit-offer/<int:pk>/', views.edit_offer, name='edit_offer'),
    path('delete-offer/<int:pk>/', views.delete_offer, name='delete_offer'),
    path('offers/', views.offers_list, name='offers_list'),
    path('offer/<int:pk>/', views.offer_details, name='offer_details'),
    path('new-arrivals/', views.new_arrivals_list, name='new_arrivals_list'),
    path('add-new-arrival/', views.add_new_product, name='add_new_product'),
    path('edit-new-arrival/<int:pk>/', views.edit_new_product, name='edit_new_product'),
    path('new-product/<int:pk>/', views.new_product_details, name='new_product_details'),
    path('delete-new-arrival/<int:pk>/', views.delete_new_product, name='delete_new_product'),
    path('api/categories/', CategoryListAPIView.as_view()),
    path('api/products/<int:pk>/', views.product_detail),
    path("api/products/<int:product_id>/reviews/", ReviewAPIView.as_view()),
    path('products/<int:pk>/related/', related_products),
]