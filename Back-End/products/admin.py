from django.contrib import admin
from .models import Category, Product, Review
from orders.models import Order, OrderItem

# Register your models here.

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Review)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_id', 'product_name', 'price', 'quantity']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'phone', 'products_count', 'total_price', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    readonly_fields = ['created_at', 'updated_at', 'id']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('معلومات العميل', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('عنوان الشحن', {
            'fields': ('governorate', 'city', 'address', 'building_number')
        }),
        ('تفاصيل الطلب', {
            'fields': ('total_price', 'shipping_cost', 'products_count', 'status', 'notes')
        }),
        ('المعلومات التقنية', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )