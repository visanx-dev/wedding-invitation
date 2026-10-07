"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Shirt } from "lucide-react";
import { useWedding } from "@/context/WeddingContext";
import { BotanicalDivider, BotanicalCorner } from "./BotanicalDivider";

export function DressCode() {
  const { wedding } = useWedding();
  return (
    <section
      id="dress-code"
      className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF7F2] text-[#1A3026] overflow-hidden border-t border-[#C5A880]/20"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-sans-luxury font-medium"
          >
            Attire Inspiration
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-2 text-3xl sm:text-5xl font-serif-luxury font-normal text-[#1A3026]"
          >
            {wedding.dressCode.title}
          </motion.h2>

          <BotanicalDivider variant="crest" className="mt-6" />
        </div>

        {/* Center Presentation Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="paper-card rounded-sm p-8 sm:p-12 text-center relative max-w-2xl mx-auto"
        >
          <BotanicalCorner className="absolute top-2 left-2" />
          <BotanicalCorner className="absolute bottom-2 right-2" flipX flipY />

          <div className="w-12 h-12 mx-auto rounded-full border border-[#C5A880]/50 flex items-center justify-center mb-4 text-[#C5A880]">
            <Shirt className="w-6 h-6" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-sans-luxury font-medium block">
            {wedding.dressCode.subtitle}
          </span>

          <h3 className="text-3xl sm:text-4xl font-serif-luxury text-[#1A3026] my-2 font-normal">
            {wedding.dressCode.attire}
          </h3>

          <p className="text-xs sm:text-sm text-[#6B6862] font-sans-luxury font-light leading-relaxed max-w-lg mx-auto mt-4">
            {wedding.dressCode.description}
          </p>

          {/* Color Palette Swatches */}
          <div className="mt-8 pt-8 border-t border-[#C5A880]/20">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury block mb-4">
              Recommended Color Palette
            </span>

            <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
              {wedding.dressCode.palette.map((color) => (
                <div
                  key={color.name}
                  className="flex flex-col items-center gap-2 group cursor-default"
                >
                  <div
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-white shadow-xs transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                  <span className="text-[10px] tracking-wider text-[#6B6862] font-sans-luxury font-medium">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gentle Etiquette Notes */}
          <div className="mt-8 pt-6 border-t border-[#C5A880]/20 text-xs text-[#6B6862] font-sans-luxury space-y-2">
            {wedding.dressCode.notes.map((note, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="italic">{note}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
