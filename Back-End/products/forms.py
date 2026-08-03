from django import forms
from .models import Product


class ProductForm(forms.ModelForm):

    class Meta:
        model = Product
        fields = '__all__'
        labels = {
            'name': 'اسم المنتج',
            'description': 'وصف المنتج',
            'price': 'سعر المنتج',
            'old_price': 'السعر القديم',
            'stock': 'المخزون',
            'category': 'الفئة',
            'image': 'الصورة الرئيسية',
            'image_2': 'الصورة الجانبية 1',
            'image_3': 'الصورة الجانبية 2',
            'image_4': 'الصورة الجانبية 3',
            'image_5': 'الصورة الجانبية 4',
            'more_details': 'تفاصيل أكثر',
            'specs': 'المواصفات',
            'features': 'الميزات',
            'is_new': 'منتج جديد؟',
            'is_featured_new_arrival': 'منتج مميز؟',
            'added_at': 'تاريخ الإضافة',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field in self.fields.values():
            if isinstance(field.widget, forms.CheckboxInput):
                field.widget.attrs.update({
                    'class': 'form-check-input'
                })
            else:
                field.widget.attrs.update({
                    'class': 'form-control'
                })


