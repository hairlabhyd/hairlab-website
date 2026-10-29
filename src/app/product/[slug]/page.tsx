"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { WhatsAppShare } from "@/components/whatsapp-share";
import { toast } from "sonner";
import Link from "next/link";

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

// Usage guides per product (Sruwa's real instructions)
const usageGuides: Record<string, { steps: string[]; note: string }> = {
  mane: {
    steps: [
      "Warm 2-3 drops between your palms.",
      "Press into your scalp — not the lengths. Scalp first, always.",
      "Massage in slow circles for 2 minutes.",
      "Leave overnight, or for a minimum of 2 hours.",
      "Rinse with a mild cleanser, warm water, gentle hands.",
    ],
    note:
      "Powered by botanicals like bhringraj, brahmi, amla, and hibiscus. Slow-infused into a base that remembers Sunday evenings.",
  },
  neelam: {
    steps: [
      "Warm 2-3 drops between your palms.",
      "Part your hair in sections. Apply to scalp first.",
      "Massage gently — focus on the crown and temples.",
      "Leave overnight for deep nourishment.",
      "Rinse next morning with a mild cleanser.",
    ],
    note:
      "Indigo and bhringraj, infused carefully. Traditionally used to help prevent premature greying and support naturally dark, lustrous hair.",
  },
  ojas: {
    steps: [
      "Take the powder — the amount depends on your hair length.",
      "The night before: soak it in an iron kadai overnight.",
      "Add water, tea decoction — as much as needed. You can also add curd if that suits you.",
      "For a brown tint, you can also add coffee. But it's always nice to add tea.",
      "20 minutes before applying: mix your favourite oil into the paste.",
      "Apply to your hair in sections.",
      "Leave for 45 minutes to one hour.",
      "Wash with your favourite shampoo.",
    ],
    note:
      "A blend of botanicals — slow-dried and hand-blended. Mix fresh each time. The ritual is yours to make.",
  },
  karu: {
    steps: [
      "Start from the ends of your hair — not the roots.",
      "Gently detangle in small sections.",
      "Work your way up to the roots.",
      "Use morning and night for best results.",
      "Clean weekly with a dry cloth. No water needed.",
    ],
    note:
      "Hand-carved from a single piece of neem wood. Anti-bacterial by nature, no plastic, no lacquer.",
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"description" | "usage">("description");
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const found = data.products.find((p: Product) => p.slug === slug);
          setProduct(found || null);
        }
      } catch (e) {
        console.error("Could not fetch product:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4ECD8] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-8 w-8 text-[#7A8450] mx-auto mb-3 animate-pulse" strokeWidth={1.4} />
          <p className="font-[family-name:var(--font-playfair)] text-lg text-[#2C2416]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F4ECD8] flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416] mb-3">
            Product not found
          </h1>
          <Button
            asChild
            className="bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
          >
            <Link href="/#shop">Back to shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const usage = usageGuides[product.slug] || usageGuides.mane;
  const price = (product.price / 100).toFixed(0);

  return (
    <div className="min-h-screen bg-[#F4ECD8]">
      {/* Back button */}
      <div className="sticky top-0 z-30 bg-[#1A3D2A] text-[#F4ECD8] shadow-lg">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[12px] tracking-[0.15em] uppercase text-[#F4ECD8]/80 hover:text-[#F4ECD8] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <a
            href="/#top"
            className="font-[family-name:var(--font-playfair)] text-xl tracking-[0.15em] uppercase"
          >
            Hair Lab.
          </a>
          <div className="w-16" />
        </div>
      </div>

      {/* Product Hero */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image */}
          <div className="relative">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${product.accentFrom}, ${product.accentTo})`,
              }}
            >
              <img
                src={product.image}
                alt={`${product.name} — ${product.subtitle}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/40 via-transparent to-transparent" />

              {product.tagline && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#F4ECD8]/90 text-[#2C2416] hover:bg-[#F4ECD8]/90 rounded-full px-3 text-[10px] tracking-[0.15em] uppercase backdrop-blur-sm">
                    {product.tagline}
                  </Badge>
                </div>
              )}

              <div className="absolute bottom-5 left-5 right-5 text-[#F4ECD8]">
                <p className="text-[10px] tracking-[0.25em] uppercase opacity-80">
                  {product.subtitle}
                </p>
                <h1 className="font-[family-name:var(--font-playfair)] text-4xl italic">
                  {product.name}
                </h1>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Price */}
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/50">
                {product.volume}
              </p>
              <p className="font-[family-name:var(--font-playfair)] text-4xl text-[#2C2416] mt-1">
                ₹{price}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-[#2C2416]/10">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-4 py-2 text-[11px] tracking-[0.15em] uppercase border-b-2 transition-colors ${
                  activeTab === "description"
                    ? "border-[#1A3D2A] text-[#1A3D2A]"
                    : "border-transparent text-[#2C2416]/50 hover:text-[#2C2416]"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("usage")}
                className={`px-4 py-2 text-[11px] tracking-[0.15em] uppercase border-b-2 transition-colors ${
                  activeTab === "usage"
                    ? "border-[#1A3D2A] text-[#1A3D2A]"
                    : "border-transparent text-[#2C2416]/50 hover:text-[#2C2416]"
                }`}
              >
                Usage Guide
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === "description" && (
                <div className="space-y-4">
                  <p className="font-[family-name:var(--font-playfair)] italic text-lg text-[#2C2416]/85 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === "usage" && (
                <div className="space-y-4">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-[#5C6B3A] mb-3">
                    How to use
                  </p>
                  <ol className="space-y-3">
                    {usage.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A3D2A] text-[#F4ECD8] flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span className="text-sm text-[#2C2416]/85 leading-relaxed pt-0.5">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 pt-4 border-t border-[#2C2416]/10 font-[family-name:var(--font-playfair)] italic text-sm text-[#2C2416]/70 leading-relaxed">
                    {usage.note}
                  </p>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="pt-4 border-t border-[#2C2416]/10">
              <Button
                onClick={() => {
                  addItem({
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    subtitle: product.subtitle,
                    price: product.price,
                    image: product.image,
                    accentFrom: product.accentFrom,
                    accentTo: product.accentTo,
                  });
                  toast.success(`${product.name} added to cart 🍃`);
                }}
                className="w-full bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full py-6 text-[12px] tracking-[0.2em] uppercase font-medium"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add to Cart · ₹{price}
              </Button>

              <div className="mt-4">
                <WhatsAppShare
                  text={`Hey! Check out ${product.name} from HAIR LAB. — ${product.subtitle}. ₹${price}.`}
                  label="Share on WhatsApp"
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>

            {/* Promise badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className="h-5 w-5 text-[#7A8450]" strokeWidth={1.4} />
                <span className="text-[9px] tracking-[0.15em] uppercase text-[#2C2416]/60">
                  Pan-India delivery
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <ShieldCheck className="h-5 w-5 text-[#7A8450]" strokeWidth={1.4} />
                <span className="text-[9px] tracking-[0.15em] uppercase text-[#2C2416]/60">
                  COD available
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RefreshCw className="h-5 w-5 text-[#7A8450]" strokeWidth={1.4} />
                <span className="text-[9px] tracking-[0.15em] uppercase text-[#2C2416]/60">
                  Easy returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
