"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Star,
  CheckCircle,
  ChevronLeft,
  User,
  Calendar,
} from "lucide-react";
import { useRoom } from "@/hooks/useQueries";
import { BookingForm } from "@/components/booking/BookingForm";
import { format } from "date-fns";

interface Props {
  id: string;
}

export function RoomDetailClient({ id }: Props) {
  const { data, isLoading, error } = useRoom(id);
  const room = data?.room;

  if (isLoading) {
    return (
      <div className="section-container py-10">
        <div className="skeleton h-8 w-48 rounded-lg mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton rounded-2xl h-80 w-full" />
            <div className="skeleton h-6 w-2/3 rounded-lg" />
            <div className="skeleton h-4 w-full rounded-lg" />
            <div className="skeleton h-4 w-4/5 rounded-lg" />
          </div>
          <div className="skeleton rounded-2xl h-80 w-full" />
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="section-container py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">Room not found</h2>
        <p className="text-muted-foreground mb-6">
          This room may have been removed or doesn&apos;t exist.
        </p>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Browse All Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/20">
        <div className="section-container py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/rooms" className="hover:text-foreground transition-colors">Rooms</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{room.roomName}</span>
          </nav>
        </div>
      </div>

      <div className="section-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — Details */}
          <div className="lg:col-span-2">
            {/* Main image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-8"
            >
              <Image
                src={room.image}
                alt={room.roomName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {room.bookingCount > 0 && (
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  Booked {room.bookingCount} times
                </div>
              )}
            </motion.div>

            {/* Room header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <h1 className="text-2xl font-bold">{room.roomName}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Floor {room.floor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> Up to {room.capacity} people
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="font-semibold text-lg mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/30"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room details */}
            <div className="mb-8 p-5 rounded-2xl bg-muted/30 border border-border">
              <h2 className="font-semibold text-lg mb-4">Room Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {[
                  { label: "Floor", value: `Floor ${room.floor}` },
                  { label: "Capacity", value: `${room.capacity} people` },
                  { label: "Hourly Rate", value: `$${room.hourlyRate}/hr` },
                  { label: "Total Bookings", value: `${room.bookingCount}` },
                  {
                    label: "Listed On",
                    value: format(new Date(room.createdAt), "MMM d, yyyy"),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner info */}
            {room.owner && (
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center overflow-hidden border border-border flex-shrink-0">
                  {room.owner.photoURL ? (
                    <Image
                      src={room.owner.photoURL}
                      alt={room.owner.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-primary-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Listed by</p>
                  <p className="font-semibold">{room.owner.name}</p>
                  <p className="text-sm text-muted-foreground">{room.owner.email}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {format(new Date(room.createdAt), "yyyy")}
                </div>
              </div>
            )}
          </div>

          {/* Right — Booking form */}
          <div>
            <BookingForm room={room} />
          </div>
        </div>
      </div>
    </div>
  );
}
