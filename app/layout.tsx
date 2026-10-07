import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, Alex_Brush } from "next/font/google";
import "./globals.css";
import { wedding } from "@/data/wedding";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A3026",
};

export const metadata: Metadata = {
  title: wedding.meta.title,
  description: wedding.meta.description,
  openGraph: {
    title: wedding.meta.title,
    description: wedding.meta.description,
    url: wedding.meta.siteUrl,
    siteName: `${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} Wedding`,
    images: [
      {
        url: wedding.meta.ogImage,
        width: 1200,
        height: 800,
        alt: `${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} Wedding Invitation`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.meta.title,
    description: wedding.meta.description,
    images: [wedding.meta.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${alexBrush.variable} scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-[#FAF7F2] text-[#1A3026] selection:bg-[#C5A880]/30 selection:text-[#1A3026]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
