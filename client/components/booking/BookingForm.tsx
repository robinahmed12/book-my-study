"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarDays, Clock, DollarSign, FileText, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCreateBooking, useRoomAvailability } from "@/hooks/useQueries";
import { useAuth } from "@/providers/AuthProvider";
import type { Room } from "@/types";

const bookingSchema = z
  .object({
    date: z.string().min(1, "Please select a date"),
    startTime: z.string().min(1, "Please select a start time"),
    endTime: z.string().min(1, "Please select an end time"),
    note: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      const [sh, sm] = data.startTime.split(":").map(Number);
      const [eh, em] = data.endTime.split(":").map(Number);
      return eh * 60 + em > sh * 60 + sm;
    },
    { message: "End time must be after start time", path: ["endTime"] }
  );

type BookingFormValues = z.infer<typeof bookingSchema>;

const TIME_SLOTS = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7; // 7AM to 10PM
  const minute = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

interface BookingFormProps {
  room: Room;
}

export function BookingForm({ room }: BookingFormProps) {
  const { isAuthenticated, user } = useAuth();
  const createBooking = useCreateBooking();
  const [selectedDate, setSelectedDate] = useState("");
  const [totalCost, setTotalCost] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const watchDate = watch("date");
  const watchStart = watch("startTime");
  const watchEnd = watch("endTime");

  // Fetch booked slots for selected date
  const { data: availabilityData } = useRoomAvailability(
    room._id,
    watchDate || ""
  );
  const bookedSlots = availabilityData?.bookedSlots || [];

  // Calculate total cost
  useEffect(() => {
    if (watchStart && watchEnd) {
      const [sh, sm] = watchStart.split(":").map(Number);
      const [eh, em] = watchEnd.split(":").map(Number);
      const durationMins = (eh * 60 + em) - (sh * 60 + sm);
      if (durationMins > 0) {
        const cost = (durationMins / 60) * room.hourlyRate;
        setTotalCost(parseFloat(cost.toFixed(2)));
      } else {
        setTotalCost(null);
      }
    } else {
      setTotalCost(null);
    }
  }, [watchStart, watchEnd, room.hourlyRate]);

  // Check if a time slot is booked
  function isTimeSlotBooked(time: string): boolean {
    return bookedSlots.some(
      (slot) => time >= slot.startTime && time < slot.endTime
    );
  }

  const today = format(new Date(), "yyyy-MM-dd");

  const onSubmit = async (data: BookingFormValues) => {
    await createBooking.mutateAsync({
      roomId: room._id,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      note: data.note,
    });
    reset();
    setTotalCost(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto">
          <CalendarDays className="w-6 h-6 text-primary-500" />
        </div>
        <h3 className="font-semibold">Sign in to book this room</h3>
        <p className="text-sm text-muted-foreground">
          Create an account or sign in to reserve this study space.
        </p>
        <a
          href="/auth/login"
          className="block w-full py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium text-center hover:bg-primary-600 transition-colors"
        >
          Sign in to Book
        </a>
      </div>
    );
  }

  if (user && room.ownerId === user._id) {
    return (
      <div className="bg-muted/50 border border-border rounded-2xl p-6 text-center">
        <p className="text-sm text-muted-foreground">
          This is your listing. You cannot book your own room.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 sticky top-24"
    >
      <div className="mb-5">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary-500">
            ${room.hourlyRate}
          </span>
          <span className="text-muted-foreground text-sm">/hour</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          No hidden fees. Free cancellation anytime.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Date picker */}
        <div>
          <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            Date
          </label>
          <input
            type="date"
            min={today}
            {...register("date")}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
          />
          {errors.date && (
            <p className="text-xs text-destructive mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Time selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              From
            </label>
            <select
              {...register("startTime")}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
            >
              <option value="">Select</option>
              {TIME_SLOTS.map((time) => {
                const booked = watchDate && isTimeSlotBooked(time);
                return (
                  <option key={time} value={time} disabled={!!booked}>
                    {time} {booked ? "✗" : ""}
                  </option>
                );
              })}
            </select>
            {errors.startTime && (
              <p className="text-xs text-destructive mt-1">{errors.startTime.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Until</label>
            <select
              {...register("endTime")}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
            >
              <option value="">Select</option>
              {TIME_SLOTS.map((time) => {
                const booked = watchDate && isTimeSlotBooked(time);
                return (
                  <option key={time} value={time} disabled={!!booked}>
                    {time} {booked ? "✗" : ""}
                  </option>
                );
              })}
            </select>
            {errors.endTime && (
              <p className="text-xs text-destructive mt-1">{errors.endTime.message}</p>
            )}
          </div>
        </div>

        {/* Booked slots indicator */}
        {watchDate && bookedSlots.length > 0 && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                Already booked on this date:
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                {bookedSlots.map((s) => `${s.startTime}–${s.endTime}`).join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Note */}
        <div>
          <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Note{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <textarea
            {...register("note")}
            placeholder="Purpose of booking, team size, etc."
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Cost summary */}
        {totalCost !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-xl bg-primary-500/5 border border-primary-500/20"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                Total cost
              </span>
              <span className="font-bold text-primary-500 text-base">
                ${totalCost}
              </span>
            </div>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={createBooking.isPending}
          className="w-full py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary-500/25"
        >
          {createBooking.isPending ? "Booking..." : "Book Now"}
        </button>
      </form>
    </motion.div>
  );
}
