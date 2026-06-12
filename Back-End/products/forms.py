from django import forms
from .models import Offer, Product, NewArrival


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
            'image': 'صورة المنتج',
            'is_new': 'منتج جديد؟',
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

class OfferForm(forms.ModelForm):
    class Meta:
        model = Offer
        fields = '__all__'
        labels = {
            'subTitle': 'عنوان فرعي للعرض',
            'title': 'عنوان العرض',
            'description': 'وصف العرض',
            'price': 'سعر العرض',
            'image': 'صورة العرض',
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

class NewArrivalForm(forms.ModelForm):
    class Meta:
        model = NewArrival
        fields = '__all__'
        labels = {
            'title' : 'عنوان المنتج الجديد',
            'price' : 'سعر المنتج الجديد',
            'image' : 'صورة المنتج الجديد',
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