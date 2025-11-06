from rest_framework import filters
import django_filters
from rest_framework import viewsets, mixins
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Prefetch
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

from .models import (
    CarsListing, ModelName, Inquiry, Make, Color, Transmission, Condition, FuelType, DriveType, CarType, Feature, SafetyFeature
)
from .serializers import (
    CarsListingSerializer, MakeSerializer, InquirySerializer, ModelSerializer, ColorSerializer, TransmissionSerializer,
    ConditionSerializer, FuelTypeSerializer, DriveTypeSerializer, CarTypeSerializer,
    FeatureSerializer, SafetyFeatureSerializer
)

# Inquiery - Views
class InquiryCreateView(generics.CreateAPIView):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [AllowAny]

# Lookup - Views
@api_view(['GET'])
@permission_classes([AllowAny])
def list_makes(request):
    makes = (
        Make.objects
        .annotate(listings_count=Count('listings'))
        .filter(listings_count__gt=0)
        .order_by('name')
    )
    serializer = MakeSerializer(makes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_models(request, make_id):
    models = ModelName.objects.filter(make=make_id)
    serializer = ModelSerializer(models, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def top_makes(request):
    listings_prefetch = Prefetch(
        'listings',
        queryset=CarsListing.objects.all()[:8],
        to_attr='limited_listings'
    )
    
    top_makes = (
        Make.objects
        .prefetch_related(listings_prefetch)
        .annotate(count=Count('listings'))
        .filter(count__gt=0)
        .order_by('-count')[:4]
    )

    result = [
        {
            'id': make.id,
            'name': make.name,
            'count': make.count,
            'limited_listings': CarsListingSerializer(
                make.limited_listings,
                many=True,
                context={'request': request}
            ).data
        }
        for make in top_makes
    ]
    
    return Response(result)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_conditions(request):
    conditions = Condition.objects.all().order_by('id')
    serializer = ConditionSerializer(conditions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_filters(request):
    makes = Make.objects.all().order_by('id')
    models = ModelName.objects.all().order_by('id')
    colors = Color.objects.all().order_by('id')
    transmissions = Transmission.objects.all().order_by('id')
    conditions = Condition.objects.all().order_by('id')
    fuel_types = FuelType.objects.all().order_by('id')
    drive_types = DriveType.objects.all().order_by('id')
    car_types = CarType.objects.all().order_by('id')
    features = Feature.objects.all().order_by('id')
    safety_features = SafetyFeature.objects.all().order_by('id')

    makes_serializer = MakeSerializer(makes, many=True)
    models_serializer = ModelSerializer(models, many=True)
    colors_serializer = ColorSerializer(colors, many=True)
    transmissions_serializer = TransmissionSerializer(transmissions, many=True)
    conditions_serializer = ConditionSerializer(conditions, many=True)
    fuel_types_serializer = FuelTypeSerializer(fuel_types, many=True)
    drive_types_serializer = DriveTypeSerializer(drive_types, many=True)
    car_types_serializer = CarTypeSerializer(car_types, many=True)
    features_serializer = FeatureSerializer(features, many=True)
    safety_features_serializer = SafetyFeatureSerializer(safety_features, many=True)

    response_data = {
        'makes': makes_serializer.data,
        'models': models_serializer.data,
        'colors': colors_serializer.data,
        'transmissions': transmissions_serializer.data,
        'conditions': conditions_serializer.data,
        'fuel_types': fuel_types_serializer.data,
        'drive_types': drive_types_serializer.data,
        'car_types': car_types_serializer.data,
        'features': features_serializer.data,
        'safety_features': safety_features_serializer.data
    }

    return Response(response_data)


class RandomSimilarListingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        get_object_or_404(CarsListing, pk=pk)

        qs = CarsListing.objects.exclude(pk=pk)
        qs = qs.order_by('?')[:4]

        data = CarsListingSerializer(qs, many=True, context={'request': request}).data
        return Response(data)
    


# ---------- Filter class for Car Listings ----------

class CarListingsFilter(django_filters.FilterSet):
    make = django_filters.ModelChoiceFilter(queryset=Make.objects.all())
    model = django_filters.ModelChoiceFilter(queryset=ModelName.objects.all())
    car_type = django_filters.ModelChoiceFilter(queryset=CarType.objects.all())
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    mileage_min = django_filters.NumberFilter(field_name='mileage', lookup_expr='gte')
    mileage_max = django_filters.NumberFilter(field_name='mileage', lookup_expr='lte')
    drive_type = django_filters.ModelChoiceFilter(queryset=DriveType.objects.all())
    fuel_type = django_filters.ModelChoiceFilter(queryset=FuelType.objects.all())
    features = django_filters.ModelMultipleChoiceFilter(queryset=Feature.objects.all())
    transmission = django_filters.ModelChoiceFilter(queryset=Transmission.objects.all())
    condition = django_filters.ModelChoiceFilter(queryset=Condition.objects.all())
    color = django_filters.ModelChoiceFilter(queryset=Color.objects.all())
    doors = django_filters.NumberFilter(field_name='doors')
    safety_features = django_filters.ModelMultipleChoiceFilter(queryset=SafetyFeature.objects.all())
    cylinders_min = django_filters.NumberFilter(field_name='cylinders', lookup_expr='gte')
    cylinders_max = django_filters.NumberFilter(field_name='cylinders', lookup_expr='lte')
    year_min = django_filters.NumberFilter(field_name='year', lookup_expr='gte')
    year_max = django_filters.NumberFilter(field_name='year', lookup_expr='lte')
    vin = django_filters.CharFilter(field_name='vin', lookup_expr='icontains')

    sort_date = django_filters.OrderingFilter(fields=(
        ('created_at', 'created_at'),
        ('price', 'price'),
        ('mileage', 'mileage'),
    ), method='filter_sort')

    def filter_sort(self, queryset, name, value):
        if value == 'created_at':
            return queryset.order_by('-created_at')
        if value == 'price':
            return queryset.order_by('price')
        if value == 'price_desc':
            return queryset.order_by('-price')
        if value == 'mileage':
            return queryset.order_by('mileage')
        if value == 'mileage_desc':
            return queryset.order_by('-mileage')
        return queryset

    class Meta:
        model = CarsListing
        fields = ['make', 'model', 'car_type', 'price_min', 'price_max', 'mileage_min', 'mileage_max', 'drive_type', 'fuel_type', 'features', 'transmission', 'color', 'doors', 'safety_features', 'cylinders_min', 'cylinders_max', 'year_min', 'year_max', 'vin', 'sort_date']

# ---------- CarListings ViewSet ----------

class CarListingsViewSet(viewsets.ModelViewSet):
    queryset = CarsListing.objects.all()
    serializer_class = CarsListingSerializer
    permission_classes = [AllowAny]
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filterset_class = CarListingsFilter
    ordering_fields = ['created_at', 'price', 'mileage']
    search_fields = ['title']

    http_method_names = ['get']

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset