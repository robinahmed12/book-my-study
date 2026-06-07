import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { roomService, bookingService } from "@/services/api.service";
import type { RoomFilters, BookingFormData } from "@/types";

// ─── Query Keys ────────────────────────────────────────────

export const QUERY_KEYS = {
  rooms: (filters?: Partial<RoomFilters>) => ["rooms", filters],
  latestRooms: ["rooms", "latest"],
  room: (id: string) => ["rooms", id],
  myListings: ["rooms", "my-listings"],
  myBookings: (params?: object) => ["bookings", "my", params],
  roomAvailability: (roomId: string, date: string) => ["availability", roomId, date],
} as const;

// ─── Room Hooks ────────────────────────────────────────────

export function useRooms(filters: Partial<RoomFilters>) {
  return useQuery({
    queryKey: QUERY_KEYS.rooms(filters),
    queryFn: () => roomService.getAll(filters),
  });
}

export function useLatestRooms() {
  return useQuery({
    queryKey: QUERY_KEYS.latestRooms,
    queryFn: roomService.getLatest,
    staleTime: 2 * 60 * 1000, // 2 minutes for home page
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.room(id),
    queryFn: () => roomService.getById(id),
    enabled: !!id,
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: QUERY_KEYS.myListings,
    queryFn: roomService.getMyListings,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room listing created successfully!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to create room");
    },
  });
}

export function useUpdateRoom(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof roomService.update>[1]) =>
      roomService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.room(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myListings });
      toast.success("Room updated successfully!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update room");
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room deleted successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to delete room");
    },
  });
}

// ─── Booking Hooks ─────────────────────────────────────────

export function useMyBookings(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: QUERY_KEYS.myBookings(params),
    queryFn: () => bookingService.getMyBookings(params),
  });
}

export function useRoomAvailability(roomId: string, date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.roomAvailability(roomId, date),
    queryFn: () => bookingService.getRoomAvailability(roomId, date),
    enabled: !!roomId && !!date,
    staleTime: 30 * 1000, // 30 seconds — availability changes frequently
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BookingFormData) => bookingService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room booked successfully! 🎉");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to book room");
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Booking cancelled successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });
}
