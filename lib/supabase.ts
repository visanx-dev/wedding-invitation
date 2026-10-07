import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseUrl.includes("placeholder")
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface SupabaseRSVP {
  id?: string;
  client_id?: string;
  full_name: string;
  email?: string;
  phone?: string;
  guest_count: number;
  attendance: "accept" | "decline";
  events_attending: "both" | "ceremony" | "reception" | "none";
  meal_preference: string;
  notes?: string;
  created_at?: string;
}

/**
 * Submit an RSVP to Supabase with automatic localStorage fallback
 */
export async function insertRsvp(rsvpData: SupabaseRSVP) {
  // 1. Always write to local storage as instant local cache
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem("wedding_rsvps") || "[]");
      const localRecord = {
        id: rsvpData.id || `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fullName: rsvpData.full_name,
        email: rsvpData.email || "",
        phone: rsvpData.phone || "",
        guestCount: rsvpData.guest_count,
        attendance: rsvpData.attendance,
        eventsAttending: rsvpData.events_attending,
        mealPreference: rsvpData.meal_preference,
        notes: rsvpData.notes || "",
        timestamp: rsvpData.created_at || new Date().toISOString(),
      };
      existing.unshift(localRecord);
      localStorage.setItem("wedding_rsvps", JSON.stringify(existing));
      window.dispatchEvent(new Event("rsvp_updated"));
    } catch (e) {
      console.warn("LocalStorage cache error:", e);
    }
  }

  // 2. If Supabase is configured, persist to remote PostgreSQL table
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("rsvps").insert([
        {
          client_id: rsvpData.client_id || "amal-nethmi",
          full_name: rsvpData.full_name,
          email: rsvpData.email || null,
          phone: rsvpData.phone || null,
          guest_count: rsvpData.guest_count,
          attendance: rsvpData.attendance,
          events_attending: rsvpData.events_attending,
          meal_preference: rsvpData.meal_preference,
          notes: rsvpData.notes || null,
          created_at: rsvpData.created_at || new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("Supabase request failed:", err);
      return { success: false, error: err.message };
    }
  }

  // If not configured, local cache was updated successfully
  return { success: true, mode: "local" };
}

/**
 * Fetch RSVPs from Supabase, or fall back to localStorage
 */
export async function getRsvps(clientId?: string) {
  if (supabase && isSupabaseConfigured()) {
    try {
      let query = supabase.from("rsvps").select("*").order("created_at", { ascending: false });
      if (clientId) {
        query = query.eq("client_id", clientId);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        return data.map((row) => ({
          id: row.id,
          fullName: row.full_name,
          email: row.email,
          phone: row.phone,
          guestCount: row.guest_count,
          attendance: row.attendance,
          eventsAttending: row.events_attending,
          mealPreference: row.meal_preference,
          notes: row.notes,
          timestamp: row.created_at,
        }));
      }
    } catch (e) {
      console.warn("Could not fetch from Supabase, falling back to local:", e);
    }
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("wedding_rsvps");
      if (stored) return JSON.parse(stored);
    } catch {}
  }

  return [];
}
