"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Users,
  CheckCircle2,
  XCircle,
  Utensils,
  Download,
  Share2,
  ExternalLink,
  Edit3,
  Calendar,
  Clock,
  MapPin,
  Save,
  Check,
  Search,
  MessageCircleHeart,
  FileSpreadsheet,
  Shirt,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Music,
  Plus,
  Trash2,
  BookOpen,
  Eye,
  EyeOff,
  RotateCcw,
  Palette,
  Camera,
  Phone,
  Mail,
  Tag,
  Sliders,
} from "lucide-react";
import { useWedding, PRESET_THEMES, WeddingProvider } from "@/context/WeddingContext";

interface RSVPRecord {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  guestCount: number;
  attendance: "accept" | "decline";
  eventsAttending?: "both" | "ceremony" | "reception" | "none";
  mealPreference: string;
  notes?: string;
  timestamp: string;
}

interface MessageItem {
  id: string;
  name: string;
  message: string;
  date: string;
}

function HostPortalContent() {
  const {
    wedding,
    activeTheme,
    activeClientId,
    setThemeById,
    updateWedding,
    updateCouple,
    updateEvent,
    updateVenue,
    updateDetails,
    updateStory,
    updateStoryMilestone,
    updateTimelineItem,
    addTimelineItem,
    removeTimelineItem,
    updateDressCode,
    updateDressCodePalette,
    updateMusic,
    resetToDefault,
  } = useWedding();

  const [activeTab, setActiveTab] = useState<"editor" | "rsvps" | "wishes">("editor");
  const [editorStep, setEditorStep] = useState<number>(1);
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>(wedding.guestBook.initialMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Load RSVPs & Messages
  const loadData = () => {
    if (typeof window !== "undefined") {
      try {
        const storedRsvps = localStorage.getItem("wedding_rsvps");
        if (storedRsvps) {
          const parsed = JSON.parse(storedRsvps);
          if (Array.isArray(parsed)) setRsvps(parsed);
        }
        const storedMsgs = localStorage.getItem("wedding_guest_messages");
        if (storedMsgs) {
          const parsedMsgs = JSON.parse(storedMsgs);
          if (Array.isArray(parsedMsgs)) setMessages(parsedMsgs);
        }
      } catch (e) {
        console.error("Could not load data", e);
      }
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("rsvp_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("rsvp_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Compute stats including separable ceremony and reception counts
  const attendingList = rsvps.filter((r) => r.attendance === "accept");
  const declinedList = rsvps.filter((r) => r.attendance === "decline");
  const totalAttendingGuests = attendingList.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const ceremonyCount = attendingList
    .filter((r) => !(r as any).eventsAttending || (r as any).eventsAttending === "both" || (r as any).eventsAttending === "ceremony")
    .reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const receptionCount = attendingList
    .filter((r) => !(r as any).eventsAttending || (r as any).eventsAttending === "both" || (r as any).eventsAttending === "reception")
    .reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const vegCount = attendingList
    .filter((r) => r.mealPreference === "Vegetarian")
    .reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const nonVegCount = totalAttendingGuests - vegCount;

  const [filterEvent, setFilterEvent] = useState<string>("all");

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterEvent === "all") return true;
    if (filterEvent === "decline") return r.attendance === "decline";
    if (r.attendance !== "accept") return false;
    if (filterEvent === "both") return !r.eventsAttending || r.eventsAttending === "both";
    if (filterEvent === "ceremony") return r.eventsAttending === "ceremony" || !r.eventsAttending || r.eventsAttending === "both";
    if (filterEvent === "reception") return r.eventsAttending === "reception" || !r.eventsAttending || r.eventsAttending === "both";
    return true;
  });

  // CSV Export with separable events column
  const handleExportCsv = () => {
    const headers = [
      "Guest Name",
      "Attendance",
      "Events Invited / Attending",
      "Party Size",
      "Meal Preference",
      "Contact Phone",
      "Contact Email",
      "Dietary / Notes",
      "RSVP Date",
    ];

    const rows = rsvps.map((r) => [
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.attendance === "accept" ? "Attending" : "Declined",
      `"${(r as any).eventsAttending === "reception" ? "Reception Only" : (r as any).eventsAttending === "ceremony" ? "Ceremony Only" : "Both Events"}"`,
      r.guestCount,
      `"${r.mealPreference}"`,
      `"${r.phone || ""}"`,
      `"${r.email || ""}"`,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
      new Date(r.timestamp).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${wedding.couple.groom.firstName}-${wedding.couple.bride.firstName}-Guest-List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [copiedScope, setCopiedScope] = useState<string | null>(null);

  const getScopeUrl = (scope: "all" | "reception" | "ceremony") => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : wedding.meta.siteUrl;
    const clientParam = activeClientId ? `client=${activeClientId}` : "";
    const scopeParam = scope === "all" ? "" : `invite=${scope}`;
    const params = [clientParam, scopeParam].filter(Boolean).join("&");
    return `${baseUrl}/${params ? `?${params}` : ""}`;
  };

  // WhatsApp Share invitation message by scope
  const handleShareWhatsAppScope = (scope: "all" | "reception" | "ceremony") => {
    const fullUrl = getScopeUrl(scope);
    let text = "";
    if (scope === "reception") {
      text = `Together with our families, ${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} warmly invite you to our wedding celebration at our Evening Reception on ${wedding.event.dateFormatted} at ${wedding.details.reception.venue}.\n\nPlease view your digital invitation & RSVP here: ${fullUrl}`;
    } else if (scope === "ceremony") {
      text = `Together with our families, ${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} warmly invite you to our wedding ceremony on ${wedding.event.dateFormatted} at ${wedding.details.ceremony.venue}.\n\nPlease view your digital invitation & RSVP here: ${fullUrl}`;
    } else {
      text = `Together with our families, ${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} warmly invite you to our wedding celebration on ${wedding.event.dateFormatted} in ${wedding.event.displayLocation}.\n\nPlease view our digital invitation & RSVP here: ${fullUrl}`;
    }
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyLinkScope = (scope: "all" | "reception" | "ceremony") => {
    const fullUrl = getScopeUrl(scope);
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedScope(scope);
      setTimeout(() => setCopiedScope(null), 3000);
    });
  };

  // Default WhatsApp Share (All Events)
  const handleShareWhatsApp = () => handleShareWhatsAppScope("all");

  const handleCopyLink = () => {
    const fullUrl = getScopeUrl("all");
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    });
  };

  const triggerSaveNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const steps = [
    { num: 1, label: "The Couple & Hero" },
    { num: 2, label: "Date & Countdown" },
    { num: 3, label: "Our Story" },
    { num: 4, label: "Ceremony & Reception" },
    { num: 5, label: "Order of Day" },
    { num: 6, label: "Venue & Arrival" },
    { num: 7, label: "Dress Code & Colors" },
    { num: 8, label: "RSVP, Music & Theme" },
  ];

  const liveUrl = activeClientId ? `/?client=${activeClientId}` : "/";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A3026]">
      {/* Top Luxury Banner */}
      <header className="bg-[#102119] text-[#FAF7F2] border-b border-[#C5A880]/30 px-4 sm:px-6 py-5 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full border border-[#C5A880] flex items-center justify-center bg-[#1A3026] text-[#DFCDB7] shrink-0 shadow-md">
              <span className="font-serif-luxury text-base tracking-widest pl-0.5 font-medium">
                {wedding.couple.monogram}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-sans-luxury font-medium">
                  Wedding Couple &amp; Host Portal
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1A3026] border border-[#C5A880]/40 text-[#DFCDB7]">
                  Live Synchronized
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif-luxury text-[#FAF7F2]">
                {wedding.couple.groom.firstName} &amp; {wedding.couple.bride.firstName}
              </h1>
              <p className="text-xs text-[#DFCDB7]/80 font-sans-luxury mt-0.5">
                {wedding.event.dayOfWeek}, {wedding.event.dateFormatted} &bull; {wedding.venue.name}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`px-3.5 py-2 rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                showLivePreview
                  ? "bg-[#C5A880] text-[#102119] border-[#C5A880]"
                  : "bg-[#1A3026] text-[#DFCDB7] border-[#C5A880]/40 hover:bg-[#233C30]"
              }`}
            >
              {showLivePreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#C5A880]" />}
              <span>{showLivePreview ? "Close Preview" : "Split Live Preview"}</span>
            </button>

            <Link
              href={liveUrl}
              target="_blank"
              className="px-3.5 py-2 rounded-xs bg-[#C5A880] hover:bg-[#DFCDB7] text-[#102119] text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Exactly The Live Page</span>
            </Link>

            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xs bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xs border border-[#C5A880]/50 hover:bg-[#1A3026] text-[#DFCDB7] text-xs uppercase tracking-wider font-sans-luxury transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copied</span>
                </>
              ) : (
                <span>Copy Link</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#C5A880]/30 mb-8 bg-white rounded-t-sm shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-sans-luxury font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "editor"
                ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
            }`}
          >
            <Edit3 className="w-4 h-4 text-[#C5A880]" />
            <span>Customize Every Section (Walkthrough)</span>
          </button>

          <button
            onClick={() => setActiveTab("rsvps")}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-sans-luxury font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "rsvps"
                ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
            }`}
          >
            <Users className="w-4 h-4 text-[#C5A880]" />
            <span>Guest RSVPs &amp; Catering ({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wishes")}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-sans-luxury font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "wishes"
                ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
            }`}
          >
            <MessageCircleHeart className="w-4 h-4 text-[#C5A880]" />
            <span>Words of Love ({messages.length})</span>
          </button>
        </div>

        {/* TAB 1: COMPREHENSIVE WALKTHROUGH EDITOR */}
        {activeTab === "editor" && (
          <div className="space-y-6">
            {/* Walkthrough Header & Live Preview Bar */}
            <div className="bg-white p-5 rounded-xs border border-[#C5A880]/30 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                  Easy Step-by-Step Walkthrough &bull; Step {editorStep} of 8
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#1A3026]">
                  {steps[editorStep - 1]?.label}
                </h3>
                <p className="text-xs text-[#6B6862] mt-0.5">
                  Change any section text, details, images or colors. Your changes update the live invitation instantly.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className="px-4 py-2 border border-[#C5A880] text-[#1A3026] hover:bg-[#FAF7F2] rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{showLivePreview ? "Hide Preview" : "Split Preview"}</span>
                </button>

                <button
                  onClick={triggerSaveNotification}
                  className="px-5 py-2 bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Changes Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#C5A880]" />
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="bg-white p-3 rounded-xs border border-[#C5A880]/30 shadow-xs space-y-2">
              <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#C5A880]/20">
                <div
                  className="bg-[#1A3026] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(editorStep / 8) * 100}%` }}
                />
              </div>

              {/* Stepper Wizard Bar */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pt-1">
                {steps.map((st) => (
                  <button
                    key={st.num}
                    onClick={() => setEditorStep(st.num)}
                    className={`px-3 py-2 rounded-xs text-xs font-sans-luxury flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                      editorStep === st.num
                        ? "bg-[#1A3026] text-[#FAF7F2] shadow-xs"
                        : "bg-[#FAF7F2] text-[#6B6862] hover:bg-[#F2EAE0]"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${
                        editorStep === st.num ? "bg-[#C5A880] text-[#102119]" : "bg-gray-200 text-[#1A3026]"
                      }`}
                    >
                      {st.num}
                    </span>
                    <span className="hidden sm:inline">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area with Optional Split Preview */}
            <div className={`grid grid-cols-1 ${showLivePreview ? "lg:grid-cols-2" : ""} gap-6`}>
              {/* Step Editor Card */}
              <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#C5A880]/30 shadow-xs space-y-6">
                {/* STEP 1: COUPLE, PARENTS & HERO */}
                {editorStep === 1 && (
                  <div className="space-y-6">
                    <div className="border-b border-[#C5A880]/20 pb-3">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                        Step 1 of 8 &bull; Hero Section
                      </span>
                      <h4 className="font-serif-luxury text-2xl text-[#1A3026]">
                        The Couple, Parents &amp; Hero Portrait
                      </h4>
                      <p className="text-xs text-[#6B6862] mt-0.5">
                        Names, family blessings, and opening cover photo displayed on the grand invitation entrance.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Groom First Name</label>
                        <input
                          type="text"
                          value={wedding.couple.groom.firstName}
                          onChange={(e) => updateCouple({ groom: { ...wedding.couple.groom, firstName: e.target.value } })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Groom Full Name</label>
                        <input
                          type="text"
                          value={wedding.couple.groom.fullName}
                          onChange={(e) => updateCouple({ groom: { ...wedding.couple.groom, fullName: e.target.value } })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1A3026] mb-1">Groom Parents Blessing</label>
                      <input
                        type="text"
                        value={wedding.couple.groom.parents}
                        onChange={(e) => updateCouple({ groom: { ...wedding.couple.groom, parents: e.target.value } })}
                        placeholder="e.g. Son of Mr. & Mrs. Rohan Senanayake"
                        className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Bride First Name</label>
                        <input
                          type="text"
                          value={wedding.couple.bride.firstName}
                          onChange={(e) => updateCouple({ bride: { ...wedding.couple.bride, firstName: e.target.value } })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Bride Full Name</label>
                        <input
                          type="text"
                          value={wedding.couple.bride.fullName}
                          onChange={(e) => updateCouple({ bride: { ...wedding.couple.bride, fullName: e.target.value } })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1A3026] mb-1">Bride Parents Blessing</label>
                      <input
                        type="text"
                        value={wedding.couple.bride.parents}
                        onChange={(e) => updateCouple({ bride: { ...wedding.couple.bride, parents: e.target.value } })}
                        placeholder="e.g. Daughter of Dr. & Mrs. Janaka Wickramasinghe"
                        className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Monogram Crest Initial</label>
                        <input
                          type="text"
                          value={wedding.couple.monogram}
                          onChange={(e) => updateCouple({ monogram: e.target.value })}
                          placeholder="e.g. A & N"
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Wedding Hashtag</label>
                        <input
                          type="text"
                          value={wedding.couple.hashtag}
                          onChange={(e) => updateCouple({ hashtag: e.target.value })}
                          placeholder="#AmalAndNethmi"
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1A3026] mb-1">Invitation Preamble</label>
                      <input
                        type="text"
                        value={wedding.couple.invitationPreamble}
                        onChange={(e) => updateCouple({ invitationPreamble: e.target.value })}
                        placeholder="Together with their families"
                        className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1A3026] mb-1">Invitation Tagline &amp; Blessing</label>
                      <textarea
                        rows={2}
                        value={wedding.couple.invitationTagline}
                        onChange={(e) => updateCouple({ invitationTagline: e.target.value })}
                        className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                      />
                    </div>

                    <div className="pt-2 border-t border-[#C5A880]/20">
                      <label className="block text-xs font-medium text-[#1A3026] mb-1">
                        Hero Cover Portrait Photo URL
                      </label>
                      <input
                        type="text"
                        value={wedding.meta.ogImage || ""}
                        onChange={(e) =>
                          updateWedding({
                            meta: { ...wedding.meta, ogImage: e.target.value },
                          })
                        }
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs font-mono bg-[#FAF7F2]"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[10px] text-[#6B6862] py-1">Quick photo styles:</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateWedding({
                              meta: {
                                ...wedding.meta,
                                ogImage:
                                  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=90",
                              },
                            })
                          }
                          className="px-2 py-1 bg-white border border-[#C5A880]/30 rounded-xs text-[10px] text-[#1A3026] hover:bg-[#FAF7F2]"
                        >
                          Classic Romantic
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateWedding({
                              meta: {
                                ...wedding.meta,
                                ogImage:
                                  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2000&q=90",
                              },
                            })
                          }
                          className="px-2 py-1 bg-white border border-[#C5A880]/30 rounded-xs text-[10px] text-[#1A3026] hover:bg-[#FAF7F2]"
                        >
                          Editorial Luxury
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateWedding({
                              meta: {
                                ...wedding.meta,
                                ogImage:
                                  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2000&q=90",
                              },
                            })
                          }
                          className="px-2 py-1 bg-white border border-[#C5A880]/30 rounded-xs text-[10px] text-[#1A3026] hover:bg-[#FAF7F2]"
                        >
                          Enchanted Garden
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: DATE & COUNTDOWN */}
                {editorStep === 2 && (
                  <div className="space-y-6">
                    <div className="border-b border-[#C5A880]/20 pb-3">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                        Step 2 of 8 &bull; Countdown Timer
                      </span>
                      <h4 className="font-serif-luxury text-2xl text-[#1A3026]">
                        Wedding Date, Time &amp; Live Countdown
                      </h4>
                      <p className="text-xs text-[#6B6862] mt-0.5">
                        Controls the exact date displayed on banners and drives the live real-time countdown timer.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Date Formatted (Display)</label>
                        <input
                          type="text"
                          value={wedding.event.dateFormatted}
                          onChange={(e) => updateEvent({ dateFormatted: e.target.value })}
                          placeholder="e.g. 18 December 2026"
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Day of the Week</label>
                        <input
                          type="text"
                          value={wedding.event.dayOfWeek}
                          onChange={(e) => updateEvent({ dayOfWeek: e.target.value })}
                          placeholder="e.g. Wednesday"
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Time Formatted (Display)</label>
                        <input
                          type="text"
                          value={wedding.event.timeFormatted}
                          onChange={(e) => updateEvent({ timeFormatted: e.target.value })}
                          placeholder="e.g. 10:00 AM onwards"
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Display Location String</label>
                        <input
                          type="text"
                          value={wedding.event.displayLocation}
                          onChange={(e) => updateEvent({ displayLocation: e.target.value })}
                          placeholder="e.g. Colombo, Sri Lanka"
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1A3026] mb-1">
                        Exact Countdown Date/Time (ISO Format)
                      </label>
                      <input
                        type="text"
                        value={wedding.event.dateISO}
                        onChange={(e) => updateEvent({ dateISO: e.target.value })}
                        placeholder="YYYY-MM-DDTHH:mm:ss+offset e.g. 2026-12-18T10:00:00+05:30"
                        className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm font-mono bg-[#FAF7F2]"
                      />
                      <p className="text-[11px] text-[#6B6862] mt-1">
                        The countdown clock calculates days, hours, minutes, and seconds until this exact moment.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 3: OUR STORY */}
                {editorStep === 3 && (
                  <div className="space-y-6">
                    <div className="border-b border-[#C5A880]/20 pb-3">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                        Step 3 of 8 &bull; Our Story Section
                      </span>
                      <h4 className="font-serif-luxury text-2xl text-[#1A3026]">
                        Our Story, Romantic Quote &amp; 4 Milestones
                      </h4>
                      <p className="text-xs text-[#6B6862] mt-0.5">
                        Customize your romantic quote and the 4 journey milestones on your story timeline.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Story Section Title</label>
                        <input
                          type="text"
                          value={wedding.story.title}
                          onChange={(e) => updateStory({ title: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Story Subtitle</label>
                        <input
                          type="text"
                          value={wedding.story.subtitle}
                          onChange={(e) => updateStory({ subtitle: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Romantic Quote</label>
                        <input
                          type="text"
                          value={wedding.story.quote}
                          onChange={(e) => updateStory({ quote: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Quote Author</label>
                        <input
                          type="text"
                          value={wedding.story.author}
                          onChange={(e) => updateStory({ author: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs uppercase tracking-wider text-[#C5A880] font-sans-luxury font-medium mb-3">
                        The 4 Journey Milestones
                      </label>

                      <div className="space-y-4">
                        {wedding.story.milestones.map((milestone, idx) => (
                          <div key={idx} className="p-4 bg-[#FAF7F2] rounded-xs border border-[#C5A880]/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-sans-luxury font-medium text-[#1A3026]">
                                Milestone {idx + 1}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[10px] text-[#6B6862] uppercase">Year</label>
                                <input
                                  type="text"
                                  value={milestone.year}
                                  onChange={(e) => updateStoryMilestone(idx, { year: e.target.value })}
                                  className="w-full px-2 py-1 bg-white border border-[#C5A880]/40 rounded-xs text-xs font-medium"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[10px] text-[#6B6862] uppercase">Title</label>
                                <input
                                  type="text"
                                  value={milestone.title}
                                  onChange={(e) => updateStoryMilestone(idx, { title: e.target.value })}
                                  className="w-full px-2 py-1 bg-white border border-[#C5A880]/40 rounded-xs text-xs font-medium"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] text-[#6B6862] uppercase">Description</label>
                              <textarea
                                rows={2}
                                value={milestone.description}
                                onChange={(e) => updateStoryMilestone(idx, { description: e.target.value })}
                                className="w-full px-2 py-1 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: CEREMONY & RECEPTION */}
                {editorStep === 4 && (
                  <div className="space-y-6">
                    <div className="border-b border-[#C5A880]/20 pb-3">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                        Step 4 of 8 &bull; Wedding Details &amp; Two Places
                      </span>
                      <h4 className="font-serif-luxury text-2xl text-[#1A3026]">
                        Ceremony &amp; Reception Locations
                      </h4>
                      <p className="text-xs text-[#6B6862] mt-0.5">
                        Configure morning &amp; evening locations, plus generate separate invitation links for guests invited to one event vs both.
                      </p>
                    </div>

                    {/* SEPARABLE GUEST INVITATION TOOL BOX */}
                    <div className="p-5 bg-[#FAF7F2] rounded-xs border-2 border-[#C5A880]/60 space-y-4 shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                            Separable Guest Invitations Feature
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium border border-emerald-300">
                            WhatsApp Ready
                          </span>
                        </div>
                        <h5 className="font-serif-luxury text-xl text-[#1A3026] mt-0.5">
                          Send Custom Links to Different Guest Lists
                        </h5>
                        <p className="text-xs text-[#6B6862] leading-relaxed mt-1">
                          Most weddings have two places (Morning Ceremony &amp; Evening Banquet). If colleagues or friends only receive an invite to the Evening Reception, send their tailored WhatsApp link below. They will only see the Reception card and RSVP specifically for dinner!
                        </p>
                      </div>

                      <div className="space-y-3 pt-1">
                        {/* 1. Full Wedding */}
                        <div className="p-3 bg-white rounded-xs border border-[#C5A880]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif-luxury text-base text-[#1A3026] font-medium">
                                💌 Full Wedding (Both Events)
                              </span>
                              <span className="text-[10px] text-[#6B6862]">(Ceremony &amp; Reception)</span>
                            </div>
                            <span className="text-[11px] text-[#6B6862] font-mono block truncate max-w-sm sm:max-w-md">
                              {getScopeUrl("all")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleShareWhatsAppScope("all")}
                              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] uppercase tracking-wider font-sans-luxury font-medium rounded-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyLinkScope("all")}
                              className="px-3 py-1.5 border border-[#C5A880] text-[#1A3026] hover:bg-[#FAF7F2] text-[11px] uppercase tracking-wider font-sans-luxury rounded-xs cursor-pointer"
                            >
                              {copiedScope === "all" ? "Copied!" : "Copy Link"}
                            </button>
                          </div>
                        </div>

                        {/* 2. Reception Only */}
                        <div className="p-3 bg-white rounded-xs border border-[#C5A880]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif-luxury text-base text-[#1A3026] font-medium">
                                🍸 Reception Only Guest Link
                              </span>
                              <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded-xs border border-amber-200">
                                Single Invite
                              </span>
                            </div>
                            <span className="text-[11px] text-[#6B6862] font-mono block truncate max-w-sm sm:max-w-md">
                              {getScopeUrl("reception")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleShareWhatsAppScope("reception")}
                              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] uppercase tracking-wider font-sans-luxury font-medium rounded-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyLinkScope("reception")}
                              className="px-3 py-1.5 border border-[#C5A880] text-[#1A3026] hover:bg-[#FAF7F2] text-[11px] uppercase tracking-wider font-sans-luxury rounded-xs cursor-pointer"
                            >
                              {copiedScope === "reception" ? "Copied!" : "Copy Link"}
                            </button>
                          </div>
                        </div>

                        {/* 3. Ceremony Only */}
                        <div className="p-3 bg-white rounded-xs border border-[#C5A880]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif-luxury text-base text-[#1A3026] font-medium">
                                🕊️ Ceremony Only Guest Link
                              </span>
                              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-200">
                                Single Invite
                              </span>
                            </div>
                            <span className="text-[11px] text-[#6B6862] font-mono block truncate max-w-sm sm:max-w-md">
                              {getScopeUrl("ceremony")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleShareWhatsAppScope("ceremony")}
                              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] uppercase tracking-wider font-sans-luxury font-medium rounded-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyLinkScope("ceremony")}
                              className="px-3 py-1.5 border border-[#C5A880] text-[#1A3026] hover:bg-[#FAF7F2] text-[11px] uppercase tracking-wider font-sans-luxury rounded-xs cursor-pointer"
                            >
                              {copiedScope === "ceremony" ? "Copied!" : "Copy Link"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ceremony */}
                    <div className="p-4 bg-[#FAF7F2] rounded-xs border border-[#C5A880]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs uppercase tracking-wider text-[#1A3026] font-sans-luxury font-medium">
                          Morning Ceremony Card
                        </h5>
                        <span className="text-[10px] text-[#C5A880] font-serif-luxury italic">Morning</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-[#6B6862]">Ceremony Title</label>
                          <input
                            type="text"
                            value={wedding.details.ceremony.title}
                            onChange={(e) => updateDetails({ ceremony: { ...wedding.details.ceremony, title: e.target.value } })}
                            className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#6B6862]">Badge Note</label>
                          <input
                            type="text"
                            value={wedding.details.ceremony.badge}
                            onChange={(e) => updateDetails({ ceremony: { ...wedding.details.ceremony, badge: e.target.value } })}
                            className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#6B6862]">Time Schedule</label>
                          <input
                            type="text"
                            value={wedding.details.ceremony.time}
                            onChange={(e) => updateDetails({ ceremony: { ...wedding.details.ceremony, time: e.target.value } })}
                            className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-[#6B6862]">Venue / Ballroom</label>
                          <input
                            type="text"
                            value={wedding.details.ceremony.venue}
                            onChange={(e) => updateDetails({ ceremony: { ...wedding.details.ceremony, venue: e.target.value } })}
                            className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#6B6862]">Address &amp; City</label>
                          <input
                            type="text"
                            value={wedding.details.ceremony.address}
                            onChange={(e) => updateDetails({ ceremony: { ...wedding.details.ceremony, address: e.target.value } })}
                            className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#6B6862]">Description &amp; Customs Note</label>
                        <textarea
                          rows={2}
                          value={wedding.details.ceremony.description}
                          onChange={(e) => updateDetails({ ceremony: { ...wedding.details.ceremony, description: e.target.value } })}
                          className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                        />
                      </div>
                    </div>

                    {/* Reception */}
                    <div className="p-4 bg-[#FAF7F2] rounded-xs border border-[#C5A880]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs uppercase tracking-wider text-[#1A3026] font-sans-luxury font-medium">
                          Evening Reception Card
                        </h5>
                        <span className="text-[10px] text-[#C5A880] font-serif-luxury italic">Evening</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-[#6B6862]">Reception Title</label>
                          <input
                            type="text"
                            value={wedding.details.reception.title}
                            onChange={(e) => updateDetails({ reception: { ...wedding.details.reception, title: e.target.value } })}
                            className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#6B6862]">Badge Note</label>
                          <input
                            type="text"
                            value={wedding.details.reception.badge}
                            onChange={(e) => updateDetails({ reception: { ...wedding.details.reception, badge: e.target.value } })}
                            className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#6B6862]">Time Schedule</label>
                          <input
                            type="text"
                            value={wedding.details.reception.time}
                            onChange={(e) => updateDetails({ reception: { ...wedding.details.reception, time: e.target.value } })}
                            className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-[#6B6862]">Venue / Ballroom</label>
                          <input
                            type="text"
                            value={wedding.details.reception.venue}
                            onChange={(e) => updateDetails({ reception: { ...wedding.details.reception, venue: e.target.value } })}
                            className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#6B6862]">Address &amp; City</label>
                          <input
                            type="text"
                            value={wedding.details.reception.address}
                            onChange={(e) => updateDetails({ reception: { ...wedding.details.reception, address: e.target.value } })}
                            className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#6B6862]">Description &amp; Dinner Note</label>
                        <textarea
                          rows={2}
                          value={wedding.details.reception.description}
                          onChange={(e) => updateDetails({ reception: { ...wedding.details.reception, description: e.target.value } })}
                          className="w-full px-2 py-1.5 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: ORDER OF DAY (TIMELINE) */}
                {editorStep === 5 && (
                  <div className="space-y-6">
                    <div className="border-b border-[#C5A880]/20 pb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                          Step 5 of 8 &bull; Itinerary Schedule
                        </span>
                        <h4 className="font-serif-luxury text-2xl text-[#1A3026]">
                          Order of the Day Schedule
                        </h4>
                        <p className="text-xs text-[#6B6862] mt-0.5">
                          Add, edit, or adjust your wedding day itinerary items and times.
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          addTimelineItem({
                            time: "11:00 PM",
                            title: "Sparkler Send-Off",
                            description: "Farewell toasts, dancing and midnight celebration.",
                            icon: "party",
                          })
                        }
                        className="px-3.5 py-1.5 bg-[#1A3026] text-[#FAF7F2] rounded-xs text-xs uppercase tracking-wider font-sans-luxury flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Add Schedule Item</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {wedding.timeline.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-[#FAF7F2] rounded-xs border border-[#C5A880]/30 flex flex-col sm:flex-row items-start gap-3">
                          <div className="w-full sm:w-28 shrink-0">
                            <label className="block text-[10px] text-[#6B6862] uppercase">Time</label>
                            <input
                              type="text"
                              value={item.time}
                              onChange={(e) => updateTimelineItem(idx, { time: e.target.value })}
                              className="w-full px-2 py-1 bg-white border border-[#C5A880]/40 rounded-xs text-xs font-medium"
                            />
                          </div>

                          <div className="flex-1 w-full space-y-1">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] text-[#6B6862] uppercase">Event Title</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => updateTimelineItem(idx, { title: e.target.value })}
                                  className="w-full px-2 py-1 bg-white border border-[#C5A880]/40 rounded-xs text-xs font-medium"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-[#6B6862] uppercase">Icon Type</label>
                                <select
                                  value={item.icon}
                                  onChange={(e) => updateTimelineItem(idx, { icon: e.target.value as any })}
                                  className="w-full px-2 py-1 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                                >
                                  <option value="arrival">Arrival / Welcome</option>
                                  <option value="ceremony">Ceremony / Sacred</option>
                                  <option value="photos">Photos / Portraits</option>
                                  <option value="reception">Reception / Toast</option>
                                  <option value="dinner">Dinner / Feast</option>
                                  <option value="party">Party / Dancing</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] text-[#6B6862] uppercase">Description</label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateTimelineItem(idx, { description: e.target.value })}
                                className="w-full px-2 py-1 bg-white border border-[#C5A880]/40 rounded-xs text-xs"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => removeTimelineItem(idx)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs self-end sm:self-center"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: VENUE & ARRIVAL */}
                {editorStep === 6 && (
                  <div className="space-y-6">
                    <div className="border-b border-[#C5A880]/20 pb-3">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                        Step 6 of 8 &bull; Venue &amp; Arrival
                      </span>
                      <h4 className="font-serif-luxury text-2xl text-[#1A3026]">
                        Venue &amp; Arrival Logistics
                      </h4>
                      <p className="text-xs text-[#6B6862] mt-0.5">
                        Venue description, address, valet instructions, and Google Maps location.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Venue Name</label>
                        <input
                          type="text"
                          value={wedding.venue.name}
                          onChange={(e) => updateVenue({ name: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Ballroom / Subtitle</label>
                        <input
                          type="text"
                          value={wedding.venue.subname}
                          onChange={(e) => updateVenue({ subname: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Full Street Address</label>
                        <input
                          type="text"
                          value={wedding.venue.address}
                          onChange={(e) => updateVenue({ address: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">City, Country</label>
                        <input
                          type="text"
                          value={wedding.venue.city}
                          onChange={(e) => updateVenue({ city: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1A3026] mb-1">Venue Description</label>
                      <textarea
                        rows={3}
                        value={wedding.venue.description}
                        onChange={(e) => updateVenue({ description: e.target.value })}
                        className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1A3026] mb-1">Venue Photo URL</label>
                      <input
                        type="text"
                        value={wedding.venue.image}
                        onChange={(e) => updateVenue({ image: e.target.value })}
                        className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs font-mono bg-[#FAF7F2]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Valet &amp; Parking Note</label>
                        <input
                          type="text"
                          value={wedding.venue.parkingNote}
                          onChange={(e) => updateVenue({ parkingNote: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Google Maps URL</label>
                        <input
                          type="text"
                          value={wedding.venue.mapsUrl}
                          onChange={(e) => updateVenue({ mapsUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs font-mono bg-[#FAF7F2]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: DRESS CODE & SWATCHES */}
                {editorStep === 7 && (
                  <div className="space-y-6">
                    <div className="border-b border-[#C5A880]/20 pb-3">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                        Step 7 of 8 &bull; Dress Code
                      </span>
                      <h4 className="font-serif-luxury text-2xl text-[#1A3026]">
                        Dress Code &amp; Color Swatches Palette
                      </h4>
                      <p className="text-xs text-[#6B6862] mt-0.5">
                        Tell your guests what attire style to wear and customize the 4 color swatches shown on your invitation.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Attire Style</label>
                        <input
                          type="text"
                          value={wedding.dressCode.attire}
                          onChange={(e) => updateDressCode({ attire: e.target.value })}
                          placeholder="e.g. Elegant Formal & Sri Lankan Traditional"
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={wedding.dressCode.subtitle}
                          onChange={(e) => updateDressCode({ subtitle: e.target.value })}
                          placeholder="e.g. Modest Elegance & Grace"
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1A3026] mb-1">Attire Description</label>
                      <textarea
                        rows={3}
                        value={wedding.dressCode.description}
                        onChange={(e) => updateDressCode({ description: e.target.value })}
                        className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs uppercase tracking-wider text-[#C5A880] font-sans-luxury font-medium mb-3">
                        Guest Attire Color Swatches (4 Recommended Tones)
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {wedding.dressCode.palette.map((swatch, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#FAF7F2] rounded-xs border border-[#C5A880]/30 flex items-center gap-3"
                          >
                            <input
                              type="color"
                              value={swatch.hex}
                              onChange={(e) => {
                                const newPalette = [...wedding.dressCode.palette];
                                newPalette[idx] = { ...newPalette[idx], hex: e.target.value };
                                updateDressCodePalette(newPalette);
                              }}
                              className="w-9 h-9 rounded-full border border-gray-300 cursor-pointer p-0 shrink-0"
                            />
                            <div className="flex-1 space-y-1">
                              <input
                                type="text"
                                value={swatch.name}
                                onChange={(e) => {
                                  const newPalette = [...wedding.dressCode.palette];
                                  newPalette[idx] = { ...newPalette[idx], name: e.target.value };
                                  updateDressCodePalette(newPalette);
                                }}
                                className="w-full px-2 py-1 bg-white border border-[#C5A880]/40 rounded-xs text-xs font-medium"
                                placeholder="Color Name"
                              />
                              <input
                                type="text"
                                value={swatch.hex}
                                onChange={(e) => {
                                  const newPalette = [...wedding.dressCode.palette];
                                  newPalette[idx] = { ...newPalette[idx], hex: e.target.value };
                                  updateDressCodePalette(newPalette);
                                }}
                                className="w-full px-2 py-1 bg-white border border-[#C5A880]/40 rounded-xs text-[10px] font-mono"
                                placeholder="#HEX"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: RSVP, MUSIC & THEME */}
                {editorStep === 8 && (
                  <div className="space-y-6">
                    <div className="border-b border-[#C5A880]/20 pb-3">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                        Step 8 of 8 &bull; Final Polish
                      </span>
                      <h4 className="font-serif-luxury text-2xl text-[#1A3026]">
                        RSVP Deadline, Music &amp; Luxury Theme
                      </h4>
                      <p className="text-xs text-[#6B6862] mt-0.5">
                        Finalize response deadline, music details, and select your luxury theme palette.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">RSVP Deadline Date</label>
                        <input
                          type="text"
                          value={wedding.rsvp.deadline}
                          onChange={(e) =>
                            updateWedding({
                              rsvp: { ...wedding.rsvp, deadline: e.target.value },
                            })
                          }
                          placeholder="e.g. 15 November 2026"
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Max Guests Per Party</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={wedding.rsvp.maxGuests}
                          onChange={(e) =>
                            updateWedding({
                              rsvp: { ...wedding.rsvp, maxGuests: Number(e.target.value) },
                            })
                          }
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Background Song Title</label>
                        <input
                          type="text"
                          value={wedding.music.title}
                          onChange={(e) => updateMusic({ title: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1A3026] mb-1">Artist / Orchestra</label>
                        <input
                          type="text"
                          value={wedding.music.artist}
                          onChange={(e) => updateMusic({ artist: e.target.value })}
                          className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                        />
                      </div>
                    </div>

                    {/* Theme Switcher */}
                    <div className="pt-4 border-t border-[#C5A880]/20">
                      <label className="block text-xs uppercase tracking-wider text-[#C5A880] font-sans-luxury font-medium mb-3">
                        Choose Your Wedding Color Atmosphere
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PRESET_THEMES.map((th) => (
                          <button
                            key={th.id}
                            type="button"
                            onClick={() => setThemeById(th.id)}
                            className={`p-3 rounded-xs border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                              activeTheme.id === th.id
                                ? "border-[#1A3026] bg-[#FAF7F2] ring-2 ring-[#C5A880]"
                                : "border-[#C5A880]/30 bg-white hover:border-[#1A3026]"
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: th.primary }} />
                              <span className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: th.accent }} />
                            </div>
                            <span className="text-[11px] font-sans-luxury font-medium text-[#1A3026]">{th.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Walkthrough Controls (Previous / Next / Save) */}
                <div className="flex items-center justify-between pt-6 border-t border-[#C5A880]/20">
                  <button
                    onClick={() => setEditorStep((prev) => Math.max(1, prev - 1))}
                    disabled={editorStep === 1}
                    className="px-4 py-2 border border-[#C5A880]/50 rounded-xs text-xs uppercase tracking-wider font-sans-luxury flex items-center gap-1.5 disabled:opacity-30 cursor-pointer hover:bg-[#FAF7F2]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>

                  <div className="text-xs text-[#6B6862] font-sans-luxury">
                    Step {editorStep} of 8
                  </div>

                  {editorStep < 8 ? (
                    <button
                      onClick={() => {
                        triggerSaveNotification();
                        setEditorStep((prev) => Math.min(8, prev + 1));
                      }}
                      className="px-5 py-2 bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] rounded-xs text-xs uppercase tracking-wider font-sans-luxury flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4 text-[#C5A880]" />
                    </button>
                  ) : (
                    <button
                      onClick={triggerSaveNotification}
                      className="px-6 py-2 bg-[#C5A880] text-[#102119] hover:bg-[#DFCDB7] rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Complete &amp; Save All</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Optional Side-by-Side Live Preview Panel */}
              {showLivePreview && (
                <div className="bg-white rounded-xs border border-[#C5A880]/40 shadow-lg overflow-hidden flex flex-col h-[750px] sticky top-24">
                  <div className="bg-[#102119] text-[#DFCDB7] px-4 py-2.5 flex items-center justify-between text-xs border-b border-[#C5A880]/30">
                    <span className="font-sans-luxury flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Exact Live Page Preview
                    </span>
                    <Link
                      href={liveUrl}
                      target="_blank"
                      className="text-[#C5A880] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>Open in New Tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <iframe
                    src={liveUrl}
                    title="Live Wedding Invitation Preview"
                    className="w-full flex-1 border-0"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: RSVPs & GUEST LIST */}
        {activeTab === "rsvps" && (
          <div className="space-y-6">
            {/* Stat Cards - 6 Cards for Full Wedding & Separable Places */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-xs border border-[#C5A880]/30 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#6B6862] font-sans-luxury block truncate">
                  Total Attending
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{totalAttendingGuests}</span>
                  <span className="text-[10px] text-emerald-700 font-medium">({attendingList.length} parties)</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xs border-2 border-amber-300/80 shadow-xs bg-amber-50/20">
                <span className="text-[10px] uppercase tracking-wider text-amber-800 font-sans-luxury block truncate">
                  Place 1: Ceremony
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{ceremonyCount}</span>
                  <span className="text-[10px] text-amber-700 font-medium">guests</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xs border-2 border-blue-300/80 shadow-xs bg-blue-50/20">
                <span className="text-[10px] uppercase tracking-wider text-blue-800 font-sans-luxury block truncate">
                  Place 2: Reception
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{receptionCount}</span>
                  <span className="text-[10px] text-blue-700 font-medium">guests</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xs border border-[#C5A880]/30 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#6B6862] font-sans-luxury block truncate">
                  Declined
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{declinedList.length}</span>
                  <span className="text-[10px] text-red-600 font-medium">regrets</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xs border border-[#C5A880]/30 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#6B6862] font-sans-luxury block truncate">
                  Vegetarian
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{vegCount}</span>
                  <span className="text-[10px] text-[#6B6862]">caterer</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xs border border-[#C5A880]/30 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#6B6862] font-sans-luxury block truncate">
                  Non-Veg
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{nonVegCount}</span>
                  <span className="text-[10px] text-[#6B6862]">caterer</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white p-4 rounded-xs border border-[#C5A880]/30 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-[#6B6862] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guest by name or dietary note..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#C5A880]/40 rounded-xs text-xs sm:text-sm bg-[#FAF7F2] focus:outline-hidden focus:border-[#1A3026]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterEvent}
                  onChange={(e) => setFilterEvent(e.target.value)}
                  className="px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs font-sans-luxury bg-[#FAF7F2]"
                >
                  <option value="all">All Invitations &amp; Responses</option>
                  <option value="both">Both Places (Ceremony + Reception)</option>
                  <option value="reception">Place 2: Reception Attendees</option>
                  <option value="ceremony">Place 1: Ceremony Attendees</option>
                  <option value="decline">Declined Only</option>
                </select>

                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] rounded-xs text-xs uppercase tracking-wider font-sans-luxury flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  <Download className="w-4 h-4 text-[#C5A880]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xs border border-[#C5A880]/30 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF7F2] border-b border-[#C5A880]/30 text-[#1A3026] font-sans-luxury uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Guest Name</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Event Attending</th>
                    <th className="py-3 px-4">Party Size</th>
                    <th className="py-3 px-4">Meal</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Dietary Notes</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C5A880]/20 font-sans-luxury">
                  {filteredRsvps.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#6B6862] italic">
                        No RSVP responses found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-[#FAF7F2]/60">
                        <td className="py-3.5 px-4 font-medium text-[#1A3026]">{rsvp.fullName}</td>
                        <td className="py-3.5 px-4">
                          {rsvp.attendance === "accept" ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
                              Attending
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[11px] font-medium border border-red-200">
                              Declined
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {rsvp.attendance === "accept" ? (
                            rsvp.eventsAttending === "reception" ? (
                              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
                                Place 2: Reception Only
                              </span>
                            ) : rsvp.eventsAttending === "ceremony" ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-medium border border-amber-200">
                                Place 1: Ceremony Only
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200">
                                Both Places
                              </span>
                            )
                          ) : (
                            <span className="opacity-40 text-xs">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-serif-luxury text-base">
                          {rsvp.attendance === "accept" ? rsvp.guestCount : "-"}
                        </td>
                        <td className="py-3.5 px-4">
                          {rsvp.attendance === "accept" ? (
                            <span className="px-2 py-0.5 rounded-xs border border-[#C5A880]/40 bg-[#FAF7F2] text-[10px]">
                              {rsvp.mealPreference}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#6B6862]">
                          <div>{rsvp.phone || "-"}</div>
                          <div className="text-[10px] opacity-75">{rsvp.email || ""}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[#6B6862] max-w-xs truncate">
                          {rsvp.notes ? <span>&ldquo;{rsvp.notes}&rdquo;</span> : <span className="opacity-40">None</span>}
                        </td>
                        <td className="py-3.5 px-4 text-[#6B6862] text-[10px] whitespace-nowrap">
                          {new Date(rsvp.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GUEST WISHES */}
        {activeTab === "wishes" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xs border border-[#C5A880]/30 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-xl text-[#1A3026]">
                  Messages from Your Guests
                </h3>
                <p className="text-xs text-[#6B6862]">
                  Blessings and warm wishes submitted by your friends and family through your wedding invitation.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#C5A880]/40 text-xs font-serif-luxury text-[#1A3026]">
                {messages.length} Messages
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-xs border border-[#C5A880]/30 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-luxury text-lg text-[#1A3026] font-normal">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-[#C5A880] uppercase tracking-wider font-sans-luxury">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#6B6862] font-sans-luxury font-light leading-relaxed italic">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function HostPortalPage() {
  return (
    <WeddingProvider>
      <HostPortalContent />
    </WeddingProvider>
  );
}
