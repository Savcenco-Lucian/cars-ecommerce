from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from . import settings

admin.site.site_header = 'Administration'
admin.site.index_title = 'Administration'
admin.site.site_title = 'Administration'
admin.site.site_url = '/'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('api.urls')),
]