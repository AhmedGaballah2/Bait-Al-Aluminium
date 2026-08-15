from decimal import Decimal
from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse

from products.models import Category, Product, ProductSize


class OrdersViewsTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name='Aluminium')
        self.product = Product.objects.create(
            name='Door 1',
            description='Test product',
            price=Decimal('100.00'),
            old_price=Decimal('120.00'),
            stock=50,
            category=self.category,
            image='products/test.jpg',
        )
        self.size = ProductSize.objects.create(
            product=self.product,
            name='L',
            price=Decimal('180.00'),
            stock=20,
        )

    @patch('orders.views.verify_turnstile', return_value=True)
    def test_create_order_uses_server_side_size_price(self, mock_verify_turnstile):
        response = self.client.post(
            reverse('orders:create_order'),
            {
                'turnstile_token': 'fake-token',
                'first_name': 'Ahmed',
                'last_name': 'Ali',
                'email': 'ahmed@example.com',
                'phone': '01012345678',
                'governorate': 'Cairo',
                'city': 'Nasr City',
                'address': 'Some street',
                'building_number': '12',
                'total_price': '9999.00',
                'shipping_cost': '50.00',
                'products_count': 2,
                'notes': 'Test note',
                'items': [
                    {
                        'product_id': self.product.id,
                        'size_id': self.size.id,
                        'product_name': 'Wrong name',
                        'price': '9.99',
                        'quantity': 2,
                    }
                ],
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(response.data['total_price'], '360.00')
        self.assertEqual(response.data['items'][0]['price'], '180.00')
        self.assertEqual(response.data['items'][0]['size_name'], 'L')

    def test_dashboard_orders_requires_login(self):
        response = self.client.get(reverse('orders:dashboard_orders'))
        self.assertEqual(response.status_code, 302)

    def test_order_detail_api_returns_404_for_missing_order(self):
        response = self.client.get(reverse('orders:order_detail_api', kwargs={'pk': 999999}))
        self.assertEqual(response.status_code, 404)
