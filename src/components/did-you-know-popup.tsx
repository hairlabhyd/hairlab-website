"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, X, RefreshCw, ArrowRight } from "lucide-react";
import { facts, getFactForCurrentWeek } from "@/lib/did-you-know-facts";
import { toast } from "sonner";

const STORAGE_KEY = "hairlab_did_you_known_last_shown_week";
const SESSION_KEY = "hairlab_did_you_known_session_seen";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export function DidYouKnowPopup() {
  const lastShownWeek = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [isOpen, setIsOpen] = useState(false);
  const [factIndex, setFactIndex] = useState<number | null>(null);

  // Get current week number
  function getCurrentWeek(): string {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysSinceStart = Math.floor(
      (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
    );
    const weekNumber = Math.floor(daysSinceStart / 7);
    return `${now.getFullYear()}-W${weekNumber}`;
  }

  // On mount: check if we should show popup
  useState(() => {
    const currentWeek = getCurrentWeek();
    if (lastShownWeek !== currentWeek) {
      // Show popup for new week
      setTimeout(() => {
        setIsOpen(true);
        const weeklyFact = getFactForCurrentWeek();
        const idx = facts.findIndex((f) => f.text === weeklyFact.text);
        setFactIndex(idx >= 0 ? idx : 0);
        localStorage.setItem(STORAGE_KEY, currentWeek);
        window.dispatchEvent(new Event("storage"));
      }, 3000); // Show after 3 seconds
    }
  });

  function close() {
    setIsOpen(false);
    // Mark as seen for this week
    const currentWeek = getCurrentWeek();
    localStorage.setItem(STORAGE_KEY, currentWeek);
    window.dispatchEvent(new Event("storage"));
  }

  function showAnother() {
    const newIdx = Math.floor(Math.random() * facts.length);
    setFactIndex(newIdx);
    toast.success("A new fact for you 🍃");
  }

  if (!isOpen || factIndex === null) return null;

  const fact = facts[factIndex];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#2C2416]/60 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="bg-[#F4ECD8] max-w-md w-full rounded-sm shadow-2xl border border-[#B8860B]/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1A3D2A] text-[#F4ECD8] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#B8860B]" />
            <span className="text-[11px] tracking-[0.3em] uppercase font-medium">
              Did You Know
            </span>
          </div>
          <button
            onClick={close}
            className="text-[#F4ECD8]/60 hover:text-[#F4ECD8] p-1"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8860B]">
              {fact.category}
            </span>
            <div className="h-px flex-1 bg-[#B8860B]/20" />
          </div>

          <p className="font-[family-name:var(--font-playfair)] italic text-lg text-[#2C2416] leading-relaxed">
            {fact.text}
          </p>

          <p className="mt-5 text-[10px] tracking-[0.3em] uppercase text-[#2C2416]/40">
            A new fact every week · {facts.length}+ facts in our archive
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FBF6E9] border-t border-[#2C2416]/8 flex items-center justify-between gap-2">
          <Button
            onClick={showAnother}
            variant="ghost"
            size="sm"
            className="text-[#2C2416]/70 hover:text-[#B8553C] rounded-full px-4 text-[10px] tracking-[0.2em] uppercase"
          >
            <RefreshCw className="mr-1.5 h-3 w-3" />
            Show Another
          </Button>
          <Button
            onClick={close}
            size="sm"
            className="bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full px-4 text-[10px] tracking-[0.2em] uppercase"
          >
            Got it
            <ArrowRight className="ml-1.5 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
