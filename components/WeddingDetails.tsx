"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  CalendarPlus,
  Check,
  Sparkles,
  Info,
  Users,
  Compass,
} from "lucide-react";
import { useWedding } from "@/context/WeddingContext";
import { BotanicalDivider, BotanicalCorner } from "./BotanicalDivider";
import { generateIcsCalendar } from "@/lib/utils";

export function WeddingDetails() {
  const { wedding, inviteScope, setInviteScope } = useWedding();
  const [downloadedEvent, setDownloadedEvent] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"all" | "ceremony" | "reception">("all");

  // Sync with context inviteScope if set via URL (?invite=reception or ?invite=ceremony)
  useEffect(() => {
    if (inviteScope === "reception" || inviteScope === "ceremony") {
      setSelectedTab(inviteScope);
    }
  }, [inviteScope]);

  const isSeparable = wedding.details?.structure !== "single_combined";
  const isReceptionOnlyInvite = inviteScope === "reception";
  const isCeremonyOnlyInvite = inviteScope === "ceremony";

  const handleDownloadIcs = (type: "ceremony" | "reception") => {
    let dateObj = new Date(wedding.event.dateISO || "2026-12-18T10:00:00+05:30");
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date("2026-12-18T10:00:00+05:30");
    }
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const datePrefix = `${year}${month}${day}`;

    if (type === "ceremony") {
      generateIcsCalendar({
        title: `${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} - Wedding Ceremony`,
        description: wedding.details.ceremony.description,
        location: `${wedding.details.ceremony.venue}, ${wedding.details.ceremony.address}`,
        startDate: `${datePrefix}T043000Z`,
        endDate: `${datePrefix}T070000Z`,
        fileName: `${wedding.couple.groom.firstName}-${wedding.couple.bride.firstName}-Ceremony.ics`,
      });
    } else {
      generateIcsCalendar({
        title: `${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} - Wedding Reception`,
        description: wedding.details.reception.description,
        location: `${wedding.details.reception.venue}, ${wedding.details.reception.address}`,
        startDate: `${datePrefix}T130000Z`,
        endDate: `${datePrefix}T180000Z`,
        fileName: `${wedding.couple.groom.firstName}-${wedding.couple.bride.firstName}-Reception.ics`,
      });
    }

    setDownloadedEvent(type);
    setTimeout(() => setDownloadedEvent(null), 3000);
  };

  return (
    <section
      id="details"
      className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF7F2] text-[#1A3026] overflow-hidden border-t border-[#C5A880]/20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-sans-luxury font-medium"
          >
            Celebration Particulars
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-2 text-3xl sm:text-5xl font-serif-luxury font-normal text-[#1A3026]"
          >
            {isReceptionOnlyInvite
              ? "Evening Reception & Banquet"
              : isCeremonyOnlyInvite
              ? "Sacred Morning Ceremony"
              : "Wedding Details & Venues"}
          </motion.h2>

          <BotanicalDivider variant="crest" className="mt-6" />

          {/* Guest Scope Custom Notice Badge (for Reception-Only or Ceremony-Only invites) */}
          {isReceptionOnlyInvite && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#102119] text-[#DFCDB7] border border-[#C5A880]/50 shadow-md text-xs font-sans-luxury"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="font-medium tracking-wide">
                Special Invitation &bull; Cordially Invited to our Evening Reception &amp; Dinner
              </span>
            </motion.div>
          )}

          {isCeremonyOnlyInvite && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#102119] text-[#DFCDB7] border border-[#C5A880]/50 shadow-md text-xs font-sans-luxury"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="font-medium tracking-wide">
                Special Invitation &bull; Cordially Invited to our Sacred Morning Poruwa &amp; Blessings
              </span>
            </motion.div>
          )}

          {/* Event Filter Pills (When guest is invited to both events or host enables switcher) */}
          {isSeparable && !isReceptionOnlyInvite && !isCeremonyOnlyInvite && (
            <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedTab("all")}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all cursor-pointer ${
                  selectedTab === "all"
                    ? "bg-[#1A3026] text-[#FAF7F2] shadow-sm"
                    : "bg-white text-[#6B6862] hover:text-[#1A3026] border border-[#C5A880]/30"
                }`}
              >
                All Celebrations (2 Places)
              </button>
              <button
                onClick={() => setSelectedTab("ceremony")}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all cursor-pointer ${
                  selectedTab === "ceremony"
                    ? "bg-[#1A3026] text-[#FAF7F2] shadow-sm"
                    : "bg-white text-[#6B6862] hover:text-[#1A3026] border border-[#C5A880]/30"
                }`}
              >
                Morning Ceremony
              </button>
              <button
                onClick={() => setSelectedTab("reception")}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all cursor-pointer ${
                  selectedTab === "reception"
                    ? "bg-[#1A3026] text-[#FAF7F2] shadow-sm"
                    : "bg-white text-[#6B6862] hover:text-[#1A3026] border border-[#C5A880]/30"
                }`}
              >
                Evening Reception
              </button>
            </div>
          )}
        </div>

        {/* Ceremony & Reception Cards Grid */}
        <div
          className={`grid gap-8 sm:gap-10 ${
            selectedTab === "all" && !isReceptionOnlyInvite && !isCeremonyOnlyInvite
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 max-w-2xl mx-auto"
          }`}
        >
          {/* Ceremony Card (Rendered if tab is 'all' or 'ceremony', and not reception-only invite) */}
          {(selectedTab === "all" || selectedTab === "ceremony") &&
            !isReceptionOnlyInvite && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative paper-card rounded-sm p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-[#C5A880] hover:shadow-lg"
              >
                <BotanicalCorner className="absolute top-2 left-2" />
                <BotanicalCorner className="absolute bottom-2 right-2" flipX flipY />

                <div>
                  <div className="flex items-center justify-between border-b border-[#C5A880]/30 pb-4 mb-6">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-sans-luxury text-[#C5A880] font-medium">
                      {wedding.details.ceremony.badge}
                    </span>
                    <span className="font-serif-luxury text-sm italic text-[#6B6862]">
                      Morning &bull; Place 1
                    </span>
                  </div>

                  <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1A3026] font-normal mb-3">
                    {wedding.details.ceremony.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B6862] font-sans-luxury font-light leading-relaxed mb-6">
                    {wedding.details.ceremony.description}
                  </p>

                  <div className="space-y-4 py-4 border-y border-[#C5A880]/20 text-xs sm:text-sm font-sans-luxury">
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-[#1A3026] block">
                          {wedding.details.ceremony.time}
                        </span>
                        <span className="text-[#6B6862] text-[11px]">
                          Auspicious ceremony begins promptly
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-[#1A3026] block">
                          {wedding.event.dayOfWeek}, {wedding.event.dateFormatted}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-[#1A3026] block">
                          {wedding.details.ceremony.venue}
                        </span>
                        <span className="text-[#6B6862] text-xs">
                          {wedding.details.ceremony.address}, {wedding.details.ceremony.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDownloadIcs("ceremony")}
                    className="flex-1 py-2.5 px-4 rounded-sm border border-[#C5A880] text-[#1A3026] hover:bg-[#C5A880] hover:text-[#102119] text-xs uppercase tracking-[0.16em] font-medium font-sans-luxury transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {downloadedEvent === "ceremony" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Added to Calendar</span>
                      </>
                    ) : (
                      <>
                        <CalendarPlus className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Add to Calendar</span>
                      </>
                    )}
                  </button>

                  <a
                    href={wedding.details.ceremony.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-sm bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] text-xs uppercase tracking-[0.16em] font-medium font-sans-luxury transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Directions &amp; Map</span>
                    <ExternalLink className="w-3 h-3 text-[#C5A880]" />
                  </a>
                </div>
              </motion.div>
            )}

          {/* Reception Card (Rendered if tab is 'all' or 'reception', and not ceremony-only invite) */}
          {(selectedTab === "all" || selectedTab === "reception") &&
            !isCeremonyOnlyInvite && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative paper-card rounded-sm p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:border-[#C5A880] hover:shadow-lg"
              >
                <BotanicalCorner className="absolute top-2 left-2" />
                <BotanicalCorner className="absolute bottom-2 right-2" flipX flipY />

                <div>
                  <div className="flex items-center justify-between border-b border-[#C5A880]/30 pb-4 mb-6">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-sans-luxury text-[#C5A880] font-medium">
                      {wedding.details.reception.badge}
                    </span>
                    <span className="font-serif-luxury text-sm italic text-[#6B6862]">
                      Evening &bull; Place 2
                    </span>
                  </div>

                  <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1A3026] font-normal mb-3">
                    {wedding.details.reception.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B6862] font-sans-luxury font-light leading-relaxed mb-6">
                    {wedding.details.reception.description}
                  </p>

                  <div className="space-y-4 py-4 border-y border-[#C5A880]/20 text-xs sm:text-sm font-sans-luxury">
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-[#1A3026] block">
                          {wedding.details.reception.time}
                        </span>
                        <span className="text-[#6B6862] text-[11px]">
                          Cocktails, champagne toast &amp; banquet dinner
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-[#1A3026] block">
                          {wedding.event.dayOfWeek}, {wedding.event.dateFormatted}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-[#1A3026] block">
                          {wedding.details.reception.venue}
                        </span>
                        <span className="text-[#6B6862] text-xs">
                          {wedding.details.reception.address}, {wedding.details.reception.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDownloadIcs("reception")}
                    className="flex-1 py-2.5 px-4 rounded-sm border border-[#C5A880] text-[#1A3026] hover:bg-[#C5A880] hover:text-[#102119] text-xs uppercase tracking-[0.16em] font-medium font-sans-luxury transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {downloadedEvent === "reception" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Added to Calendar</span>
                      </>
                    ) : (
                      <>
                        <CalendarPlus className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Add to Calendar</span>
                      </>
                    )}
                  </button>

                  <a
                    href={wedding.details.reception.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-sm bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] text-xs uppercase tracking-[0.16em] font-medium font-sans-luxury transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Directions &amp; Map</span>
                    <ExternalLink className="w-3 h-3 text-[#C5A880]" />
                  </a>
                </div>
              </motion.div>
            )}
        </div>

        {/* Private Intimate Family Note (when a guest has Reception-Only invite) */}
        {isReceptionOnlyInvite && (
          <div className="mt-8 text-center max-w-lg mx-auto">
            <p className="text-xs text-[#6B6862] font-sans-luxury italic bg-white/70 p-3 rounded-xs border border-[#C5A880]/30">
              <Info className="w-3.5 h-3.5 text-[#C5A880] inline mr-1 -mt-0.5" />
              Note: The morning sacred Poruwa rites are held intimately for immediate family. We eagerly anticipate celebrating together at our grand Evening Reception!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
