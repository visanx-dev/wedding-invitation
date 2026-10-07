"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Utensils,
  Download,
  PlusCircle,
  Trash2,
  Copy,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Calendar,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  FileSpreadsheet,
  Briefcase,
  DollarSign,
  Share2,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  Plus,
  X,
  CreditCard,
  Building,
  Heart,
} from "lucide-react";
import {
  useWedding,
  PRESET_THEMES,
  WeddingTheme,
  WeddingClient,
  WeddingProvider,
} from "@/context/WeddingContext";
import { wedding as defaultWedding } from "@/data/wedding";
import { getRsvps, isSupabaseConfigured } from "@/lib/supabase";

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

// Initial realistic sample RSVPs for demonstration if none exist
const DEMO_RSVPS: RSVPRecord[] = [
  {
    id: "rsvp-101",
    fullName: "Dr. & Mrs. Janaka Perera",
    email: "janaka.perera@example.com",
    phone: "+94 77 234 5678",
    guestCount: 2,
    attendance: "accept",
    eventsAttending: "both",
    mealPreference: "Non-Vegetarian",
    notes: "Thrilled to celebrate with you both! Table near family if possible.",
    timestamp: "2026-10-06T14:32:00.000Z",
  },
  {
    id: "rsvp-102",
    fullName: "Aravinda & Dinithi De Silva",
    email: "aravinda@desilva.lk",
    phone: "+94 71 889 2211",
    guestCount: 2,
    attendance: "accept",
    eventsAttending: "reception",
    mealPreference: "Vegetarian",
    notes: "Strict vegetarian for Dinithi. Counting down the days to the evening reception!",
    timestamp: "2026-10-06T18:15:00.000Z",
  },
  {
    id: "rsvp-103",
    fullName: "Kavinda Wickramasinghe",
    email: "kavinda.w@gmail.com",
    phone: "+94 76 543 2190",
    guestCount: 1,
    attendance: "accept",
    eventsAttending: "ceremony",
    mealPreference: "Non-Vegetarian",
    notes: "Honored to witness the auspicious morning ceremony.",
    timestamp: "2026-10-07T09:20:00.000Z",
  },
  {
    id: "rsvp-104",
    fullName: "Mr. Samantha Fernando",
    email: "samantha.f@yahoo.com",
    phone: "+94 77 999 8888",
    guestCount: 1,
    attendance: "decline",
    eventsAttending: "none",
    mealPreference: "Non-Vegetarian",
    notes: "Sending all my love and heartfelt blessings from overseas! Sadly cannot attend.",
    timestamp: "2026-10-07T11:45:00.000Z",
  },
];

function AdminDashboardContent() {
  const {
    wedding,
    clients,
    activeClientId,
    activeTheme,
    switchClient,
    createClient,
    deleteClient,
    updateClientStatus,
    setThemeById,
    updateCouple,
    updateEvent,
    updateVenue,
    resetToDefault,
    exportConfigJson,
  } = useWedding();

  const [activeTab, setActiveTab] = useState<
    "clients" | "rsvps" | "customizer" | "business" | "export"
  >("clients");
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [clientFilterStatus, setClientFilterStatus] = useState<string>("all");
  const [filterAttendance, setFilterAttendance] = useState<
    "all" | "accept" | "decline"
  >("all");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedClientLink, setCopiedClientLink] = useState<string | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  // New Client Form State
  const [newGroomName, setNewGroomName] = useState("");
  const [newBrideName, setNewBrideName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDate, setNewDate] = useState("20 December 2026");
  const [newCity, setNewCity] = useState("Colombo, Sri Lanka");
  const [newVenue, setNewVenue] = useState("Cinnamon Grand Hotel");
  const [newPackage, setNewPackage] = useState("Royal Platinum");
  const [newPrice, setNewPrice] = useState(799);
  const [newPaymentStatus, setNewPaymentStatus] = useState<
    "Paid" | "Deposit" | "Pending"
  >("Paid");
  const [newThemeId, setNewThemeId] = useState("royal-emerald");
  const [newNotes, setNewNotes] = useState("");

  // Load RSVPs from Supabase or localStorage
  const loadRsvps = async () => {
    try {
      const data = await getRsvps(activeClientId);
      if (Array.isArray(data) && data.length > 0) {
        setRsvps(data);
        return;
      }
      setRsvps(DEMO_RSVPS);
    } catch (e) {
      console.error("Could not load RSVPs", e);
    }
  };

  useEffect(() => {
    loadRsvps();
    const handleUpdate = () => loadRsvps();
    window.addEventListener("rsvp_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("rsvp_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [activeClientId]);

  // Compute RSVP Stats
  const attendingList = rsvps.filter((r) => r.attendance === "accept");
  const declinedList = rsvps.filter((r) => r.attendance === "decline");
  const totalAttendingGuests = attendingList.reduce(
    (acc, curr) => acc + (curr.guestCount || 1),
    0
  );
  const ceremonyCount = attendingList
    .filter((r) => !r.eventsAttending || r.eventsAttending === "both" || r.eventsAttending === "ceremony")
    .reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const receptionCount = attendingList
    .filter((r) => !r.eventsAttending || r.eventsAttending === "both" || r.eventsAttending === "reception")
    .reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const vegetarianCount = attendingList
    .filter((r) => r.mealPreference === "Vegetarian")
    .reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const nonVegCount = totalAttendingGuests - vegetarianCount;

  // Real Business Metrics
  const totalClients = clients.length;
  const activeClientsCount = clients.filter((c) => c.status === "Active").length;
  const grossRevenue = clients.reduce((sum, c) => sum + (c.price || 0), 0);
  const pendingRevenue = clients
    .filter((c) => c.paymentStatus !== "Paid")
    .reduce((sum, c) => sum + (c.paymentStatus === "Deposit" ? (c.price || 0) * 0.5 : (c.price || 0)), 0);
  const avgPackagePrice = totalClients > 0 ? Math.round(grossRevenue / totalClients) : 0;

  // Filtered Clients for CRM
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.coupleTitle.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.clientEmail.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.venueName.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.clientPhone.toLowerCase().includes(clientSearch.toLowerCase());
    const matchesStatus =
      clientFilterStatus === "all" || c.status === clientFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const [filterEvent, setFilterEvent] = useState<string>("all");

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterAttendance === "all" || r.attendance === filterAttendance;
    const matchesEvent =
      filterEvent === "all" ||
      (filterEvent === "both" && (!r.eventsAttending || r.eventsAttending === "both")) ||
      (filterEvent === "reception" && (r.eventsAttending === "reception" || !r.eventsAttending || r.eventsAttending === "both")) ||
      (filterEvent === "ceremony" && (r.eventsAttending === "ceremony" || !r.eventsAttending || r.eventsAttending === "both"));
    return matchesSearch && matchesFilter && matchesEvent;
  });

  // Add Simulation Test RSVP
  const handleAddTestRsvp = () => {
    const names = [
      "Malik & Natasha Alwis",
      "Suresh Gunawardena",
      "Dr. Roshan & Chathuri Silva",
      "Nalaka Jayasuriya",
      "Dilshan & Anoma Mendis",
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const isAttending = Math.random() > 0.2;
    const count = isAttending ? Math.floor(Math.random() * 2) + 1 : 1;
    const isVeg = Math.random() > 0.5;
    const eventsAttending: "both" | "ceremony" | "reception" | "none" = isAttending
      ? Math.random() > 0.4
        ? "both"
        : Math.random() > 0.5
        ? "reception"
        : "ceremony"
      : "none";

    const newRecord: RSVPRecord = {
      id: `rsvp-test-${Date.now()}`,
      fullName: randomName,
      email: `${randomName.toLowerCase().replace(/[^a-z]/g, "")}@example.com`,
      phone: "+94 77 " + Math.floor(1000000 + Math.random() * 9000000),
      guestCount: count,
      attendance: isAttending ? "accept" : "decline",
      eventsAttending: eventsAttending,
      mealPreference: isVeg ? "Vegetarian" : "Non-Vegetarian",
      notes: isAttending
        ? "Looking forward to celebrating this magical day!"
        : "Sending warmest congratulations from London.",
      timestamp: new Date().toISOString(),
    };

    const updated = [newRecord, ...rsvps];
    setRsvps(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wedding_rsvps", JSON.stringify(updated));
    }
  };

  // Clear RSVPs
  const handleClearRsvps = () => {
    if (confirm("Are you sure you want to clear all RSVP responses? This cannot be undone.")) {
      setRsvps([]);
      if (typeof window !== "undefined") {
        localStorage.setItem("wedding_rsvps", JSON.stringify([]));
      }
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      "Guest Name",
      "Attendance",
      "Events Invited / Attending",
      "Number of Guests",
      "Meal Preference",
      "Email",
      "Phone",
      "Dietary Notes / Message",
      "Submitted At",
    ];

    const rows = rsvps.map((r) => [
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.attendance === "accept" ? "Attending" : "Declined",
      `"${r.eventsAttending === "reception" ? "Reception Only" : r.eventsAttending === "ceremony" ? "Ceremony Only" : "Both Events"}"`,
      r.guestCount,
      `"${r.mealPreference}"`,
      `"${r.email || ""}"`,
      `"${r.phone || ""}"`,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
      new Date(r.timestamp).toLocaleString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${wedding.couple.groom.firstName}-${wedding.couple.bride.firstName}-RSVP-List.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Production Code
  const handleCopyCode = () => {
    const code = `import { WeddingConfig } from "./wedding";\n\nexport const wedding: WeddingConfig = ${exportConfigJson()};`;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    });
  };

  // Copy Client Host Portal Link
  const handleCopyClientLink = (clientId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const portalUrl = `${origin}/portal?client=${clientId}`;
    navigator.clipboard.writeText(portalUrl).then(() => {
      setCopiedClientLink(clientId);
      setTimeout(() => setCopiedClientLink(null), 3000);
    });
  };

  // Handle Create New Client
  const handleCreateNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroomName.trim() || !newBrideName.trim()) {
      alert("Please enter groom and bride names.");
      return;
    }

    const clientId = `${newGroomName.toLowerCase().replace(/[^a-z]/g, "")}-${newBrideName
      .toLowerCase()
      .replace(/[^a-z]/g, "")}`;

    const newConfig = {
      ...defaultWedding,
      couple: {
        ...defaultWedding.couple,
        groom: {
          firstName: newGroomName.split(" ")[0] || newGroomName,
          fullName: newGroomName,
          parents: "Son of proud parents",
        },
        bride: {
          firstName: newBrideName.split(" ")[0] || newBrideName,
          fullName: newBrideName,
          parents: "Daughter of proud parents",
        },
        monogram: `${newGroomName.charAt(0).toUpperCase()} & ${newBrideName.charAt(0).toUpperCase()}`,
        hashtag: `#${newGroomName.split(" ")[0]}Weds${newBrideName.split(" ")[0]}`,
      },
      event: {
        ...defaultWedding.event,
        dateFormatted: newDate,
        displayLocation: newCity,
      },
      venue: {
        ...defaultWedding.venue,
        name: newVenue,
        city: newCity,
      },
    };

    createClient({
      id: clientId,
      coupleTitle: `${newGroomName.split(" ")[0]} & ${newBrideName.split(" ")[0]}`,
      clientEmail: newEmail || `${clientId}@example.com`,
      clientPhone: newPhone || "+94 77 000 0000",
      weddingDate: newDate,
      venueName: newVenue,
      status: "Active",
      packageTier: newPackage,
      price: Number(newPrice),
      paymentStatus: newPaymentStatus,
      themeId: newThemeId,
      totalGuestsExpected: 200,
      notes: newNotes,
      config: newConfig,
    });

    setShowAddClientModal(false);
    // Reset form
    setNewGroomName("");
    setNewBrideName("");
    setNewEmail("");
    setNewPhone("");
    setNewNotes("");
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A3026]">
      {/* Top Header Bar */}
      <header className="bg-[#102119] text-[#FAF7F2] border-b border-[#C5A880]/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#C5A880] flex items-center justify-center bg-[#1A3026] text-[#C5A880]">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-serif-luxury text-[#FAF7F2] tracking-wide">
                LuxeWedding SaaS &bull; Developer Agency Console
              </h1>
              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C5A880] text-[#102119] font-medium">
                Agency Mode
              </span>
            </div>
            <p className="text-xs text-[#DFCDB7] font-sans-luxury">
              Active Client:{" "}
              <strong className="text-[#C5A880]">
                {wedding.couple.groom.firstName} &amp; {wedding.couple.bride.firstName}
              </strong>{" "}
              ({wedding.event.dateFormatted} &bull; {wedding.venue.name})
            </p>
          </div>
        </div>

        {/* Global Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Client Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#1A3026] border border-[#C5A880]/40 rounded-sm px-2.5 py-1.5">
            <span className="text-[10px] uppercase text-[#DFCDB7] font-sans-luxury">Switch:</span>
            <select
              value={activeClientId}
              onChange={(e) => switchClient(e.target.value)}
              className="bg-transparent text-xs text-[#FAF7F2] font-sans-luxury focus:outline-hidden cursor-pointer"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#102119] text-[#FAF7F2]">
                  {c.coupleTitle} ({c.weddingDate})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddClientModal(true)}
            className="px-3.5 py-1.5 rounded-sm bg-[#C5A880] hover:bg-[#DFCDB7] text-[#102119] text-xs uppercase tracking-wider font-sans-luxury font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Client</span>
          </button>

          <Link
            href={`/portal?client=${activeClientId}`}
            target="_blank"
            className="px-3 py-1.5 rounded-sm bg-[#1A3026] hover:bg-[#2A483B] text-[#DFCDB7] border border-[#C5A880]/40 text-xs uppercase tracking-wider font-sans-luxury font-medium transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Open Couple Portal</span>
          </Link>

          <Link
            href={`/?client=${activeClientId}`}
            target="_blank"
            className="px-3 py-1.5 rounded-sm bg-[#1A3026] hover:bg-[#2A483B] text-[#FAF7F2] border border-[#C5A880]/40 text-xs uppercase tracking-wider font-sans-luxury font-medium transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>View Live Site</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Business KPI Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xs border border-[#C5A880]/30 shadow-xs">
            <div className="flex items-center justify-between text-[#6B6862] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-sans-luxury">Host Clients</span>
              <Users className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif-luxury text-[#1A3026]">{totalClients}</span>
              <span className="text-xs text-emerald-700 font-medium">({activeClientsCount} live)</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xs border border-[#C5A880]/30 shadow-xs">
            <div className="flex items-center justify-between text-[#6B6862] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-sans-luxury">Gross Booked</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif-luxury text-[#1A3026]">${grossRevenue}</span>
              <span className="text-xs text-[#6B6862]">USD</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xs border border-[#C5A880]/30 shadow-xs">
            <div className="flex items-center justify-between text-[#6B6862] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-sans-luxury">Pending Payments</span>
              <CreditCard className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif-luxury text-[#1A3026]">${pendingRevenue}</span>
              <span className="text-xs text-amber-700 font-medium">to collect</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xs border border-[#C5A880]/30 shadow-xs">
            <div className="flex items-center justify-between text-[#6B6862] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-sans-luxury">RSVPs Headcount</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif-luxury text-[#1A3026]">{totalAttendingGuests}</span>
              <span className="text-xs text-[#6B6862]">attending</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xs border border-[#C5A880]/30 shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-[#6B6862] mb-1">
              <span className="text-[11px] uppercase tracking-wider font-sans-luxury">Avg / Wedding</span>
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif-luxury text-[#1A3026]">${avgPackagePrice}</span>
              <span className="text-xs text-[#6B6862]">per couple</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#C5A880]/30 bg-white rounded-t-sm shadow-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-sans-luxury font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "clients"
                ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
            }`}
          >
            <Briefcase className="w-4 h-4 text-[#C5A880]" />
            <span>Wedding Host Customers (CRM) ({clients.length})</span>
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
            <span>Active RSVP Tracker ({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("customizer")}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-sans-luxury font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "customizer"
                ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
            }`}
          >
            <Sliders className="w-4 h-4 text-[#C5A880]" />
            <span>Theme &amp; Quick Editor</span>
          </button>

          <button
            onClick={() => setActiveTab("business")}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-sans-luxury font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "business"
                ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span>Business &amp; RSVP Database Guide</span>
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-sans-luxury font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "export"
                ? "border-[#1A3026] text-[#1A3026] bg-[#FAF7F2]"
                : "border-transparent text-[#6B6862] hover:text-[#1A3026]"
            }`}
          >
            <Download className="w-4 h-4 text-[#C5A880]" />
            <span>Export Code for Production</span>
          </button>
        </div>

        {/* TAB 1: WEDDING HOST CUSTOMERS (CRM) */}
        {activeTab === "clients" && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-xs border border-[#C5A880]/30 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-[#6B6862] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer by couple names, email, phone, venue..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#C5A880]/40 rounded-xs text-xs sm:text-sm bg-[#FAF7F2] focus:outline-hidden focus:border-[#1A3026]"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={clientFilterStatus}
                  onChange={(e) => setClientFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs font-sans-luxury bg-[#FAF7F2]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active / Live</option>
                  <option value="Draft">Drafting</option>
                  <option value="Delivered">Delivered</option>
                </select>

                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="px-4 py-2 bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#C5A880]" />
                  <span>Onboard New Wedding Client</span>
                </button>
              </div>
            </div>

            {/* Customers CRM Cards & Table */}
            <div className="space-y-4">
              {filteredClients.map((c) => {
                const isActive = c.id === activeClientId;
                return (
                  <div
                    key={c.id}
                    className={`bg-white p-6 rounded-xs border transition-all shadow-xs ${
                      isActive
                        ? "border-[#1A3026] ring-2 ring-[#C5A880]/60 bg-[#FDFBF7]"
                        : "border-[#C5A880]/30 hover:border-[#C5A880]"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      {/* Left: Client Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full border border-[#C5A880] flex items-center justify-center bg-[#1A3026] text-[#DFCDB7] shrink-0 font-serif-luxury font-medium text-base">
                          {c.config.couple.monogram || c.coupleTitle.slice(0, 3)}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1A3026]">
                              {c.coupleTitle}
                            </h3>
                            {isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium border border-emerald-300">
                                Live Active Invitation
                              </span>
                            )}
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                                c.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : c.status === "Draft"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B6862] font-sans-luxury mt-1.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                              {c.weddingDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                              {c.venueName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                              {c.clientEmail}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                              {c.clientPhone}
                            </span>
                          </div>

                          {c.notes && (
                            <p className="text-xs text-[#6B6862] font-sans-luxury italic mt-2 bg-[#FAF7F2] p-2 rounded-xs border border-[#C5A880]/20 max-w-xl">
                              &ldquo;{c.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Middle: Package & Payment Badge */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t lg:border-t-0 lg:border-l border-[#C5A880]/20 pt-4 lg:pt-0 lg:pl-6 shrink-0">
                        <div>
                          <span className="text-[10px] uppercase text-[#6B6862] block font-sans-luxury">
                            Package &amp; Fee
                          </span>
                          <span className="font-serif-luxury text-xl text-[#1A3026] block">
                            ${c.price}{" "}
                            <span className="text-xs font-sans-luxury text-[#6B6862]">
                              ({c.packageTier})
                            </span>
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block mt-1 ${
                              c.paymentStatus === "Paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : c.paymentStatus === "Deposit"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            Payment: {c.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto border-t lg:border-t-0 border-[#C5A880]/20 pt-4 lg:pt-0">
                        {!isActive ? (
                          <button
                            onClick={() => switchClient(c.id)}
                            className="px-3 py-1.5 bg-[#1A3026] hover:bg-[#102119] text-[#FAF7F2] rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>Set Live</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active</span>
                          </span>
                        )}

                        <Link
                          href={`/portal?client=${c.id}`}
                          target="_blank"
                          className="px-3 py-1.5 border border-[#C5A880] hover:bg-[#FAF7F2] text-[#1A3026] rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all flex items-center gap-1"
                          title="Open the private host walkthrough editor for this couple"
                        >
                          <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>Host Portal</span>
                        </Link>

                        <Link
                          href={`/?client=${c.id}`}
                          target="_blank"
                          className="px-3 py-1.5 border border-[#C5A880]/50 hover:bg-[#FAF7F2] text-[#1A3026] rounded-xs text-xs uppercase tracking-wider font-sans-luxury transition-all flex items-center gap-1"
                          title="Open this client's public invitation"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>View Live</span>
                        </Link>

                        <button
                          onClick={() => handleCopyClientLink(c.id)}
                          className="px-3 py-1.5 border border-[#C5A880]/50 hover:bg-[#FAF7F2] text-[#1A3026] rounded-xs text-xs uppercase tracking-wider font-sans-luxury transition-all flex items-center gap-1 cursor-pointer"
                          title="Copy Couple Host Portal Link to send on WhatsApp"
                        >
                          {copiedClientLink === c.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5 text-[#C5A880]" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => deleteClient(c.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                          title="Remove Client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE RSVP TRACKER */}
        {activeTab === "rsvps" && (
          <div className="space-y-6">
            {/* Supabase Connection Status Banner */}
            <div
              className={`p-4 rounded-xs border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans-luxury ${
                isSupabaseConfigured()
                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                  : "bg-amber-50/70 border-amber-300/80 text-amber-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isSupabaseConfigured() ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                <div>
                  <span className="font-medium tracking-wide block">
                    {isSupabaseConfigured()
                      ? "Supabase Live Database Connected • Real-time Cross-Device Sync Active"
                      : "Local Storage Mode • Connect Supabase to sync RSVPs live across all guests' smartphones"}
                  </span>
                  <span className="block text-[11px] opacity-75 mt-0.5">
                    {isSupabaseConfigured()
                      ? "RSVP submissions from all guests are directly stored in your PostgreSQL cloud database."
                      : "Run supabase-schema.sql in your Supabase dashboard and add keys to .env.local"}
                  </span>
                </div>
              </div>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xs border border-current font-medium text-[11px] uppercase tracking-wider hover:bg-black/5 shrink-0 flex items-center gap-1"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* RSVP KPIs - 6 Cards for Both Places and Individual Events */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-xs border border-[#C5A880]/30 shadow-xs">
                <div className="flex items-center justify-between text-[#6B6862] mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-sans-luxury truncate">Total Guests</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{totalAttendingGuests}</span>
                  <span className="text-[10px] text-[#6B6862]">({attendingList.length} rsvps)</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xs border-2 border-amber-300/80 shadow-xs bg-amber-50/20">
                <div className="flex items-center justify-between text-amber-800 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-sans-luxury truncate">Place 1: Ceremony</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{ceremonyCount}</span>
                  <span className="text-[10px] text-amber-700">headcount</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xs border-2 border-blue-300/80 shadow-xs bg-blue-50/20">
                <div className="flex items-center justify-between text-blue-800 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-sans-luxury truncate">Place 2: Reception</span>
                  <Heart className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{receptionCount}</span>
                  <span className="text-[10px] text-blue-700">headcount</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xs border border-[#C5A880]/30 shadow-xs">
                <div className="flex items-center justify-between text-[#6B6862] mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-sans-luxury truncate">Declined</span>
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{declinedList.length}</span>
                  <span className="text-[10px] text-[#6B6862]">regrets</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xs border border-[#C5A880]/30 shadow-xs">
                <div className="flex items-center justify-between text-[#6B6862] mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-sans-luxury truncate">Vegetarian</span>
                  <Utensils className="w-3.5 h-3.5 text-[#C5A880]" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{vegetarianCount}</span>
                  <span className="text-[10px] text-[#6B6862]">caterer</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xs border border-[#C5A880]/30 shadow-xs">
                <div className="flex items-center justify-between text-[#6B6862] mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-sans-luxury truncate">Non-Veg</span>
                  <Utensils className="w-3.5 h-3.5 text-[#1A3026]" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-serif-luxury text-[#1A3026]">{nonVegCount}</span>
                  <span className="text-[10px] text-[#6B6862]">caterer</span>
                </div>
              </div>
            </div>

            {/* Actions Bar & Search */}
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
                  <option value="all">All Events &amp; Invites</option>
                  <option value="both">Both Places (Ceremony + Reception)</option>
                  <option value="reception">Place 2: Reception Attendees</option>
                  <option value="ceremony">Place 1: Ceremony Attendees</option>
                  <option value="decline">Declined Only</option>
                </select>

                <select
                  value={filterAttendance}
                  onChange={(e) => setFilterAttendance(e.target.value as any)}
                  className="px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs font-sans-luxury bg-[#FAF7F2]"
                >
                  <option value="all">All Responses</option>
                  <option value="accept">Attending Only</option>
                  <option value="decline">Declined Only</option>
                </select>

                <button
                  onClick={handleAddTestRsvp}
                  className="px-3 py-2 border border-[#C5A880] text-[#1A3026] hover:bg-[#FAF7F2] rounded-xs text-xs uppercase tracking-wider font-sans-luxury flex items-center gap-1.5 cursor-pointer"
                  title="Simulate a real-time guest submission"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Simulate RSVP</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="px-3 py-2 bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] rounded-xs text-xs uppercase tracking-wider font-sans-luxury flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleClearRsvps}
                  className="p-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-xs cursor-pointer"
                  title="Clear all RSVPs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Guest Table */}
            <div className="bg-white rounded-xs border border-[#C5A880]/30 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF7F2] border-b border-[#C5A880]/30 text-[#1A3026] font-sans-luxury uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Guest Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Event Attending</th>
                    <th className="py-3 px-4">Party Size</th>
                    <th className="py-3 px-4">Meal Preference</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Dietary Notes / Wishes</th>
                    <th className="py-3 px-4">Submitted</th>
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

        {/* TAB 3: THEME & QUICK CUSTOMIZER */}
        {activeTab === "customizer" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xs border border-[#C5A880]/30 shadow-xs space-y-6">
              <div>
                <h3 className="font-serif-luxury text-2xl text-[#1A3026]">
                  Active Client Quick Configurator
                </h3>
                <p className="text-xs text-[#6B6862]">
                  Quickly change core details for {wedding.couple.groom.firstName} &amp; {wedding.couple.bride.firstName}. For full walkthrough, use the Host Portal.
                </p>
              </div>

              {/* Theme Palettes */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A880] font-sans-luxury font-medium mb-3">
                  Theme Preset Atmosphere
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PRESET_THEMES.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => setThemeById(th.id)}
                      className={`p-4 rounded-xs border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                        activeTheme.id === th.id
                          ? "border-[#1A3026] bg-[#FAF7F2] ring-2 ring-[#C5A880]"
                          : "border-[#C5A880]/30 bg-white hover:border-[#1A3026]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: th.primary }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: th.accent }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-gray-200 shadow-xs"
                          style={{ backgroundColor: th.background }}
                        />
                      </div>
                      <div>
                        <span className="font-serif-luxury text-base text-[#1A3026] font-normal block">
                          {th.name}
                        </span>
                        <span className="text-[10px] text-[#6B6862] font-mono">
                          {th.primary} / {th.accent}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Couple Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#C5A880]/20">
                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">Groom Name</label>
                  <input
                    type="text"
                    value={wedding.couple.groom.fullName}
                    onChange={(e) =>
                      updateCouple({
                        groom: {
                          ...wedding.couple.groom,
                          fullName: e.target.value,
                          firstName: e.target.value.split(" ")[0] || e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">Bride Name</label>
                  <input
                    type="text"
                    value={wedding.couple.bride.fullName}
                    onChange={(e) =>
                      updateCouple({
                        bride: {
                          ...wedding.couple.bride,
                          fullName: e.target.value,
                          firstName: e.target.value.split(" ")[0] || e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                  />
                </div>
              </div>

              {/* Quick Venue & Date */}
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
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">Wedding Date</label>
                  <input
                    type="text"
                    value={wedding.event.dateFormatted}
                    onChange={(e) => updateEvent({ dateFormatted: e.target.value })}
                    className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-sm bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#C5A880]/20">
                <button
                  onClick={resetToDefault}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-[#6B6862] rounded-xs text-xs uppercase tracking-wider font-sans-luxury cursor-pointer"
                >
                  Reset Active Client to Defaults
                </button>

                <Link
                  href={`/portal?client=${activeClientId}`}
                  target="_blank"
                  className="px-5 py-2 bg-[#1A3026] hover:bg-[#102119] text-[#FAF7F2] rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all shadow-xs flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Open Full Host Portal Walkthrough</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REAL BUSINESS & RSVP DATABASE GUIDE */}
        {activeTab === "business" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#C5A880]/30 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                  Commercial SaaS Agency Operations
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1A3026]">
                  How to Run &amp; Scale Your Wedding Agency Business
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-5 bg-[#FAF7F2] rounded-xs border border-[#C5A880]/30 space-y-2">
                  <span className="text-[11px] font-sans-luxury uppercase text-[#C5A880] font-medium block">
                    Step 1 &bull; Package Sales
                  </span>
                  <h4 className="font-serif-luxury text-lg text-[#1A3026]">
                    Offer 3 Lucrative Tiers
                  </h4>
                  <p className="text-xs text-[#6B6862] leading-relaxed">
                    <strong>Luxury Gold ($499):</strong> Standard digital invitation + RSVP form + calendar download.
                    <br />
                    <strong>Royal Platinum ($799):</strong> Custom domain + audio melody player + host walkthrough portal + catering CSV.
                    <br />
                    <strong>Signature Bespoke ($1,299):</strong> Multi-day schedule + WhatsApp distribution + personalized guest cards.
                  </p>
                </div>

                <div className="p-5 bg-[#FAF7F2] rounded-xs border border-[#C5A880]/30 space-y-2">
                  <span className="text-[11px] font-sans-luxury uppercase text-[#C5A880] font-medium block">
                    Step 2 &bull; Client Delivery
                  </span>
                  <h4 className="font-serif-luxury text-lg text-[#1A3026]">
                    Zero-Headache Client Onboarding
                  </h4>
                  <p className="text-xs text-[#6B6862] leading-relaxed">
                    1. Onboard couple in this panel with 1 click.
                    <br />
                    2. Click <strong>&ldquo;Copy Link&rdquo;</strong> to send the couple their private <code>/portal?client=ID</code> walkthrough link on WhatsApp.
                    <br />
                    3. The couple customizes their quotes, reviews their RSVP headcounts, and exports catering reports with no developer intervention!
                  </p>
                </div>

                <div className="p-5 bg-[#FAF7F2] rounded-xs border border-[#C5A880]/30 space-y-2">
                  <span className="text-[11px] font-sans-luxury uppercase text-[#C5A880] font-medium block">
                    Step 3 &bull; Production Database
                  </span>
                  <h4 className="font-serif-luxury text-lg text-[#1A3026]">
                    RSVP Storage Architecture
                  </h4>
                  <p className="text-xs text-[#6B6862] leading-relaxed">
                    RSVPs currently store in browser <code>localStorage</code> with live synchronization. For live production scaling with 1,000+ simultaneous guests, plug into Supabase or Google Sheets in minutes.
                  </p>
                </div>
              </div>

              {/* Database Code Snippets */}
              <div className="p-5 bg-[#102119] text-[#FAF7F2] rounded-xs space-y-3 font-mono text-xs">
                <span className="text-[#C5A880] uppercase tracking-wider block font-sans-luxury text-[11px] font-medium">
                  Production Database Schema (Supabase / Postgres)
                </span>
                <pre className="text-[#DFCDB7] overflow-x-auto p-2 bg-[#1A3026] rounded-xs">
{`CREATE TABLE wedding_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  attendance TEXT CHECK (attendance IN ('accept', 'decline')),
  guest_count INT DEFAULT 1,
  meal_preference TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PRODUCTION CODE EXPORTER */}
        {activeTab === "export" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xs border border-[#C5A880]/30 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-[#1A3026]">
                    Export Production Code for {wedding.couple.groom.firstName} &amp; {wedding.couple.bride.firstName}
                  </h3>
                  <p className="text-xs text-[#6B6862]">
                    Copy and paste this TypeScript configuration directly into <code>data/wedding.ts</code> for zero-runtime static deployment.
                  </p>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#C5A880]" />
                      <span>Copy Code Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="bg-[#102119] text-[#DFCDB7] p-5 rounded-xs text-xs font-mono overflow-x-auto max-h-[500px] border border-[#C5A880]/20">
                  {`import { WeddingConfig } from "./wedding";\n\nexport const wedding: WeddingConfig = ${exportConfigJson()};`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ONBOARD NEW WEDDING CLIENT MODAL */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-xs border border-[#C5A880] shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#C5A880]/30 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans-luxury font-medium">
                  Client CRM
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#1A3026]">
                  Onboard New Wedding Client
                </h3>
              </div>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="p-1 text-[#6B6862] hover:text-[#1A3026] rounded-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewClient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">
                    Groom Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroomName}
                    onChange={(e) => setNewGroomName(e.target.value)}
                    placeholder="e.g. Kasun Fernando"
                    className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">
                    Bride Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrideName}
                    onChange={(e) => setNewBrideName(e.target.value)}
                    placeholder="e.g. Dilini Jayawardena"
                    className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">
                    Client WhatsApp / Phone
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">
                    Wedding Date
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. 20 December 2026"
                    className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">
                    City / Destination
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Colombo, Sri Lanka"
                    className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A3026] mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="e.g. Cinnamon Grand Colombo"
                  className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">
                    Package Tier
                  </label>
                  <select
                    value={newPackage}
                    onChange={(e) => {
                      setNewPackage(e.target.value);
                      if (e.target.value === "Luxury Gold") setNewPrice(499);
                      if (e.target.value === "Royal Platinum") setNewPrice(799);
                      if (e.target.value === "Signature Bespoke") setNewPrice(1299);
                    }}
                    className="w-full px-2 py-1.5 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                  >
                    <option value="Luxury Gold">Luxury Gold ($499)</option>
                    <option value="Royal Platinum">Royal Platinum ($799)</option>
                    <option value="Signature Bespoke">Signature Bespoke ($1,299)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">
                    Price ($ USD)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1A3026] mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                  >
                    <option value="Paid">Paid in Full</option>
                    <option value="Deposit">Deposit Received</option>
                    <option value="Pending">Payment Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A3026] mb-1">
                  Initial Theme Atmosphere
                </label>
                <select
                  value={newThemeId}
                  onChange={(e) => setNewThemeId(e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                >
                  <option value="royal-emerald">Royal Emerald &amp; Gold</option>
                  <option value="velvet-burgundy">Velvet Burgundy &amp; Antique Gold</option>
                  <option value="coastal-navy">Coastal Sapphire &amp; Champagne</option>
                  <option value="blush-romance">Blush Rose &amp; Warm Bronze</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A3026] mb-1">
                  Customer Notes &amp; Requests
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Couple requested traditional Poruwa ceremony schedule and vegan meal options."
                  className="w-full px-3 py-2 border border-[#C5A880]/40 rounded-xs text-xs bg-[#FAF7F2]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#C5A880]/20">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xs text-xs text-[#6B6862] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A3026] text-[#FAF7F2] hover:bg-[#102119] rounded-xs text-xs uppercase tracking-wider font-sans-luxury font-medium transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Onboard &amp; Activate Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <WeddingProvider>
      <AdminDashboardContent />
    </WeddingProvider>
  );
}
