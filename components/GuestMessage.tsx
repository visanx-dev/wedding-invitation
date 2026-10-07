"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, MessageCircleHeart, Check } from "lucide-react";
import { useWedding } from "@/context/WeddingContext";
import { BotanicalDivider, BotanicalCorner } from "./BotanicalDivider";

interface MessageItem {
  id: string;
  name: string;
  message: string;
  date: string;
}

export function GuestMessage() {
  const { wedding } = useWedding();
  const [messages, setMessages] = useState<MessageItem[]>(wedding.guestBook.initialMessages);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load local wishes from localStorage if present
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wedding_guest_messages");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch (e) {
        console.error("Could not load messages from localStorage", e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!message.trim()) {
      setError("Please write a short message or blessing.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    setTimeout(() => {
      const newMessage: MessageItem = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        message: message.trim(),
        date: "Just now",
      };

      const updated = [newMessage, ...messages];
      setMessages(updated);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("wedding_guest_messages", JSON.stringify(updated));
        } catch (e) {
          console.error("Could not save to localStorage", e);
        }
      }

      setName("");
      setMessage("");
      setIsSubmitting(false);
      setSentSuccess(true);

      setTimeout(() => setSentSuccess(false), 4000);
    }, 600);
  };

  return (
    <section
      id="messages"
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
            Heartfelt Blessings
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-2 text-3xl sm:text-5xl font-serif-luxury font-normal text-[#1A3026]"
          >
            {wedding.guestBook.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-xs sm:text-sm text-[#6B6862] font-serif-luxury italic max-w-md mx-auto"
          >
            {wedding.guestBook.subtitle}
          </motion.p>

          <BotanicalDivider variant="crest" className="mt-6" />
        </div>

        {/* Input Form Card */}
        <div className="paper-card rounded-sm p-6 sm:p-10 mb-14 relative max-w-2xl mx-auto">
          <BotanicalCorner className="absolute top-2 left-2" />
          <BotanicalCorner className="absolute bottom-2 right-2" flipX flipY />

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-xs text-red-600 font-sans-luxury">{error}</p>
            )}

            <div>
              <label
                htmlFor="guestName"
                className="block text-[11px] uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium mb-1.5"
              >
                Your Name
              </label>
              <input
                id="guestName"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. Maya & Dinuk"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#C5A880]/50 rounded-xs text-sm text-[#1A3026] placeholder:text-[#6B6862]/60 focus:outline-hidden focus:border-[#1A3026] focus:ring-1 focus:ring-[#1A3026]"
              />
            </div>

            <div>
              <label
                htmlFor="guestNote"
                className="block text-[11px] uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium mb-1.5"
              >
                Leave a message for the couple
              </label>
              <textarea
                id="guestNote"
                rows={3}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Wishing you a lifetime filled with laughter, adventures, and endless love..."
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#C5A880]/50 rounded-xs text-sm text-[#1A3026] placeholder:text-[#6B6862]/60 focus:outline-hidden focus:border-[#1A3026] focus:ring-1 focus:ring-[#1A3026]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#6B6862] italic font-serif-luxury">
                {sentSuccess ? "Your blessings were shared with love!" : "Shared with the newlyweds"}
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-6 rounded-sm bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] text-xs uppercase tracking-[0.2em] font-medium font-sans-luxury transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {sentSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sent!</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5 text-[#C5A880] fill-[#C5A880]" />
                    <span>Send Love</span>
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Messages Feed */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium">
              Recent Wishes ({messages.length})
            </span>
            <MessageCircleHeart className="w-4 h-4 text-[#C5A880]" />
          </div>

          <AnimatePresence>
            {messages.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="paper-card p-5 sm:p-6 rounded-sm transition-all hover:border-[#C5A880]"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif-luxury text-lg text-[#1A3026] font-normal">
                    {item.name}
                  </h4>
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-sans-luxury">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6B6862] font-sans-luxury font-light leading-relaxed">
                  &ldquo;{item.message}&rdquo;
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
