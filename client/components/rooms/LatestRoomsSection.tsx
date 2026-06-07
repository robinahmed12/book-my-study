"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLatestRooms } from "@/hooks/useQueries";
import { RoomCard, RoomCardSkeleton } from "./RoomCard";

export function LatestRoomsSection() {
  const { data, isLoading, error } = useLatestRooms();
  const rooms = data?.rooms || [];

  return (
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-primary-500 mb-2 uppercase tracking-wider">
              Featured
            </p>
            <h2 className="text-3xl font-bold">Latest Study Rooms</h2>
            <p className="text-muted-foreground mt-2">
              Freshly listed spaces ready to book today
            </p>
          </div>
          <Link
            href="/rooms"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors group"
          >
            View all rooms
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {error ? (
          <div className="text-center py-12 text-muted-foreground">
            Unable to load rooms. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <RoomCardSkeleton key={i} />
                ))
              : rooms.map((room, index) => (
                  <RoomCard key={room._id} room={room} index={index} />
                ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
          >
            Browse All Rooms
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
