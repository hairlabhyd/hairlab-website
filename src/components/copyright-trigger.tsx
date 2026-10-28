"use client";

import { useState, useRef, useEffect } from "react";

interface CopyrightTriggerProps {
  children: React.ReactNode;
}

export function CopyrightTrigger({ children }: CopyrightTriggerProps) {
  const [clicks, setClicks] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen for the open-admin event (called by AdminModal)
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleClick() {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setClicks(0), 1500);

    if (newClicks >= 5) {
      setClicks(0);
      window.dispatchEvent(new CustomEvent("open-admin"));
    }
  }

  return (
    <button
      onClick={handleClick}
      className="hover:text-[#F4ECD8]/70 transition-colors text-left cursor-pointer"
      aria-label="Copyright"
      type="button"
    >
      {children}
    </button>
  );
}
