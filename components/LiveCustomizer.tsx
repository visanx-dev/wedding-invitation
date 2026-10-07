"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  X,
  Sparkles,
  Download,
  Copy,
  RotateCcw,
  Check,
  Heart,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Sliders,
  ChevronRight,
} from "lucide-react";
import { useWedding, PRESET_THEMES } from "@/context/WeddingContext";

export function LiveCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"presets" | "couple" | "event" | "venue" | "photos" | "export">("presets");
  const [copied, setCopied] = useState(false);

  const {
    wedding,
    clients,
    activeTheme,
    setThemeById,
    updateCouple,
    updateEvent,
    updateVenue,
    switchClient,
    resetToDefault,
    exportConfigJson,
  } = useWedding();

  const handleCopyConfig = () => {
    const configCode = `import { WeddingConfig } from "./wedding";\n\nexport const wedding: WeddingConfig = ${exportConfigJson()};`;
    navigator.clipboard.writeText(configCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleDownloadJson = () => {
    const blob = new Blob([exportConfigJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${wedding.couple.groom.firstName.toLowerCase()}-${wedding.couple.bride.firstName.toLowerCase()}-wedding-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Floating Studio Trigger Button */}
      <div className="fixed top-20 right-4 z-40 select-none">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#102119] text-[#DFCDB7] border border-[#C5A880] shadow-xl hover:bg-[#1A3026] hover:text-[#FAF7F2] transition-all cursor-pointer backdrop-blur-md"
          aria-label="Open Live Customizer Studio"
        >
          <div className="w-6 h-6 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
            <Palette className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-sans-luxury uppercase tracking-[0.2em] font-medium text-[#C5A880]">
              Studio Mode
            </span>
            <span className="text-[11px] font-sans-luxury font-medium text-[#FAF7F2] leading-tight">
              Customize Live
            </span>
          </div>
        </motion.button>
      </div>

      {/* Slide-Over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="w-screen max-w-md sm:max-w-lg bg-[#FAF7F2] text-[#1A3026] shadow-2xl flex flex-col border-l border-[#C5A880]/40"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 bg-[#102119] text-[#FAF7F2] border-b border-[#C5A880]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-[#C5A880] flex items-center justify-center bg-[#1A3026] text-[#C5A880]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif-luxury text-xl font-normal text-[#FAF7F2]">
                        Invitation Studio
                      </h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#DFCDB7] font-sans-luxury">
                        Live Preview &amp; Customization
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full text-[#DFCDB7] hover:bg-[#1A3026] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                    aria-label="Close Studio"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center border-b border-[#C5A880]/30 bg-[#F4EDE4] overflow-x-auto text-xs font-sans-luxury">
                  <button
                    onClick={() => setActiveTab("presets")}
                    className={`px-4 py-3 whitespace-nowrap font-medium tracking-wider uppercase text-[11px] transition-colors border-b-2 flex items-center gap-1.5 ${
                      activeTab === "presets"
                        ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                        : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Presets</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("couple")}
                    className={`px-4 py-3 whitespace-nowrap font-medium tracking-wider uppercase text-[11px] transition-colors border-b-2 flex items-center gap-1.5 ${
                      activeTab === "couple"
                        ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                        : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Couple</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("event")}
                    className={`px-4 py-3 whitespace-nowrap font-medium tracking-wider uppercase text-[11px] transition-colors border-b-2 flex items-center gap-1.5 ${
                      activeTab === "event"
                        ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                        : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Date</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("venue")}
                    className={`px-4 py-3 whitespace-nowrap font-medium tracking-wider uppercase text-[11px] transition-colors border-b-2 flex items-center gap-1.5 ${
                      activeTab === "venue"
                        ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                        : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Venue</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("export")}
                    className={`px-4 py-3 whitespace-nowrap font-medium tracking-wider uppercase text-[11px] transition-colors border-b-2 flex items-center gap-1.5 ${
                      activeTab === "export"
                        ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                        : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Export</span>
                  </button>
                </div>

                {/* Content Panel */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* TAB 1: PRESETS & THEMES */}
                  {activeTab === "presets" && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-serif-luxury text-xl text-[#1A3026] mb-1">
                          Ready-to-Use Wedding Templates
                        </h4>
                        <p className="text-xs text-[#6B6862] font-sans-luxury">
                          Choose a preset couple and theme to instantly reconfigure the whole invitation:
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div
                          onClick={() => switchClient("amal-nethmi")}
                          className="p-4 rounded-xs border border-[#C5A880]/60 bg-[#FAF7F2] hover:border-[#1A3026] transition-all cursor-pointer flex items-center justify-between group shadow-xs hover:shadow-md"
                        >
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-sans-luxury font-medium block">
                              Sri Lankan Romance &bull; Colombo
                            </span>
                            <h5 className="font-serif-luxury text-lg text-[#1A3026]">
                              Amal &amp; Nethmi
                            </h5>
                            <p className="text-xs text-[#6B6862]">
                              Shangri-La Colombo &bull; Royal Emerald &amp; Gold
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
                        </div>

                        <div
                          onClick={() => switchClient("arjun-priya")}
                          className="p-4 rounded-xs border border-[#C5A880]/60 bg-[#FAF7F2] hover:border-[#1A3026] transition-all cursor-pointer flex items-center justify-between group shadow-xs hover:shadow-md"
                        >
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-sans-luxury font-medium block">
                              Royal Palace &bull; Udaipur, India
                            </span>
                            <h5 className="font-serif-luxury text-lg text-[#1A3026]">
                              Arjun &amp; Priya
                            </h5>
                            <p className="text-xs text-[#6B6862]">
                              The Oberoi Udaivilas &bull; Velvet Burgundy &amp; Gold
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
                        </div>

                        <div
                          onClick={() => switchClient("david-sophia")}
                          className="p-4 rounded-xs border border-[#C5A880]/60 bg-[#FAF7F2] hover:border-[#1A3026] transition-all cursor-pointer flex items-center justify-between group shadow-xs hover:shadow-md"
                        >
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#CBA674] font-sans-luxury font-medium block">
                              Mediterranean Coastal &bull; Amalfi, Italy
                            </span>
                            <h5 className="font-serif-luxury text-lg text-[#1A3026]">
                              David &amp; Sophia
                            </h5>
                            <p className="text-xs text-[#6B6862]">
                              Villa Cimbrone &bull; Coastal Sapphire &amp; Champagne
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Color Palette Switcher */}
                      <div className="pt-4 border-t border-[#C5A880]/20">
                        <label className="block text-xs uppercase tracking-[0.2em] text-[#6B6862] font-sans-luxury font-medium mb-3">
                          Select Color Atmosphere
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {PRESET_THEMES.map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() => setThemeById(theme.id)}
                              className={`p-3 rounded-xs border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                                activeTheme.id === theme.id
                                  ? "border-[#1A3026] bg-[#FFFFFF] shadow-sm ring-1 ring-[#1A3026]"
                                  : "border-[#C5A880]/30 bg-[#FAF7F2] hover:border-[#C5A880]"
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-5 h-5 rounded-full border border-white/50 shadow-xs"
                                  style={{ backgroundColor: theme.primary }}
                                />
                                <div
                                  className="w-5 h-5 rounded-full border border-white/50 shadow-xs"
                                  style={{ backgroundColor: theme.accent }}
                                />
                                <div
                                  className="w-5 h-5 rounded-full border border-gray-200 shadow-xs"
                                  style={{ backgroundColor: theme.background }}
                                />
                              </div>
                              <span className="text-[11px] font-sans-luxury font-medium text-[#1A3026]">
                                {theme.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: COUPLE DETAILS */}
                  {activeTab === "couple" && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-serif-luxury text-xl text-[#1A3026] mb-1">
                          Couple Information
                        </h4>
                        <p className="text-xs text-[#6B6862] font-sans-luxury">
                          Changes reflect instantly on the live invitation:
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                            Groom First Name
                          </label>
                          <input
                            type="text"
                            value={wedding.couple.groom.firstName}
                            onChange={(e) =>
                              updateCouple({
                                groom: {
                                  ...wedding.couple.groom,
                                  firstName: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                            Bride First Name
                          </label>
                          <input
                            type="text"
                            value={wedding.couple.bride.firstName}
                            onChange={(e) =>
                              updateCouple({
                                bride: {
                                  ...wedding.couple.bride,
                                  firstName: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                            Monogram Crest
                          </label>
                          <input
                            type="text"
                            value={wedding.couple.monogram}
                            onChange={(e) =>
                              updateCouple({ monogram: e.target.value })
                            }
                            placeholder="e.g. A & N"
                            className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                            Hashtag
                          </label>
                          <input
                            type="text"
                            value={wedding.couple.hashtag}
                            onChange={(e) =>
                              updateCouple({ hashtag: e.target.value })
                            }
                            placeholder="e.g. #AmalAndNethmi"
                            className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                          Invitation Preamble
                        </label>
                        <input
                          type="text"
                          value={wedding.couple.invitationPreamble}
                          onChange={(e) =>
                            updateCouple({ invitationPreamble: e.target.value })
                          }
                          placeholder="Together with their families"
                          className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                          Invitation Tagline
                        </label>
                        <textarea
                          rows={2}
                          value={wedding.couple.invitationTagline}
                          onChange={(e) =>
                            updateCouple({ invitationTagline: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 3: DATE & TIME */}
                  {activeTab === "event" && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-serif-luxury text-xl text-[#1A3026] mb-1">
                          Wedding Date &amp; Countdown
                        </h4>
                        <p className="text-xs text-[#6B6862] font-sans-luxury">
                          The live countdown will recalculate in real time:
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                          Target Date &amp; Time (ISO String)
                        </label>
                        <input
                          type="text"
                          value={wedding.event.dateISO}
                          onChange={(e) =>
                            updateEvent({ dateISO: e.target.value })
                          }
                          placeholder="2026-12-18T10:00:00+05:30"
                          className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm font-mono text-xs"
                        />
                        <span className="text-[10px] text-[#6B6862]">
                          Format: YYYY-MM-DDTHH:MM:SS+Timezone
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                            Day of Week
                          </label>
                          <input
                            type="text"
                            value={wedding.event.dayOfWeek}
                            onChange={(e) =>
                              updateEvent({ dayOfWeek: e.target.value })
                            }
                            placeholder="Wednesday"
                            className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                            Formatted Date
                          </label>
                          <input
                            type="text"
                            value={wedding.event.dateFormatted}
                            onChange={(e) =>
                              updateEvent({ dateFormatted: e.target.value })
                            }
                            placeholder="18 December 2026"
                            className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                            City &amp; Country
                          </label>
                          <input
                            type="text"
                            value={wedding.event.displayLocation}
                            onChange={(e) =>
                              updateEvent({
                                displayLocation: e.target.value,
                                city: e.target.value.split(",")[0]?.trim() || wedding.event.city,
                              })
                            }
                            placeholder="Colombo, Sri Lanka"
                            className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                            Time Display
                          </label>
                          <input
                            type="text"
                            value={wedding.event.timeFormatted}
                            onChange={(e) =>
                              updateEvent({ timeFormatted: e.target.value })
                            }
                            placeholder="10:00 AM onwards"
                            className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: VENUE */}
                  {activeTab === "venue" && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-serif-luxury text-xl text-[#1A3026] mb-1">
                          Venue Details &amp; Directions
                        </h4>
                        <p className="text-xs text-[#6B6862] font-sans-luxury">
                          Venue presentation and Google Maps link:
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                          Venue Name
                        </label>
                        <input
                          type="text"
                          value={wedding.venue.name}
                          onChange={(e) => updateVenue({ name: e.target.value })}
                          placeholder="Shangri-La Colombo"
                          className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                          Venue Subtitle / Ballroom
                        </label>
                        <input
                          type="text"
                          value={wedding.venue.subname}
                          onChange={(e) => updateVenue({ subname: e.target.value })}
                          placeholder="Grand Ballroom & Ocean Lawn"
                          className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={wedding.venue.address}
                          onChange={(e) => updateVenue({ address: e.target.value })}
                          placeholder="1 Galle Face, Colombo 00200"
                          className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                          Venue Photo URL
                        </label>
                        <input
                          type="text"
                          value={wedding.venue.image}
                          onChange={(e) => updateVenue({ image: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#6B6862] font-sans-luxury font-medium mb-1">
                          Google Maps URL
                        </label>
                        <input
                          type="text"
                          value={wedding.venue.mapsUrl}
                          onChange={(e) => updateVenue({ mapsUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#C5A880]/60 rounded-xs text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 5: EXPORT & DEPLOY */}
                  {activeTab === "export" && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-serif-luxury text-xl text-[#1A3026] mb-1">
                          Export for Clients &amp; Deployment
                        </h4>
                        <p className="text-xs text-[#6B6862] font-sans-luxury">
                          Use these tools to deploy a personalized wedding website for your paying clients:
                        </p>
                      </div>

                      <div className="p-4 bg-[#102119] text-[#FAF7F2] rounded-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider text-[#C5A880] font-sans-luxury font-medium">
                            TypeScript Config (data/wedding.ts)
                          </span>
                          <span className="text-[10px] text-[#DFCDB7]">Ready to paste</span>
                        </div>

                        <p className="text-xs text-[#DFCDB7]/80">
                          Copy this customized configuration and replace the contents of{" "}
                          <code className="text-[#C5A880]">data/wedding.ts</code> to permanently lock in this wedding.
                        </p>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleCopyConfig}
                            className="flex-1 py-2.5 px-3 rounded-xs bg-[#C5A880] text-[#102119] hover:bg-[#DFCDB7] text-xs font-sans-luxury uppercase tracking-wider font-medium transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-900" />
                                <span>Copied to Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={handleDownloadJson}
                            className="py-2.5 px-3 rounded-xs border border-[#C5A880]/60 text-[#DFCDB7] hover:bg-[#1A3026] text-xs font-sans-luxury uppercase tracking-wider font-medium transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                          >
                            <Download className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>Download JSON</span>
                          </button>
                        </div>
                      </div>

                      {/* Reset Button */}
                      <div className="pt-4 border-t border-[#C5A880]/20 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-sans-luxury text-[#1A3026] font-medium">
                            Reset all customizations
                          </p>
                          <p className="text-[10px] text-[#6B6862]">
                            Restore original Amal &amp; Nethmi invitation
                          </p>
                        </div>
                        <button
                          onClick={resetToDefault}
                          className="py-2 px-3 border border-red-300 text-red-700 hover:bg-red-50 rounded-xs text-xs font-sans-luxury uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Drawer Note */}
                <div className="p-4 bg-[#F4EDE4] border-t border-[#C5A880]/30 text-center text-[11px] text-[#6B6862] font-sans-luxury">
                  Edits are automatically saved to your browser in real time.
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
