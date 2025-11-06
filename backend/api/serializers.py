from rest_framework import serializers
from .models import (
    Inquiry, CarsListing, Make, ModelName, Status, Color, Transmission,
    Condition, FuelType, DriveType, CarType, Feature, SafetyFeature, ListingImage
)

#Status - Inquiry - Serializers
class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = [
            "listing",
            "name",
            "email",
            "phone",
            "message",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        try:
            validated_data["status"] = Status.objects.get(pk=1)
        except Status.DoesNotExist:
            raise serializers.ValidationError(
                {"status_id": "Default status (id=1) does not exist. Please seed your Status table."}
            )
        return super().create(validated_data)
    
#Lookup - Serializers
class MakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Make
        fields = '__all__'

class ModelSerializer(serializers.ModelSerializer):
    make = MakeSerializer()

    class Meta:
        model = ModelName
        fields = ['id', 'name', 'make']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'

class TransmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transmission
        fields = '__all__'

class ConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condition
        fields = '__all__'

class FuelTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelType
        fields = '__all__'

class DriveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveType
        fields = '__all__'

class CarTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarType
        fields = '__all__'

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = '__all__'

class SafetyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyFeature
        fields = '__all__'

#Listing - Serializers
class CarListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = '__all__'

class CarsListingSerializer(serializers.ModelSerializer):
    make = MakeSerializer()
    model = ModelSerializer()
    color = ColorSerializer()
    transmission = TransmissionSerializer()
    drive_type = DriveTypeSerializer()
    fuel_type = FuelTypeSerializer()
    condition = ConditionSerializer()
    car_type = CarTypeSerializer()
    features = FeatureSerializer(many=True)
    safety_features = SafetyFeatureSerializer(many=True)
    listing_images = CarListingImageSerializer(source='images', many=True)

    class Meta:
        model = CarsListing
        fields = [
            'id', 'title', 'description', 'make', 'model', 'color', 'transmission', 'condition', 
            'drive_type', 'fuel_type', 'car_type', 'year', 'mileage', 'engine_size', 
            'cylinders', 'doors', 'vin', 'price', 'features', 'safety_features', 'listing_images',
            'created_at', 'updated_at'
        ]