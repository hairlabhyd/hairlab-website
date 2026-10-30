"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Check, X, RotateCcw, Share2, Trophy } from "lucide-react";
import { toast } from "sonner";

interface HerbCard {
  id: number;
  name: string;
  emoji: string;
  fact: string;
  flipped: boolean;
  matched: boolean;
}

const HERBS = [
  { name: "Bhringraj", emoji: "🌿", fact: "Known as the 'king of hair herbs' — traditionally used to support hair growth." },
  { name: "Amla", emoji: "🟢", fact: "Rich in Vitamin C — 20x more than an orange." },
  { name: "Hibiscus", emoji: "🌺", fact: "Contains natural conditioners that soften hair and add shine." },
  { name: "Brahmi", emoji: "🌱", fact: "Calms the scalp and soothes the mind." },
  { name: "Fenugreek", emoji: "🟡", fact: "Rich in protein and lecithin — strengthens hair." },
  { name: "Neem", emoji: "🍃", fact: "Anti-bacterial by nature — keeps the scalp healthy." },
  { name: "Coconut", emoji: "🥥", fact: "Penetrates the hair shaft — one of the few oils that does." },
  { name: "Sesame", emoji: "🟤", fact: "Rich in linoleic acid — supports scalp health." },
  { name: "Curry Leaf", emoji: "🌿", fact: "Rich in beta-carotene and protein — supports hair growth." },
  { name: "Castor", emoji: "💧", fact: "Rich in ricinoleic acid — supports scalp health." },
];

const LEVELS = [
  { level: 1, pairs: 2, name: "Seedling" },
  { level: 2, pairs: 2, name: "Sprout" },
  { level: 3, pairs: 3, name: "Sapling" },
  { level: 4, pairs: 3, name: "Leaf" },
  { level: 5, pairs: 4, name: "Branch" },
  { level: 6, pairs: 4, name: "Bloom" },
  { level: 7, pairs: 5, name: "Bouquet" },
  { level: 8, pairs: 5, name: "Garden" },
  { level: 9, pairs: 5, name: "Forest" },
  { level: 10, pairs: 5, name: "Botanist" },
];

function shuffleCards(herbs: typeof HERBS, pairCount: number): HerbCard[] {
  const selected = [...herbs].sort(() => Math.random() - 0.5).slice(0, pairCount);
  const cards: HerbCard[] = [];
  selected.forEach((herb, i) => {
    cards.push({ id: i * 2, name: herb.name, emoji: herb.emoji, fact: herb.fact, flipped: false, matched: false });
    cards.push({ id: i * 2 + 1, name: herb.name, emoji: herb.emoji, fact: herb.fact, flipped: false, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
}

export function HerbHunter() {
  const [started, setStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [cards, setCards] = useState<HerbCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [showFact, setShowFact] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  function startLevel(levelIdx: number) {
    const level = LEVELS[levelIdx];
    const newCards = shuffleCards(HERBS, level.pairs);
    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setCurrentLevel(levelIdx);
    setStarted(true);
    setCompleted(false);
    setShowFact(null);
  }

  function handleFlip(cardId: number) {
    if (flipped.length === 2) return;
    if (flipped.includes(cardId)) return;
    if (matched.includes(cardId)) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      const card1 = cards.find((c) => c.id === first);
      const card2 = cards.find((c) => c.id === second);

      if (card1 && card2 && card1.name === card2.name) {
        // Match!
        setTimeout(() => {
          setMatched([...matched, first, second]);
          setFlipped([]);
          setShowFact(card1.fact);
          setScore(score + 100);

          // Check if level complete
          if (matched.length + 2 === cards.length) {
            setTimeout(() => {
              if (currentLevel + 1 < LEVELS.length) {
                setCompleted(true);
              } else {
                // All levels done!
                setCompleted(true);
                toast.success("🏆 You completed all 10 levels! You're a true Botanist!");
              }
            }, 1500);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  }

  function nextLevel() {
    if (currentLevel + 1 < LEVELS.length) {
      startLevel(currentLevel + 1);
    }
  }

  function restart() {
    setStarted(false);
    setCompleted(false);
    setScore(0);
    setCurrentLevel(0);
  }

  function share() {
    const text = `I just completed Level ${currentLevel + 1} of Herb Hunter on HAIR LAB. with ${moves} moves! 🌿\n\nPlay → hairlab.one`;
    if (navigator.share) {
      navigator.share({ title: "Herb Hunter", text, url: "https://hairlab.one" }).catch(() => {
        navigator.clipboard.writeText(text);
        toast.success("Copied! Share on your IG story 🍃");
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied! Share on your IG story 🍃");
    }
  }

  // Start screen
  if (!started) {
    return (
      <div className="max-w-md mx-auto px-5 text-center">
        <Leaf className="h-12 w-12 text-[#7A8450] mx-auto mb-4" strokeWidth={1.4} />
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416] mb-3">
          Herb Hunter
        </h3>
        <p className="text-sm text-[#2C2416]/70 leading-relaxed mb-6">
          Match the herb pairs. Learn their secrets. 10 levels — from Seedling to Botanist.
        </p>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {LEVELS.map((l, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm border border-[#2C2416]/10 bg-[#FBF6E9] flex flex-col items-center justify-center p-1"
            >
              <span className="text-[10px] font-bold text-[#2C2416]">{l.level}</span>
              <span className="text-[7px] text-[#2C2416]/50 text-center leading-tight">{l.name}</span>
            </div>
          ))}
        </div>
        <Button
          onClick={() => startLevel(0)}
          className="bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full px-8 py-5 text-[12px] tracking-[0.2em] uppercase"
        >
          Start Hunting
        </Button>
      </div>
    );
  }

  // Level complete screen
  if (completed) {
    const isLast = currentLevel + 1 >= LEVELS.length;
    return (
      <div className="max-w-md mx-auto px-5 text-center">
        <Trophy className="h-12 w-12 text-[#B8860B] mx-auto mb-4" strokeWidth={1.4} />
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416] mb-2">
          {isLast ? "All levels complete!" : `Level ${currentLevel + 1} complete!`}
        </h3>
        <p className="text-sm text-[#2C2416]/70 mb-1">Moves: {moves}</p>
        <p className="text-sm text-[#2C2416]/70 mb-6">Score: {score}</p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {!isLast && (
            <Button
              onClick={nextLevel}
              className="bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
            >
              Next Level →
            </Button>
          )}
          <Button
            onClick={share}
            variant="outline"
            className="border-[#2C2416]/15 text-[#2C2416] hover:bg-[#2C2416]/5 rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button
            onClick={restart}
            variant="ghost"
            className="text-[#2C2416]/60 hover:text-[#2C2416] rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </div>
    );
  }

  // Game screen
  const level = LEVELS[currentLevel];
  return (
    <div className="max-w-md mx-auto px-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/50">
            Level {level.level} / 10
          </p>
          <p className="font-[family-name:var(--font-playfair)] text-lg text-[#2C2416]">
            {level.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/50">Score</p>
          <p className="font-[family-name:var(--font-playfair)] text-lg text-[#B8553C]">
            {score}
          </p>
        </div>
      </div>

      {/* Fact popup */}
      {showFact && (
        <div className="bg-[#1A3D2A] text-[#F4ECD8] rounded-sm p-4 mb-4 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#B8860B] mb-1">
            Herb fact
          </p>
          <p className="text-sm leading-relaxed">{showFact}</p>
          <button
            onClick={() => setShowFact(null)}
            className="mt-2 text-[10px] tracking-[0.15em] uppercase text-[#F4ECD8]/60 hover:text-[#F4ECD8]"
          >
            Got it ✕
          </button>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              disabled={isFlipped || matched.includes(card.id)}
              className={`aspect-square rounded-sm flex items-center justify-center transition-all duration-300 ${
                isMatched
                  ? "bg-[#7A8450]/20 border-2 border-[#7A8450]"
                  : isFlipped
                  ? "bg-[#FBF6E9] border-2 border-[#1A3D2A]"
                  : "bg-[#1A3D2A] border-2 border-transparent hover:border-[#7A8450]/30"
              }`}
            >
              {isFlipped ? (
                <div className="text-center">
                  <span className="text-2xl block">{card.emoji}</span>
                  <span className="text-[8px] text-[#2C2416]/70 uppercase tracking-wide mt-1 block">
                    {card.name}
                  </span>
                </div>
              ) : (
                <Leaf className="h-5 w-5 text-[#F4ECD8]/20" strokeWidth={1} />
              )}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-[10px] tracking-[0.15em] uppercase text-[#2C2416]/50">
        <span>Moves: {moves}</span>
        <span>Matched: {matched.length / 2} / {cards.length / 2}</span>
      </div>
    </div>
  );
}
