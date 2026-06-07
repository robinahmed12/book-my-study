// ─── User Types ────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: "user" | "admin";
  bookings: string[];
  googleId?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ─── Room Types ────────────────────────────────────────────

export interface Room {
  _id: string;
  ownerId: string;
  roomName: string;
  description: string;
  image: string;
  floor: string;
  capacity: number;
  hourlyRate: number;
  amenities: string[];
  bookingCount: number;
  owner?: RoomOwner;
  createdAt: string;
  updatedAt: string;
}

export interface RoomOwner {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
}

export interface RoomFormData {
  roomName: string;
  description: string;
  image: string;
  floor: string;
  capacity: number;
  hourlyRate: number;
  amenities: string[];
}

// ─── Booking Types ──────────────────────────────────────────

export type BookingStatus = "confirmed" | "cancelled" | "pending";

export interface Booking {
  _id: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  durationHours: number;
  totalCost: number;
  note: string;
  status: BookingStatus;
  createdAt: string;
  cancelledAt?: string;
}

export interface BookingFormData {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  note?: string;
}

export interface BookedSlot {
  _id: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

// ─── API Response Types ─────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── Filter Types ───────────────────────────────────────────

export interface RoomFilters {
  search: string;
  minRate: string;
  maxRate: string;
  capacity: string;
  sort: string;
  page: number;
}

// ─── Form Error Types ───────────────────────────────────────

export type FormErrors<T> = Partial<Record<keyof T, string>>;
