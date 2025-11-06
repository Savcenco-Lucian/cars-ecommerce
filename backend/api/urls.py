from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CarListingsViewSet, InquiryCreateView, list_makes, list_models, top_makes, list_conditions, list_filters, RandomSimilarListingsView
)


router = DefaultRouter()
router.register(r'car-listings', CarListingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('inquiry/', InquiryCreateView.as_view(), name='inquiry'),
    path('makes/', list_makes, name='makes-list'),
    path('models/<make_id>/', list_models, name='models-list'),
    path('top-makes/', top_makes, name='top_makes-list'),
    path('conditions/', list_conditions, name='condition-list'),
    path('filters/', list_filters, name='filters-list'),
    path('car-listings/<int:pk>/other/', RandomSimilarListingsView.as_view(), name='random-similar-listings'),
]
