import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import os
from django.core.validators import RegexValidator
from django.db.models import F,UniqueConstraint
from django.db.models.functions import Lower


# ---------- Lookup tables ----------
class Make(models.Model):
    name = models.CharField(max_length=100, unique=False)

    class Meta:
        ordering = ["name"]
        constraints = [
            UniqueConstraint(Lower("name"), name="unique_lower_name")
        ]

    def __str__(self) -> str:
        return self.name


class ModelName(models.Model):
    make = models.ForeignKey('Make', on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=120)

    class Meta:
        verbose_name = 'Model'
        verbose_name_plural = 'Models'
        ordering = ['name']
        constraints = [
            UniqueConstraint(
                F('make'),
                Lower('name'),
                name='uniq_make_lower_name',
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.make.name})"


class Color(models.Model):
    name = models.CharField(max_length=60, unique=False)

    class Meta:
        ordering = ["name"]
        constraints = [
            UniqueConstraint(Lower("name"), name="unique_color_lower_name")
        ]

    def __str__(self) -> str:
        return self.name
    
    class Admin:
        search_fields = ['name']


class Transmission(models.Model):
    type = models.CharField(max_length=40, unique=False)

    class Meta:
        ordering = ["type"]
        constraints = [
            UniqueConstraint(Lower("type"), name="unique_transmission_lower_type")
        ]

    def __str__(self) -> str:
        return self.type


class Condition(models.Model):
    type = models.CharField(max_length=40, unique=False)

    class Meta:
        ordering = ["type"]
        constraints = [
            UniqueConstraint(Lower("type"), name="unique_condition_lower_type")
        ]

    def __str__(self) -> str:
        return self.type


class FuelType(models.Model):
    type = models.CharField(max_length=40, unique=False)

    class Meta:
        ordering = ["type"]
        constraints = [
            UniqueConstraint(Lower("type"), name="unique_fuel_lower_type")
        ]

    def __str__(self) -> str:
        return self.type


class DriveType(models.Model):
    type = models.CharField(max_length=40, unique=False)

    class Meta:
        ordering = ["type"]
        constraints = [
            UniqueConstraint(Lower("type"), name="unique_drive_lower_type")
        ]

    def __str__(self) -> str:
        return self.type


class CarType(models.Model):
    type = models.CharField(max_length=40, unique=False)

    class Meta:
        ordering = ["type"]
        constraints = [
            UniqueConstraint(Lower("type"), name="unique_car_lower_type")
        ]

    def __str__(self) -> str:
        return self.type


class Status(models.Model):
    name = models.CharField(max_length=40, unique=False)

    class Meta:
        ordering = ["name"]
        verbose_name = "Status"
        verbose_name_plural = "Statuses"
        constraints = [
            UniqueConstraint(Lower("name"), name="unique_status_lower_name")
        ]

    def __str__(self):
        return self.name


class Feature(models.Model):
    name = models.CharField(max_length=100, unique=False)

    class Meta:
        ordering = ["name"]
        constraints = [
            UniqueConstraint(Lower("name"), name="unique_feature_lower_name")
        ]

    def __str__(self):
        return self.name


class SafetyFeature(models.Model):
    name = models.CharField(max_length=100, unique=False)

    class Meta:
        ordering = ["name"]
        constraints = [
            UniqueConstraint(Lower("name"), name="unique_safety_feature_lower_name")
        ]

    def __str__(self):
        return self.name


# ---------- Main tables ----------
class CarsListing(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    make = models.ForeignKey(Make, on_delete=models.PROTECT, related_name="listings")
    model = models.ForeignKey(ModelName, on_delete=models.PROTECT, related_name="listings")
    color = models.ForeignKey(Color, on_delete=models.PROTECT, related_name="listings")
    transmission = models.ForeignKey(Transmission, on_delete=models.PROTECT, related_name="listings")
    condition = models.ForeignKey(Condition, on_delete=models.PROTECT, related_name="listings")
    fuel_type = models.ForeignKey(FuelType, on_delete=models.PROTECT, related_name="listings")
    drive_type = models.ForeignKey(DriveType, on_delete=models.PROTECT, related_name="listings")
    car_type = models.ForeignKey(CarType, on_delete=models.PROTECT, related_name="listings")

    year = models.IntegerField(validators=[MinValueValidator(1900), MaxValueValidator(2100)])
    mileage = models.IntegerField(validators=[MinValueValidator(0)])
    engine_size = models.FloatField(validators=[MinValueValidator(0.0)])
    cylinders = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    doors = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    vin = models.CharField(max_length=32, unique=True)
    price = models.PositiveIntegerField()

    safety_features = models.ManyToManyField("SafetyFeature", related_name="listings", blank=True)
    features = models.ManyToManyField("Feature", related_name="listings", blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Car Listing"
        verbose_name_plural = "Car Listings"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.title} ({self.make} {self.model}, {self.year})"
    
    def delete(self, *args, **kwargs):
        # Ensure related images are deleted first
        for image in self.images.all():
            image.delete()  # Calls ListingImage's delete method

        # Now delete the listing itself
        super().delete(*args, **kwargs)


def listing_image_upload_to(instance: "ListingImage", filename: str) -> str:
    listing_id = instance.listing_id or "unassigned"
    ext = filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join("listings", str(listing_id), new_filename)


class ListingImage(models.Model):
    listing = models.ForeignKey(CarsListing, on_delete=models.CASCADE, related_name="images")
    path = models.ImageField(upload_to=listing_image_upload_to)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Listing Image"
        verbose_name_plural = "Listing Images"
        ordering = ["id"]

    def __str__(self) -> str:
        return f"Image #{self.pk} for {self.listing}"

    @property
    def full_url(self):
        """Returnează URL complet pentru frontend"""
        from django.conf import settings
        request_domain = "https://zoom-vintageclassics.com"
        return f"{request_domain}{settings.MEDIA_URL}{self.path}"

    def delete(self, *args, **kwargs):
        if self.path:
            self.path.delete(save=False)
        super().delete(*args, **kwargs)

class Inquiry(models.Model):
    listing = models.ForeignKey(
        CarsListing, on_delete=models.SET_NULL, null=True, blank=True, related_name="inquiries"
    )
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.TextField(
        validators=[
            RegexValidator(
                regex=r'^\+?\d+$',
                message='Phone number must contain only digits and may start with +.'
            )
        ]
    )
    message = models.TextField()
    status = models.ForeignKey(Status, on_delete=models.PROTECT, related_name="inquiries")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Inquiry"
        verbose_name_plural = "Inquiries"

    def __str__(self) -> str:
        target = f" for {self.listing}" if self.listing_id else ""
        return f"Inquiry by {self.name}{target}"
            

class InquiryComments(models.Model):
    comment = models.TextField()
    inquiry = models.ForeignKey(
        Inquiry, on_delete=models.SET_NULL, null=True, blank=True, related_name="inquiry"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Comment"
        verbose_name_plural = "Comments"

    def __str__(self):
        return self.comment
