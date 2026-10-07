"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { useWedding } from "@/context/WeddingContext";

export function FloatingNav() {
  const { wedding } = useWedding();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal after scrolling past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Story", target: "story" },
    { label: "Details", target: "details" },
    { label: "Timeline", target: "timeline" },
    { label: "Venue", target: "venue" },
    { label: "Dress Code", target: "dress-code" },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#C5A880]/30 transition-all shadow-xs"
        >
          <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
            {/* Monogram Brand */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 group cursor-pointer"
              aria-label="Scroll to top"
            >
              <div className="w-8 h-8 rounded-full border border-[#C5A880] flex items-center justify-center bg-[#1A3026] text-[#DFCDB7] text-xs font-serif-luxury font-medium">
                {wedding.couple.monogram}
              </div>
              <span className="font-serif-luxury text-base sm:text-lg text-[#1A3026] font-normal tracking-wide group-hover:text-[#C5A880] transition-colors">
                {wedding.couple.groom.firstName} &amp; {wedding.couple.bride.firstName}
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((item) => (
                <button
                  key={item.target}
                  onClick={() => scrollTo(item.target)}
                  className="text-xs uppercase tracking-[0.18em] font-sans-luxury text-[#1A3026]/80 hover:text-[#C5A880] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Quick Actions (RSVP button & mobile toggle) */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => scrollTo("rsvp")}
                className="px-4 py-1.5 rounded-sm bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] text-[11px] uppercase tracking-[0.18em] font-sans-luxury font-medium transition-all duration-300 flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
              >
                <Heart className="w-3 h-3 fill-[#C5A880] text-[#C5A880]" />
                <span>RSVP</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 md:hidden text-[#1A3026] rounded-xs hover:bg-[#C5A880]/10 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#1A3026]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#1A3026]" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-[#FAF7F2] border-b border-[#C5A880]/30 px-6 py-4 space-y-3"
              >
                {navLinks.map((item) => (
                  <button
                    key={item.target}
                    onClick={() => scrollTo(item.target)}
                    className="block w-full text-left py-2 text-xs uppercase tracking-[0.2em] font-sans-luxury text-[#1A3026] hover:text-[#C5A880] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
