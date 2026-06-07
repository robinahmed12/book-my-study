"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  DollarSign,
  MapPin,
  FileText,
  XCircle,
} from "lucide-react";
import { useMyBookings, useCancelBooking } from "@/hooks/useQueries";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import type { Booking } from "@/types";
import Image from "next/image";

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    className: "badge-confirmed",
  },
  cancelled: {
    label: "Cancelled",
    className: "badge-cancelled",
  },
  pending: {
    label: "Pending",
    className: "badge-pending",
  },
};

const FILTER_TABS = [
  { value: "", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MyBookingsPage() {
  const { isLoading: authLoading } = useProtectedRoute();
  const [statusFilter, setStatusFilter] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data, isLoading } = useMyBookings({
    status: statusFilter || undefined,
  });
  const cancelBooking = useCancelBooking();

  const bookings = data?.bookings || [];

  const handleCancel = async (booking: Booking) => {
    if (cancellingId) return;
    const confirmed = window.confirm(
      `Cancel booking for "${booking.roomName}" on ${booking.date}?`
    );
    if (!confirmed) return;
    setCancellingId(booking._id);
    await cancelBooking.mutateAsync(booking._id);
    setCancellingId(null);
  };

  const isCancellable = (booking: Booking) => {
    if (booking.status !== "confirmed") return false;
    const bookingTime = new Date(`${booking.date}T${booking.startTime}`);
    return bookingTime > new Date();
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-muted/20">
        <div className="section-container py-6">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your room reservations
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Status filter tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-xl w-fit">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
                <div className="skeleton w-24 h-20 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="skeleton h-5 w-1/2 rounded" />
                  <div className="skeleton h-4 w-1/3 rounded" />
                  <div className="skeleton h-4 w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No bookings yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              {statusFilter
                ? `No ${statusFilter} bookings found.`
                : "Start by browsing and booking a study room."}
            </p>
            <a
              href="/rooms"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors text-sm"
            >
              Browse Rooms
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => {
              const statusCfg = STATUS_CONFIG[booking.status];
              const cancellable = isCancellable(booking);

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row gap-4"
                >
                  {/* Room image */}
                  <div className="relative w-full sm:w-24 h-32 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={booking.roomImage || "/placeholder-room.jpg"}
                      alt={booking.roomName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Booking details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold truncate">{booking.roomName}</h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusCfg.className}`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {format(new Date(booking.date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.startTime} – {booking.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        ${booking.totalCost} total
                      </span>
                    </div>

                    {booking.note && (
                      <p className="text-xs text-muted-foreground flex items-start gap-1">
                        <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {booking.note}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 sm:items-end justify-end">
                    {cancellable && (
                      <button
                        onClick={() => handleCancel(booking)}
                        disabled={cancellingId === booking._id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {cancellingId === booking._id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                    <a
                      href={`/rooms/${booking.roomId}`}
                      className="px-3 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-colors text-center"
                    >
                      View Room
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
