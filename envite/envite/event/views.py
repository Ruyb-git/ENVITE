from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from .serializers import EventSerializer
from rest_framework import viewsets, generics, status, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsOwnerOrReadOnly
from .paginaition import CustomPagination
from .models import Event
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse


@extend_schema(
	summary="CRUD de eventos",
	description="Permite criar, listar, obter, atualizar e deletar eventos.\n\n"
				"A atualização e remoção só podem ser feitas pelo owner do evento.",
	responses=EventSerializer,
)
class EventViewSet(viewsets.ModelViewSet):

	permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
	serializer_class = EventSerializer
	pagination_class = CustomPagination
	parser_classes = [MultiPartParser, FormParser]

	def get_queryset(self):
		return Event.objects.all()

	def perform_create(self, serializer):
		serializer.save(owner=self.request.user)

	@extend_schema(
		summary="Listar eventos",
		description="Lista eventos com paginação.\n\n"
					"Aceita os parâmetros `page` e `size` para controle de paginação.",
		parameters=[
			OpenApiParameter(name='page', description='Número da página', required=False, type=int),
			OpenApiParameter(name='size', description='Quantidade de itens por página', required=False, type=int),
		],
		responses=EventSerializer,
	)
		
	def list(self, request, *args, **kwargs):
		return super().list(request, *args, **kwargs)

	@extend_schema(
		summary="Criar evento",
		description="Cria um novo evento associado ao usuário autenticado.",
		responses={
			201: EventSerializer,
			400: OpenApiResponse(description='Dados inválidos'),
		},
	)
	def create(self, request, *args, **kwargs):
		return super().create(request, *args, **kwargs)

	@extend_schema(
		summary="Obter detalhes de um evento",
		description="Retorna os detalhes de um evento específico pelo seu ID.",
		responses=EventSerializer,
	)
	def retrieve(self, request, *args, **kwargs):
		return super().retrieve(request, *args, **kwargs)

	@extend_schema(
		summary="Atualizar evento (total)",
		description="Atualiza todos os campos de um evento.\n\n"
					"**Apenas o owner do evento pode atualizar.**",
		responses=EventSerializer,
	)
	def update(self, request, *args, **kwargs):
		return super().update(request, *args, **kwargs)

	@extend_schema(
		summary="Atualizar evento (parcial)",
		description="Atualiza parcialmente os campos de um evento.\n\n"
					"**Apenas o owner do evento pode atualizar.**",
		responses=EventSerializer,
	)
	def partial_update(self, request, *args, **kwargs):
		return super().partial_update(request, *args, **kwargs)

	@extend_schema(
		summary="Deletar evento",
		description="Remove um evento pelo seu ID.\n\n"
					"**Apenas o owner do evento pode deletar.**",
		responses={204: OpenApiResponse(description='Evento deletado com sucesso.')},
	)
	def destroy(self, request, *args, **kwargs):
		return super().destroy(request, *args, **kwargs)
	
@extend_schema(
	summary="Listar meus eventos (como owner)",
	description="Lista eventos em que o usuário autenticado é o criador (owner).",
	responses=EventSerializer,
	parameters=[
		OpenApiParameter(name='page', description='Número da página', required=False, type=int),
		OpenApiParameter(name='size', description='Quantidade de itens por página', required=False, type=int),
	],
)
class MyEventsView(generics.ListAPIView):
	serializer_class = EventSerializer
	permission_classes = [IsAuthenticated]
	pagination_class = CustomPagination

	def get_queryset(self):
		return Event.objects.filter(owner=self.request.user).order_by('-event_date')

@extend_schema(
	summary="Listar meus eventos (como participante)",
	description="Lista eventos em que o usuário autenticado é o participante (owner).",
	responses=EventSerializer,
	parameters=[
		OpenApiParameter(name='page', description='Número da página', required=False, type=int),
		OpenApiParameter(name='size', description='Quantidade de itens por página', required=False, type=int),
	],
)
class EventsIParticipateView(generics.ListAPIView):
	serializer_class = EventSerializer
	permission_classes = [IsAuthenticated]
	pagination_class = CustomPagination

	def get_queryset(self):
		return Event.objects.filter(participants=self.request.user).order_by('-event_date')
	
@extend_schema(
	summary="Confirmar participação em um evento",
	description="Confirma a participação do usuário autenticado em um evento.\n\n"
				"Se já for participante, retorna sucesso da mesma forma (idempotente).",
	parameters=[
		OpenApiParameter(
			name="event_id",
			description="ID do evento para participar",
			required=True,
			type=str,
			location=OpenApiParameter.PATH,
		)
	],
	responses={
		200: EventSerializer,
		404: OpenApiResponse(description="Evento não encontrado")
	}
)
class JoinEventView(views.APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, event_id):
		event = get_object_or_404(Event, id=event_id)

		event.participants.add(request.user)

		serializer = EventSerializer(event, context={'request': request})
		return Response(serializer.data, status=status.HTTP_200_OK)
	
@extend_schema(
	summary="Cancelar participação no evento",
	description=(
		"Cancela a participação do usuário autenticado no evento especificado.\n\n"
		"Se o usuário não estiver participando, a operação ainda assim é considerada bem-sucedida (idempotente).\n\n"
		"Retorna os dados atualizados do evento."
	),
	parameters=[
		OpenApiParameter(
			name="event_id",
			description="ID do evento para sair",
			required=True,
			type=str,
			location=OpenApiParameter.PATH,
		)
	],
	responses={
		200: EventSerializer,
		404: OpenApiResponse(description="Evento não encontrado")
	}
)
class LeaveEventView(views.APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, event_id):
		event = get_object_or_404(Event, id=event_id)

		event = get_object_or_404(Event, id=event_id)
		event.participants.remove(request.user)

		serializer = EventSerializer(
			event, context={"request": request}
		)
		return Response(serializer.data, status=status.HTTP_200_OK)