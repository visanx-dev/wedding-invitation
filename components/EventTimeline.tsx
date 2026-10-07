"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Sparkles,
  Camera,
  GlassWater,
  UtensilsCrossed,
  Music,
} from "lucide-react";
import { wedding } from "@/data/wedding";
import { useWedding } from "@/context/WeddingContext";
import { BotanicalDivider } from "./BotanicalDivider";

export function EventTimeline() {
  const { wedding, inviteScope } = useWedding();
  const [activeFilter, setActiveFilter] = React.useState<"all" | "ceremony" | "reception">("all");

  React.useEffect(() => {
    if (inviteScope === "reception" || inviteScope === "ceremony") {
      setActiveFilter(inviteScope);
    }
  }, [inviteScope]);

  const isCeremonyItem = (item: (typeof wedding.timeline)[0], idx: number) => {
    return (
      item.icon === "arrival" ||
      item.icon === "ceremony" ||
      item.icon === "photos" ||
      item.time.toLowerCase().includes("am") ||
      idx < 3
    );
  };

  const isReceptionItem = (item: (typeof wedding.timeline)[0], idx: number) => {
    return (
      item.icon === "reception" ||
      item.icon === "dinner" ||
      item.icon === "party" ||
      item.time.toLowerCase().includes("pm") ||
      idx >= 3
    );
  };

  const filteredTimeline = wedding.timeline.filter((item, idx) => {
    if (activeFilter === "ceremony") return isCeremonyItem(item, idx);
    if (activeFilter === "reception") return isReceptionItem(item, idx);
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "arrival":
        return <Users className="w-4 h-4 text-[#C5A880]" />;
      case "ceremony":
        return <Sparkles className="w-4 h-4 text-[#C5A880]" />;
      case "photos":
        return <Camera className="w-4 h-4 text-[#C5A880]" />;
      case "reception":
        return <GlassWater className="w-4 h-4 text-[#C5A880]" />;
      case "dinner":
        return <UtensilsCrossed className="w-4 h-4 text-[#C5A880]" />;
      case "party":
        return <Music className="w-4 h-4 text-[#C5A880]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#C5A880]" />;
    }
  };

  return (
    <section
      id="timeline"
      className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF7F2] text-[#1A3026] overflow-hidden border-t border-[#C5A880]/20"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-sans-luxury font-medium"
          >
            Order of the Day
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-2 text-3xl sm:text-5xl font-serif-luxury font-normal text-[#1A3026]"
          >
            {inviteScope === "reception"
              ? "Reception Itinerary"
              : inviteScope === "ceremony"
              ? "Ceremony Itinerary"
              : "Event Itinerary"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-xs sm:text-sm text-[#6B6862] font-sans-luxury tracking-wide"
          >
            {wedding.event.dayOfWeek}, {wedding.event.dateFormatted} &bull; {wedding.event.displayLocation}
          </motion.p>

          <BotanicalDivider variant="crest" className="mt-6" />

          {/* Interactive Itinerary Filter (Only shown when guest is invited to both events) */}
          {inviteScope === "all" && (
            <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                    : "bg-white text-[#6B6862] hover:text-[#1A3026] border border-[#C5A880]/30"
                }`}
              >
                Full Day Program
              </button>
              <button
                onClick={() => setActiveFilter("ceremony")}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all cursor-pointer ${
                  activeFilter === "ceremony"
                    ? "bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                    : "bg-white text-[#6B6862] hover:text-[#1A3026] border border-[#C5A880]/30"
                }`}
              >
                Morning Ceremony
              </button>
              <button
                onClick={() => setActiveFilter("reception")}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all cursor-pointer ${
                  activeFilter === "reception"
                    ? "bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                    : "bg-white text-[#6B6862] hover:text-[#1A3026] border border-[#C5A880]/30"
                }`}
              >
                Evening Reception
              </button>
            </div>
          )}
        </div>

        {/* Timeline List */}
        <div className="relative max-w-2xl mx-auto">
          {/* Subtle connecting vertical line */}
          <div className="absolute left-[27px] sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[1px] bg-gradient-to-b from-[#C5A880]/20 via-[#C5A880]/70 to-[#C5A880]/20" />

          <div className="space-y-8 sm:space-y-12">
            {filteredTimeline.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={`${item.time}-${item.title}`}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Central Node Badge */}
                  <div className="absolute left-[27px] sm:left-1/2 -translate-x-1/2 top-1.5 z-10">
                    <div className="w-10 h-10 rounded-full border border-[#C5A880] bg-[#FAF7F2] flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-110">
                      {getIcon(item.icon)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div
                    className={`ml-16 sm:ml-0 w-[calc(100%-4rem)] sm:w-[calc(50%-2.5rem)] ${
                      isEven ? "sm:pr-6 sm:text-right" : "sm:pl-6 sm:text-left"
                    }`}
                  >
                    <div className="paper-card p-5 sm:p-6 rounded-sm transition-all duration-300 hover:border-[#C5A880] hover:shadow-md">
                      <div
                        className={`flex items-center gap-2 mb-1.5 ${
                          isEven ? "sm:justify-end" : "sm:justify-start"
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-sans-luxury font-medium tracking-[0.16em] text-[#C5A880]">
                          {item.time}
                        </span>
                      </div>

                      <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1A3026] font-normal">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-[#6B6862] leading-relaxed font-sans-luxury font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
