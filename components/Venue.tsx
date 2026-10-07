"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Navigation, Car, Info, ExternalLink } from "lucide-react";
import { useWedding } from "@/context/WeddingContext";
import { BotanicalDivider, BotanicalCorner } from "./BotanicalDivider";

export function Venue() {
  const { wedding, inviteScope } = useWedding();
  const [selectedVenueTab, setSelectedVenueTab] = React.useState<"ceremony" | "reception">(
    inviteScope === "reception" ? "reception" : "ceremony"
  );

  React.useEffect(() => {
    if (inviteScope === "reception") setSelectedVenueTab("reception");
    if (inviteScope === "ceremony") setSelectedVenueTab("ceremony");
  }, [inviteScope]);

  const hasDistinctVenues =
    wedding.details?.ceremony?.venue &&
    wedding.details?.reception?.venue &&
    wedding.details.ceremony.venue !== wedding.details.reception.venue;

  const currentVenue =
    inviteScope === "reception"
      ? {
          name: wedding.details?.reception?.venue || wedding.venue.name,
          subname: wedding.details?.reception?.badge || "Evening Reception",
          address: wedding.details?.reception?.address || wedding.venue.address,
          city: wedding.details?.reception?.city || wedding.venue.city,
          description: wedding.details?.reception?.description || wedding.venue.description,
          mapsUrl: wedding.details?.reception?.mapsUrl || wedding.venue.mapsUrl,
          parkingNote: wedding.venue.parkingNote,
          valetNote: wedding.venue.valetNote,
          image: wedding.venue.image,
        }
      : inviteScope === "ceremony"
      ? {
          name: wedding.details?.ceremony?.venue || wedding.venue.name,
          subname: wedding.details?.ceremony?.badge || "Sacred Ceremony",
          address: wedding.details?.ceremony?.address || wedding.venue.address,
          city: wedding.details?.ceremony?.city || wedding.venue.city,
          description: wedding.details?.ceremony?.description || wedding.venue.description,
          mapsUrl: wedding.details?.ceremony?.mapsUrl || wedding.venue.mapsUrl,
          parkingNote: wedding.venue.parkingNote,
          valetNote: wedding.venue.valetNote,
          image: wedding.venue.image,
        }
      : selectedVenueTab === "reception"
      ? {
          name: wedding.details?.reception?.venue || wedding.venue.name,
          subname: "Place 2 &bull; " + (wedding.details?.reception?.badge || "Evening Reception"),
          address: wedding.details?.reception?.address || wedding.venue.address,
          city: wedding.details?.reception?.city || wedding.venue.city,
          description: wedding.details?.reception?.description || wedding.venue.description,
          mapsUrl: wedding.details?.reception?.mapsUrl || wedding.venue.mapsUrl,
          parkingNote: wedding.venue.parkingNote,
          valetNote: wedding.venue.valetNote,
          image: wedding.venue.image,
        }
      : {
          name: wedding.details?.ceremony?.venue || wedding.venue.name,
          subname: "Place 1 &bull; " + (wedding.details?.ceremony?.badge || "Morning Ceremony"),
          address: wedding.details?.ceremony?.address || wedding.venue.address,
          city: wedding.details?.ceremony?.city || wedding.venue.city,
          description: wedding.details?.ceremony?.description || wedding.venue.description,
          mapsUrl: wedding.details?.ceremony?.mapsUrl || wedding.venue.mapsUrl,
          parkingNote: wedding.venue.parkingNote,
          valetNote: wedding.venue.valetNote,
          image: wedding.venue.image,
        };

  return (
    <section
      id="venue"
      className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF7F2] text-[#1A3026] overflow-hidden border-t border-[#C5A880]/20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-sans-luxury font-medium"
          >
            The Destination
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-2 text-3xl sm:text-5xl font-serif-luxury font-normal text-[#1A3026]"
          >
            {inviteScope === "reception"
              ? "Reception Venue"
              : inviteScope === "ceremony"
              ? "Ceremony Venue"
              : "Wedding Venues"}
          </motion.h2>

          <BotanicalDivider variant="crest" className="mt-6" />

          {/* Place Switcher when guest is invited to both events */}
          {inviteScope === "all" && (
            <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedVenueTab("ceremony")}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all cursor-pointer ${
                  selectedVenueTab === "ceremony"
                    ? "bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                    : "bg-white text-[#6B6862] hover:text-[#1A3026] border border-[#C5A880]/30"
                }`}
              >
                Place 1: Ceremony Venue
              </button>
              <button
                onClick={() => setSelectedVenueTab("reception")}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all cursor-pointer ${
                  selectedVenueTab === "reception"
                    ? "bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                    : "bg-white text-[#6B6862] hover:text-[#1A3026] border border-[#C5A880]/30"
                }`}
              >
                Place 2: Reception Venue
              </button>
            </div>
          )}
        </div>

        {/* Venue Showcase Card */}
        <div className="paper-card rounded-sm overflow-hidden relative">
          <BotanicalCorner className="absolute top-2 left-2 z-10" />
          <BotanicalCorner className="absolute bottom-2 right-2 z-10" flipX flipY />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Venue Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative lg:col-span-6 h-72 sm:h-96 lg:h-auto min-h-[320px] overflow-hidden"
              style={{ position: "relative" }}
            >
              <Image
                src={currentVenue.image}
                alt={currentVenue.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102119]/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 text-[#FAF7F2] lg:hidden">
                <span
                  className="text-xs uppercase tracking-[0.2em] text-[#DFCDB7] font-sans-luxury"
                  dangerouslySetInnerHTML={{ __html: currentVenue.subname }}
                />
                <p className="font-serif-luxury text-2xl">{currentVenue.name}</p>
              </div>
            </motion.div>

            {/* Venue Details & Map Preview */}
            <div className="p-8 sm:p-12 lg:col-span-6 flex flex-col justify-between">
              <div>
                <span
                  className="hidden lg:inline-block text-[11px] uppercase tracking-[0.25em] text-[#C5A880] font-sans-luxury font-medium"
                  dangerouslySetInnerHTML={{ __html: currentVenue.subname }}
                />

                <h3 className="hidden lg:block text-3xl sm:text-4xl font-serif-luxury text-[#1A3026] mt-1 mb-3">
                  {currentVenue.name}
                </h3>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1A3026] font-medium font-sans-luxury mb-4">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span>
                    {currentVenue.address}, {currentVenue.city}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#6B6862] font-sans-luxury font-light leading-relaxed mb-6">
                  {currentVenue.description}
                </p>

                {/* Logistics Notes */}
                <div className="space-y-3 p-4 bg-[#FAF7F2] border border-[#C5A880]/30 rounded-xs mb-6 text-xs text-[#6B6862] font-sans-luxury">
                  <div className="flex items-start gap-2.5">
                    <Car className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                    <span>{currentVenue.parkingNote}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Info className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                    <span>{currentVenue.valetNote}</span>
                  </div>
                </div>

                {/* Stylized Interactive Map Preview */}
                <div className="relative w-full h-36 rounded-xs overflow-hidden border border-[#C5A880]/40 group mb-6 bg-[#1A3026]">
                  <iframe
                    key={currentVenue.name}
                    title="Venue Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, filter: "contrast(1.05) opacity(0.85)" }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      currentVenue.name + " " + currentVenue.address
                    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    loading="lazy"
                    className="w-full h-full pointer-events-none group-hover:pointer-events-auto"
                  />
                  <div className="absolute top-2 right-2 bg-[#FAF7F2]/90 backdrop-blur-xs px-2.5 py-1 rounded-xs text-[10px] font-sans-luxury uppercase tracking-wider text-[#1A3026] border border-[#C5A880]/40 flex items-center gap-1 pointer-events-none">
                    <Navigation className="w-3 h-3 text-[#C5A880]" />
                    <span>Live GPS Location</span>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <div>
                <a
                  href={currentVenue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 rounded-sm bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] text-xs uppercase tracking-[0.2em] font-medium font-sans-luxury transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm active:scale-[0.99]"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  <span>Get Directions to {currentVenue.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
