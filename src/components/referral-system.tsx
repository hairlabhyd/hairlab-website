"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Share2, Check } from "lucide-react";
import { toast } from "sonner";

const REFERRAL_STORAGE_KEY = "hairlab_referral_code";

// Generate a unique referral code for this visitor
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "HAIRLAB-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function ReferralSystem() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      let code = localStorage.getItem(REFERRAL_STORAGE_KEY);
      if (!code) {
        code = generateReferralCode();
        localStorage.setItem(REFERRAL_STORAGE_KEY, code);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReferralCode(code);
    } catch {}
  }, []);

  function getReferralLink() {
    return `https://hairlab.one?ref=${referralCode}`;
  }

  function copyLink() {
    navigator.clipboard.writeText(getReferralLink());
    setCopied(true);
    toast.success("Referral link copied! 🍃");
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    const text = `Hey! I found this hand-blended hair oil brand — HAIR LAB. Ancient luxury, handcrafted. Use my code ${referralCode} for 10% off your first order! 🌿\n\n${getReferralLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  if (!referralCode) return null;

  return (
    <div className="bg-[#1A3D2A] rounded-sm p-6 max-w-md mx-auto">
      <div className="text-center mb-5">
        <Gift className="h-8 w-8 text-[#B8860B] mx-auto mb-3" strokeWidth={1.4} />
        <h4 className="font-[family-name:var(--font-playfair)] text-xl text-[#F4ECD8] mb-2">
          Share the ritual
        </h4>
        <p className="text-sm text-[#F4ECD8]/70 leading-relaxed">
          Give 10% off. Get ₹50 when they order. Everyone wins.
        </p>
      </div>

      {/* Referral code */}
      <div className="bg-[#F4ECD8] rounded-sm p-4 mb-4 text-center">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/60 mb-1">
          Your referral code
        </p>
        <p className="font-mono text-lg font-bold text-[#1A3D2A]">
          {referralCode}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button
          onClick={copyLink}
          className="w-full bg-[#F4ECD8] hover:bg-white text-[#1A3D2A] rounded-full py-4 text-[11px] tracking-[0.2em] uppercase font-medium"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy referral link
            </>
          )}
        </Button>
        <Button
          onClick={shareWhatsApp}
          className="w-full bg-[#25D366] hover:bg-[#1da851] text-white rounded-full py-4 text-[11px] tracking-[0.2em] uppercase font-medium"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share on WhatsApp
        </Button>
      </div>

      <p className="text-center text-[9px] tracking-[0.15em] uppercase text-[#F4ECD8]/40 mt-4">
        Friend gets 10% off · You get ₹50 credit on their first order
      </p>
    </div>
  );
}
