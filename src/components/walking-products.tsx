"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface WalkingProduct {
  id: string;
  name: string;
  image: string;
  accentFrom: string;
  accentTo: string;
  delay: number;
  message: string;
}

const walkingProducts: WalkingProduct[] = [
  {
    id: "mane",
    name: "Mane",
    image: "/products/mane.jpg",
    accentFrom: "#7A8450",
    accentTo: "#5C6B3A",
    delay: 0,
    message: "Buy me!",
  },
  {
    id: "neelam",
    name: "Neelam",
    image: "/products/neelam.jpg",
    accentFrom: "#3A4D5C",
    accentTo: "#1F2E3A",
    delay: 0.8,
    message: "Take me home!",
  },
  {
    id: "ojas",
    name: "Ojas",
    image: "/products/ojas.jpg",
    accentFrom: "#B8860B",
    accentTo: "#8C6708",
    delay: 1.6,
    message: "I'm your ritual!",
  },
  {
    id: "karu",
    name: "Kāru",
    image: "/products/karu.jpg",
    accentFrom: "#8C6F4A",
    accentTo: "#5C4A2F",
    delay: 2.4,
    message: "Comb me!",
  },
];

export function WalkingProducts() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show after curtain animation (3.5 seconds)
    const timer = setTimeout(() => {
      setShow(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setDismissed(true);
    setTimeout(() => setShow(false), 500);
  }

  if (!show || dismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] pointer-events-none transition-all duration-500 ${
        dismissed ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Walking products */}
      {walkingProducts.map((product) => (
        <div
          key={product.id}
          className="absolute pointer-events-auto"
          style={{
            bottom: "15%",
            left: "-120px",
            animation: `walkAcross 8s linear ${product.delay}s forwards`,
          }}
          onClick={dismiss}
        >
          <Link href="#shop" className="block group">
            {/* Product bottle */}
            <div
              className="relative w-20 h-28 rounded-sm overflow-hidden shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})`,
                animation: `bobUp 0.6s ease-in-out infinite`,
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
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#F4ECD8] text-[#2C2416] px-3 py-1 rounded-full text-[10px] font-medium whitespace-nowrap shadow-lg border border-[#B8860B]/30"
              style={{
                animation: `bobUp 0.6s ease-in-out infinite 0.3s`,
              }}
            >
              {product.message}
            </div>

            {/* Little legs (walking animation) */}
            <div className="flex justify-center gap-1 mt-0.5">
              <div
                className="w-1 h-3 bg-[#2C2416]/40 rounded-full"
                style={{ animation: "walkLeg 0.3s ease-in-out infinite" }}
              />
              <div
                className="w-1 h-3 bg-[#2C2416]/40 rounded-full"
                style={{ animation: "walkLeg 0.3s ease-in-out infinite 0.15s" }}
              />
            </div>
          </Link>
        </div>
      ))}

      {/* "Take me to the shop" button */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto"
        style={{
          animation: "fadeInUp 0.8s ease-out 3s both",
        }}
      >
        <Link
          href="#shop"
          onClick={dismiss}
          className="inline-flex items-center gap-2 bg-[#1A3D2A] text-[#F4ECD8] px-6 py-3 rounded-full text-[11px] tracking-[0.2em] uppercase shadow-xl hover:bg-[#0F2A1C] transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          Take me to the shop
        </Link>
      </div>

      {/* Skip button */}
      <button
        onClick={dismiss}
        className="absolute top-6 right-6 pointer-events-auto text-[#F4ECD8]/40 hover:text-[#F4ECD8] text-[10px] tracking-[0.2em] uppercase"
        style={{
          animation: "fadeIn 0.5s ease-out 3.5s both",
        }}
      >
        Skip ✕
      </button>

      <style>{`
        @keyframes walkAcross {
          0% { left: -120px; }
          85% { left: calc(100% + 50px); }
          100% { left: calc(100% + 50px); opacity: 0; }
        }
        @keyframes bobUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes walkLeg {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
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
