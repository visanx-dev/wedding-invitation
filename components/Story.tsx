"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWedding } from "@/context/WeddingContext";
import { BotanicalDivider } from "./BotanicalDivider";

export function Story() {
  const { wedding } = useWedding();
  return (
    <section
      id="story"
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
            How Love Unfolded
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-2 text-3xl sm:text-5xl font-serif-luxury font-normal text-[#1A3026]"
          >
            {wedding.story.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-[#6B6862] font-serif-luxury italic max-w-xl mx-auto px-4"
          >
            &ldquo;{wedding.story.subtitle}&rdquo;
          </motion.p>

          <BotanicalDivider variant="crest" className="mt-6" />
        </div>

        {/* Romantic Quote Feature Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-16 sm:mb-20 p-8 sm:p-10 paper-card rounded-sm text-center relative"
        >
          <span className="font-serif-luxury text-6xl text-[#C5A880]/30 absolute top-2 left-4 select-none leading-none">
            &ldquo;
          </span>
          <p className="font-serif-luxury text-xl sm:text-2xl text-[#1A3026] italic leading-relaxed px-4">
            {wedding.story.quote}
          </p>
          <p className="mt-4 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C5A880] font-sans-luxury font-medium">
            — {wedding.story.author}
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative max-w-2xl mx-auto">
          {/* Subtle Vertical Gold Center Line */}
          <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[1px] bg-gradient-to-b from-[#C5A880]/20 via-[#C5A880]/60 to-[#C5A880]/20" />

          <div className="space-y-12 sm:space-y-16">
            {wedding.story.milestones.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Node Center Badge */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 top-0 z-10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-[#C5A880] bg-[#FAF7F2] flex items-center justify-center shadow-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1A3026]" />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`ml-14 sm:ml-0 w-[calc(100%-3.5rem)] sm:w-[calc(50%-2.5rem)] ${
                      isEven ? "sm:pr-4 sm:text-right" : "sm:pl-4 sm:text-left"
                    }`}
                  >
                    <div className="paper-card p-6 sm:p-7 rounded-sm transition-all duration-300 hover:border-[#C5A880] hover:shadow-md">
                      {/* Year badge */}
                      <span className="inline-block px-3 py-1 mb-2 text-xs font-serif-luxury font-medium tracking-widest text-[#C5A880] border border-[#C5A880]/40 rounded-full">
                        {item.year}
                      </span>

                      <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1A3026] font-normal">
                        {item.title}
                      </h3>

                      <p className="mt-2.5 text-xs sm:text-sm text-[#6B6862] leading-relaxed font-sans-luxury font-light">
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
