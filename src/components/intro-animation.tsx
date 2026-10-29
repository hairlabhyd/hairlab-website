"use client";

import { useEffect, useState, useRef } from "react";

const STORAGE_KEY = "hairlab_intro_seen";

export function IntroAnimation() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioAttempted = useRef(false);

  useEffect(() => {
    // Only show on client-side, once per session
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (!seen) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShow(true);
        sessionStorage.setItem(STORAGE_KEY, "true");
      }
    } catch {
      // If sessionStorage fails, don't show
    }
  }, []);

  // Start fade out timer when showing
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShow(false), 600);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Play welcome voice when intro shows
  useEffect(() => {
    if (show && !audioAttempted.current && typeof window !== "undefined") {
      audioAttempted.current = true;

      const playWithInteraction = () => {
        if (audioRef.current) {
          audioRef.current.volume = 0.5;
          audioRef.current.play().catch(() => {
            // Browser blocked autoplay — listen for first interaction
            const playOnce = () => {
              if (audioRef.current) {
                audioRef.current.play().catch(() => {});
              }
              document.removeEventListener("click", playOnce);
              document.removeEventListener("touchstart", playOnce);
              document.removeEventListener("keydown", playOnce);
            };
            document.addEventListener("click", playOnce);
            document.addEventListener("touchstart", playOnce);
            document.addEventListener("keydown", playOnce);
          });
        }
      };

      const audioTimer = setTimeout(playWithInteraction, 200);
      return () => clearTimeout(audioTimer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto">
        <source src="/welcome-voice.wav" type="audio/wav" />
      </audio>

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

        {/* Keyframe animations */}
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
    </>
  );
}
