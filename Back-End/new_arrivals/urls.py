from django.urls import path

from . import views

app_name = 'new_arrivals'

urlpatterns = [
    path('new-arrivals/', views.new_arrivals_list, name='new_arrivals_list'),
    path('add-new-arrival/', views.add_new_product, name='add_new_product'),
    path('edit-new-arrival/<int:pk>/', views.edit_new_product, name='edit_new_product'),
    path('new-product/<int:pk>/', views.new_product_details, name='new_product_details'),
    path('delete-new-arrival/<int:pk>/', views.delete_new_product, name='delete_new_product'),
    path('dashboard/new-arrivals/', views.dashboard_new_arrivals, name='dashboard_new_arrivals'),
]
