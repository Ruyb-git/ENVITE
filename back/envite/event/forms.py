from django import forms
from .models import Event
from django.contrib.auth import get_user_model


class EventForm(forms.ModelForm):

	class Meta:
		model = Event
		fields = ['title', 'description', 'latitude', 'longitude', 'owner','bio','participants','event_date','event_time','phone','ticket_price']