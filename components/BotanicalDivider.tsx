import React from "react";

interface BotanicalDividerProps {
  className?: string;
  variant?: "leaf" | "crest" | "simple";
  color?: string;
}

export function BotanicalDivider({
  className = "my-6",
  variant = "leaf",
  color = "#C5A880",
}: BotanicalDividerProps) {
  if (variant === "simple") {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C5A880]/60" />
        <div className="w-1.5 h-1.5 rotate-45 border border-[#C5A880] bg-[#FAF7F2]" />
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C5A880]/60" />
      </div>
    );
  }

  if (variant === "crest") {
    return (
      <div className={`flex items-center justify-center gap-4 ${className}`}>
        <div className="h-[1px] flex-1 max-w-[80px] sm:max-w-[120px] bg-gradient-to-r from-transparent via-[#C5A880]/50 to-[#C5A880]" />
        <svg
          width="36"
          height="24"
          viewBox="0 0 36 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#C5A880] opacity-80"
        >
          {/* Subtle Laurel / Olive flourish */}
          <path
            d="M18 12C13 6 7 7 4 10C8 12 11 12 18 12Z"
            fill={color}
            fillOpacity="0.4"
          />
          <path
            d="M18 12C23 6 29 7 32 10C28 12 25 12 18 12Z"
            fill={color}
            fillOpacity="0.4"
          />
          <path
            d="M18 12C14 17 8 16 5 13C9 12 12 12 18 12Z"
            fill={color}
            fillOpacity="0.6"
          />
          <path
            d="M18 12C22 17 28 16 31 13C27 12 24 12 18 12Z"
            fill={color}
            fillOpacity="0.6"
          />
          <circle cx="18" cy="12" r="2" fill={color} />
        </svg>
        <div className="h-[1px] flex-1 max-w-[80px] sm:max-w-[120px] bg-gradient-to-l from-transparent via-[#C5A880]/50 to-[#C5A880]" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-[1px] flex-1 max-w-[60px] sm:max-w-[100px] bg-gradient-to-r from-transparent to-[#C5A880]/70" />
      <svg
        width="28"
        height="18"
        viewBox="0 0 28 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-75"
      >
        <path
          d="M14 1V17M14 1C10 5 6 7 1 7C6 9 10 11 14 17M14 1C18 5 22 7 27 7C22 9 18 11 14 17"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="9" r="1.5" fill={color} />
      </svg>
      <div className="h-[1px] flex-1 max-w-[60px] sm:max-w-[100px] bg-gradient-to-l from-transparent to-[#C5A880]/70" />
    </div>
  );
}

export function BotanicalCorner({
  className = "",
  flipX = false,
  flipY = false,
}: {
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
}) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${flipX ? "scale-x-[-1]" : ""} ${
        flipY ? "scale-y-[-1]" : ""
      } pointer-events-none opacity-40`}
    >
      <path
        d="M2 46V14C2 7.37258 7.37258 2 14 2H46"
        stroke="#C5A880"
        strokeWidth="1"
      />
      <path
        d="M6 46V16C6 10.4772 10.4772 6 16 6H46"
        stroke="#C5A880"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />
      <circle cx="14" cy="14" r="2" fill="#C5A880" />
      <path
        d="M14 14C19 9 26 9 30 11C27 15 21 16 14 14Z"
        fill="#C5A880"
        fillOpacity="0.5"
      />
      <path
        d="M14 14C9 19 9 26 11 30C15 27 16 21 14 14Z"
        fill="#C5A880"
        fillOpacity="0.5"
      />
    </svg>
  );
}
