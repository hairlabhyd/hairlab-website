"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Check, Share2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "hairlab_ritual_challenge";

interface ChallengeState {
  startDate: string;
  completedNights: number[];
}

// Subscribe to localStorage so we can render the saved state on the client
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): ChallengeState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): ChallengeState | null {
  return null;
}

export function RitualChallenge() {
  const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  function startChallenge() {
    const newState: ChallengeState = {
      startDate: new Date().toISOString(),
      completedNights: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    window.dispatchEvent(new Event("storage"));
    toast.success("Your 30-night ritual begins tonight 🍃");
  }

  function toggleNight(night: number) {
    if (!state) return;
    const completed = state.completedNights.includes(night)
      ? state.completedNights.filter((n) => n !== night)
      : [...state.completedNights, night];
    const newState = { ...state, completedNights: completed };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    window.dispatchEvent(new Event("storage"));

    if (completed.includes(night) && night === 30) {
      toast.success("30 nights complete. Your hair remembers. 🌙");
    } else if (completed.includes(night)) {
      toast.success(`Night ${night} marked 🍃`);
    }
  }

  function resetChallenge() {
    if (!confirm("Reset your 30-night challenge? This cannot be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("storage"));
    toast.info("Challenge reset");
  }

  function shareProgress() {
    if (!state) return;
    const count = state.completedNights.length;
    const text = `I'm on Night ${count} of my 30-night HAIR LAB. ritual challenge.\n\n${"🌙".repeat(Math.min(count, 30))}\n\nJoin me → hairlab-website.vercel.app`;
    if (navigator.share) {
      navigator.share({
        title: "My HAIR LAB. Ritual",
        text,
        url: "https://hairlab-website.vercel.app",
      }).catch(() => {
        navigator.clipboard.writeText(text);
        toast.success("Copied! Share on your IG story 🍃");
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied! Share on your IG story 🍃");
    }
  }

  if (!state) {
    return (
      <div className="text-center max-w-2xl mx-auto px-5">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-10 bg-[#B8860B]" />
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#B8860B]">
            The Challenge
          </span>
          <div className="h-px w-10 bg-[#B8860B]" />
        </div>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#F4ECD8] leading-tight">
          The 30-Night
          <br />
          <span className="italic text-[#B8860B]">Ritual Challenge</span>
        </h2>
        <p className="mt-6 text-[#F4ECD8]/75 leading-relaxed max-w-md mx-auto">
          Oil your hair every night for 30 nights. Mark each one. Screenshot at
          Night 30. Tag <strong>@yourhairourlab</strong> on Instagram. Watch your
          hair remember what care feels like.
        </p>
        <Button
          onClick={startChallenge}
          className="mt-8 bg-[#B8860B] hover:bg-[#8C6708] text-[#2C2416] rounded-full px-8 py-6 text-[12px] tracking-[0.2em] uppercase font-medium"
        >
          <Moon className="mr-2 h-4 w-4" />
          Begin Tonight
        </Button>
        <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-[#F4ECD8]/40">
          Free · Saved in your browser · No signup
        </p>
      </div>
    );
  }

  const completedCount = state.completedNights.length;
  const progress = (completedCount / 30) * 100;
  const startDate = new Date(state.startDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-5">
      <div className="text-center mb-8">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8860B] mb-3">
          Started {startDate}
        </p>
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl text-[#F4ECD8] leading-tight">
          Night {completedCount} of 30
        </h2>
        <div className="mt-4 h-1.5 bg-[#F4ECD8]/10 rounded-full overflow-hidden max-w-xs mx-auto">
          <div
            className="h-full bg-gradient-to-r from-[#7A8450] to-[#B8860B] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-[10px] tracking-[0.3em] uppercase text-[#F4ECD8]/40">
          {Math.round(progress)}% complete
        </p>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 mb-8">
        {Array.from({ length: 30 }).map((_, i) => {
          const night = i + 1;
          const isComplete = state.completedNights.includes(night);
          return (
            <button
              key={night}
              onClick={() => toggleNight(night)}
              className={`aspect-square rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                isComplete
                  ? "bg-[#B8860B] text-[#2C2416] hover:bg-[#8C6708]"
                  : "bg-[#F4ECD8]/10 text-[#F4ECD8]/60 hover:bg-[#F4ECD8]/20 border border-[#F4ECD8]/20"
              }`}
              aria-label={`Night ${night} ${isComplete ? "complete" : "incomplete"}`}
            >
              {isComplete ? <Check className="h-3.5 w-3.5" /> : night}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={shareProgress}
          className="bg-[#B8860B] hover:bg-[#8C6708] text-[#2C2416] rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
        >
          <Share2 className="mr-2 h-3.5 w-3.5" />
          Share Progress
        </Button>
        <Button
          onClick={resetChallenge}
          variant="ghost"
          className="text-[#F4ECD8]/60 hover:text-[#F4ECD8] rounded-full px-5 text-[11px] tracking-[0.2em] uppercase"
        >
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <p className="mt-6 text-center text-[10px] tracking-[0.2em] uppercase text-[#F4ECD8]/40">
        Tap each night as you complete it · Saved in your browser
      </p>
    </div>
  );
}

