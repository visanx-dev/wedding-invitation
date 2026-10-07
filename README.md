# 💍 Luxury Wedding Invitation Platform & SaaS Agency Suite

A production-grade, editorial luxury wedding invitation web application and commercial agency SaaS platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Supabase (PostgreSQL)**.

Designed for high-end luxury weddings, destination events, and multi-ceremony celebrations (e.g. South Asian Poruwa & Mandap ceremonies, church weddings, and grand evening banquets).

---

## 🌟 Architecture & Core Routes

### 1. Public Luxury Wedding Invitation (`/`)
* **Editorial Aesthetic**: Warm ivory (`#FAF7F2`), deep forest green (`#1A3026`), and metallic gold accents (`#C5A880`).
* **Emotional Opening Hero**: Couple monogram crest, floral laurel dividers, and smooth scroll guidance.
* **Separable Guest Invitations**: Supports distinct invitations for guests attending:
  - **Full Wedding**: `/?invite=all` (Morning Ceremony + Evening Reception)
  - **Reception-Only**: `/?invite=reception` (Customized banner, hides morning ceremony to preserve intimate family privacy, highlights evening banquet & catering)
  - **Ceremony-Only**: `/?invite=ceremony` (Morning rituals, Poruwa, blessings)
* **Live Countdown Timer**: Real-time ticker counting down to the auspicious moment.
* **Our Story**: Romantic timeline tracking relationship milestones.
* **Venues & Google Maps**: Dual-venue GPS directions, logistics notes (valet/carriage), and live embedded maps.
* **Interactive RSVP with Confetti**: Real-time RSVP with party size, dietary/meal preferences, and separate attendance options per event.
* **Background Audio Player**: Floating vinyl player with soundwave equalizer and Web Audio fallback melody (*Canon in D*).

### 2. Couple & Host Walkthrough Portal (`/portal`)
* **8-Step Simple Walkthrough Editor**: The couple can customize every single section (Names, Story, Dates, Venues, Dress Code, Music, Gallery).
* **Live Split-Screen Preview**: Real-time desktop and mobile preview pane while editing.
* **Separable WhatsApp Toolbox**: 1-click personalized WhatsApp invitation link generator with pre-filled messages for All, Reception-Only, and Ceremony-Only guests.
* **6-Card Catering & Headcount Analytics**:
  1. Total Attending Guests
  2. Place 1: Ceremony Headcount (for morning tea/lunch catering)
  3. Place 2: Reception Headcount (for evening dinner banquet catering)
  4. Declined Responses
  5. Vegetarian Catering Count
  6. Non-Vegetarian Catering Count
* **Guest List Export**: 1-click CSV export ready for planners and caterers.

### 3. Commercial Agency Developer CRM (`/admin`)
* **Multi-Tenant Customer Database**: Track all wedding clients (Amal & Nethmi, Arjun & Priya, David & Sophia, etc.).
* **Financial KPIs**: Gross revenue, pending deposits, active clients count, average wedding package fee.
* **1-Click Active Client Switcher**: Instantly switch which wedding client is live on the public URL.
* **Client Onboarding Modal**: Add new clients, set package tiers ($499 – $1,299), select color palettes, and track payment status.
* **Production Code Exporter**: 1-click export of the full TypeScript wedding configuration.

---

## ⚡ Separable Multi-Place Guest Links

Many weddings have two places, but some guests only receive an invite to one event:

| Guest Group | URL Parameter | Visual Presentation | RSVP Attendance Choices |
| :--- | :--- | :--- | :--- |
| **Full Wedding** | `/?invite=all` | Shows Both Places with switcher pills & calendar downloads | Both Events, Ceremony Only, Reception Only, Decline |
| **Reception Only** | `/?invite=reception` | Evening Reception banner & card only; intimate family morning note | Evening Reception, Decline |
| **Ceremony Only** | `/?invite=ceremony` | Sacred Morning Ceremony card & venue only | Morning Ceremony, Decline |

---

## 🗄️ Supabase Cloud Database Setup

This platform is integrated with Supabase PostgreSQL for real-time cross-device sync.

### 1. Initialize Tables in 3 Seconds
1. Open your project on [Supabase Dashboard](https://supabase.com).
2. Go to **SQL Editor** → **New Query**.
3. Copy and run [`supabase-schema.sql`](./supabase-schema.sql).

### 2. Environment Variables
Add your keys to `.env.local` (local) and Vercel (production):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

*Note: If environment variables are not configured, the app gracefully falls back to browser `localStorage` without crashing.*

---

## 🚀 Deployment Guide (1-Click Vercel)

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your `wedding-invitation` repository.
4. Add your Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in your browser
http://localhost:3000

# 4. Validate production build
npm run build
```
