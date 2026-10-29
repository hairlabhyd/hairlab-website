"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { products as allProducts } from "@/lib/products";

interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  volume: string;
  image: string;
  tagline: string | null;
  nights: number | null;
  accentFrom: string;
  accentTo: string;
  ingredients: string[];
}

export function FoundersPicks() {
  const addItem = useCart((s) => s.addItem);

  function addBundle() {
    const bundleProducts = [
      allProducts.find((p) => p.slug === "mane"),
      allProducts.find((p) => p.slug === "ojas"),
      allProducts.find((p) => p.slug === "karu"),
    ].filter(Boolean) as Product[];

    bundleProducts.forEach((p) => {
      addItem({
        id: p.id,
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle,
        price: p.price,
        image: p.image,
        accentFrom: p.accentFrom,
        accentTo: p.accentTo,
      });
    });
    toast.success("Sruwa's ritual bundle added to cart 🍃");
  }

  return (
    <div className="bg-[#F4ECD8] rounded-sm p-6 sm:p-8 max-w-md mx-auto">
      <div className="space-y-3 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-[#2C2416]">Mane — Hair Oil (100ml)</span>
          <span className="text-[#2C2416]/70">₹289</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#2C2416]">Ojas — Power Mix (100g)</span>
          <span className="text-[#2C2416]/70">₹189</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#2C2416]">Kāru — Neem Wood Comb</span>
          <span className="text-[#2C2416]/70">₹189</span>
        </div>
      </div>
      <div className="border-t border-[#2C2416]/10 pt-3 flex justify-between items-end">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/60">
            Bundle total
          </p>
          <p className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416]">
            ₹667
          </p>
          <p className="text-[10px] text-[#5C6B3A] mt-1">
            Save ₹17 vs individual
          </p>
        </div>
        <Button
          onClick={addBundle}
          className="bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full px-5 text-[11px] tracking-[0.15em] uppercase"
        >
          Add bundle to cart
        </Button>
      </div>
    </div>
  );
}
