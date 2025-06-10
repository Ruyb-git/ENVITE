from rest_framework import serializers
from .models import Event, EventBanner, EventParticipant
from ..user.serializers import SimpleUserSerializer

class EventBannerSerializer(serializers.ModelSerializer):
	image = serializers.ImageField()
	class Meta:
		model = EventBanner
		fields = ['image']

class EventSerializer(serializers.HyperlinkedModelSerializer):
	id = serializers.CharField(read_only=True)
	is_my_event = serializers.SerializerMethodField()
	i_will_join = serializers.SerializerMethodField()
	owner = SimpleUserSerializer(read_only=True)
	participants = SimpleUserSerializer(many=True, read_only=True)
	banners = EventBannerSerializer(many=True, read_only=True)  # Só leitura para listagem
	banners_upload = serializers.ListField(
		child=serializers.ImageField(),
		write_only=True,
		required=False,
		allow_empty=True,
		help_text="Imagens para upload dos banners"
	)

	class Meta:
		model = Event
		fields = ['id', 'title', 'description', 'latitude', 'longitude', 'event_date', 'event_time',
				  'phone', 'ticket_price', 'owner', 'participants', 'banners', 'banners_upload',
				  'is_my_event', 'i_will_join']
		read_only_fields = ['id', 'owner', 'participants', 'is_my_event', 'i_will_join', 'banners']

			
	def create(self, validated_data):
		banners_files = validated_data.pop('banners_upload', [])
		event = Event.objects.create(**validated_data)

		for image in banners_files:
			EventBanner.objects.create(event=event, image=image)

		return event
	
	def update(self, instance, validated_data):
		banners_files = validated_data.pop('banners_upload', [])

		for attr, value in validated_data.items():
			setattr(instance, attr, value)
		instance.save()

		if banners_files:

			instance.banners.all().delete()

			for image in banners_files:
				EventBanner.objects.create(event=instance, image=image)

		return instance


	def get_is_my_event(self, obj):
		request = self.context.get('request')
		return obj.owner == request.user if request else False

	def get_i_will_join(self, obj):
		request = self.context.get('request')
		if request:
			return obj.participants.filter(id=request.user.id).exists()
		return False