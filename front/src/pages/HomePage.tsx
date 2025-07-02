// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { PlusCircle } from "lucide-react";
// import MainLayout from "../components/Layout/MainLayout";
// import EventCard from "../components/EventCard";
// import Button from "../components/ui/Button";
// import Modal from "../components/ui/Modal";
// import EventForm from "../components/EventForm";
// import api from "../utils/api";
// import { Event, PaginatedEvents } from "../types";
// import toast from "react-hot-toast";

// const HomePage: React.FC = () => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formLoading, setFormLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const observer = useRef<IntersectionObserver>();

//   const lastEventElementRef = useCallback(
//     (node: HTMLDivElement) => {
//       if (loading || loadingMore || !hasMore) return;

//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, loadingMore, hasMore]
//   );

//   const fetchEvents = async (pageNum: number) => {
//     try {
//       if (pageNum === 1) {
//         setLoading(true);
//       } else {
//         setLoadingMore(true);
//       }

//       const response = await api.get<PaginatedEvents>("/v1/events/", {
//         params: {
//           page: pageNum,
//           size: 10,
//         },
//       });

//       if (pageNum === 1) {
//         setEvents(response.data.results);
//       } else {
//         setEvents((prev) => [...prev, ...response.data.results]);
//       }

//       setHasMore(response.data.next !== null);
//     } catch (error: any) {
//       if (error.response?.status === 404) {
//         setHasMore(false);
//       } else {
//         console.error("Erro ao obter eventos:", error);
//         if (pageNum === 1) {
//           toast.error("Falha ao carregar eventos");
//         }
//       }
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents(page);
//   }, [page]);

//   const handleCreateEvent = async (formData: FormData) => {
//     try {
//       setFormLoading(true);
//       await api.post("/v1/events/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setIsModalOpen(false);
//       toast.success("Evento criado com sucesso!");
//       setPage(1);
//       fetchEvents(1);
//     } catch (error) {
//       console.error("Erro ao criar evento:", error);
//       toast.error("Não foi possível criar o evento");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   return (
//     <MainLayout>
//       {/* para evitar o bug da barra de pesquisa do mobile */}
//       <div className="min-h-[100dvh] bg-[#1E1E1E]">
//         <div className=" bg-[#1E1E1E] flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-white">Todos os eventos</h1>
//           <Button
//             onClick={() => setIsModalOpen(true)}
//             className="flex items-center"
//           >
//             <PlusCircle size={18} className="mr-2" />
//             Criar Evento
//           </Button>
//         </div>

//         {loading && events.length === 0 ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
//           </div>
//         ) : events.length === 0 ? (
//           <div className="bg-[#2F2F2F] rounded-lg shadow-md p-8 text-center">
//             <h3 className="text-lg font-medium text-white mb-2">
//               Nenhum evento encontrado
//             </h3>
//             <p className="text-gray-400 mb-4">
//               Não existem eventos criados de momento.
//             </p>
//             <Button onClick={() => setIsModalOpen(true)}>
//               Criar um evento
//             </Button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {events.map((event, index) => (
//               <div
//                 key={event.id}
//                 ref={
//                   index === events.length - 1 ? lastEventElementRef : undefined
//                 }
//               >
//                 <EventCard event={event} />
//               </div>
//             ))}
//             {loadingMore && (
//               <div className="col-span-full flex justify-center py-4">
//                 <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
//               </div>
//             )}
//           </div>
//         )}

//         <Modal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           title="Criar um evento"
//           size="lg"
//         >
//           <EventForm onSubmit={handleCreateEvent} isLoading={formLoading} />
//         </Modal>

//         {/* Botão de ação flutuante para dispositivos móveis */}
//         <div className="md:hidden fixed bottom-6 right-6">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-colors"
//           >
//             <PlusCircle size={24} />
//           </button>
//         </div>
//       </div>
//     </MainLayout>
//   );
// };

// export default HomePage;

// MODIFICAÇÃO PARA PESQUISA

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import MainLayout from "../components/Layout/MainLayout";
import EventCard from "../components/EventCard";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import EventForm from "../components/EventForm";
import api from "../utils/api";
import { Event, PaginatedEvents } from "../types";
import toast from "react-hot-toast";

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

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

  const fetchEvents = async (pageNum: number, search?: string) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get<PaginatedEvents>("/v1/events/", {
        params: {
          page: pageNum,
          size: 10,
          search: search || "",
        },
      });

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
        console.error("Erro ao obter eventos:", error);
        if (pageNum === 1) {
          toast.error("Falha ao carregar eventos");
        }
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // Reinicia a página se o termo de busca mudar
    setPage(1);
    fetchEvents(1, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    // Continua carregando mais eventos da mesma busca
    if (page > 1) {
      fetchEvents(page, searchQuery);
    }
  }, [page]);

  // Controle do botão flutuante para mobile
  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCreateEvent = async (formData: FormData) => {
    try {
      setFormLoading(true);
      await api.post("/v1/events/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsModalOpen(false);
      toast.success("Evento criado com sucesso!");
      setPage(1);
      fetchEvents(1, searchQuery);
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      toast.error("Não foi possível criar o evento");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[100dvh] bg-[#1E1E1E]">
        <div className="bg-[#1E1E1E] flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Todos os eventos</h1>
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
            <p className="text-gray-400 mb-4">
              Não existem eventos criados de momento.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              Criar um evento
            </Button>
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
          title="Criar um evento"
          size="lg"
        >
          <EventForm onSubmit={handleCreateEvent} isLoading={formLoading} />
        </Modal>

        {/* Botão de ação flutuante para dispositivos móveis - aparece só ao rolar pra baixo com fade-in */}
        <div
          className={`md:hidden fixed bottom-6 right-6 transition-opacity duration-500 ${
            showButton
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg"
          >
            <PlusCircle size={32} />
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
