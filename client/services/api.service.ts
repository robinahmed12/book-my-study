import { axiosPublic, axiosSecure } from "@/lib/axios";
import type { Room, RoomFormData, Booking, BookingFormData, RoomFilters, User } from "@/types";

// ─── Auth Services ──────────────────────────────────────────

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    photoURL?: string;
  }) => {
    const res = await axiosPublic.post("/api/auth/register", data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await axiosPublic.post("/api/auth/login", data, {
      withCredentials: true,
    });
    return res.data;
  },

  googleAuth: async (data: {
    name: string;
    email: string;
    photoURL: string;
    googleId: string;
  }) => {
    const res = await axiosPublic.post("/api/auth/google", data, {
      withCredentials: true,
    });
    return res.data;
  },

  logout: async () => {
    const res = await axiosSecure.post("/api/auth/logout");
    return res.data;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const res = await axiosSecure.get("/api/auth/me");
    return res.data;
  },
};

// ─── Room Services ──────────────────────────────────────────

export const roomService = {
  getAll: async (filters: Partial<RoomFilters>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== "" && val !== null) {
        params.append(key, String(val));
      }
    });
    const res = await axiosPublic.get(`/api/rooms?${params.toString()}`);
    return res.data;
  },

  getLatest: async (): Promise<{ success: boolean; rooms: Room[] }> => {
    const res = await axiosPublic.get("/api/rooms/latest");
    return res.data;
  },

  getById: async (id: string): Promise<{ success: boolean; room: Room }> => {
    const res = await axiosPublic.get(`/api/rooms/${id}`);
    return res.data;
  },

  getMyListings: async (): Promise<{ success: boolean; rooms: Room[] }> => {
    const res = await axiosSecure.get("/api/rooms/my-listings");
    return res.data;
  },

  create: async (data: RoomFormData): Promise<{ success: boolean; room: Room }> => {
    const res = await axiosSecure.post("/api/rooms", data);
    return res.data;
  },

  update: async (
    id: string,
    data: Partial<RoomFormData>
  ): Promise<{ success: boolean; room: Room }> => {
    const res = await axiosSecure.patch(`/api/rooms/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await axiosSecure.delete(`/api/rooms/${id}`);
    return res.data;
  },
};

// ─── Booking Services ───────────────────────────────────────

export const bookingService = {
  create: async (
    data: BookingFormData
  ): Promise<{ success: boolean; booking: Booking }> => {
    const res = await axiosSecure.post("/api/bookings", data);
    return res.data;
  },

  getMyBookings: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; bookings: Booking[]; pagination: unknown }> => {
    const res = await axiosSecure.get("/api/bookings/my", { params });
    return res.data;
  },

  getRoomAvailability: async (
    roomId: string,
    date: string
  ): Promise<{ success: boolean; bookedSlots: Array<{ startTime: string; endTime: string }> }> => {
    const res = await axiosSecure.get(
      `/api/bookings/room/${roomId}/availability`,
      { params: { date } }
    );
    return res.data;
  },

  cancel: async (id: string): Promise<{ success: boolean }> => {
    const res = await axiosSecure.patch(`/api/bookings/${id}/cancel`);
    return res.data;
  },
};
