import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "./ui/Button";
import Input from "./ui/Input";
import TextArea from "./ui/TextArea";
import { EventFormData } from "../types";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
// import { CalendarDays, Clock } from "lucide-react";

// Corrigir o problema do ícone de folheto em falta
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  event_date: z.string().min(1, "Event date is required"),
  event_time: z.string().min(1, "Event time is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  ticket_price: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  banners_upload: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length <= 5,
      "Maximum of 5 images allowed"
    )
    .refine(
      (files) =>
        !files || Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      "Each file must be less than 5MB"
    )
    .refine(
      (files) =>
        !files ||
        Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});

interface LocationPickerProps {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
  mapRef: React.MutableRefObject<L.Map | null>;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  position,
  onPositionChange,
  mapRef,
}) => {
  const [markerPosition, setMarkerPosition] =
    useState<[number, number]>(position);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        onPositionChange(lat, lng);
      },
    });
    return null;
  };

  return (
    <>
      <MapEvents />
      <Marker position={markerPosition} />
    </>
  );
};

interface EventFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<EventFormData>;
  isLoading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [mapPosition, setMapPosition] = useState<[number, number]>([
    initialData?.latitude || -7.075748,
    initialData?.longitude || -41.46727,
  ]);
  const [searchAddress, setSearchAddress] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const mapRef = React.useRef<L.Map | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      event_date: initialData?.event_date || "",
      event_time: initialData?.event_time || "",
      phone: initialData?.phone || "",
      ticket_price: initialData?.ticket_price || "",
      latitude: initialData?.latitude || -7.075748,
      longitude: initialData?.longitude || -41.46727,
    },
  });

  const handleLocationChange = (lat: number, lng: number) => {
    setValue("latitude", lat);
    setValue("longitude", lng);
    setMapPosition([lat, lng]);
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
    }
  };

  const handleAddressSearch = async (
    e: React.FormEvent | React.KeyboardEvent
  ) => {
    e.preventDefault();
    if (!searchAddress.trim()) return;

    try {
      setSearchLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        handleLocationChange(latitude, longitude);
        toast.success("Location found!");
      } else {
        toast.error("Location not found");
      }
    } catch (error) {
      toast.error("Error searching for location");
    } finally {
      setSearchLoading(false);
    }
  };

  const onSubmitForm = handleSubmit((data) => {
    const formData = new FormData();

    // Add all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "banners_upload" && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Add banner files
    if (data.banners_upload) {
      Array.from(data.banners_upload).forEach((file) => {
        formData.append("banners_upload", file);
      });
    }

    onSubmit(formData);
  });

  return (
    <form onSubmit={onSubmitForm} className="space-y-4">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            label="Título do Evento"
            placeholder="Digite o título do Evento"
            error={errors.title?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextArea
            label="Descrição"
            placeholder="Descreva o seu evento"
            rows={4}
            error={errors.description?.message}
            {...field}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="event_date"
          control={control}
          render={({ field }) => (
            <Input
              type="date"
              label="Data do Evento"
              // icon={<CalendarDays size={18} />} ICONE CRIADO POR MIM MESMO
              error={errors.event_date?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="event_time"
          control={control}
          render={({ field }) => (
            <Input
              type="time"
              label="Horário"
              // icon={<Clock size={18} />}
              error={errors.event_time?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              label="Telefone para contato"
              placeholder="(123) 456-7890"
              error={errors.phone?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="ticket_price"
          control={control}
          render={({ field }) => (
            <Input
              label="Valor do Evento"
              placeholder="0.00"
              type="number"
              step="0.01"
              error={errors.ticket_price?.message}
              {...field}
            />
          )}
        />
      </div>

      <Controller
        name="banners_upload"
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banners de eventos (até 5 imagens)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onChange(e.target.files)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              {...field}
            />
            {errors.banners_upload && (
              <p className="mt-1 text-sm text-red-600">
                {errors.banners_upload.message}
              </p>
            )}
          </div>
        )}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Localização do Evento
        </label>

        <div className="mb-2">
          <div className="flex gap-2">
            <Input
              placeholder="Search for an address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddressSearch(e);
                }
              }}
              className="flex-1"
            />
            <Button
              onClick={handleAddressSearch}
              isLoading={searchLoading}
              className="flex items-center "
              type="button"
            >
              <Search size={18} className="mr-2" />
              Pesquisar
            </Button>
          </div>
        </div>

        <div className="h-64 rounded-md overflow-hidden border border-gray-300">
          <MapContainer
            center={mapPosition}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationPicker
              position={mapPosition}
              onPositionChange={handleLocationChange}
              mapRef={mapRef}
            />
          </MapContainer>
        </div>
        {(errors.latitude || errors.longitude) && (
          <p className="mt-1 text-sm text-red-600">
            Seleccione uma localização no mapa
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Update Event" : "Criar Evento"}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
