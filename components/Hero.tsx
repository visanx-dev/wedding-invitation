"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Calendar, MapPin, Heart } from "lucide-react";
import { useWedding } from "@/context/WeddingContext";
import { BotanicalDivider } from "./BotanicalDivider";

export function Hero() {
  const { wedding, inviteScope } = useWedding();
  const scrollToContent = (id: string = "countdown") => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between items-center text-center px-4 py-8 sm:py-12 overflow-hidden bg-[#102119]">
      {/* Background Editorial Couple Image with Luxury Vignette */}
      <div className="absolute inset-0 z-0" style={{ position: "absolute" }}>
        <Image
          src={wedding.meta.ogImage || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=90"}
          alt={`${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} wedding celebration`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 animate-pulse-subtle filter brightness-[0.45] contrast-[1.08]"
        />
        {/* Multi-layered luxury gradient overlay for immaculate text contrast and depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#102119]/80 via-[#102119]/60 to-[#102119]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(16,33,25,0.85)_100%)]" />
      </div>

      {/* Subtle Fine Gold Border Frame */}
      <div className="absolute inset-3 sm:inset-6 z-10 border border-[#C5A880]/30 pointer-events-none rounded-sm transition-all duration-700">
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C5A880]" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C5A880]" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C5A880]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C5A880]" />
      </div>

      {/* Top Seal / Monogram */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 pt-4 sm:pt-6 flex flex-col items-center"
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#C5A880]/60 flex items-center justify-center bg-[#102119]/60 backdrop-blur-sm shadow-inner shadow-[#C5A880]/10">
          <span className="font-serif-luxury text-sm sm:text-base tracking-[0.2em] text-[#DFCDB7] pl-1 font-medium">
            {wedding.couple.monogram}
          </span>
        </div>
        <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#DFCDB7]/80 font-sans-luxury">
          Wedding Invitation
        </p>

        {inviteScope === "reception" && (
          <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2]/10 backdrop-blur-xs border border-[#C5A880]/40 text-[#DFCDB7] text-[10px] uppercase tracking-[0.2em] font-sans-luxury">
            ✦ Evening Reception &amp; Dinner Guest ✦
          </span>
        )}
        {inviteScope === "ceremony" && (
          <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2]/10 backdrop-blur-xs border border-[#C5A880]/40 text-[#DFCDB7] text-[10px] uppercase tracking-[0.2em] font-sans-luxury">
            ✦ Sacred Morning Ceremony Guest ✦
          </span>
        )}
      </motion.div>

      {/* Main Invitation Typography */}
      <div className="relative z-20 max-w-3xl mx-auto my-auto py-8 sm:py-12 flex flex-col items-center">
        {/* Preamble */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-xs sm:text-sm md:text-base uppercase tracking-[0.28em] text-[#DFCDB7] font-sans-luxury font-light"
        >
          {wedding.couple.invitationPreamble}
        </motion.p>

        {/* Botanical Crest Accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="my-3 sm:my-4"
        >
          <BotanicalDivider variant="crest" color="#DFCDB7" className="my-1" />
        </motion.div>

        {/* Couple Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="py-2"
        >
          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#FAF7F2] font-normal leading-[1.08] drop-shadow-md">
            <span className="inline-block hover:text-[#DFCDB7] transition-colors duration-300">
              {wedding.couple.groom.firstName}
            </span>
            <span className="font-script-luxury text-3xl sm:text-5xl md:text-6xl text-[#DFCDB7] mx-3 sm:mx-5 font-normal align-middle">
              &
            </span>
            <span className="inline-block hover:text-[#DFCDB7] transition-colors duration-300">
              {wedding.couple.bride.firstName}
            </span>
          </h1>
        </motion.div>

        {/* Invitation phrase */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-[#FAF7F2]/90 font-serif-luxury italic tracking-wide max-w-lg px-4"
        >
          {wedding.couple.invitationTagline}
        </motion.p>

        {/* Date and Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-6 sm:mt-8 flex flex-col items-center gap-2"
        >
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
          
          <div className="flex items-center gap-2 text-xs sm:text-sm tracking-[0.25em] uppercase text-[#DFCDB7] font-sans-luxury font-medium mt-1">
            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{wedding.event.dayOfWeek.toUpperCase()}, {wedding.event.dateFormatted.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#FAF7F2]/80 font-sans-luxury tracking-[0.18em] uppercase">
            <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{wedding.event.displayLocation}</span>
          </div>

          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent mt-1" />
        </motion.div>

        {/* Action Buttons for Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => scrollToContent("rsvp")}
            className="px-6 py-2.5 rounded-sm bg-[#C5A880] text-[#102119] text-xs font-sans-luxury uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:bg-[#DFCDB7] hover:shadow-lg hover:shadow-[#C5A880]/20 active:scale-95 flex items-center gap-2"
          >
            <Heart className="w-3.5 h-3.5 fill-[#102119]" />
            <span>RSVP Now</span>
          </button>
          <button
            onClick={() => scrollToContent("details")}
            className="px-6 py-2.5 rounded-sm border border-[#C5A880]/70 text-[#DFCDB7] text-xs font-sans-luxury uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:bg-[#FAF7F2]/10 backdrop-blur-xs active:scale-95"
          >
            Event Details
          </button>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="relative z-20 pb-2 sm:pb-4 flex flex-col items-center cursor-pointer select-none"
        onClick={() => scrollToContent("countdown")}
        role="button"
        tabIndex={0}
        aria-label="Scroll to invitation details"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#DFCDB7]/80 font-sans-luxury mb-1">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-[#C5A880]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
