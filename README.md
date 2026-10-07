# Amal & Nethmi — Luxury Wedding Invitation Website

A production-quality, mobile-first wedding invitation web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

Designed specifically for guests opening invitations on mobile devices (e.g. WhatsApp links) and looking for an editorial, high-end wedding studio aesthetic.

---

## ✨ Features & Visual Aesthetics

- **Luxury Aesthetic**: Warm ivory/cream background (`#FAF7F2`), deep forest green (`#1A3026`), and metallic gold accents (`#C5A880`).
- **Typography**: Google Fonts pairing — *Cormorant Garamond* for headings, *Montserrat* for modern sans-serif body, and *Alex Brush* for romantic calligraphy accents.
- **Botanical Flourishes**: Custom SVG laurel crests, botanical sprigs, and delicate paper card borders.
- **Full-Screen Hero**: Emotional opening invitation with animated entrance, subtle vignette, monogram seal, and scroll indicator.
- **Live Countdown Timer**: Updates in real time down to the second, transitioning to *"Today we celebrate love"* once the date arrives.
- **Our Story**: Romantic narrative and interactive vertical timeline (2019, 2021, 2024, 2026).
- **Wedding Details**: Morning Ceremony and Evening Reception cards with date, time, venue, Google Calendar link, and `.ics` download generator.
- **Event Itinerary**: Day schedule with bespoke icons (Arrival, Ceremony, Photos, Reception, Dinner, Celebration).
- **Cherished Moments (Gallery)**: Curated editorial photo grid with a fullscreen lightbox (prev/next, close, keyboard arrow keys, image counter).
- **The Venue**: Shangri-La Colombo presentation with styled map preview, logistics (parking & valet), and Google Maps navigation.
- **Dress Code**: "Elegant Formal" guidance with curated color swatches and gentle guest attire etiquette.
- **Interactive RSVP**: Form with attendance selection, guest count, meal preferences, notes, validation, and celebratory gold confetti. Structured for Supabase.
- **Guest Book (Words of Love)**: Form for guests to leave messages with live display of recent blessings.
- **Background Music**: Floating music controller with rotating vinyl animation, soundwave equalizer, and Web Audio fallback melody (Canon in D). *Strictly no autoplay*.
- **Share Invitation**: Web Share API integration with automatic fallback to clipboard copying and toast notification.
- **Interactive Live Customizer (Studio Mode)**: Real-time side drawer to customize names, dates, countdowns, venues, and color themes on the fly.
- **Instant Preset Switcher**: Switch between *Royal Emerald* (Amal & Nethmi), *Velvet Burgundy* (Arjun & Priya), *Coastal Sapphire* (David & Sophia), or *Blush Rose*.
- **1-Click Client Export**: Copy or download ready-to-deploy TypeScript configuration for any paying client.
- **Sticky Luxury Navigation**: Reveals upon scrolling past hero for quick mobile access.

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx         # Google Fonts, viewport, anti-extension & SEO
│   ├── page.tsx           # Assembled wedding invitation page wrapped in WeddingProvider
│   └── globals.css        # Tailwind v4 theme tokens, paper-card & gold styles
├── context/
│   └── WeddingContext.tsx # Dynamic multi-wedding state, presets & live theme engine
├── components/
│   ├── LiveCustomizer.tsx # Real-time Studio drawer with live preview & 1-click export
│   ├── Hero.tsx           # Fullscreen opening invitation
│   ├── Countdown.tsx      # Real-time countdown timer
│   ├── Story.tsx          # Romantic narrative & vertical timeline
│   ├── WeddingDetails.tsx # Ceremony & Reception cards + calendar links
│   ├── EventTimeline.tsx  # Order of the day schedule
│   ├── Gallery.tsx        # Photo gallery with fullscreen lightbox
│   ├── Venue.tsx          # Venue showcase with map & directions
│   ├── DressCode.tsx      # Attire guidelines & color swatches
│   ├── RSVP.tsx           # Polished RSVP form with confetti confirmation
│   ├── GuestMessage.tsx   # Guest message book & blessings wall
│   ├── MusicPlayer.tsx    # Floating background audio controller
│   ├── ShareButton.tsx    # Floating & inline share button
│   ├── FloatingNav.tsx    # Sticky mobile navigation bar
│   ├── BotanicalDivider.tsx # SVG botanical flourishes & corner ornaments
│   └── Footer.tsx         # Minimal romantic footer
├── data/
│   └── wedding.ts         # Central default configuration for wedding data
├── lib/
│   └── utils.ts           # Calendar (.ics) generator & formatting helpers
├── next.config.ts         # Remote image domains (Unsplash)
├── package.json
└── tsconfig.json
```

---

## 🎨 How to Customize for Another Wedding

All wedding-specific data is centralized in [`data/wedding.ts`](file:///d:/Wedding%20Invitation/data/wedding.ts). Simply update this single file to personalize:

1. **Couple Info**: Names, parents, monogram, hashtag, preamble, and invitation text.
2. **Date & Location**: ISO date (`dateISO`), formatted date, day of the week, city, and country.
3. **Story**: Narrative text, quotes, and timeline milestones.
4. **Ceremony & Reception**: Times, venues, addresses, and calendar links.
5. **Timeline**: Day schedule, times, and descriptions.
6. **Gallery**: Photo URLs, captions, and aspect ratios.
7. **Venue**: Name, description, venue photo, and Google Maps URL.
8. **Dress Code**: Attire title, description, color swatches, and etiquette notes.
9. **RSVP**: Deadline, max allowed guests, meal options.
10. **Music**: Audio track URL and title.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in your browser
http://localhost:3000

# 4. Production build
npm run build
```

---

## 🔌 Connecting Backend & External Services

- **Supabase for RSVP**: In [`components/RSVP.tsx`](file:///d:/Wedding%20Invitation/components/RSVP.tsx), replace the local submission handler with `supabase.from('rsvps').insert([...])`.
- **Supabase for Guest Book**: In [`components/GuestMessage.tsx`](file:///d:/Wedding%20Invitation/components/GuestMessage.tsx), connect the message submission to a `guest_messages` table with real-time subscriptions.
- **Audio Track**: Place an MP3 file (e.g. `wedding-melody.mp3`) in `public/audio/` and reference it in `data/wedding.ts`.
- **Google Maps**: Update the coordinates and embed query in `data/wedding.ts` with your specific venue link.
