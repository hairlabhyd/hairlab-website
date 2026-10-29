"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

const STORAGE_KEY = "hairlab_intro_seen";

interface WalkingProduct {
  id: string;
  name: string;
  image: string;
  accentFrom: string;
  accentTo: string;
  delay: number;
  message: string;
  verticalOffset: number;
}

const walkingProducts: WalkingProduct[] = [
  {
    id: "mane",
    name: "Mane",
    image: "/products/mane-cutout.png",
    accentFrom: "#7A8450",
    accentTo: "#5C6B3A",
    delay: 0,
    message: "Hi!",
    verticalOffset: 0,
  },
  {
    id: "neelam",
    name: "Neelam",
    image: "/products/neelam-cutout.png",
    accentFrom: "#3A4D5C",
    accentTo: "#1F2E3A",
    delay: 1.5,
    message: "Welcome to Hair Lab!",
    verticalOffset: 40,
  },
  {
    id: "ojas",
    name: "Ojas",
    image: "/products/ojas-cutout.png",
    accentFrom: "#B8860B",
    accentTo: "#8C6708",
    delay: 3,
    message: "Hey!",
    verticalOffset: 20,
  },
  {
    id: "karu",
    name: "Kāru",
    image: "/products/karu-cutout.png",
    accentFrom: "#8C6F4A",
    accentTo: "#5C4A2F",
    delay: 4.5,
    message: "Welcome!",
    verticalOffset: 70,
  },
];

export function IntroAnimation() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const startedRef = useRef(false);

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

  function enter() {
    if (startedRef.current) return;
    startedRef.current = true;
    setFadeOut(true);
    setTimeout(() => setShow(false), 700);
  }

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#1A3D2A] flex flex-col items-center justify-center transition-all duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none -translate-y-full" : "opacity-100"
      }`}
    >
      {/* Subtle radial gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(184, 134, 11, 0.3) 0%, transparent 60%)",
        }}
      />

      {/* Logo at center (top portion) */}
      <div
        className={`relative z-20 flex flex-col items-center transition-all duration-700 ${
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
      </div>

      {/* Walking products at bottom (peripheral vision) */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] overflow-hidden z-10">
        {walkingProducts.map((product, idx) => (
          <div
            key={`${product.id}-${idx}`}
            className="absolute pointer-events-auto"
            style={{
              bottom: `calc(20px + ${product.verticalOffset}px)`,
              left: "-80px",
              animation: `walkAcross 12s linear ${product.delay}s infinite`,
            }}
            onClick={enter}
          >
            {/* Product bottle */}
            <div
              className="relative w-14 h-20 shadow-2xl cursor-pointer hover:scale-110 transition-transform object-contain"
              style={{
                animation: `bobUp 0.5s ease-in-out infinite`,
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Speech bubble */}
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#F4ECD8] text-[#2C2416] px-2 py-0.5 rounded-full text-[9px] font-medium whitespace-nowrap shadow-lg border border-[#B8860B]/30"
              style={{
                animation: `bobUp 0.5s ease-in-out infinite 0.25s`,
              }}
            >
              {product.message}
            </div>

            {/* Little legs */}
            <div className="flex justify-center gap-0.5 mt-0.5">
              <div
                className="w-0.5 h-2 bg-[#F4ECD8]/30 rounded-full"
                style={{ animation: "walkLeg 0.25s ease-in-out infinite" }}
              />
              <div
                className="w-0.5 h-2 bg-[#F4ECD8]/30 rounded-full"
                style={{ animation: "walkLeg 0.25s ease-in-out infinite 0.12s" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Click to shop button (center-bottom) */}
      <button
        onClick={enter}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 bg-[#F4ECD8] text-[#1A3D2A] px-6 py-3 rounded-full text-[11px] tracking-[0.2em] uppercase shadow-xl hover:bg-white transition-colors"
        style={{ animation: "fadeInUp 0.8s ease-out 2s both" }}
      >
        <ShoppingBag className="h-4 w-4" />
        Click to Shop
      </button>

      {/* Skip */}
      <button
        onClick={enter}
        className="absolute top-6 right-6 z-30 text-[#F4ECD8]/30 hover:text-[#F4ECD8] text-[10px] tracking-[0.2em] uppercase flex items-center gap-1"
        style={{ animation: "fadeIn 0.5s ease-out 1s both" }}
      >
        Skip
        <X className="h-3 w-3" />
      </button>

      <style>{`
        @keyframes hairlabFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hairlabSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes walkAcross {
          0% { left: -80px; }
          100% { left: calc(100% + 50px); }
        }
        @keyframes bobUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes walkLeg {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
