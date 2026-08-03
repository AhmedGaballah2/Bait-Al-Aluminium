from rest_framework import serializers

from .models import NewArrival


class NewArrivalSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewArrival
        fields = '__all__'
