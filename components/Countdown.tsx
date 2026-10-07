"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWedding } from "@/context/WeddingContext";
import { formatNumberTwoDigits } from "@/lib/utils";
import { BotanicalDivider } from "./BotanicalDivider";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function Countdown() {
  const { wedding } = useWedding();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    function calculateTime() {
      const targetDate = new Date(wedding.event.dateISO).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [wedding.event.dateISO]);

  const timeUnits = [
    { label: "DAYS", value: timeLeft ? timeLeft.days : 0 },
    { label: "HOURS", value: timeLeft ? timeLeft.hours : 0 },
    { label: "MINUTES", value: timeLeft ? timeLeft.minutes : 0 },
    { label: "SECONDS", value: timeLeft ? timeLeft.seconds : 0 },
  ];

  return (
    <section
      id="countdown"
      className="relative py-16 sm:py-24 px-4 bg-[#FAF7F2] text-[#1A3026] overflow-hidden"
      suppressHydrationWarning
    >
      <div className="max-w-4xl mx-auto text-center" suppressHydrationWarning>
        {/* Subtle Section Tag */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-sans-luxury font-medium"
        >
          Counting Down to Forever
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-2 text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-normal text-[#1A3026]"
        >
          {wedding.event.dateFormatted}
        </motion.h2>

        <BotanicalDivider variant="crest" className="my-6" />

        {timeLeft?.isPast ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 px-6 max-w-lg mx-auto paper-card rounded-sm"
          >
            <p className="font-script-luxury text-4xl sm:text-5xl text-[#C5A880] mb-2">
              With all our hearts
            </p>
            <p className="font-serif-luxury text-2xl sm:text-3xl text-[#1A3026] tracking-wide">
              Today we celebrate love.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-xl mx-auto mt-6" suppressHydrationWarning>
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
                suppressHydrationWarning
              >
                <div className="paper-card rounded-sm py-4 sm:py-6 px-1 sm:px-4 flex flex-col items-center justify-center transition-all duration-300 hover:border-[#C5A880] hover:shadow-md" suppressHydrationWarning>
                  {/* Fine corner decoration */}
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#C5A880]/40" />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#C5A880]/40" />
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#C5A880]/40" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#C5A880]/40" />

                  <span
                    className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl font-light text-[#1A3026] tracking-tight leading-none"
                    suppressHydrationWarning
                  >
                    {timeLeft === null ? "--" : formatNumberTwoDigits(unit.value)}
                  </span>
                  <span className="mt-2 sm:mt-3 text-[9px] sm:text-[11px] md:text-xs uppercase tracking-[0.22em] text-[#6B6862] font-sans-luxury font-medium">
                    {unit.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-xs sm:text-sm text-[#6B6862] font-sans-luxury tracking-[0.08em] italic"
        >
          {wedding.event.city}, {wedding.event.country} &bull; {wedding.event.timeFormatted}
        </motion.p>
      </div>
    </section>
  );
}
