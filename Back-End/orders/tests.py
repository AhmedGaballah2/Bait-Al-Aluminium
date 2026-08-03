from django.test import TestCase
from django.urls import reverse

from .models import Order


class OrdersViewsTests(TestCase):
    def test_dashboard_orders_requires_login(self):
        response = self.client.get(reverse('orders:dashboard_orders'))
        self.assertEqual(response.status_code, 302)

    def test_order_detail_api_returns_404_for_missing_order(self):
        response = self.client.get(reverse('orders:order_detail_api', kwargs={'pk': 999999}))
        self.assertEqual(response.status_code, 404)
