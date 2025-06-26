import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Event } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = format(new Date(event.event_date), "PPP", {
    locale: ptBR,
  });

  return (
    <div className="bg-[#2F2F2F] rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        {event.banners && event.banners.length > 0 ? (
          <img
            src={event.banners[0].image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xl font-semibold">
              {event.title}
            </span>
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 p-2 space-x-2 flex">
          {event.i_will_join && (
            <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              Participando
            </div>
          )}

          {event.is_my_event && (
            <div className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded">
              Seu evento
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>

        <div className="text-sm text-gray-400 mb-4 flex-grow">
          {event.description}
        </div>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-sm text-gray-400">
            <Calendar size={16} className="mr-2" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center text-sm text-gray-400">
            <Clock size={16} className="mr-2" />
            <span>{event.event_time}</span>
          </div>

          {/* TRATAR A LOCALIZAÇÃO */}

          {/* <div className="flex items-center text-sm text-gray-400">
            <MapPin size={16} className="mr-2" />
            <span className="truncate">
              Lat: {event.latitude.toFixed(4)}, Long.{" "}
              {event.longitude.toFixed(4)}
            </span>
          </div> */}

          <div className="flex items-center text-sm text-gray-400">
            <Users size={16} className="mr-2" />
            <span>{event.participants.length} participantes</span>
          </div>
        </div>

        <Link
          to={`/events/${event.id}`}
          className="mt-4 inline-block w-full text-center bg-gray-500 hover:bg-[#4338CA] text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
