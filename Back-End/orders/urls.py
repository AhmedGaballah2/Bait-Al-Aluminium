from django.urls import path

from . import views

app_name = 'orders'

urlpatterns = [
    path('dashboard/orders/', views.dashboard_orders, name='dashboard_orders'),
    path('dashboard/order/<int:pk>/', views.order_detail_view, name='dashboard_order_detail'),
    path('dashboard/order/<int:pk>/delete/', views.order_delete_view, name='dashboard_order_delete'),
    path('orders/', views.create_order, name='orders_create'),
    path('api/orders/', views.get_orders, name='get_orders'),
    path('api/orders/create/', views.create_order, name='create_order'),
    path('api/orders/<int:pk>/', views.order_detail, name='order_detail_api'),
]
