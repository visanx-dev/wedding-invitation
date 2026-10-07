"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music, Disc } from "lucide-react";
import { useWedding } from "@/context/WeddingContext";

export function MusicPlayer() {
  const { wedding } = useWedding();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthAudioRef = useRef<{
    ctx: AudioContext | null;
    interval: NodeJS.Timeout | null;
  }>({ ctx: null, interval: null });

  // Web Audio romantic melody fallback (Canon in D arpeggio progression in warm acoustic tones)
  const startRomanticSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      synthAudioRef.current.ctx = ctx;

      // Pachelbel Canon notes in D major (D4, A3, B3, F#3, G3, D3, G3, A3)
      const chordNotes = [
        [293.66, 369.99, 440.0], // D F# A
        [220.0, 277.18, 329.63], // A C# E
        [246.94, 293.66, 369.99], // B D F#
        [185.0, 220.0, 277.18],  // F# A C#
        [196.0, 246.94, 293.66], // G B D
        [146.83, 220.0, 293.66], // D A D
        [196.0, 246.94, 293.66], // G B D
        [220.0, 277.18, 329.63], // A C# E
      ];

      let step = 0;
      const playChime = () => {
        if (!synthAudioRef.current.ctx || synthAudioRef.current.ctx.state === "closed") return;
        const notes = chordNotes[step % chordNotes.length];
        step++;

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

          gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
          gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + i * 0.15 + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.15 + 2.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + i * 0.15 + 2.5);
        });
      };

      playChime();
      synthAudioRef.current.interval = setInterval(playChime, 2400);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  };

  const stopRomanticSynth = () => {
    if (synthAudioRef.current.interval) {
      clearInterval(synthAudioRef.current.interval);
      synthAudioRef.current.interval = null;
    }
    if (synthAudioRef.current.ctx) {
      synthAudioRef.current.ctx.close();
      synthAudioRef.current.ctx = null;
    }
  };

  useEffect(() => {
    setIsLoaded(true);

    return () => {
      stopRomanticSynth();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = async () => {
    if (!isPlaying) {
      // User requested playback
      if (audioRef.current && audioRef.current.src && audioRef.current.src !== "") {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          return;
        } catch {
          // If mp3 placeholder is not found, fallback to romantic synth
          startRomanticSynth();
          setIsPlaying(true);
        }
      } else {
        startRomanticSynth();
        setIsPlaying(true);
      }
    } else {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopRomanticSynth();
      setIsPlaying(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={wedding.music.audioSrc}
        loop
        preload="none"
        onError={() => {
          // Graceful fallback to synthesized chime if mp3 does not exist
        }}
      />

      <div className="fixed bottom-6 right-5 z-40 flex items-center gap-2 select-none">
        {/* Floating audio button with rotating vinyl style */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 group ${
            isPlaying
              ? "bg-[#1A3026] text-[#FAF7F2] border-[#C5A880] ring-2 ring-[#C5A880]/30"
              : "bg-[#FAF7F2]/90 text-[#1A3026] border-[#C5A880]/50 hover:border-[#C5A880]"
          }`}
        >
          {/* Animated vinyl or speaker icon */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            {isPlaying ? (
              <Disc className="w-5 h-5 text-[#C5A880] animate-spin-slow" />
            ) : (
              <Music className="w-4 h-4 text-[#C5A880]" />
            )}
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] font-sans-luxury uppercase tracking-wider font-medium text-[#C5A880]">
              {isPlaying ? "Playing Music" : "Background Music"}
            </span>
            <span className="text-[9px] text-gray-500 truncate max-w-[110px] font-sans-luxury">
              {wedding.music.title}
            </span>
          </div>

          {/* Equalizer animation waves when playing */}
          {isPlaying ? (
            <div className="flex items-end gap-[2px] h-3.5 px-1">
              <span className="w-[2px] bg-[#C5A880] h-3 animate-pulse" />
              <span className="w-[2px] bg-[#C5A880] h-1.5 animate-pulse delay-100" />
              <span className="w-[2px] bg-[#C5A880] h-3.5 animate-pulse delay-200" />
              <span className="w-[2px] bg-[#C5A880] h-2 animate-pulse delay-75" />
            </div>
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-[#6B6862]" />
          )}
        </button>
      </div>
    </>
  );
}
