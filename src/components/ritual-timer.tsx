"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Droplets, Check, Share2, X } from "lucide-react";
import { toast } from "sonner";

const PRESETS = [
  { label: "2 min", value: 2 * 60, desc: "Quick massage" },
  { label: "20 min", value: 20 * 60, desc: "Pre-wash" },
  { label: "1 hour", value: 60 * 60, desc: "Deep conditioning" },
  { label: "Overnight", value: 8 * 60 * 60, desc: "Full ritual" },
];

const MASSAGE_STEPS = [
  { time: 0, text: "Warm 2-3 drops between your palms." },
  { time: 15, text: "Press into your scalp — not the lengths." },
  { time: 30, text: "Massage in slow circles at the crown." },
  { time: 60, text: "Move to the temples. Gentle pressure." },
  { time: 90, text: "Work down to the nape of your neck." },
  { time: 120, text: "Now the sides — small circular motions." },
  { time: 180, text: "Pull gently through the lengths." },
  { time: 240, text: "You're doing great. Breathe." },
  { time: 300, text: "The oil is working. Be patient." },
  { time: 600, text: "Halfway there. Your scalp is warm." },
  { time: 900, text: "The botanicals are infusing. Slowly." },
  { time: 1200, text: "Almost there. The ritual is almost complete." },
];

export function RitualTimer() {
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setRunning(false);
            setCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [running, secondsLeft]);

  function startTimer(seconds: number) {
    setTotalTime(seconds);
    setSecondsLeft(seconds);
    setRunning(true);
    setCompleted(false);
    setShowFull(true);
  }

  function pause() {
    setRunning(false);
  }

  function resume() {
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(0);
    setCompleted(false);
    setShowFull(false);
  }

  function formatTime(secs: number) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Find current massage step
  const elapsed = totalTime - secondsLeft;
  const currentStep = [...MASSAGE_STEPS].reverse().find((s) => elapsed >= s.time);
  const progress = totalTime > 0 ? ((totalTime - secondsLeft) / totalTime) * 100 : 0;

  function share() {
    const text = `I just completed a ${formatTime(totalTime)} hair oiling ritual with HAIR LAB. 🍃 My scalp is happy.\n\nStart your ritual → hairlab.one`;
    if (navigator.share) {
      navigator.share({ title: "My HAIR LAB. Ritual", text, url: "https://hairlab.one" }).catch(() => {
        navigator.clipboard.writeText(text);
        toast.success("Copied! Share on your IG story 🍃");
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied! Share on your IG story 🍃");
    }
  }

  // Compact view (not started)
  if (!showFull) {
    return (
      <div className="max-w-md mx-auto px-5">
        <div className="text-center mb-8">
          <Droplets className="h-10 w-10 text-[#7A8450] mx-auto mb-4" strokeWidth={1.4} />
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416] mb-2">
            Set your ritual timer
          </h3>
          <p className="text-sm text-[#2C2416]/60">
            Choose your duration. We&apos;ll guide you through the massage.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => startTimer(preset.value)}
              className="p-4 rounded-sm border-2 border-[#2C2416]/10 bg-[#FBF6E9] hover:border-[#1A3D2A] hover:bg-[#1A3D2A]/5 transition-all text-left group"
            >
              <p className="font-[family-name:var(--font-playfair)] text-xl text-[#2C2416]">
                {preset.label}
              </p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#2C2416]/50 mt-1">
                {preset.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Completed view
  if (completed) {
    return (
      <div className="max-w-md mx-auto px-5 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#7A8450] text-[#F4ECD8] mb-6">
          <Check className="h-10 w-10" strokeWidth={2} />
        </div>
        <h3 className="font-[family-name:var(--font-playfair)] text-3xl text-[#2C2416] mb-3">
          Ritual complete.
        </h3>
        <p className="text-[#2C2416]/70 leading-relaxed mb-2">
          You oiled your hair for <strong>{formatTime(totalTime)}</strong>.
        </p>
        <p className="font-[family-name:var(--font-playfair)] italic text-lg text-[#7A8450] mb-8">
          Your scalp remembers care.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={share}
            className="bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share my ritual
          </Button>
          <Button
            onClick={reset}
            variant="outline"
            className="border-[#2C2416]/15 text-[#2C2416] hover:bg-[#2C2416]/5 rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Start again
          </Button>
        </div>
      </div>
    );
  }

  // Timer running view
  return (
    <div className="max-w-md mx-auto px-5 text-center">
      {/* Close button */}
      <button
        onClick={reset}
        className="absolute top-4 right-4 text-[#2C2416]/30 hover:text-[#2C2416]"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Circular progress */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#2C2416"
            strokeWidth="2"
            opacity="0.1"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#7A8450"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-[family-name:var(--font-playfair)] text-4xl text-[#2C2416]">
            {formatTime(secondsLeft)}
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/50 mt-1">
            {running ? "Massaging" : "Paused"}
          </p>
        </div>
      </div>

      {/* Current step guidance */}
      {currentStep && (
        <div className="bg-[#1A3D2A] text-[#F4ECD8] rounded-sm p-5 mb-6 min-h-[80px] flex items-center justify-center">
          <p className="font-[family-name:var(--font-playfair)] italic text-base leading-relaxed">
            {currentStep.text}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {running ? (
          <Button
            onClick={pause}
            className="bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full px-8 py-5 text-[12px] tracking-[0.2em] uppercase"
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        ) : (
          <Button
            onClick={resume}
            className="bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full px-8 py-5 text-[12px] tracking-[0.2em] uppercase"
          >
            <Play className="mr-2 h-4 w-4" />
            Resume
          </Button>
        )}
        <Button
          onClick={reset}
          variant="outline"
          className="border-[#2C2416]/15 text-[#2C2416] hover:bg-[#2C2416]/5 rounded-full px-6 py-5 text-[12px] tracking-[0.2em] uppercase"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Pulsing oil drop animation */}
      {running && (
        <div className="mt-8 flex justify-center">
          <div
            className="w-3 h-3 rounded-full bg-[#7A8450]"
            style={{ animation: "oilDrop 1.5s ease-in-out infinite" }}
          />
        </div>
      )}

      <style>{`
        @keyframes oilDrop {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
