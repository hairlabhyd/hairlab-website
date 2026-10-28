"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, X, BookOpen, ShoppingBag, Phone, Mail, Instagram, Heart, Leaf, Truck, ShieldCheck, RefreshCw, Sparkles } from "lucide-react";

const SUBSTACK_URL = "https://yourhairourlab.substack.com/?utm_campaign=profile_chips";
const INSTAGRAM_URL = "https://www.instagram.com/yourhairourlab/";
const WHATSAPP_URL = "https://wa.me/919502194263";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Shop All", href: "#shop", icon: ShoppingBag },
    { label: "Our Story", href: "#story", icon: Heart },
    { label: "Our Promise", href: "#promise", icon: ShieldCheck },
    { label: "Our Fav Herbs", href: "#herbs", icon: Leaf },
    { label: "Letters We Keep", href: "#testimonials", icon: Sparkles },
    { label: "Read Our Substack", href: SUBSTACK_URL, icon: BookOpen, external: true },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[#F4ECD8]/85 hover:text-[#F4ECD8] p-2 -ml-2 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="w-[280px] sm:w-[320px] bg-[#1A3D2A] border-r border-[#F4ECD8]/10 p-0 flex flex-col text-[#F4ECD8]"
        >
          <SheetHeader className="px-5 py-4 border-b border-[#F4ECD8]/10 flex flex-row items-center justify-between space-y-0">
            <SheetTitle className="flex items-center h-10">
              { }
              <img
                src="/hairlab-logo-green.png"
                alt="HAIR LAB."
                className="h-full w-auto object-contain"
              />
            </SheetTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#F4ECD8]/60 hover:text-[#F4ECD8] p-1"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto px-5 py-5">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8860B] mb-4">
              Explore
            </p>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-sm hover:bg-[#F4ECD8]/8 transition-colors text-[#F4ECD8] text-sm"
                  >
                    <item.icon className="h-4 w-4 text-[#B8860B]" strokeWidth={1.5} />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-[#F4ECD8]/10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8860B] mb-3">
                Reach Us
              </p>
              <ul className="space-y-3 text-sm text-[#F4ECD8]/70">
                <li>
                  <a
                    href="tel:+919502194263"
                    className="flex items-center gap-2 hover:text-[#F4ECD8] transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    +91 95021 94263
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hairlabhyd@gmail.com"
                    className="flex items-center gap-2 hover:text-[#F4ECD8] transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    hairlabhyd@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#F4ECD8] transition-colors"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    @yourhairourlab
                  </a>
                </li>
              </ul>
              <p className="text-[10px] text-[#F4ECD8]/50 mt-4 leading-relaxed">
                Hyderabad, Telangana 500029
                <br />
                India
              </p>
            </div>
          </nav>

          <div className="border-t border-[#F4ECD8]/10 px-5 py-4 bg-[#F4ECD8]/5">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#B8860B] mb-2">
              Made with intention
            </p>
            <p className="text-[11px] text-[#F4ECD8]/70 leading-relaxed font-[family-name:var(--font-playfair)] italic">
              Ancient luxury, handcrafted.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
