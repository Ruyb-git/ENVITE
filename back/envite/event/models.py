from django.db import models
from django.utils import timezone
from hashid_field import HashidAutoField
from ..user.models import User

class Event(models.Model):
	id = HashidAutoField(primary_key=True)
	title = models.CharField('Title', max_length=100, blank=False, null=False)
	description = models.TextField(verbose_name='Description', null=False, blank=False, default='')
	latitude = models.FloatField(verbose_name='Latitude', null=False, blank=False)
	longitude = models.FloatField(verbose_name='Latitude', null=False, blank=False)
	owner = models.ForeignKey(User, verbose_name='Owner', null=False, blank=False, related_name='events', on_delete=models.CASCADE)
	participants = models.ManyToManyField(
		User,
		through='EventParticipant',
		related_name='participated_events'
	)
	created_at = models.DateTimeField(default=timezone.now)
	updated_at = models.DateTimeField(default=timezone.now)
	event_date = models.DateField('Event Date', null=False, blank=False)
	event_time = models.TimeField('Event Time', null=False, blank=False)
	phone = models.CharField('Phone', max_length=100, blank=False, null=False)
	ticket_price = models.DecimalField(
		verbose_name='Ticket Price',
		max_digits=10,
		decimal_places=2,
		null=True,
		blank=True,
		help_text='Leave blank if the event is free.'
	)

	class Meta:
		ordering = ['-updated_at']

	def __str__(self):
		return f"{self.title} by {self.owner.username} in {self.event_date}"
	
class EventBanner(models.Model):
	event = models.ForeignKey(
		Event,
		related_name='banners',
		on_delete=models.CASCADE
	)
	image = models.ImageField(
		upload_to='event_banners/',
		verbose_name='Banner Image'
	)
	uploaded_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Banner for {self.event.title}"
	
class EventParticipant(models.Model):
	event = models.ForeignKey(Event, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	joined_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ('event', 'user')
		ordering = ['joined_at']

	def __str__(self):
		return f"{self.user.username} goes to \"{self.event.title}\" from {self.event.owner.username} at {self.joined_at}"