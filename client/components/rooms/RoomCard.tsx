"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";
import type { Room } from "@/types";

interface RoomCardProps {
  room: Room;
  index?: number;
}

const AMENITY_COLORS: Record<string, string> = {
  WiFi: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Whiteboard: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  AC: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Projector: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  TV: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  default: "bg-muted text-muted-foreground",
};

export function RoomCard({ room, index = 0 }: RoomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
      <Link href={`/rooms/${room._id}`}>
        <div className="bg-card border border-border rounded-2xl overflow-hidden card-hover cursor-pointer h-full flex flex-col">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={room.image}
              alt={room.roomName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Floor badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Floor {room.floor}
            </div>

            {/* Booking count badge */}
            {room.bookingCount > 0 && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {room.bookingCount} booked
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary-500 transition-colors">
              {room.roomName}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
              {room.description}
            </p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {room.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                    AMENITY_COLORS[amenity] || AMENITY_COLORS.default
                  }`}
                >
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                  +{room.amenities.length - 3} more
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {room.capacity}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="font-bold text-primary-500">${room.hourlyRate}</span>
                  <span className="text-xs text-muted-foreground">/hr</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Skeleton Loader ─────────────────────────────────────────

export function RoomCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="skeleton h-48" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-2/3 rounded-lg" />
        <div className="flex gap-2 mt-2">
          <div className="skeleton h-6 w-16 rounded-md" />
          <div className="skeleton h-6 w-16 rounded-md" />
          <div className="skeleton h-6 w-16 rounded-md" />
        </div>
        <div className="mt-auto pt-4 border-t border-border flex justify-between">
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
