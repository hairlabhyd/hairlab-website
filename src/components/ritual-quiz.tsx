"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, RotateCcw, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Question {
  question: string;
  options: { text: string; archetype: "mane" | "neelam" | "ojas" | "karu" }[];
}

const questions: Question[] = [
  {
    question: "Sunday morning, your hand reaches for…",
    options: [
      { text: "A slow scalp massage, before the world wakes up", archetype: "mane" },
      { text: "Something to bring back the dark", archetype: "neelam" },
      { text: "A paste, mixed fresh, weekly ritual", archetype: "ojas" },
      { text: "A comb that remembers my grandmother", archetype: "karu" },
    ],
  },
  {
    question: "Your grandmother's hair secret was…",
    options: [
      { text: "Bhringraj in sesame, slow-infused for days", archetype: "neelam" },
      { text: "Coconut oil with hibiscus, every Sunday", archetype: "mane" },
      { text: "Shikakai powder, mixed in a brass bowl", archetype: "ojas" },
      { text: "A neem wood comb, never plastic", archetype: "karu" },
    ],
  },
  {
    question: "Hair oils you've tried so far…",
    options: [
      { text: "Many. None felt like ritual.", archetype: "ojas" },
      { text: "A few. I keep coming back to the basics.", archetype: "mane" },
      { text: "Few. I trust tradition over trends.", archetype: "neelam" },
      { text: "I prefer combs over oils, honestly.", archetype: "karu" },
    ],
  },
  {
    question: "Your ideal hair evening is…",
    options: [
      { text: "Quiet. Two minutes. Sleep.", archetype: "mane" },
      { text: "Dark, intentional, slow", archetype: "neelam" },
      { text: "Mixing, blending, hands in herbs", archetype: "ojas" },
      { text: "Long strokes, neem wood, calm", archetype: "karu" },
    ],
  },
  {
    question: "Pick a word that feels like you:",
    options: [
      { text: "Patient", archetype: "mane" },
      { text: "Mysterious", archetype: "neelam" },
      { text: "Curious", archetype: "ojas" },
      { text: "Grounded", archetype: "karu" },
    ],
  },
];

const archetypes = {
  mane: {
    name: "The Resham Ritual Keeper",
    ritual: "Sunday evenings are yours. Two minutes, scalp to ends. Slow, intentional, patient.",
    product: "Mane",
    description: "You believe hair has memory. You'd rather it remember care.",
    color: "#7A8450",
    accent: "#5C6B3A",
  },
  neelam: {
    name: "The Neelam Ritual Keeper",
    ritual: "You lean toward the dark. Indigo, bhringraj, depth. Hair that remembers it has roots.",
    product: "Neelam",
    description: "Mysterious, traditional, intentional. Your hair knows it.",
    color: "#3A4D5C",
    accent: "#1F2E3A",
  },
  ojas: {
    name: "The Ojas Ritual Keeper",
    ritual: "You like to mix. Powders, oils, decoctions. Your ritual is hands-on, weekly, alive.",
    product: "Ojas",
    description: "Curious, experimental, grounded. Your hair follows your hands.",
    color: "#B8860B",
    accent: "#8C6708",
  },
  karu: {
    name: "The Kāru Ritual Keeper",
    ritual: "You trust the slow drag of neem wood through hair. No static, no snags, no plastic.",
    product: "Kāru",
    description: "Grounded, deliberate, anti-plastic. Your comb is your ritual.",
    color: "#8C6F4A",
    accent: "#5C4A2F",
  },
};

export function RitualQuiz() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    mane: 0,
    neelam: 0,
    ojas: 0,
    karu: 0,
  });
  const [result, setResult] = useState<keyof typeof archetypes | null>(null);

  function start() {
    setStarted(true);
    setCurrentQ(0);
    setScores({ mane: 0, neelam: 0, ojas: 0, karu: 0 });
    setResult(null);
  }

  function answer(archetype: keyof typeof archetypes) {
    const newScores = { ...scores, [archetype]: scores[archetype] + 1 };
    setScores(newScores);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      // Determine winner
      const winner = (Object.entries(newScores) as [keyof typeof archetypes, number][])
        .sort((a, b) => b[1] - a[1])[0][0];
      setResult(winner);
    }
  }

  function share() {
    const archetype = result ? archetypes[result] : null;
    if (!archetype) return;
    const text = `I'm ${archetype.name} on HAIR LAB.\n\n${archetype.ritual}\n\nFind your ritual → hairlab-website.vercel.app`;
    if (navigator.share) {
      navigator.share({
        title: archetype.name,
        text,
        url: "https://hairlab-website.vercel.app",
      }).catch(() => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard! Paste it on Instagram 🍃");
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied! Paste it on your Instagram story 🍃");
    }
  }

  if (!started) {
    return (
      <div className="text-center max-w-2xl mx-auto px-5">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-10 bg-[#B8860B]" />
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#8C6708]">
            Find Your Ritual
          </span>
          <div className="h-px w-10 bg-[#B8860B]" />
        </div>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#2C2416] leading-tight">
          What&apos;s your
          <br />
          <span className="italic text-[#B8553C]">hair ritual?</span>
        </h2>
        <p className="mt-6 text-[#2C2416]/70 leading-relaxed max-w-md mx-auto">
          Five questions. One ritual. Screenshot your result, share it on Instagram,
          tag us at <strong>@yourhairourlab</strong>.
        </p>
        <Button
          onClick={start}
          className="mt-8 bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full px-8 py-6 text-[12px] tracking-[0.2em] uppercase font-medium"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Take the Quiz
        </Button>
        <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/40">
          5 questions · 30 seconds · Free
        </p>
      </div>
    );
  }

  if (result) {
    const archetype = archetypes[result];
    return (
      <div className="text-center max-w-xl mx-auto px-5">
        <div
          className="p-8 sm:p-12 rounded-sm border-2"
          style={{
            background: `linear-gradient(135deg, ${archetype.color}15, ${archetype.accent}25)`,
            borderColor: `${archetype.color}40`,
          }}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#8C6708] mb-3">
            You are
          </p>
          <h3 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl text-[#2C2416] leading-tight">
            {archetype.name}
          </h3>
          <p className="mt-4 font-[family-name:var(--font-playfair)] italic text-lg text-[#2C2416]/85 leading-relaxed">
            {archetype.ritual}
          </p>
          <p className="mt-4 text-sm text-[#2C2416]/70 leading-relaxed">
            {archetype.description}
          </p>

          <div className="mt-8 pt-6 border-t border-[#2C2416]/10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#2C2416]/50 mb-3">
              Your ritual product
            </p>
            <p className="font-[family-name:var(--font-playfair)] text-2xl text-[#B8553C]">
              {archetype.product}
            </p>
            <Button
              asChild
              className="mt-5 bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
            >
              <a href="#shop">
                Shop {archetype.product}
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={share}
            variant="outline"
            className="bg-[#FBF6E9] border-[#2C2416]/15 text-[#2C2416] hover:bg-[#2C2416]/5 rounded-full px-5 text-[11px] tracking-[0.2em] uppercase"
          >
            <Share2 className="mr-2 h-3.5 w-3.5" />
            Share my result
          </Button>
          <Button
            onClick={start}
            variant="ghost"
            className="text-[#2C2416]/60 hover:text-[#2C2416] rounded-full px-5 text-[11px] tracking-[0.2em] uppercase"
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Retake
          </Button>
        </div>
        <p className="mt-6 text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/40">
          Screenshot this · Share on IG story · Tag @yourhairourlab
        </p>
      </div>
    );
  }

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto px-5">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#2C2416]/50">
            Question {currentQ + 1} of {questions.length}
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C6708]">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 bg-[#2C2416]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7A8450] to-[#B8860B] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-[#2C2416] leading-tight mb-8 text-center">
        {q.question}
      </h3>

      <div className="space-y-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(opt.archetype)}
            className="w-full text-left p-4 sm:p-5 rounded-sm bg-[#FBF6E9] border border-[#2C2416]/10 hover:border-[#B8553C] hover:bg-[#F4ECD8] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#2C2416]/40 group-hover:text-[#B8553C] transition-colors">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm sm:text-base text-[#2C2416] font-[family-name:var(--font-inter)]">
                {opt.text}
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-[#2C2416]/30 group-hover:text-[#B8553C] group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
