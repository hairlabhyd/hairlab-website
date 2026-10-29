"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const STORAGE_KEY = "hairlab_intro_seen";

export function IntroAnimation() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [entered, setEntered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const enteredRef = useRef(false);

  const handleEnter = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    setEntered(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShow(false), 600);
    }, 500);
  }, []);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (!seen) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShow(true);
        sessionStorage.setItem(STORAGE_KEY, "true");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (show && !entered) {
      const timer = setTimeout(() => {
        handleEnter();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, entered, handleEnter]);

  if (!show) return null;

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src="/welcome-voice.wav" type="audio/wav" />
      </audio>

      <div
        className={`fixed inset-0 z-[100] bg-[#1A3D2A] flex flex-col items-center justify-center transition-all duration-500 ${
          fadeOut ? "opacity-0 pointer-events-none -translate-y-full" : "opacity-100"
        }`}
        onClick={handleEnter}
        style={{ cursor: "pointer" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(184, 134, 11, 0.3) 0%, transparent 60%)",
          }}
        />

        <div
          className={`relative z-10 flex flex-col items-center transition-all duration-700 ${
            fadeOut ? "scale-110 opacity-0" : "scale-100 opacity-100"
          }`}
          style={{ animation: "hairlabFadeIn 0.8s ease-out forwards" }}
        >
          <div className="h-20 sm:h-24 mb-6">
            <img
              src="/hairlab-logo-green.png"
              alt="HAIR LAB."
              className="h-full w-auto object-contain"
            />
          </div>

          <p
            className="font-[family-name:var(--font-playfair)] italic text-base sm:text-lg text-[#B8860B] tracking-[0.2em] uppercase"
            style={{ animation: "hairlabSlideUp 0.8s ease-out 0.4s both" }}
          >
            Ancient Luxury, Handcrafted
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="mt-10 px-8 py-3 border border-[#B8860B]/40 rounded-full text-[#F4ECD8] text-[11px] tracking-[0.3em] uppercase hover:bg-[#B8860B]/10 transition-all duration-300"
            style={{ animation: "hairlabSlideUp 0.8s ease-out 1.2s both" }}
          >
            {entered ? "Entering..." : "Tap to Enter"}
          </button>

          <p
            className="mt-4 text-[10px] text-[#F4ECD8]/30 tracking-[0.2em] uppercase"
            style={{ animation: "hairlabSlideUp 0.8s ease-out 1.6s both" }}
          >
            Or wait — we&apos;ll open for you
          </p>
        </div>

        <style>{`
          @keyframes hairlabFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes hairlabSlideUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}
