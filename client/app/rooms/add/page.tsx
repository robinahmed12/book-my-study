"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, X, Image as ImageIcon, DollarSign, Users, Building } from "lucide-react";
import { useCreateRoom } from "@/hooks/useQueries";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

const schema = z.object({
  roomName: z.string().min(3, "At least 3 characters").max(100),
  description: z.string().min(20, "At least 20 characters").max(1000),
  image: z.string().url("Must be a valid image URL"),
  floor: z.string().min(1, "Required"),
  capacity: z.coerce.number().int().min(1).max(100),
  hourlyRate: z.coerce.number().positive().max(10000),
});

type FormValues = z.infer<typeof schema>;

const SUGGESTED_AMENITIES = [
  "WiFi", "Whiteboard", "AC", "Projector", "TV", "Power Outlets",
  "Standing Desk", "Natural Light", "Private", "Soundproof",
  "Video Conferencing", "Coffee Machine",
];

export default function AddRoomPage() {
  const { isLoading: authLoading } = useProtectedRoute();
  const createRoom = useCreateRoom();
  const router = useRouter();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [amenityError, setAmenityError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const imageUrl = watch("image");

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
    setAmenityError("");
  };

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
      setCustomAmenity("");
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (amenities.length === 0) {
      setAmenityError("Please select at least one amenity");
      return;
    }
    await createRoom.mutateAsync({ ...data, amenities });
    router.push("/dashboard/my-listings");
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b border-border bg-background">
        <div className="section-container py-6">
          <h1 className="text-2xl font-bold">List a Study Room</h1>
          <p className="text-muted-foreground mt-1">
            Share your study space with the StudyNook community.
          </p>
        </div>
      </div>

      <div className="section-container py-10">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 space-y-5"
            >
              <h2 className="font-semibold text-lg">Basic Information</h2>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Room Name *</label>
                <input
                  {...register("roomName")}
                  placeholder="e.g., Quiet Focus Room 3A"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                />
                {errors.roomName && <p className="text-xs text-destructive mt-1">{errors.roomName.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Description *</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Describe your study room — environment, rules, best use cases..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors resize-none"
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
              </div>
            </motion.div>

            {/* Image Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-card border border-border rounded-2xl p-6 space-y-4"
            >
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                Room Photo
              </h2>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Image URL *</label>
                <input
                  {...register("image")}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                />
                {errors.image && <p className="text-xs text-destructive mt-1">{errors.image.message}</p>}
              </div>
              {imageUrl && (
                <div className="relative h-40 rounded-xl overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </motion.div>

            {/* Room Specs Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 space-y-5"
            >
              <h2 className="font-semibold text-lg">Room Specs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5 block">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    Floor *
                  </label>
                  <input
                    {...register("floor")}
                    placeholder="e.g., 2, Ground, B1"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                  />
                  {errors.floor && <p className="text-xs text-destructive mt-1">{errors.floor.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5 block">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Capacity *
                  </label>
                  <input
                    type="number"
                    {...register("capacity")}
                    placeholder="e.g., 4"
                    min={1}
                    max={100}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                  />
                  {errors.capacity && <p className="text-xs text-destructive mt-1">{errors.capacity.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5 block">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    Hourly Rate *
                  </label>
                  <input
                    type="number"
                    {...register("hourlyRate")}
                    placeholder="e.g., 15"
                    min={1}
                    step="0.01"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                  />
                  {errors.hourlyRate && <p className="text-xs text-destructive mt-1">{errors.hourlyRate.message}</p>}
                </div>
              </div>
            </motion.div>

            {/* Amenities Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="font-semibold text-lg mb-4">Amenities *</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTED_AMENITIES.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      amenities.includes(amenity)
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "border-border hover:border-primary-500/50 hover:bg-muted"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>

              {/* Custom amenity input */}
              <div className="flex gap-2">
                <input
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())}
                  placeholder="Add custom amenity..."
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={addCustomAmenity}
                  className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 border border-border transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {amenities.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-medium"
                    >
                      {a}
                      <button type="button" onClick={() => toggleAmenity(a)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {amenityError && <p className="text-xs text-destructive mt-2">{amenityError}</p>}
            </motion.div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || createRoom.isPending}
              className="w-full py-3.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-primary-500/25"
            >
              {createRoom.isPending ? "Creating Listing..." : "Publish Room Listing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
