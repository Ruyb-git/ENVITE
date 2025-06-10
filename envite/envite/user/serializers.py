from rest_framework import serializers
from .models import User

class SimpleUserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = ['username', 'name', 'avatar', 'bio']

class MeSerializer(serializers.HyperlinkedModelSerializer):
	password = serializers.CharField(write_only=True, required=True, min_length=6)

	class Meta:
		model = User
		fields = ['email', 'username', 'name', 'avatar', 'bio', 'password']
		# read_only_fields = ['email', 'username', 'avatar']

	def create(self, validated_data):
		password = validated_data.pop('password')
		user = User(**validated_data)
		user.set_password(password)
		user.save()
		return user

	def update(self, instance, validated_data):
		password = validated_data.pop('password', None)
		for attr, value in validated_data.items():
			setattr(instance, attr, value)
		if password:
			instance.set_password(password)
		instance.save()
		return instance

class AvatarSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['avatar']