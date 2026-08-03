from django.urls import path

from . import views

app_name = 'dashboard'

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard/products/', views.dashboard_products, name='dashboard_products'),
    path('dashboard/reviews/', views.dashboard_reviews, name='dashboard_reviews'),
    path('dashboard/categories/', views.dashboard_categories, name='dashboard_categories'),
    path('dashboard/categories/add/', views.add_category, name='add_category'),
    path('dashboard/categories/<int:pk>/edit/', views.edit_category, name='edit_category'),
    path('dashboard/categories/<int:pk>/delete/', views.delete_category, name='delete_category'),
]
