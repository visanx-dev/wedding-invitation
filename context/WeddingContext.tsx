"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { wedding as defaultWedding, WeddingConfig } from "@/data/wedding";

export interface WeddingTheme {
  id: string;
  name: string;
  primary: string; // Dark / Brand color (hero bg, primary text, buttons)
  primaryDark: string;
  accent: string; // Gold / Metallic accent
  accentLight: string;
  background: string; // Ivory / Cream
  cardBg: string;
}

export interface WeddingClient {
  id: string;
  coupleTitle: string;
  clientEmail: string;
  clientPhone: string;
  weddingDate: string;
  venueName: string;
  status: "Active" | "Draft" | "Delivered";
  packageTier: string;
  price: number;
  paymentStatus: "Paid" | "Deposit" | "Pending";
  themeId: string;
  config: WeddingConfig;
  notes?: string;
  totalGuestsExpected?: number;
  createdAt: string;
}

export const PRESET_THEMES: WeddingTheme[] = [
  {
    id: "royal-emerald",
    name: "Royal Emerald & Gold",
    primary: "#1A3026",
    primaryDark: "#102119",
    accent: "#C5A880",
    accentLight: "#DFCDB7",
    background: "#FAF7F2",
    cardBg: "#FDFBF7",
  },
  {
    id: "velvet-burgundy",
    name: "Velvet Burgundy & Antique Gold",
    primary: "#3B141E",
    primaryDark: "#240B12",
    accent: "#D4AF37",
    accentLight: "#EED789",
    background: "#FAF5F5",
    cardBg: "#FDFCFC",
  },
  {
    id: "coastal-navy",
    name: "Coastal Sapphire & Champagne",
    primary: "#14253D",
    primaryDark: "#0B1524",
    accent: "#CBA674",
    accentLight: "#E8D2B4",
    background: "#F6F8FB",
    cardBg: "#FAFBFC",
  },
  {
    id: "blush-romance",
    name: "Blush Rose & Warm Bronze",
    primary: "#3D222A",
    primaryDark: "#261319",
    accent: "#C98A78",
    accentLight: "#E5BBB0",
    background: "#FAF5F3",
    cardBg: "#FCF8F7",
  },
];

const INITIAL_CLIENTS: WeddingClient[] = [
  {
    id: "amal-nethmi",
    coupleTitle: "Amal & Nethmi",
    clientEmail: "amal.senanayake@example.com",
    clientPhone: "+94 77 123 4567",
    weddingDate: "18 December 2026",
    venueName: "Shangri-La Colombo",
    status: "Active",
    packageTier: "Royal Platinum",
    price: 799,
    paymentStatus: "Paid",
    themeId: "royal-emerald",
    totalGuestsExpected: 200,
    notes: "Sri Lankan traditional luxury Poruwa ceremony followed by evening grand banquet.",
    config: defaultWedding,
    createdAt: "2026-09-15T10:00:00.000Z",
  },
  {
    id: "arjun-priya",
    coupleTitle: "Arjun & Priya",
    clientEmail: "arjun.singhania@example.com",
    clientPhone: "+91 98200 12345",
    weddingDate: "14 February 2027",
    venueName: "The Oberoi Udaivilas",
    status: "Active",
    packageTier: "Signature Bespoke",
    price: 1299,
    paymentStatus: "Paid",
    themeId: "velvet-burgundy",
    totalGuestsExpected: 350,
    notes: "Udaipur palace destination wedding with lakeside ceremony and royal banquet.",
    config: {
      ...defaultWedding,
      couple: {
        groom: {
          firstName: "Arjun",
          fullName: "Arjun Singhania",
          parents: "Son of Mr. & Mrs. Vikram Singhania",
        },
        bride: {
          firstName: "Priya",
          fullName: "Priya Kapoor",
          parents: "Daughter of Dr. & Mrs. Rajesh Kapoor",
        },
        monogram: "A & P",
        hashtag: "#ArjunWedsPriya",
        invitationPreamble: "With the blessings of our elders and ancestors",
        invitationTagline:
          "request the honour of your presence at the celebration of their holy union",
      },
      event: {
        dateISO: "2027-02-14T11:00:00+05:30",
        dayOfWeek: "Sunday",
        dateFormatted: "14 February 2027",
        timeFormatted: "11:00 AM onwards",
        city: "Udaipur",
        country: "India",
        displayLocation: "Udaipur, Rajasthan, India",
      },
      venue: {
        name: "The Oberoi Udaivilas",
        subname: "Grand Lake Palace Gardens",
        address: "Haridas Ji Ki Magri, Udaipur",
        city: "Rajasthan, India",
        description:
          "Set on the romantic banks of Lake Pichola, The Oberoi Udaivilas captures all the romance and grandeur of royal Rajasthan.",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Oberoi+Udaivilas+Udaipur",
        mapsEmbedQuery: "The+Oberoi+Udaivilas+Udaipur",
        parkingNote: "Private royal carriage transfers from arrival gate.",
        valetNote: "Dedicated concierge service provided.",
      },
    },
    createdAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "david-sophia",
    coupleTitle: "David & Sophia",
    clientEmail: "david.m@example.com",
    clientPhone: "+39 089 857 123",
    weddingDate: "20 June 2027",
    venueName: "Villa Cimbrone, Ravello",
    status: "Draft",
    packageTier: "Luxury Gold",
    price: 499,
    paymentStatus: "Deposit",
    themeId: "coastal-navy",
    totalGuestsExpected: 120,
    notes: "Amalfi Coast cliffside destination wedding beneath Mediterranean skies.",
    config: {
      ...defaultWedding,
      couple: {
        groom: {
          firstName: "David",
          fullName: "David Montgomery",
          parents: "Son of Mr. & Mrs. Charles Montgomery",
        },
        bride: {
          firstName: "Sophia",
          fullName: "Sophia Rossi",
          parents: "Daughter of Mr. & Mrs. Matteo Rossi",
        },
        monogram: "D & S",
        hashtag: "#DavidAndSophia",
        invitationPreamble: "Together with their beloved families",
        invitationTagline:
          "warmly invite you to witness and celebrate their marriage beneath Mediterranean skies",
      },
      event: {
        dateISO: "2027-06-20T17:00:00+02:00",
        dayOfWeek: "Sunday",
        dateFormatted: "20 June 2027",
        timeFormatted: "5:00 PM onwards",
        city: "Amalfi Coast",
        country: "Italy",
        displayLocation: "Amalfi Coast, Italy",
      },
      venue: {
        name: "Villa Cimbrone",
        subname: "Infinity Terrace & Belvedere",
        address: "Via Santa Chiara 26, Ravello",
        city: "Amalfi Coast, Italy",
        description:
          "Suspended between the azure Mediterranean sky and sea, Villa Cimbrone stands as one of the world's most romantic cliffside estates.",
        image:
          "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=85",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Villa+Cimbrone+Ravello",
        mapsEmbedQuery: "Villa+Cimbrone+Ravello",
        parkingNote: "Helipad access and designated private estate shuttles.",
        valetNote: "Private boat charter transfers provided.",
      },
    },
    createdAt: "2026-10-05T09:30:00.000Z",
  },
];

interface WeddingContextValue {
  wedding: WeddingConfig;
  clients: WeddingClient[];
  activeClientId: string;
  activeTheme: WeddingTheme;
  inviteScope: "all" | "ceremony" | "reception";
  setInviteScope: (scope: "all" | "ceremony" | "reception") => void;
  switchClient: (clientId: string) => void;
  createClient: (newClient: Omit<WeddingClient, "createdAt">) => void;
  deleteClient: (clientId: string) => void;
  updateClientStatus: (
    clientId: string,
    status: "Active" | "Draft" | "Delivered",
    paymentStatus?: "Paid" | "Deposit" | "Pending"
  ) => void;
  setThemeById: (id: string) => void;
  updateWedding: (partial: Partial<WeddingConfig>) => void;
  updateCouple: (couplePartial: Partial<WeddingConfig["couple"]>) => void;
  updateEvent: (eventPartial: Partial<WeddingConfig["event"]>) => void;
  updateVenue: (venuePartial: Partial<WeddingConfig["venue"]>) => void;
  updateDetails: (detailsPartial: Partial<WeddingConfig["details"]>) => void;
  updateStory: (storyPartial: Partial<WeddingConfig["story"]>) => void;
  updateStoryMilestone: (index: number, milestonePartial: Partial<WeddingConfig["story"]["milestones"][0]>) => void;
  updateTimelineItem: (index: number, itemPartial: Partial<WeddingConfig["timeline"][0]>) => void;
  addTimelineItem: (item: WeddingConfig["timeline"][0]) => void;
  removeTimelineItem: (index: number) => void;
  updateDressCode: (dressCodePartial: Partial<WeddingConfig["dressCode"]>) => void;
  updateDressCodePalette: (palette: Array<{ name: string; hex: string }>) => void;
  updateMusic: (musicPartial: Partial<WeddingConfig["music"]>) => void;
  resetToDefault: () => void;
  exportConfigJson: () => string;
}

const WeddingContext = createContext<WeddingContextValue | undefined>(undefined);

export function WeddingProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<WeddingClient[]>(INITIAL_CLIENTS);
  const [activeClientId, setActiveClientId] = useState<string>("amal-nethmi");
  const [wedding, setWedding] = useState<WeddingConfig>(defaultWedding);
  const [activeTheme, setActiveTheme] = useState<WeddingTheme>(PRESET_THEMES[0]);
  const [inviteScope, setInviteScope] = useState<"all" | "ceremony" | "reception">("all");

  // Load clients & active state from localStorage or URL query param (?client=ID or ?invite=reception)
  useEffect(() => {
    try {
      const storedClients = localStorage.getItem("agency_wedding_clients");
      const storedActiveId = localStorage.getItem("agency_active_client_id");

      let loadedClients = INITIAL_CLIENTS;
      if (storedClients) {
        const parsed = JSON.parse(storedClients);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedClients = parsed;
          setClients(parsed);
        }
      }

      // Check if URL specifies client, e.g. /portal?client=arjun-priya or /?client=arjun-priya
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const urlClientId = params ? params.get("client") : null;
      const urlInvite = params ? (params.get("invite") || params.get("events")) : null;

      if (urlInvite === "ceremony" || urlInvite === "reception" || urlInvite === "all") {
        setInviteScope(urlInvite as any);
      }

      const activeId =
        urlClientId && loadedClients.some((c) => c.id === urlClientId)
          ? urlClientId
          : storedActiveId && loadedClients.some((c) => c.id === storedActiveId)
          ? storedActiveId
          : loadedClients[0].id;

      setActiveClientId(activeId);
      const activeClient = loadedClients.find((c) => c.id === activeId) || loadedClients[0];
      setWedding(activeClient.config);

      const theme = PRESET_THEMES.find((t) => t.id === activeClient.themeId) || PRESET_THEMES[0];
      setActiveTheme(theme);
    } catch (e) {
      console.warn("Could not load agency clients", e);
    }
  }, []);

  // Update CSS custom properties dynamically when theme changes
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--color-forest", activeTheme.primary);
    root.style.setProperty("--color-forest-dark", activeTheme.primaryDark);
    root.style.setProperty("--color-gold", activeTheme.accent);
    root.style.setProperty("--color-gold-light", activeTheme.accentLight);
    root.style.setProperty("--bg-ivory", activeTheme.background);
    root.style.setProperty("--bg-card", activeTheme.cardBg);
  }, [activeTheme]);

  // Helper to persist clients
  const persistClients = (updatedClients: WeddingClient[], currentId: string) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("agency_wedding_clients", JSON.stringify(updatedClients));
        localStorage.setItem("agency_active_client_id", currentId);
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
    }
  };

  const switchClient = (clientId: string) => {
    const target = clients.find((c) => c.id === clientId);
    if (target) {
      setActiveClientId(clientId);
      setWedding(target.config);
      const theme = PRESET_THEMES.find((t) => t.id === target.themeId) || PRESET_THEMES[0];
      setActiveTheme(theme);
      persistClients(clients, clientId);
    }
  };

  const createClient = (newClientData: Omit<WeddingClient, "createdAt">) => {
    const newClient: WeddingClient = {
      ...newClientData,
      createdAt: new Date().toISOString(),
    };
    const updated = [newClient, ...clients];
    setClients(updated);
    switchClient(newClient.id);
    persistClients(updated, newClient.id);
  };

  const deleteClient = (clientId: string) => {
    if (clients.length <= 1) {
      alert("At least one wedding client must remain.");
      return;
    }
    const updated = clients.filter((c) => c.id !== clientId);
    setClients(updated);
    const newActiveId = updated[0].id;
    switchClient(newActiveId);
    persistClients(updated, newActiveId);
  };

  const updateWedding = (partial: Partial<WeddingConfig>) => {
    setWedding((prev) => {
      const updatedConfig = { ...prev, ...partial };
      // Also update in clients list
      const updatedClients = clients.map((c) =>
        c.id === activeClientId
          ? {
              ...c,
              config: updatedConfig,
              coupleTitle: `${updatedConfig.couple.groom.firstName} & ${updatedConfig.couple.bride.firstName}`,
              weddingDate: updatedConfig.event.dateFormatted,
              venueName: updatedConfig.venue.name,
            }
          : c
      );
      setClients(updatedClients);
      persistClients(updatedClients, activeClientId);
      return updatedConfig;
    });
  };

  const setThemeById = (id: string) => {
    const found = PRESET_THEMES.find((t) => t.id === id);
    if (found) {
      setActiveTheme(found);
      const updatedClients = clients.map((c) =>
        c.id === activeClientId ? { ...c, themeId: id } : c
      );
      setClients(updatedClients);
      persistClients(updatedClients, activeClientId);
    }
  };

  const updateCouple = (couplePartial: Partial<WeddingConfig["couple"]>) => {
    updateWedding({ couple: { ...wedding.couple, ...couplePartial } });
  };

  const updateEvent = (eventPartial: Partial<WeddingConfig["event"]>) => {
    updateWedding({ event: { ...wedding.event, ...eventPartial } });
  };

  const updateVenue = (venuePartial: Partial<WeddingConfig["venue"]>) => {
    updateWedding({ venue: { ...wedding.venue, ...venuePartial } });
  };

  const updateDetails = (detailsPartial: Partial<WeddingConfig["details"]>) => {
    updateWedding({ details: { ...wedding.details, ...detailsPartial } });
  };

  const updateStory = (storyPartial: Partial<WeddingConfig["story"]>) => {
    updateWedding({ story: { ...wedding.story, ...storyPartial } });
  };

  const updateStoryMilestone = (index: number, milestonePartial: Partial<WeddingConfig["story"]["milestones"][0]>) => {
    const updatedMilestones = [...wedding.story.milestones];
    if (updatedMilestones[index]) {
      updatedMilestones[index] = { ...updatedMilestones[index], ...milestonePartial };
      updateWedding({ story: { ...wedding.story, milestones: updatedMilestones } });
    }
  };

  const updateTimelineItem = (index: number, itemPartial: Partial<WeddingConfig["timeline"][0]>) => {
    const updatedTimeline = [...wedding.timeline];
    if (updatedTimeline[index]) {
      updatedTimeline[index] = { ...updatedTimeline[index], ...itemPartial };
      updateWedding({ timeline: updatedTimeline });
    }
  };

  const addTimelineItem = (item: WeddingConfig["timeline"][0]) => {
    updateWedding({ timeline: [...wedding.timeline, item] });
  };

  const removeTimelineItem = (index: number) => {
    const updated = wedding.timeline.filter((_, idx) => idx !== index);
    updateWedding({ timeline: updated });
  };

  const updateDressCode = (dressCodePartial: Partial<WeddingConfig["dressCode"]>) => {
    updateWedding({ dressCode: { ...wedding.dressCode, ...dressCodePartial } });
  };

  const updateDressCodePalette = (palette: Array<{ name: string; hex: string }>) => {
    updateWedding({ dressCode: { ...wedding.dressCode, palette } });
  };

  const updateMusic = (musicPartial: Partial<WeddingConfig["music"]>) => {
    updateWedding({ music: { ...wedding.music, ...musicPartial } });
  };

  const updateClientStatus = (
    clientId: string,
    status: "Active" | "Draft" | "Delivered",
    paymentStatus?: "Paid" | "Deposit" | "Pending"
  ) => {
    const updated = clients.map((c) =>
      c.id === clientId
        ? {
            ...c,
            status,
            ...(paymentStatus ? { paymentStatus } : {}),
          }
        : c
    );
    setClients(updated);
    persistClients(updated, activeClientId);
  };

  const resetToDefault = () => {
    updateWedding(defaultWedding);
    setThemeById("royal-emerald");
  };

  const exportConfigJson = () => {
    return JSON.stringify(wedding, null, 2);
  };

  return (
    <WeddingContext.Provider
      value={{
        wedding,
        clients,
        activeClientId,
        activeTheme,
        inviteScope,
        setInviteScope,
        switchClient,
        createClient,
        deleteClient,
        updateClientStatus,
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
        exportConfigJson,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error("useWedding must be used within a WeddingProvider");
  }
  return context;
}
