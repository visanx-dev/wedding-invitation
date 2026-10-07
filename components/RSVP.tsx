"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Heart, Sparkles, Send, RefreshCw, AlertCircle, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { useWedding } from "@/context/WeddingContext";
import { BotanicalDivider, BotanicalCorner } from "./BotanicalDivider";
import { insertRsvp } from "@/lib/supabase";

export interface RSVPFormData {
  fullName: string;
  email: string;
  phone: string;
  guestCount: number;
  attendance: "accept" | "decline";
  eventsAttending: "both" | "ceremony" | "reception" | "none";
  mealPreference: string;
  notes: string;
}

export function RSVP() {
  const { wedding, inviteScope, activeClientId } = useWedding();
  const defaultScope =
    inviteScope === "reception"
      ? "reception"
      : inviteScope === "ceremony"
      ? "ceremony"
      : "both";

  const [formData, setFormData] = useState<RSVPFormData>({
    fullName: "",
    email: "",
    phone: "",
    guestCount: 1,
    attendance: "accept",
    eventsAttending: defaultScope,
    mealPreference: "Vegetarian",
    notes: "",
  });

  useEffect(() => {
    if (inviteScope === "reception") {
      setFormData((prev) => ({ ...prev, eventsAttending: "reception" }));
    } else if (inviteScope === "ceremony") {
      setFormData((prev) => ({ ...prev, eventsAttending: "ceremony" }));
    }
  }, [inviteScope]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      err.fullName = "Please enter your full name.";
    }
    if (formData.guestCount < 1 || formData.guestCount > wedding.rsvp.maxGuests) {
      err.guestCount = `Please specify between 1 and ${wedding.rsvp.maxGuests} guests.`;
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Persist to Supabase with automatic local storage fallback
      await insertRsvp({
        client_id: activeClientId || "amal-nethmi",
        full_name: formData.fullName.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        guest_count: formData.guestCount,
        attendance: formData.attendance,
        events_attending: formData.eventsAttending,
        meal_preference: formData.mealPreference,
        notes: formData.notes.trim() || undefined,
        created_at: new Date().toISOString(),
      });

      setIsSubmitted(true);

      // Trigger elegant luxury confetti
      if (typeof window !== "undefined" && formData.attendance === "accept") {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.65 },
          colors: ["#C5A880", "#1A3026", "#DFCDB7", "#FAF7F2"],
          disableForReducedMotion: true,
        });
      }
    } catch {
      setErrors({ form: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      guestCount: 1,
      attendance: "accept",
      eventsAttending: defaultScope,
      mealPreference: "Vegetarian",
      notes: "",
    });
    setErrors({});
  };

  return (
    <section
      id="rsvp"
      className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF7F2] text-[#1A3026] overflow-hidden border-t border-[#C5A880]/20"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#C5A880] font-sans-luxury font-medium"
          >
            Response Requested
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-2 text-3xl sm:text-5xl font-serif-luxury font-normal text-[#1A3026]"
          >
            Répondez S&apos;il Vous Plaît
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-xs sm:text-sm text-[#6B6862] font-serif-luxury italic max-w-md mx-auto"
          >
            {wedding.rsvp.deadlineNote}
          </motion.p>

          <BotanicalDivider variant="crest" className="mt-6" />
        </div>

        {/* Card Container */}
        <div className="paper-card rounded-sm p-6 sm:p-12 relative shadow-md">
          <BotanicalCorner className="absolute top-2 left-2" />
          <BotanicalCorner className="absolute bottom-2 right-2" flipX flipY />

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="submitted-state"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6 }}
                className="py-8 sm:py-12 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full border border-[#C5A880] bg-[#1A3026] text-[#DFCDB7] flex items-center justify-center mb-6 shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] font-sans-luxury font-medium">
                  {formData.attendance === "accept"
                    ? "Joyfully Confirmed"
                    : "Response Received"}
                </span>

                <h3 className="text-3xl sm:text-4xl font-serif-luxury text-[#1A3026] mt-2 mb-4">
                  Thank you for celebrating with us.
                </h3>

                <p className="text-xs sm:text-sm text-[#6B6862] font-sans-luxury font-light leading-relaxed max-w-md mb-8">
                  {formData.attendance === "accept"
                    ? `Dearest ${formData.fullName}, your presence has been reserved for ${formData.guestCount} guest(s) for ${
                        formData.eventsAttending === "reception"
                          ? "the Evening Reception & Banquet"
                          : formData.eventsAttending === "ceremony"
                          ? "the Sacred Morning Ceremony"
                          : "both the Morning Ceremony & Evening Reception"
                      }. We eagerly anticipate celebrating together!`
                    : `Dearest ${formData.fullName}, thank you for letting us know. You will be dearly missed, but held close in our hearts.`}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-sm border border-[#C5A880] text-[#1A3026] hover:bg-[#FAF7F2] text-xs uppercase tracking-[0.18em] font-sans-luxury font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Submit Another Response</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="rsvp-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
              >
                {errors.form && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}

                {/* Attendance Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium">
                      Will you be attending? *
                    </label>
                    {inviteScope !== "all" && (
                      <span className="text-[10px] text-[#C5A880] font-sans-luxury uppercase tracking-wider font-medium">
                        {inviteScope === "reception" ? "Evening Reception" : "Morning Ceremony"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* CASE 1: Full / Both Events Invite */}
                    {inviteScope === "all" && (
                      <>
                        <label
                          className={`relative flex items-center justify-between p-4 rounded-xs border cursor-pointer transition-all ${
                            formData.attendance === "accept" && formData.eventsAttending === "both"
                              ? "border-[#1A3026] bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                              : "border-[#C5A880]/40 bg-[#FAF7F2] text-[#1A3026] hover:border-[#C5A880]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="attendance"
                              checked={formData.attendance === "accept" && formData.eventsAttending === "both"}
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  attendance: "accept",
                                  eventsAttending: "both",
                                }))
                              }
                              className="sr-only"
                            />
                            <div>
                              <span className="font-serif-luxury text-base sm:text-lg tracking-wide block">
                                Joyfully Accept &bull; Both Events
                              </span>
                              <span className="text-[11px] opacity-75 font-sans-luxury block">
                                Attending Morning Ceremony &amp; Evening Reception
                              </span>
                            </div>
                          </div>
                          <Heart
                            className={`w-4 h-4 shrink-0 ${
                              formData.attendance === "accept" && formData.eventsAttending === "both"
                                ? "fill-[#C5A880] text-[#C5A880]"
                                : "text-[#C5A880]"
                            }`}
                          />
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label
                            className={`relative flex items-center justify-between p-3.5 rounded-xs border cursor-pointer transition-all ${
                              formData.attendance === "accept" && formData.eventsAttending === "ceremony"
                                ? "border-[#1A3026] bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                                : "border-[#C5A880]/40 bg-[#FAF7F2] text-[#1A3026] hover:border-[#C5A880]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="radio"
                                name="attendance"
                                checked={formData.attendance === "accept" && formData.eventsAttending === "ceremony"}
                                onChange={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    attendance: "accept",
                                    eventsAttending: "ceremony",
                                  }))
                                }
                                className="sr-only"
                              />
                              <span className="font-serif-luxury text-base tracking-wide">
                                Ceremony Only (Morning)
                              </span>
                            </div>
                            <Check
                              className={`w-3.5 h-3.5 ${
                                formData.attendance === "accept" && formData.eventsAttending === "ceremony"
                                  ? "text-[#C5A880]"
                                  : "opacity-40"
                              }`}
                            />
                          </label>

                          <label
                            className={`relative flex items-center justify-between p-3.5 rounded-xs border cursor-pointer transition-all ${
                              formData.attendance === "accept" && formData.eventsAttending === "reception"
                                ? "border-[#1A3026] bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                                : "border-[#C5A880]/40 bg-[#FAF7F2] text-[#1A3026] hover:border-[#C5A880]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="radio"
                                name="attendance"
                                checked={formData.attendance === "accept" && formData.eventsAttending === "reception"}
                                onChange={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    attendance: "accept",
                                    eventsAttending: "reception",
                                  }))
                                }
                                className="sr-only"
                              />
                              <span className="font-serif-luxury text-base tracking-wide">
                                Reception Only (Evening)
                              </span>
                            </div>
                            <Check
                              className={`w-3.5 h-3.5 ${
                                formData.attendance === "accept" && formData.eventsAttending === "reception"
                                  ? "text-[#C5A880]"
                                  : "opacity-40"
                              }`}
                            />
                          </label>
                        </div>
                      </>
                    )}

                    {/* CASE 2: Reception Only Invite */}
                    {inviteScope === "reception" && (
                      <label
                        className={`relative flex items-center justify-between p-4 rounded-xs border cursor-pointer transition-all ${
                          formData.attendance === "accept"
                            ? "border-[#1A3026] bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                            : "border-[#C5A880]/40 bg-[#FAF7F2] text-[#1A3026] hover:border-[#C5A880]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="attendance"
                            value="accept"
                            checked={formData.attendance === "accept"}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                attendance: "accept",
                                eventsAttending: "reception",
                              }))
                            }
                            className="sr-only"
                          />
                          <div>
                            <span className="font-serif-luxury text-lg tracking-wide block">
                              Joyfully Accept &bull; Evening Reception
                            </span>
                            <span className="text-[11px] opacity-75 font-sans-luxury block">
                              Attending celebration banquet &amp; dinner
                            </span>
                          </div>
                        </div>
                        <Heart
                          className={`w-4 h-4 ${
                            formData.attendance === "accept"
                              ? "fill-[#C5A880] text-[#C5A880]"
                              : "text-[#C5A880]"
                          }`}
                        />
                      </label>
                    )}

                    {/* CASE 3: Ceremony Only Invite */}
                    {inviteScope === "ceremony" && (
                      <label
                        className={`relative flex items-center justify-between p-4 rounded-xs border cursor-pointer transition-all ${
                          formData.attendance === "accept"
                            ? "border-[#1A3026] bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                            : "border-[#C5A880]/40 bg-[#FAF7F2] text-[#1A3026] hover:border-[#C5A880]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="attendance"
                            value="accept"
                            checked={formData.attendance === "accept"}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                attendance: "accept",
                                eventsAttending: "ceremony",
                              }))
                            }
                            className="sr-only"
                          />
                          <div>
                            <span className="font-serif-luxury text-lg tracking-wide block">
                              Joyfully Accept &bull; Morning Ceremony
                            </span>
                            <span className="text-[11px] opacity-75 font-sans-luxury block">
                              Attending auspicious blessings &amp; Poruwa ceremony
                            </span>
                          </div>
                        </div>
                        <Heart
                          className={`w-4 h-4 ${
                            formData.attendance === "accept"
                              ? "fill-[#C5A880] text-[#C5A880]"
                              : "text-[#C5A880]"
                          }`}
                        />
                      </label>
                    )}

                    {/* Universal Decline Option */}
                    <label
                      className={`relative flex items-center justify-between p-4 rounded-xs border cursor-pointer transition-all ${
                        formData.attendance === "decline"
                          ? "border-[#1A3026] bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                          : "border-[#C5A880]/40 bg-[#FAF7F2] text-[#1A3026] hover:border-[#C5A880]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="attendance"
                          value="decline"
                          checked={formData.attendance === "decline"}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              attendance: "decline",
                              eventsAttending: "none",
                            }))
                          }
                          className="sr-only"
                        />
                        <span className="font-serif-luxury text-lg tracking-wide">
                          {wedding.rsvp.attendanceOptions.decline}
                        </span>
                      </div>
                      <span className="text-xs opacity-60">with regrets</span>
                    </label>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium mb-1.5"
                  >
                    Full Name(s) *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                      if (errors.fullName) {
                        setErrors((prev) => ({ ...prev, fullName: "" }));
                      }
                    }}
                    placeholder="e.g. Mr. & Mrs. Rohan Senanayake"
                    className={`w-full px-4 py-3 bg-[#FAF7F2] border ${
                      errors.fullName ? "border-red-500" : "border-[#C5A880]/50"
                    } rounded-xs text-sm sm:text-base text-[#1A3026] placeholder:text-[#6B6862]/60 focus:outline-hidden focus:border-[#1A3026] focus:ring-1 focus:ring-[#1A3026] transition-all`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600 font-sans-luxury">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Guest Count & Meal Preference (only if accepting) */}
                {formData.attendance === "accept" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 pt-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Number of Guests */}
                      <div>
                        <label
                          htmlFor="guestCount"
                          className="block text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium mb-1.5"
                        >
                          Number of Guests Attending *
                        </label>
                        <select
                          id="guestCount"
                          value={formData.guestCount}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              guestCount: Number(e.target.value),
                            }))
                          }
                          className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#C5A880]/50 rounded-xs text-sm sm:text-base text-[#1A3026] focus:outline-hidden focus:border-[#1A3026] focus:ring-1 focus:ring-[#1A3026] transition-all cursor-pointer"
                        >
                          {Array.from({ length: wedding.rsvp.maxGuests }).map(
                            (_, idx) => (
                              <option key={idx + 1} value={idx + 1}>
                                {idx + 1} {idx === 0 ? "Guest" : "Guests"}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* Meal Preference */}
                      <div>
                        <label
                          htmlFor="mealPreference"
                          className="block text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium mb-1.5"
                        >
                          Meal Preference *
                        </label>
                        <select
                          id="mealPreference"
                          value={formData.mealPreference}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              mealPreference: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#C5A880]/50 rounded-xs text-sm sm:text-base text-[#1A3026] focus:outline-hidden focus:border-[#1A3026] focus:ring-1 focus:ring-[#1A3026] transition-all cursor-pointer"
                        >
                          {wedding.rsvp.mealOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Email / Contact (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium mb-1.5"
                    >
                      Email Address (Optional)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="amal@example.com"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#C5A880]/50 rounded-xs text-sm sm:text-base text-[#1A3026] placeholder:text-[#6B6862]/60 focus:outline-hidden focus:border-[#1A3026] focus:ring-1 focus:ring-[#1A3026] transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium mb-1.5"
                    >
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="+94 77 123 4567"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#C5A880]/50 rounded-xs text-sm sm:text-base text-[#1A3026] placeholder:text-[#6B6862]/60 focus:outline-hidden focus:border-[#1A3026] focus:ring-1 focus:ring-[#1A3026] transition-all"
                    />
                  </div>
                </div>

                {/* Message / Dietary Needs */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium mb-1.5"
                  >
                    Special Dietary Requests or Note to Couple
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="Allergies, blessings, or special song recommendations..."
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#C5A880]/50 rounded-xs text-sm sm:text-base text-[#1A3026] placeholder:text-[#6B6862]/60 focus:outline-hidden focus:border-[#1A3026] focus:ring-1 focus:ring-[#1A3026] transition-all resize-y"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-8 rounded-sm bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] text-xs sm:text-sm uppercase tracking-[0.22em] font-medium font-sans-luxury transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />
                        <span>Confirming Presence...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#C5A880]" />
                        <span>Confirm Attendance</span>
                        <Send className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-[10px] sm:text-[11px] text-[#6B6862] font-sans-luxury">
                    Kindly submit on or before {wedding.rsvp.deadline}.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
