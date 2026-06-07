"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Edit,
  Trash2,
  Users,
  DollarSign,
  MapPin,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { useMyListings, useDeleteRoom } from "@/hooks/useQueries";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import type { Room } from "@/types";

function DeleteConfirmModal({
  room,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  room: Room;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="font-semibold">Delete Room Listing</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">&quot;{room.roomName}&quot;</span>? This
          action cannot be undone and will cancel any upcoming bookings.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete Room"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function MyListingsPage() {
  const { isLoading: authLoading } = useProtectedRoute();
  const { data, isLoading } = useMyListings();
  const deleteRoom = useDeleteRoom();
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  const rooms = data?.rooms || [];

  const handleDelete = async () => {
    if (!deletingRoom) return;
    await deleteRoom.mutateAsync(deletingRoom._id);
    setDeletingRoom(null);
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-muted/20">
        <div className="section-container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Listings</h1>
              <p className="text-muted-foreground mt-1">
                {rooms.length} room{rooms.length !== 1 ? "s" : ""} listed
              </p>
            </div>
            <Link
              href="/rooms/add"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Room
            </Link>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="skeleton h-40 w-full" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No listings yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Share your study space and start earning today.
            </p>
            <Link
              href="/rooms/add"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="relative h-40">
                  <Image
                    src={room.image}
                    alt={room.roomName}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{room.roomName}</h3>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Floor {room.floor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {room.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> ${room.hourlyRate}/hr
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pt-3 border-t border-border">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {room.bookingCount} bookings
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/rooms/${room._id}`}
                      className="flex-1 py-2 rounded-lg border border-border text-xs font-medium text-center hover:bg-muted transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/rooms/${room._id}/edit`}
                      className="flex-1 py-2 rounded-lg bg-primary-500/10 text-primary-500 text-xs font-medium text-center hover:bg-primary-500/20 flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </Link>
                    <button
                      onClick={() => setDeletingRoom(room)}
                      className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs hover:bg-destructive/20 flex items-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {deletingRoom && (
          <DeleteConfirmModal
            room={deletingRoom}
            onConfirm={handleDelete}
            onCancel={() => setDeletingRoom(null)}
            isDeleting={deleteRoom.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
