"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWedding } from "@/context/WeddingContext";
import { BotanicalDivider } from "./BotanicalDivider";
import { ShareButton } from "./ShareButton";

export function Footer() {
  const { wedding } = useWedding();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-16 sm:py-20 px-4 bg-[#102119] text-[#FAF7F2] text-center overflow-hidden border-t border-[#C5A880]/30">
      {/* Decorative Top Flourish */}
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Monogram Seal */}
        <div
          onClick={scrollToTop}
          role="button"
          tabIndex={0}
          aria-label="Scroll to top of wedding invitation"
          className="w-14 h-14 rounded-full border border-[#C5A880]/60 flex items-center justify-center bg-[#1A3026] text-[#DFCDB7] cursor-pointer hover:border-[#C5A880] hover:scale-105 transition-all shadow-md group"
        >
          <span className="font-serif-luxury text-base tracking-[0.2em] pl-1 font-medium group-hover:text-[#FAF7F2] transition-colors">
            {wedding.couple.monogram}
          </span>
        </div>

        <BotanicalDivider variant="crest" color="#DFCDB7" className="my-6" />

        {/* Couple Greeting */}
        <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#FAF7F2] tracking-wide">
          With love, {wedding.couple.groom.firstName} &amp; {wedding.couple.bride.firstName}
        </h3>

        {/* Date Display */}
        <p className="mt-2 text-xs sm:text-sm uppercase tracking-[0.25em] text-[#DFCDB7] font-sans-luxury">
          {wedding.event.dateFormatted} &bull; {wedding.event.city}
        </p>

        {/* Wedding Hashtag */}
        <p className="mt-2 text-xs text-[#DFCDB7]/70 font-sans-luxury tracking-widest">
          {wedding.couple.hashtag}
        </p>

        {/* Share Action on Footer */}
        <div className="mt-8 mb-6">
          <ShareButton variant="inline" />
        </div>

        {/* Made with love notice */}
        <div className="pt-8 border-t border-[#C5A880]/20 w-full max-w-sm flex items-center justify-center gap-1.5 text-[11px] text-[#DFCDB7]/60 font-sans-luxury tracking-wider">
          <span>Made with love</span>
          <Heart className="w-3 h-3 text-[#C5A880] fill-[#C5A880]" />
          <span>for friends &amp; family</span>
        </div>

        {/* Discreet Developer / Agency Portal Link */}
        <div className="mt-4">
          <a
            href="/admin"
            className="text-[10px] text-[#DFCDB7]/30 hover:text-[#C5A880] transition-colors uppercase tracking-widest font-sans-luxury"
          >
            Agency Developer Portal &bull; RSVP Tracker
          </a>
        </div>
      </div>
    </footer>
  );
}
