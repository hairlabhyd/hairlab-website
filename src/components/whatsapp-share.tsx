"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface WhatsAppShareProps {
  text: string;
  url?: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function WhatsAppShare({
  text,
  url = "https://hairlab.one",
  label = "Share on WhatsApp",
  variant = "outline",
  size = "sm",
  className = "",
}: WhatsAppShareProps) {
  const fullText = `${text}\n\n${url}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={`bg-[#25D366]/10 border-[#25D366]/30 text-[#1A3D2A] hover:bg-[#25D366]/20 rounded-full ${className}`}
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Share2 className="mr-2 h-3.5 w-3.5" />
        {label}
      </a>
    </Button>
  );
}
