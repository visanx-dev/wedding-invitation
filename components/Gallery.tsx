"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useWedding } from "@/context/WeddingContext";
import { BotanicalDivider } from "./BotanicalDivider";

export function Gallery() {
  const { wedding } = useWedding();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const photos = wedding.gallery;

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === 0 ? photos.length - 1 : prev - 1
    );
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === photos.length - 1 ? 0 : prev + 1
    );
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedIndex]);

  return (
    <section
      id="gallery"
      className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF7F2] text-[#1A3026] overflow-hidden border-t border-[#C5A880]/20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-sans-luxury font-medium"
          >
            Memories in Frame
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-2 text-3xl sm:text-5xl font-serif-luxury font-normal text-[#1A3026]"
          >
            Cherished Moments
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-xs sm:text-sm text-[#6B6862] font-serif-luxury italic max-w-lg mx-auto"
          >
            Snapshots of our journey, captured with laughter, tenderness, and love
          </motion.p>

          <BotanicalDivider variant="crest" className="mt-6" />
        </div>

        {/* Editorial Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {photos.map((photo, index) => {
            // Apply varied editorial spans for visual interest
            const isFeatured = index === 0 || index === 7;
            const aspectClass =
              photo.aspect === "tall"
                ? "aspect-[3/4]"
                : photo.aspect === "wide"
                ? "aspect-[4/3]"
                : "aspect-square";

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                className={`relative group cursor-pointer overflow-hidden rounded-xs paper-card ${aspectClass} ${
                  isFeatured ? "sm:col-span-1 lg:col-span-1" : ""
                }`}
                style={{ position: "relative" }}
                onClick={() => handleOpen(index)}
                role="button"
                tabIndex={0}
                aria-label={`View photo ${index + 1}: ${photo.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpen(index);
                  }
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle luxury overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#102119]/80 via-[#102119]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between text-[#FAF7F2]">
                    <div>
                      <p className="font-serif-luxury text-lg tracking-wide text-[#FAF7F2]">
                        {photo.title}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#DFCDB7] font-sans-luxury">
                        {photo.subtitle}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#102119]/60 border border-[#C5A880]/60 flex items-center justify-center text-[#DFCDB7]">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Subtle border highlight */}
                <div className="absolute inset-2 border border-[#C5A880]/0 group-hover:border-[#C5A880]/40 transition-colors duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#102119]/95 backdrop-blur-md p-4 sm:p-8"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label="Photo Lightbox"
          >
            {/* Top Bar with Counter and Close Button */}
            <div
              className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between text-[#FAF7F2] max-w-5xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-sans-luxury text-xs sm:text-sm tracking-[0.2em] uppercase text-[#DFCDB7]">
                {selectedIndex + 1} / {photos.length}
              </div>

              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-[#102119]/80 border border-[#C5A880]/50 text-[#FAF7F2] hover:bg-[#C5A880] hover:text-[#102119] transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-full bg-[#102119]/70 border border-[#C5A880]/50 text-[#FAF7F2] hover:bg-[#C5A880] hover:text-[#102119] transition-all hover:scale-105 active:scale-95"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-full bg-[#102119]/70 border border-[#C5A880]/50 text-[#FAF7F2] hover:bg-[#C5A880] hover:text-[#102119] transition-all hover:scale-105 active:scale-95"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Main Image Container */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative max-w-4xl max-h-[80vh] w-full h-[70vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full" style={{ position: "relative" }}>
                <Image
                  src={photos[selectedIndex].src}
                  alt={photos[selectedIndex].title}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Photo Caption */}
              <div className="mt-4 text-center">
                <p className="font-serif-luxury text-xl sm:text-2xl text-[#FAF7F2]">
                  {photos[selectedIndex].title}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-[#DFCDB7] font-sans-luxury mt-0.5">
                  {photos[selectedIndex].subtitle}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
