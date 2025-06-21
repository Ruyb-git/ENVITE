"""
URL configuration for envite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from django.conf.urls.static import static
from .user import views as user_views

from rest_framework.routers import DefaultRouter
from .event import views as event_views


router = DefaultRouter()
router.register(r'events', event_views.EventViewSet, basename='event')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    
    path('user/auth/', include('dj_rest_auth.urls')),
    path('user/me/', user_views.Me.as_view()),
    path('user/register/', user_views.RegisterView.as_view()),
    path('user/me/avatar', user_views.AvatarUpdateView.as_view()),
    path('events/<str:event_id>/join/', event_views.JoinEventView.as_view(), name='join-event'),
    path('events/<str:event_id>/leave/', event_views.LeaveEventView.as_view(), name='leave-event'),
    path('events/my/', event_views.MyEventsView.as_view(), name='my-events'),
    path('events/participating/', event_views.EventsIParticipateView.as_view(), name='events-i-participate'),
    path('', include(router.urls)),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

urlpatterns = [path('api/{}/'.format(settings.API_VERSION), include(urlpatterns))]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)