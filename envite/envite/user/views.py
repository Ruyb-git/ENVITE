from django.shortcuts import render
from django.utils.decorators import method_decorator
from .serializers import MeSerializer, AvatarSerializer
from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework.parsers import MultiPartParser, FormParser
from .models import User

@extend_schema(
    summary="Obter ou atualizar dados do usuário autenticado",
    description="Retorna os dados do usuário autenticado (GET) ou atualiza os campos name e bio (PATCH).",
    responses=MeSerializer,
)
class Me(generics.GenericAPIView):
	"""
	Returns or updates the logged user data.
	"""
	permission_classes = [IsAuthenticated]
	serializer_class = MeSerializer

	@extend_schema(
        summary="Obter dados do usuário autenticado",
        responses=MeSerializer,
    )
	def get(self, request, *args, **kwargs):
		serializer = self.get_serializer(request.user)
		return Response(serializer.data)

	@extend_schema(
        summary="Atualizar dados do usuário (name e bio)",
        request=MeSerializer,
        responses=MeSerializer,
    )
	def patch(self, request, *args, **kwargs):
		serializer = self.get_serializer(
			request.user, data=request.data, partial=True
		)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data, status=status.HTTP_200_OK)

@extend_schema(
    summary="Registrar um novo usuário",
    description="Cria um novo usuário na plataforma. "
                "Campos obrigatórios: username, name, email e password.",
    request=MeSerializer,
    responses=MeSerializer,
)
class RegisterView(generics.CreateAPIView):
	queryset = User.objects.all()
	serializer_class = MeSerializer
	permission_classes = []

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		return Response(self.get_serializer(user).data, status=status.HTTP_201_CREATED)

@extend_schema(
    summary="Atualizar avatar do usuário autenticado",
    description="Endpoint separado para atualizar o avatar do usuário autenticado via upload de imagem.",
    request=AvatarSerializer,
    responses=AvatarSerializer,
)
class AvatarUpdateView(generics.GenericAPIView):
	"""
	Updates the avatar of the logged user.
	"""
	permission_classes = [IsAuthenticated]
	serializer_class = AvatarSerializer
	parser_classes = [MultiPartParser, FormParser]

	@extend_schema(
        summary="Atualizar avatar do usuário",
        request=AvatarSerializer,
        responses=AvatarSerializer,
    )
	def patch(self, request, *args, **kwargs):
		serializer = self.get_serializer(
			request.user, data=request.data, partial=True
		)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data, status=status.HTTP_200_OK)