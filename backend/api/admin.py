from django.contrib import admin
from . import models
from django.forms import ModelForm, ValidationError
from django.utils.safestring import mark_safe
from django import forms


# ---------- Simple lookup tables ----------
@admin.register(
    models.Status,
    models.DriveType,
    models.CarType,
    models.Feature,
    models.SafetyFeature,
    models.Transmission,
    models.FuelType,
    models.Condition
)

@admin.register(models.Make)
class MakeAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(models.ModelName)
class ModelNameAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(models.Color)
class ColorAdmin(admin.ModelAdmin):
    search_fields = ['name']

class LookupAdmin(admin.ModelAdmin):
    search_fields = ("name", "type")
    list_display = ("id", "__str__")
    ordering = ("id")


# ---------- Inline for listing images ----------
class ListingImageInline(admin.TabularInline):
    model = models.ListingImage
    extra = 1
    
    def get_extra(self, request, obj=None, **kwargs):
        if obj:  # Only show extra fields if editing an existing object
            return 0  # No extra rows by default
        return 1  # One extra row for new images

    def delete(self, request, obj=None, **kwargs):
        if obj:
            obj.delete()


# ---------- CarsListing ----------
@admin.register(models.CarsListing)
class CarsListingAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "make", "model", "year", "price", "created_at")
    list_filter = (
        "fuel_type",
        "transmission",
        "condition",
        "color",
        "year",
    )
    search_fields = ("title", "description", "vin","model__name", "make__name")
    inlines = [ListingImageInline]
    autocomplete_fields = (
        "make",
        "model",
        "color"
    )


# ---------- ListingImage ----------
@admin.register(models.ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ("id", "listing", "uploaded_at")
    search_fields = ("listing__title",)
    list_filter = ("uploaded_at",)


# ---------- Inquiry ----------
class InquiryCommentForm(forms.ModelForm):
    class Meta:
        model = models.InquiryComments
        fields = ('comment',)

    comment = forms.CharField(widget=forms.Textarea(attrs={'rows': 3, 'cols': 40, }), label="Enter/Edit Comment")

class InquiryCommentInline(admin.StackedInline):
    model = models.InquiryComments
    extra = 0
    form=InquiryCommentForm
    readonly_fields = ("created_at",)
    fields = ("comment", "created_at")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        """ Hide the add button when no comments are present """
        return True

class InquiryAdminForm(ModelForm):
    class Meta:
        model = models.Inquiry
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        if self.instance and self.instance.pk:
            changed = set(self.changed_data) - {"status"}
            if changed:
                raise ValidationError(
                    f"Only 'status' can be changed in admin. You modified: {', '.join(sorted(changed))}"
                )
        return cleaned


@admin.register(models.Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    form = InquiryAdminForm
    list_display = ("name", "custom_status_coloring", "listing", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("name", "email", "phone", "message")

    inlines = [InquiryCommentInline]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            all_fields = [f.name for f in self.model._meta.fields]
            return [f for f in all_fields if f != "status"]
        return []
    
    def custom_status_coloring(self, obj):
        color_map = {
            'New': '#007bff',               # blue
            'No answer': '#6c757d',         # gray
            'Comes to our place': '#17a2b8',# teal / info
            'In progress': '#fd7e14',       # orange
            'Sold': '#28a745',              # green
            'Repeated': '#6610f2',          # purple
        }
    
        name = getattr(obj.status, 'name', 'Unknown')
        color = color_map.get(name, '#dc3545')  # red for unknown
        label = name.title()
    
        return mark_safe(
            f'<span style="background-color: {color}; color: white; '
            f'padding: 5px 16px; border-radius: 10px; font-weight: bold; '
            f'white-space: nowrap;">{label}</span>'
        )
 
    custom_status_coloring.short_description = "Status"
