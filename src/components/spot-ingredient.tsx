"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, Check, X, RotateCcw, Share2, Trophy, Eye } from "lucide-react";
import { toast } from "sonner";

interface Ingredient {
  name: string;
  emoji: string;
  fact: string;
  x: number;
  y: number;
  found: boolean;
}

const INGREDIENTS = [
  { name: "Bhringraj", emoji: "🌿", fact: "King of hair herbs — supports hair growth." },
  { name: "Amla", emoji: "🟢", fact: "20x more Vitamin C than an orange." },
  { name: "Hibiscus", emoji: "🌺", fact: "Natural conditioner — softens and shines." },
  { name: "Brahmi", emoji: "🌱", fact: "Calms the scalp, soothes the mind." },
  { name: "Fenugreek", emoji: "🟡", fact: "Rich in protein and lecithin." },
  { name: "Neem", emoji: "🍃", fact: "Anti-bacterial — keeps scalp healthy." },
  { name: "Coconut", emoji: "🥥", fact: "Penetrates the hair shaft." },
  { name: "Sesame", emoji: "🟤", fact: "Rich in linoleic acid." },
  { name: "Curry Leaf", emoji: "🌿", fact: "Beta-carotene + protein." },
  { name: "Castor", emoji: "💧", fact: "Ricinoleic acid — scalp health." },
  { name: "Rosemary", emoji: "🌲", fact: "Supports hair growth." },
  { name: "Aparajita", emoji: "🦋", fact: "Butterfly pea — natural shine." },
  { name: "Moringa", emoji: "🌿", fact: "Nutrient-dense superfood for hair." },
  { name: "Flaxseed", emoji: "🟫", fact: "Omega-3 — scalp health." },
  { name: "Shikakai", emoji: "🌱", fact: "Gentle natural cleanser." },
];

const LEVELS = [
  { level: 1, count: 1, name: "Searcher" },
  { level: 2, count: 1, name: "Seeker" },
  { level: 3, count: 2, name: "Scout" },
  { level: 4, count: 2, name: "Finder" },
  { level: 5, count: 2, name: "Tracker" },
  { level: 6, count: 3, name: "Hunter" },
  { level: 7, count: 3, name: "Explorer" },
  { level: 8, count: 3, name: "Ranger" },
  { level: 9, count: 4, name: "Discoverer" },
  { level: 10, count: 4, name: "Adventurer" },
  { level: 11, count: 4, name: "Pathfinder" },
  { level: 12, count: 5, name: "Botanist" },
  { level: 13, count: 5, name: "Herbalist" },
  { level: 14, count: 5, name: "Alchemist" },
  { level: 15, count: 5, name: "Master" },
];

// Background emojis (distractors)
const DISTRACTORS = ["🍃", "🌿", "🌱", "🪴", "🌾", "🍂", "🍁", "🌾", "🌵", "🪻", "🌾", "🌿"];

function generateBoard(levelIdx: number): { ingredients: Ingredient[]; distractors: { emoji: string; x: number; y: number }[] } {
  const level = LEVELS[levelIdx];
  const selected = [...INGREDIENTS].sort(() => Math.random() - 0.5).slice(0, level.count);
  
  const ingredients: Ingredient[] = selected.map((ing) => ({
    ...ing,
    x: 10 + Math.random() * 70,
    y: 10 + Math.random() * 60,
    found: false,
  }));

  // Generate distractor emojis
  const distractors: { emoji: string; x: number; y: number }[] = [];
  const numDistractors = 15 + levelIdx * 2;
  for (let i = 0; i < numDistractors; i++) {
    distractors.push({
      emoji: DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)],
      x: 5 + Math.random() * 85,
      y: 5 + Math.random() * 75,
    });
  }

  return { ingredients, distractors };
}

export function SpotIngredient() {
  const [started, setStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [board, setBoard] = useState<{ ingredients: Ingredient[]; distractors: { emoji: string; x: number; y: number }[] }>({ ingredients: [], distractors: [] });
  const [foundCount, setFoundCount] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showFact, setShowFact] = useState<string | null>(null);

  function startLevel(levelIdx: number) {
    const newBoard = generateBoard(levelIdx);
    setBoard(newBoard);
    setFoundCount(0);
    setCurrentLevel(levelIdx);
    setStarted(true);
    setCompleted(false);
    setShowFact(null);
  }

  function handleFind(ingredientIdx: number) {
    const ing = board.ingredients[ingredientIdx];
    if (ing.found) return;

    const newIngredients = [...board.ingredients];
    newIngredients[ingredientIdx] = { ...ing, found: true };
    setBoard({ ...board, ingredients: newIngredients });
    setFoundCount(foundCount + 1);
    setScore(score + 100);
    setShowFact(ing.fact);
    toast.success(`Found ${ing.name}! 🌿`);

    // Check if level complete
    if (foundCount + 1 === board.ingredients.length) {
      setTimeout(() => {
        setCompleted(true);
        if (currentLevel + 1 >= LEVELS.length) {
          toast.success("🏆 You found all 15 levels! You're a true Master!");
        }
      }, 1000);
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
    const text = `I just found ${foundCount} hidden ingredients in Level ${currentLevel + 1} of Spot the Ingredient on HAIR LAB.! 🔍🌿\n\nPlay → hairlab.one`;
    if (navigator.share) {
      navigator.share({ title: "Spot the Ingredient", text, url: "https://hairlab.one" }).catch(() => {
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
        <Search className="h-12 w-12 text-[#7A8450] mx-auto mb-4" strokeWidth={1.4} />
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416] mb-3">
          Spot the Ingredient
        </h3>
        <p className="text-sm text-[#2C2416]/70 leading-relaxed mb-6">
          Find the hidden ingredients among the leaves. 15 levels — from Searcher to Master.
        </p>
        <div className="grid grid-cols-5 gap-1.5 mb-6">
          {LEVELS.map((l, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm border border-[#2C2416]/10 bg-[#FBF6E9] flex flex-col items-center justify-center p-1"
            >
              <span className="text-[9px] font-bold text-[#2C2416]">{l.level}</span>
            </div>
          ))}
        </div>
        <Button
          onClick={() => startLevel(0)}
          className="bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full px-8 py-5 text-[12px] tracking-[0.2em] uppercase"
        >
          Start Searching
        </Button>
      </div>
    );
  }

  // Level complete
  if (completed) {
    const isLast = currentLevel + 1 >= LEVELS.length;
    return (
      <div className="max-w-md mx-auto px-5 text-center">
        <Trophy className="h-12 w-12 text-[#B8860B] mx-auto mb-4" strokeWidth={1.4} />
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416] mb-2">
          {isLast ? "All 15 levels complete!" : `Level ${currentLevel + 1} complete!`}
        </h3>
        <p className="text-sm text-[#2C2416]/70 mb-1">Found: {foundCount} ingredients</p>
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
            Level {level.level} / 15
          </p>
          <p className="font-[family-name:var(--font-playfair)] text-lg text-[#2C2416]">
            {level.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/50">Found</p>
          <p className="font-[family-name:var(--font-playfair)] text-lg text-[#B8553C]">
            {foundCount} / {board.ingredients.length}
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

      {/* Find list */}
      <div className="flex flex-wrap gap-2 mb-4">
        {board.ingredients.map((ing, i) => (
          <span
            key={i}
            className={`text-[10px] tracking-[0.1em] uppercase px-2 py-1 rounded-full border ${
              ing.found
                ? "bg-[#7A8450]/20 border-[#7A8450] text-[#5C6B3A] line-through"
                : "bg-[#FBF6E9] border-[#2C2416]/15 text-[#2C2416]/60"
            }`}
          >
            {ing.found ? `✓ ${ing.name}` : `? ${ing.name}`}
          </span>
        ))}
      </div>

      {/* Game board */}
      <div className="relative w-full aspect-square bg-[#1A3D2A]/5 rounded-sm border border-[#2C2416]/10 overflow-hidden">
        {/* Distractors */}
        {board.distractors.map((d, i) => (
          <div
            key={`d-${i}`}
            className="absolute text-lg opacity-30 select-none"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            {d.emoji}
          </div>
        ))}

        {/* Hidden ingredients */}
        {board.ingredients.map((ing, i) => (
          <button
            key={`ing-${i}`}
            onClick={() => handleFind(i)}
            disabled={ing.found}
            className={`absolute text-2xl transition-all duration-300 ${
              ing.found ? "opacity-30 scale-75" : "hover:scale-125 opacity-80"
            }`}
            style={{ left: `${ing.x}%`, top: `${ing.y}%` }}
          >
            {ing.emoji}
          </button>
        ))}
      </div>

      <p className="text-center text-[10px] tracking-[0.15em] uppercase text-[#2C2416]/40 mt-3">
        Tap the hidden ingredients to find them
      </p>
    </div>
  );
}
