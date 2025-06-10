export interface User {
  username: string;
  name: string;
  avatar?: string;
  bio?: string;
  email?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    pk: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  event_date: string;
  event_time: string;
  phone: string;
  ticket_price: string | null;
  owner: User;
  participants: User[];
  banners: { image: string }[];
  is_my_event: boolean;
  i_will_join: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  event_date: string;
  event_time: string;
  phone: string;
  ticket_price?: string;
  banners_upload?: FileList;
}

export interface PaginatedEvents {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUserProfile: (user: User) => void;
}