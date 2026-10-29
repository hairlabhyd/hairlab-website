"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "hairlab_intro_seen";

// Subscribe to sessionStorage
function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function IntroAnimation() {
  const shouldShow = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const [fadeOut, setFadeOut] = useState(false);

  // Mark as seen when component mounts (after we decide to show)
  useSyncExternalStore(
    subscribe,
    () => {
      // Client-side: if we should show, mark as seen
      if (shouldShow && typeof window !== "undefined") {
        try {
          sessionStorage.setItem(STORAGE_KEY, "true");
        } catch {}
      }
      return null;
    },
    () => null
  );

  // Use a separate effect for the fade out timer (allowed — it's an external timer, not state sync)
  const [started, setStarted] = useState(false);
  if (shouldShow && !started) {
    setStarted(true);
    // Start fade out after 1.8 seconds
    setTimeout(() => {
      setFadeOut(true);
    }, 1800);
  }

  if (!shouldShow && !fadeOut) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#1A3D2A] flex flex-col items-center justify-center transition-all duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none -translate-y-full" : "opacity-100"
      }`}
    >
      {/* Subtle radial gradient for depth */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(184, 134, 11, 0.3) 0%, transparent 60%)",
        }}
      />

      {/* Logo container */}
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-700 ${
          fadeOut ? "scale-110 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{
          animation: "hairlabFadeIn 0.8s ease-out forwards",
        }}
      >
        {/* Logo image */}
        <div className="h-20 sm:h-24 mb-6">
          <img
            src="/hairlab-logo-green.png"
            alt="HAIR LAB."
            className="h-full w-auto object-contain"
          />
        </div>

        {/* Tagline */}
        <p
          className="font-[family-name:var(--font-playfair)] italic text-base sm:text-lg text-[#B8860B] tracking-[0.2em] uppercase"
          style={{
            animation: "hairlabSlideUp 0.8s ease-out 0.4s both",
          }}
        >
          Ancient Luxury, Handcrafted
        </p>

        {/* Loading dots */}
        <div
          className="flex gap-1.5 mt-8"
          style={{
            animation: "hairlabSlideUp 0.8s ease-out 0.8s both",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/60"
            style={{ animation: "hairlabPulse 1.4s ease-in-out infinite 0s" }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/60"
            style={{ animation: "hairlabPulse 1.4s ease-in-out infinite 0.2s" }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full bg-[#B8860B]/60"
            style={{ animation: "hairlabPulse 1.4s ease-in-out infinite 0.4s" }}
          />
        </div>
      </div>

      {/* Keyframe animations - injected as style tag */}
      <style>{`
        @keyframes hairlabFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes hairlabSlideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes hairlabPulse {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
