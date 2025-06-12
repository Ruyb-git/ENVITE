import React, { useState, useEffect, useRef, useCallback } from "react";
import { PlusCircle } from "lucide-react";
import MainLayout from "../components/Layout/MainLayout";
import EventCard from "../components/EventCard";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import EventForm from "../components/EventForm";
import api from "../utils/api";
import { Event, PaginatedEvents } from "../types";
import toast from "react-hot-toast";

const ParticipatingPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const lastEventElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  const fetchEvents = async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get<PaginatedEvents>(
        "/api/v1/events/participating/",
        {
          params: {
            page: pageNum,
            size: 10,
          },
        }
      );

      if (pageNum === 1) {
        setEvents(response.data.results);
      } else {
        setEvents((prev) => [...prev, ...response.data.results]);
      }

      setHasMore(response.data.next !== null);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setHasMore(false);
      } else {
        console.error("Error fetching events:", error);
        if (pageNum === 1) {
          toast.error("Failed to load events");
        }
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const handleCreateEvent = async (formData: FormData) => {
    try {
      setFormLoading(true);
      await api.post("/api/v1/events/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsModalOpen(false);
      toast.success("Event created successfully!");
      setPage(1);
      fetchEvents(1);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Eventos que participo</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center"
        >
          <PlusCircle size={18} className="mr-2" />
          Criar Evento
        </Button>
      </div>

      {loading && events.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-[#2F2F2F] rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-white mb-2">
            Nenhum evento encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Não está participando de nenhum evento neste momento.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Criar um evento</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div
              key={event.id}
              ref={
                index === events.length - 1 ? lastEventElementRef : undefined
              }
            >
              <EventCard event={event} />
            </div>
          ))}
          {loadingMore && (
            <div className="col-span-full flex justify-center py-4">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Event"
        size="lg"
      >
        <EventForm onSubmit={handleCreateEvent} isLoading={formLoading} />
      </Modal>

      {/* Botão de ação flutuante para dispositivos móveis */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-colors"
        >
          <PlusCircle size={24} />
        </button>
      </div>
    </MainLayout>
  );
};

export default ParticipatingPage;
