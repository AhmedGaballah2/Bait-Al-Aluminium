from django import forms

from .models import Offer


class OfferForm(forms.ModelForm):
    class Meta:
        model = Offer
        fields = '__all__'
        labels = {
            'subTitle': 'عنوان فرعي للعرض',
            'title': 'عنوان العرض',
            'description': 'وصف العرض',
            'price': 'سعر العرض',
            'image': 'الصورة الرئيسية',
            'image_2': 'الصورة الجانبية 1',
            'image_3': 'الصورة الجانبية 2',
            'image_4': 'الصورة الجانبية 3',
            'image_5': 'الصورة الجانبية 4',
            'price_details': 'تفاصيل السعر',
            'specs': 'المواصفات',
            'features': 'الميزات',
            'stock': 'المخزون',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            if isinstance(field.widget, forms.CheckboxInput):
                field.widget.attrs.update({'class': 'form-check-input'})
            else:
                field.widget.attrs.update({'class': 'form-control'})
