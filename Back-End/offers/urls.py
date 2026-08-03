from django.urls import path

from . import views

app_name = 'offers'

urlpatterns = [
    path('dashboard/offers/', views.dashboard_offers, name='dashboard_offers'),
    path('dashboard/offer-reviews/', views.dashboard_offer_reviews, name='dashboard_offer_reviews'),
    path('add-offer/', views.add_offer, name='add_offer'),
    path('edit-offer/<int:pk>/', views.edit_offer, name='edit_offer'),
    path('delete-offer/<int:pk>/', views.delete_offer, name='delete_offer'),
    path('api/offers/', views.offers_list, name='offers_list'),
    path('api/offer/<int:pk>/', views.offer_details, name='offer_details'),
    path('offer-review/<int:pk>/', views.offer_review_detail, name='offer_review_detail'),
    path('api/offers/<int:pk>/', views.offer_detail, name='offer_detail_api'),
    path('api/offers/<int:offer_id>/reviews/', views.OfferReviewAPIView.as_view(), name='offer_review_api'),
]
