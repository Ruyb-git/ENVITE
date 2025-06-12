import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Tag,
  Users,
  Edit,
  Trash,
  LogIn,
  LogOut,
} from "lucide-react";
import MainLayout from "../components/Layout/MainLayout";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import EventForm from "../components/EventForm";
import api from "../utils/api";
import { Event } from "../types";
import { format } from "date-fns";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import toast from "react-hot-toast";
import "leaflet/dist/leaflet.css";

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [joinLeaveLoading, setJoinLeaveLoading] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get<Event>(`/api/v1/events/${id}/`);
      setEvent(response.data);
    } catch (error) {
      console.error("Ocorreu um erro ao obter o evento:", error);
      toast.error("Falha ao carregar detalhes do evento");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleUpdateEvent = async (formData: FormData) => {
    if (!id) return;

    try {
      setFormLoading(true);
      await api.patch(`/api/v1/events/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Evento atualizado com sucesso.!");
      setIsEditModalOpen(false);
      fetchEvent();
    } catch (error) {
      console.error("Erro ao atualizar o evento", error);
      toast.error("Falha ao atualizar evento");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!id) return;

    try {
      await api.delete(`/api/v1/events/${id}/`);
      toast.success('"Evento deletado com sucesso"; ::!');
      navigate("/");
    } catch (error) {
      console.error("Erro ao eliminar evento:", error);
      toast.error("Falha ao eliminar.t");
    }
  };

  const handleJoinLeaveEvent = async () => {
    if (!id || !event) return;

    try {
      setJoinLeaveLoading(true);
      if (event.i_will_join) {
        await api.post(`/api/v1/events/${id}/leave/`);
        toast.success("Saiu do evento");
      } else {
        await api.post(`/api/v1/events/${id}/join/`);
        toast.success("Juntou-se ao evento");
      }
      fetchEvent();
    } catch (error) {
      console.error("Error joining/leaving event:", error);
      toast.error("Falha ao atualizar o estado de participação");
    } finally {
      setJoinLeaveLoading(false);
    }
  };

  const nextBanner = () => {
    if (event?.banners && bannerIndex < event.banners.length - 1) {
      setBannerIndex(bannerIndex + 1);
    } else {
      setBannerIndex(0);
    }
  };

  const prevBanner = () => {
    if (event?.banners && bannerIndex > 0) {
      setBannerIndex(bannerIndex - 1);
    } else if (event?.banners) {
      setBannerIndex(event.banners.length - 1);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }

  if (!event) {
    return (
      <MainLayout>
        <div className="bg-[#2F2F2F] rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Evento não encontrado
          </h3>
          <p className="text-gray-400 mb-4">
            O evento que procura não existe ou foi removido.
          </p>
          <Button onClick={() => navigate("/")}>Voltar para Eventos</Button>
        </div>
      </MainLayout>
    );
  }

  const formattedDate = format(new Date(event.event_date), "PPP");

  return (
    <MainLayout>
      <div className="bg-[#2F2F2F] rounded-lg shadow-md overflow-hidden">
        {/* Banner */}
        <div className="relative h-64 sm:h-80 md:h-96 bg-gray-200">
          {event.banners && event.banners.length > 0 ? (
            <>
              <img
                src={event.banners[bannerIndex].image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {event.banners.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between">
                  <button
                    onClick={prevBanner}
                    className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full m-4 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextBanner}
                    className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full m-4 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {event.title}
                </h1>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {event.title}
              </h1>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {event.is_my_event && (
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Criou este evento
              </span>
            )}
            {event.i_will_join && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Está participando
              </span>
            )}
            {event.ticket_price ? (
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Pago: ${event.ticket_price}
              </span>
            ) : (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Grátis
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-4">
                Sobre este evento
              </h2>
              <p className="text-gray-400 mb-6 whitespace-pre-line">
                {event.description}
              </p>

              <h3 className="text-lg font-semibold text-white mb-2">
                Detalhes do Evento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-6">
                <div className="flex items-center text-gray-400">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{event.event_time}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{event.phone}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{event.participants.length} participantes</span>
                </div>
                {event.ticket_price && (
                  <div className="flex items-center text-gray-400">
                    <Tag className="h-5 w-5 text-gray-500 mr-2" />
                    <span>Preço: ${event.ticket_price}</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">Local</h3>
              <div className="h-64 rounded-lg overflow-hidden mb-6">
                <MapContainer
                  center={[event.latitude, event.longitude]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[event.latitude, event.longitude]} />
                </MapContainer>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-[#434343] p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Criador do evento
                </h3>
                <div className="flex items-center mb-4">
                  {event.owner.avatar ? (
                    <img
                      src={event.owner.avatar}
                      alt={event.owner.name}
                      className="h-10 w-10 rounded-full mr-2"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-2">
                      {event.owner.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{event.owner.name}</p>
                    <p className="text-sm text-gray-500">
                      @{event.owner.username}
                    </p>
                  </div>
                </div>

                {event.owner.bio && (
                  <p className="text-sm text-gray-400 mb-4">
                    {event.owner.bio}
                  </p>
                )}

                <div className="mt-6">
                  {event.is_my_event ? (
                    <div className="space-y-2">
                      <Button
                        onClick={() => setIsEditModalOpen(true)}
                        fullWidth
                        className="flex items-center justify-center"
                      >
                        <Edit size={16} className="mr-2" />
                        Editar evento
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setIsDeleteModalOpen(true)}
                        fullWidth
                        className="flex items-center justify-center"
                      >
                        <Trash size={16} className="mr-2" />
                        Eliminar Evento
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleJoinLeaveEvent}
                      variant={event.i_will_join ? "outline" : "primary"}
                      isLoading={joinLeaveLoading}
                      fullWidth
                      className="flex items-center justify-center"
                    >
                      {event.i_will_join ? (
                        <>
                          <LogOut size={16} className="mr-2" />
                          Sair do evento
                        </>
                      ) : (
                        <>
                          <LogIn size={16} className="mr-2" />
                          Participe do Evento
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {event.participants.length > 0 && (
                <div className="mt-6 bg-[#434343] p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Participantes
                  </h3>
                  <div className="space-y-3">
                    {event.participants.map((participant) => (
                      <div
                        key={participant.username}
                        className="flex items-center"
                      >
                        {participant.avatar ? (
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white mr-2">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm text-gray-400">
                          {participant.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editar Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar evento"
        size="lg"
      >
        <EventForm
          onSubmit={handleUpdateEvent}
          initialData={event}
          isLoading={formLoading}
        />
      </Modal>

      {/* Excluir Modal de Confirmação */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar Evento"
        size="sm"
      >
        <div>
          <p className="text-gray-400 mb-4">
            Tem a certeza de que deseja eliminar esta zona? Esta ação não pode
            ser revertida.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteEvent}>
              Eliminar Evento
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default EventDetailPage;
