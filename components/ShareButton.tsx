"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWedding } from "@/context/WeddingContext";

export function ShareButton({
  variant = "floating",
}: {
  variant?: "floating" | "inline";
}) {
  const { wedding } = useWedding();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} — Wedding Invitation`,
      text: `${wedding.couple.invitationPreamble}, ${wedding.couple.groom.firstName} & ${wedding.couple.bride.firstName} invite you to celebrate their wedding on ${wedding.event.dateFormatted} in ${wedding.event.displayLocation}.`,
      url: typeof window !== "undefined" ? window.location.href : wedding.meta.siteUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        // User aborted or canceled share, fallback to copy if error is not abort
        if ((err as Error)?.name !== "AbortError") {
          fallbackCopy(shareData.url);
        }
      }
    } else {
      fallbackCopy(shareData.url);
    }
  };

  const fallbackCopy = (url: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    } else {
      // Old fallback
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (variant === "inline") {
    return (
      <div className="relative inline-flex flex-col items-center">
        <button
          onClick={handleShare}
          className="px-6 py-3 rounded-sm border border-[#C5A880] bg-[#FAF7F2] hover:bg-[#C5A880] text-[#1A3026] hover:text-[#102119] text-xs uppercase tracking-[0.2em] font-sans-luxury font-medium transition-all duration-300 flex items-center gap-2 active:scale-95 shadow-xs"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#C5A880]" />
              <span>Share Invitation</span>
            </>
          )}
        </button>

        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 bg-[#1A3026] text-[#FAF7F2] text-[11px] px-3 py-1 rounded-sm shadow-md font-sans-luxury whitespace-nowrap border border-[#C5A880]/40 flex items-center gap-1.5"
            >
              <Check className="w-3 h-3 text-[#C5A880]" />
              <span>Invitation link copied.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-5 z-40 select-none">
      <button
        onClick={handleShare}
        aria-label="Share Wedding Invitation"
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#FAF7F2]/90 border border-[#C5A880]/60 text-[#1A3026] hover:border-[#C5A880] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-600" />
        ) : (
          <Share2 className="w-4 h-4 text-[#C5A880] group-hover:rotate-12 transition-transform" />
        )}
        <span className="text-[11px] font-sans-luxury uppercase tracking-wider font-medium text-[#1A3026] pr-1">
          {copied ? "Copied" : "Share"}
        </span>
      </button>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-14 left-0 bg-[#1A3026] text-[#FAF7F2] text-[11px] px-3 py-1.5 rounded-xs shadow-xl font-sans-luxury whitespace-nowrap border border-[#C5A880]/50 flex items-center gap-1.5"
          >
            <Copy className="w-3 h-3 text-[#C5A880]" />
            <span>Invitation link copied.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
