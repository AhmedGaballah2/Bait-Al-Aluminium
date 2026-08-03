from django.db import migrations


def migrate_new_arrivals(apps, schema_editor):
    NewArrival = apps.get_model('products', 'NewArrival')
    Product = apps.get_model('products', 'Product')

    new_arrivals = NewArrival.objects.filter(is_active=True).order_by('-created_at')

    first = True
    for na in new_arrivals:
        Product.objects.create(
            name=na.title,
            description=na.price_details or '',
            price=na.price,
            image=na.image,
            image_2=na.image_2,
            image_3=na.image_3,
            image_4=na.image_4,
            image_5=na.image_5,
            more_details=na.price_details,
            specs=na.specs,
            features=na.features,
            stock=0,
            is_new=True,                       # بادج "مضاف حديثًا"
            is_featured_new_arrival=first,      # بس أول واحد ياخد الميزة الخاصة
        )
        first = False


def reverse_migration(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0015_remove_newarrival_category_and_more'),  # سيبه زي ما Django كتبه تلقائيًا
    ]

    operations = [
        migrations.RunPython(migrate_new_arrivals, reverse_migration),
    ]