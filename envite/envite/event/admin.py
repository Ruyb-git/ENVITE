from django.contrib import admin
from .models import Event, EventParticipant, EventBanner

class EventBannerInline(admin.TabularInline):
    model = EventBanner
    extra = 1

class EventParticipantInline(admin.TabularInline):
    model = EventParticipant
    extra = 1

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    inlines = [EventBannerInline, EventParticipantInline]