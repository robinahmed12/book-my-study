"use client";

import { useState, useCallback } from "react";
import { useRooms } from "@/hooks/useQueries";
import { RoomCard, RoomCardSkeleton } from "@/components/rooms/RoomCard";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Metadata } from "next";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "capacity_asc", label: "Capacity: Small to Large" },
  { value: "capacity_desc", label: "Capacity: Large to Small" },
];

export default function RoomsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useRooms({
    search,
    sort,
    minRate,
    maxRate,
    capacity,
    page,
    limit: 9,
  });

  const rooms = data?.rooms || [];
  const pagination = data?.pagination;

  const clearFilters = () => {
    setMinRate("");
    setMaxRate("");
    setCapacity("");
    setPage(1);
  };

  const hasActiveFilters = minRate || maxRate || capacity;

  const handleSearch = useCallback(
    (val: string) => {
      setSearch(val);
      setPage(1);
    },
    []
  );

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-b from-muted/50 to-background pt-10 pb-8 border-b border-border">
        <div className="section-container">
          <h1 className="text-3xl font-bold mb-2">Browse Study Rooms</h1>
          <p className="text-muted-foreground">
            {pagination?.total
              ? `${pagination.total} rooms available`
              : "Finding available rooms..."}
          </p>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Search + Controls bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search rooms, amenities..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 min-w-[180px]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              hasActiveFilters
                ? "border-primary-500 text-primary-500 bg-primary-500/5"
                : "border-border hover:bg-muted"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                {[minRate, maxRate, capacity].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Expandable filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 rounded-xl border border-border bg-muted/30 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Min Rate ($/hr)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minRate}
                      onChange={(e) => { setMinRate(e.target.value); setPage(1); }}
                      className="w-28 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Max Rate ($/hr)</label>
                    <input
                      type="number"
                      placeholder="999"
                      value={maxRate}
                      onChange={(e) => { setMaxRate(e.target.value); setPage(1); }}
                      className="w-28 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Min Capacity</label>
                    <input
                      type="number"
                      placeholder="1"
                      value={capacity}
                      onChange={(e) => { setCapacity(e.target.value); setPage(1); }}
                      className="w-28 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <RoomCardSkeleton key={i} />)}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-2">🔍</p>
            <h3 className="font-semibold text-lg mb-2">No rooms found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={() => { setSearch(""); clearFilters(); }}
              className="mt-4 px-4 py-2 rounded-lg text-sm border border-border hover:bg-muted transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, index) => (
                <RoomCard key={room._id} room={room} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === pageNum
                          ? "bg-primary-500 text-white"
                          : "border border-border hover:bg-muted"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={!pagination.hasNext}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
