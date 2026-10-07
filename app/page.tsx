import { WeddingProvider } from "@/context/WeddingContext";
import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { Story } from "@/components/Story";
import { WeddingDetails } from "@/components/WeddingDetails";
import { EventTimeline } from "@/components/EventTimeline";
import { Venue } from "@/components/Venue";
import { DressCode } from "@/components/DressCode";
import { RSVP } from "@/components/RSVP";
import { GuestMessage } from "@/components/GuestMessage";
import { Footer } from "@/components/Footer";
import { MusicPlayer } from "@/components/MusicPlayer";
import { ShareButton } from "@/components/ShareButton";
import { FloatingNav } from "@/components/FloatingNav";

export default function Home() {
  return (
    <WeddingProvider>
      <main
        className="relative min-h-screen w-full bg-[#FAF7F2] text-[#1A3026] overflow-x-hidden"
        suppressHydrationWarning
      >

        {/* Sticky Top Navigation */}
        <FloatingNav />

        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Real-Time Countdown */}
        <Countdown />

        {/* 3. Our Story Section */}
        <Story />

        {/* 4. Ceremony & Reception Details */}
        <WeddingDetails />

        {/* 5. Event Schedule / Itinerary */}
        <EventTimeline />

        {/* 6. Venue & Directions */}
        <Venue />

        {/* 8. Dress Code & Color Swatches */}
        <DressCode />

        {/* 9. RSVP Form & Confirmation */}
        <RSVP />

        {/* 10. Guest Messages & Warm Wishes */}
        <GuestMessage />

        {/* 11. Minimal Luxury Footer */}
        <Footer />

        {/* Floating Background Music Control */}
        <MusicPlayer />

        {/* Floating Share Invitation Button */}
        <ShareButton />
      </main>
    </WeddingProvider>
  );
}
