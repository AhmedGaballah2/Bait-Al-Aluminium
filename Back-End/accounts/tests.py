from django.test import TestCase
from django.urls import reverse


class AccountsViewsTests(TestCase):
    def test_login_page_is_available(self):
        response = self.client.get(reverse('accounts:login'))
        self.assertEqual(response.status_code, 200)

    def test_logout_redirects_to_login(self):
        response = self.client.get(reverse('accounts:logout'))
        self.assertEqual(response.status_code, 302)
