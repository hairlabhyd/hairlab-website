import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WhatsAppShare } from "@/components/whatsapp-share";
import {
  Leaf,
  Star,
  ArrowRight,
  ShoppingBag,
  Mail,
  Phone,
  Truck,
  ShieldCheck,
  Heart,
  RefreshCw,
  Sparkles,
  Instagram,
} from "lucide-react";
import { products as allProducts } from "@/lib/products";
import { CartDrawer } from "@/components/cart-drawer";
import { CartButton } from "@/components/cart-button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { AdminModal } from "@/components/admin-modal";
import { CopyrightTrigger } from "@/components/copyright-trigger";
import { MobileMenu } from "@/components/mobile-menu";
import { RitualQuiz } from "@/components/ritual-quiz";
import { DidYouKnowPopup } from "@/components/did-you-know-popup";

const INSTAGRAM_URL = "https://www.instagram.com/yourhairourlab/";
const WHATSAPP_URL = "https://wa.me/919502194263";
const SUBSTACK_URL = "https://yourhairourlab.substack.com/?utm_campaign=profile_chips";
const EMAIL = "hairlabhyd@gmail.com";

const ourPromise = [
  {
    icon: Sparkles,
    title: "Every batch, in our own hands first",
    body: "Tested and then delivered to you. What we wouldn't use ourselves, we wouldn't ship.",
  },
  {
    icon: Truck,
    title: "Pan-India. Even to the smallest town.",
    body: "Free delivery above ₹799. Lands at your door in 5–10 days. COD available.",
  },
  {
    icon: ShieldCheck,
    title: "Razorpay-secured",
    body: "256-bit encrypted checkout. UPI, cards, net banking, COD. Your money, safe.",
  },
  {
    icon: RefreshCw,
    title: "Hated it? Tell us.",
    body: "We'll make it right. Promise. No 7-day windows, no fine print. Just write to us.",
  },
];

const favHerbs = [
  { name: "Aparajita", note: "Butterfly pea — for shine" },
  { name: "Bhringraj", note: "The king of hair herbs" },
  { name: "Amla", note: "Vitamin C-rich, hand-extracted" },
  { name: "Brahmi", note: "Calms the scalp, soothes the mind" },
  { name: "Hibiscus", note: "Softens, conditions, revives" },
  { name: "Fenugreek", note: "Protein, shine, strength" },
  { name: "Black Seed Oil", note: "Anti-inflammatory heritage" },
  { name: "Sesame", note: "The heritage base, slow-infused" },
  { name: "Pumpkin Seed Oil", note: "Rich in zinc, for scalp health" },
  { name: "Curry Leaf", note: "South Indian heritage staple" },
];

const testimonials = [
  {
    quote:
      "Neelam smells so good. 4.5/5.",
    name: "Jahnvi",
    place: "Hyderabad, Telangana",
    rating: 4.5,
  },
  {
    quote:
      "The Mane oil has become my Sunday ritual. Two minutes, scalp to ends. My hair feels softer on Monday morning than it has in years.",
    name: "Dhanu K.",
    place: "Hyderabad, Telangana",
    rating: 5,
  },
  {
    quote:
      "The Kāru comb is the most underrated product on the site. I use it morning and night — neem wood feels different on the scalp. No static, no snags.",
    name: "Mukta K.",
    place: "Hyderabad, Telangana",
    rating: 5,
  },
  {
    quote:
      "Ojas is the best. I mixed it with Mane oil and tea decoction. I also mixed curd once. That's it.",
    name: "Lakshmi P.",
    place: "Hyderabad, Telangana",
    rating: 5,
  },
];

export default function Home() {
  const products = [...allProducts].sort((a, b) => b.price - a.price);

  // Product structured data for SEO (JSON-LD)
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${p.name} — ${p.subtitle}`,
        description: p.description,
        brand: {
          "@type": "Brand",
          name: "HAIR LAB.",
        },
        offers: {
          "@type": "Offer",
          price: (p.price / 100).toFixed(0),
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: "https://hairlab.one#shop",
        },
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4ECD8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <CartDrawer />
      <AdminModal />
      <DidYouKnowPopup />

      {/* GREEN WALL — announcement bar + nav as one continuous dark green wall */}
      <div className="sticky top-0 z-40 bg-[#1A3D2A] text-[#F4ECD8] shadow-lg shadow-[#1A3D2A]/20">
        {/* Scrolling tagline */}
        <div className="py-2.5 overflow-hidden border-b border-[#F4ECD8]/10">
          <div className="flex items-center gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap text-[11px] tracking-[0.3em] uppercase">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-8">
                <span>Ancient Luxury, Handcrafted</span>
                <span className="text-[#B8860B]">✦</span>
                <span>For Modern Age</span>
                <span className="text-[#B8860B]">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav — logo on LEFT, 'HAIR LAB.' white text CENTER, cart on RIGHT */}
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between relative">
          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <MobileMenu />
            <a
              href="#top"
              className="flex items-center justify-center h-10 sm:h-12"
              aria-label="HAIR LAB. home"
            >
              { }
              <img
                src="/hairlab-logo-green.png"
                alt="HAIR LAB. logo"
                className="h-full w-auto object-contain"
              />
            </a>
          </div>

          {/* CENTER: 'HAIR LAB.' in white text (visible on the green wall) */}
          <a
            href="#top"
            className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl tracking-[0.2em] uppercase text-[#F4ECD8] hover:text-white transition-colors"
          >
            Hair Lab.
          </a>

          {/* RIGHT: Desktop nav links + Instagram + Cart */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-[12px] tracking-[0.2em] uppercase text-[#F4ECD8]/75">
              <a href="#shop" className="hover:text-[#F4ECD8] transition-colors">
                Shop
              </a>
              <a href="#story" className="hover:text-[#F4ECD8] transition-colors">
                Our Story
              </a>
              <a href="#herbs" className="hover:text-[#F4ECD8] transition-colors">
                Herbs
              </a>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-[#F4ECD8]/75 hover:text-[#F4ECD8] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <CartButton />
          </div>
        </nav>
      </div>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #7A8450 0, transparent 40%), radial-gradient(circle at 80% 70%, #B8553C 0, transparent 50%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#7A8450]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#5C6B3A] font-medium">
                By Sruwa Kesiraju · Hyderabad
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-[44px] leading-[1.05] sm:text-6xl lg:text-7xl text-[#2C2416] tracking-tight">
              Ancient luxury,
              <br />
              <span className="italic text-[#B8553C]">handcrafted</span>
              <br />
              for modern age.
            </h1>

            <p className="mt-8 text-[#2C2416]/75 text-base sm:text-lg leading-relaxed max-w-md font-[family-name:var(--font-inter)]">
              Plant-derived, cruelty-free hair care rooted in Indian ritual.
              Botanical oils, slow infusions, hand-blended formulas —
              made in small batches, with intention.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full px-8 py-6 text-[12px] tracking-[0.2em] uppercase font-medium"
              >
                <a href="#shop">
                  Shop the Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <a
                href="#story"
                className="text-[12px] tracking-[0.2em] uppercase text-[#2C2416] underline-offset-8 hover:underline hover:text-[#B8553C] transition-colors"
              >
                Our Story
              </a>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
              {[
                { icon: Leaf, label: "Plant-derived" },
                { icon: ShieldCheck, label: "Cruelty-free" },
                { icon: Truck, label: "Pan-India" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-start gap-2">
                  <t.icon className="h-5 w-5 text-[#7A8450]" strokeWidth={1.4} />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/60">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <div className="relative aspect-[4/5] sm:aspect-[5/6] overflow-hidden rounded-sm bg-[#E8DDC3] shadow-2xl shadow-[#2C2416]/20">
              { }
              <img
                src="/products/mane.jpg"
                alt="HAIR LAB. handcrafted hair oil"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/30 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div className="text-[#F4ECD8]">
                  <p className="text-[10px] tracking-[0.3em] uppercase opacity-80">
                    Ancient luxury, handcrafted
                  </p>
                  <p className="font-[family-name:var(--font-playfair)] text-2xl italic mt-1">
                    For modern age
                  </p>
                </div>
                <Badge className="bg-[#F4ECD8] text-[#2C2416] hover:bg-[#F4ECD8] rounded-full px-3 text-[10px] tracking-[0.15em] uppercase">
                  Made with intention
                </Badge>
              </div>
            </div>

            <div className="hidden sm:block absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#7A8450] text-[#F4ECD8] flex items-center justify-center text-center font-[family-name:var(--font-playfair)] italic text-xs leading-tight p-3 rotate-12 shadow-xl">
              Plant
              <br />
              derived
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE — brand values */}
      <div className="bg-[#2C2416] text-[#F4ECD8] py-4 overflow-hidden border-y border-[#7A8450]/30">
        <div className="flex items-center gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap text-[11px] tracking-[0.3em] uppercase">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12">
              <span>Hand-blended</span>
              <span className="text-[#7A8450]">✦</span>
              <span>Botanical</span>
              <span className="text-[#7A8450]">✦</span>
              <span>Cruelty-free</span>
              <span className="text-[#7A8450]">✦</span>
              <span>Heritage formula</span>
              <span className="text-[#7A8450]">✦</span>
              <span>Made with intention</span>
              <span className="text-[#7A8450]">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* BRAND STORY */}
      <section id="story" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#7A8450]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#5C6B3A]">
                Founder&apos;s Message
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#2C2416] leading-tight">
              Founder&apos;s
              <br />
              <span className="italic text-[#B8553C]">Message.</span>
            </h2>
            <div className="mt-8 space-y-5 text-[#2C2416]/75 leading-relaxed font-[family-name:var(--font-inter)]">
              <p>
                At HAIR LAB., we believe good haircare begins with understanding
                your hair, not following trends.
              </p>
              <p>
                Understanding your hair porosity, its needs, and how it responds
                to different ingredients can help you make more informed choices
                for your hair.
              </p>
              <p>
                Natural doesn&apos;t automatically mean better, just as synthetic
                doesn&apos;t automatically mean harmful. What matters is the
                ingredient, how it&apos;s formulated, and the purpose it serves.
              </p>
              <p>
                Our approach brings together traditional botanical knowledge and
                modern scientific understanding to create products that are
                thoughtfully developed and designed for real-life needs.
              </p>
              <p>
                Because we believe personal care should be as individual as you are.
              </p>
              <p className="font-[family-name:var(--font-playfair)] italic text-xl text-[#7A8450]">
                HAIR LAB. · Made with intention.
              </p>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#5C6B3A] mt-4">
                Botanical · Intentional · Rooted in ritual
              </p>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-10 w-10 rounded-full bg-[#7A8450] text-[#F4ECD8] flex items-center justify-center font-[family-name:var(--font-playfair)] italic text-sm">
                  S
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2C2416]">
                    Sruwa Kesiraju
                  </p>
                  <p className="text-xs text-[#2C2416]/60">
                    Founder · HAIR LAB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-sm overflow-hidden bg-[#E8DDC3]">
              { }
              <img
                src="/products/neelam.jpg"
                alt="HAIR LAB. product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="aspect-[3/4] rounded-sm overflow-hidden bg-[#E8DDC3]">
                { }
                <img
                  src="/products/ojas.jpg"
                  alt="HAIR LAB. product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] rounded-sm overflow-hidden bg-[#E8DDC3]">
                { }
                <img
                  src="/products/karu.jpg"
                  alt="HAIR LAB. product"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RITUAL QUIZ — viral interactive feature */}
      <section className="bg-[#FBF6E9] py-20 sm:py-28 border-y border-[#2C2416]/8">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <RitualQuiz />
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="shop" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#7A8450]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#5C6B3A]">
                The Collection
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#2C2416] leading-tight">
              Hand-blended rituals,
              <br />
              <span className="italic text-[#B8553C]">rooted in tradition.</span>
            </h2>
          </div>
          <p className="text-sm text-[#2C2416]/60 max-w-xs">
            Shipped pan-India. Cash on delivery available.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((p) => {
            const ingredientsList = p.ingredients;
            return (
              <Card
                key={p.id}
                className="overflow-hidden border-0 bg-[#FBF6E9] rounded-sm shadow-sm hover:shadow-xl hover:shadow-[#2C2416]/10 transition-all duration-500 group flex flex-col"
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${p.accentFrom}, ${p.accentTo})`,
                  }}
                >
                  { }
                  <img
                    src={p.image}
                    alt={`${p.name} — ${p.subtitle}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/40 via-transparent to-transparent" />

                  {p.tagline && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#F4ECD8]/90 text-[#2C2416] hover:bg-[#F4ECD8]/90 rounded-full px-3 text-[10px] tracking-[0.15em] uppercase backdrop-blur-sm">
                        {p.tagline}
                      </Badge>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 text-[#F4ECD8]">
                    <p className="text-[10px] tracking-[0.25em] uppercase opacity-80">
                      {p.subtitle}
                    </p>
                    <h3 className="font-[family-name:var(--font-playfair)] text-3xl italic">
                      {p.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-sm text-[#2C2416]/70 leading-relaxed mb-4 min-h-[60px]">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {ingredientsList.slice(0, 4).map((ing) => (
                      <span
                        key={ing}
                        className="text-[10px] tracking-[0.1em] uppercase px-2 py-1 rounded-full bg-[#7A8450]/10 text-[#5C6B3A] border border-[#7A8450]/20"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>

                  <Separator className="bg-[#2C2416]/10 mb-5" />

                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/50">
                        {p.volume}
                      </p>
                      <p className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416] mt-1">
                        ₹{(p.price / 100).toFixed(0)}
                      </p>
                    </div>
                    <AddToCartButton product={p} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* OUR PROMISE */}
      <section id="promise" className="bg-[#FBF6E9] py-20 sm:py-28 border-y border-[#2C2416]/8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#7A8450]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#5C6B3A]">
                Our Promise To You
              </span>
              <div className="h-px w-10 bg-[#7A8450]" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#2C2416] leading-tight">
              Made with intention,
              <br />
              <span className="italic text-[#B8553C]">delivered with care.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ourPromise.map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-sm border border-[#2C2416]/8 hover:border-[#7A8450]/30 transition-colors"
              >
                <item.icon
                  className="h-7 w-7 text-[#7A8450] mb-4"
                  strokeWidth={1.4}
                />
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#2C2416] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#2C2416]/70 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR FAV HERBS */}
      <section id="herbs" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-[#7A8450]" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#5C6B3A]">
              The Pantry
            </span>
            <div className="h-px w-10 bg-[#7A8450]" />
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#2C2416] leading-tight">
            Our favourite herbs.
          </h2>
          <p className="mt-6 text-[#2C2416]/70 leading-relaxed">
            Sourced from farms across South India — slow-infused in
            botanical oils, the way it has always been done.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#2C2416]/10 rounded-sm overflow-hidden">
          {favHerbs.map((ing) => (
            <div
              key={ing.name}
              className="bg-[#FBF6E9] p-6 sm:p-8 hover:bg-[#F4ECD8] transition-colors text-center"
            >
              <Leaf
                className="h-6 w-6 text-[#7A8450] mx-auto mb-3"
                strokeWidth={1.4}
              />
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#2C2416]">
                {ing.name}
              </h3>
              <p className="text-[11px] text-[#2C2416]/60 mt-1 italic">
                {ing.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER'S VOICE — handwritten-style notes from Sruwa */}
      <section className="bg-[#1A3D2A] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#B8860B]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#B8860B]">
                Notes from the Lab
              </span>
              <div className="h-px w-10 bg-[#B8860B]" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#F4ECD8] leading-tight">
              From the lab,
              <br />
              <span className="italic text-[#B8860B]">to you.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-[#F4ECD8] p-6 rounded-sm shadow-lg shadow-black/20 -rotate-1 hover:rotate-0 transition-transform duration-500">
              <p className="font-[family-name:var(--font-playfair)] italic text-base text-[#2C2416]/85 leading-relaxed">
                &ldquo;Every active in HAIR LAB. comes from a plant. Seed oils,
                sugarcane-derived ingredients, flowers and roots today. The
                source never changes.&rdquo;
              </p>
              <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-[#5C6B3A]">
                — On the source
              </p>
            </div>

            <div className="bg-[#F4ECD8] p-6 rounded-sm shadow-lg shadow-black/20 rotate-1 hover:rotate-0 transition-transform duration-500">
              <p className="font-[family-name:var(--font-playfair)] italic text-base text-[#2C2416]/85 leading-relaxed">
                &ldquo;Ritual isn&apos;t about doing more. It&apos;s about doing
                it often. Detangle. Warm a few drops between your palms. Press
                into your scalp. Sleep. Repeat. That&apos;s the whole
                practice.&rdquo;
              </p>
              <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-[#5C6B3A]">
                — On ritual
              </p>
            </div>

            <div className="bg-[#F4ECD8] p-6 rounded-sm shadow-lg shadow-black/20 -rotate-1 hover:rotate-0 transition-transform duration-500">
              <p className="font-[family-name:var(--font-playfair)] italic text-base text-[#2C2416]/85 leading-relaxed">
                &ldquo;Hair porosity matters more than hair type. It tells you
                how your hair takes in moisture — and how long it holds. Know
                yours, and most of your hair questions answer themselves.&rdquo;
              </p>
              <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-[#5C6B3A]">
                — On porosity
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="font-[family-name:var(--font-playfair)] italic text-lg text-[#F4ECD8]/80 max-w-md mx-auto leading-relaxed">
              Hand-blended in Hyderabad. By one founder. For one ritual at a time.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#B8860B] text-[#2C2416] flex items-center justify-center font-[family-name:var(--font-playfair)] italic text-sm">
                S
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-[#F4ECD8]">Sruwa Kesiraju</p>
                <p className="text-[11px] text-[#F4ECD8]/60">Founder · HAIR LAB.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="bg-[#FBF6E9] py-20 sm:py-28 border-y border-[#2C2416]/8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#7A8450]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#5C6B3A]">
                Their Words
              </span>
              <div className="h-px w-10 bg-[#7A8450]" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#2C2416] leading-tight">
              The letters we keep.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="bg-white border-0 rounded-sm p-8 flex flex-col"
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isHalf = t.rating >= star - 0.5 && t.rating < star;
                    const isFull = t.rating >= star;
                    return (
                      <div key={star} className="relative">
                        <Star className="h-3.5 w-3.5 text-[#B8860B]/30" />
                        {(isFull || isHalf) && (
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: isHalf ? "50%" : "100%" }}
                          >
                            <Star className="h-3.5 w-3.5 fill-[#B8860B] text-[#B8860B]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="font-[family-name:var(--font-playfair)] italic text-lg text-[#2C2416]/85 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 pt-5 border-t border-[#2C2416]/10">
                  <p className="font-medium text-[#2C2416] text-sm">{t.name}</p>
                  <p className="text-[11px] text-[#2C2416]/50 tracking-wide uppercase mt-0.5">
                    {t.place}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-[#7A8450] text-[#F4ECD8] py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <Heart
            className="h-8 w-8 mx-auto mb-6 text-[#F4ECD8]"
            strokeWidth={1.4}
          />
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl leading-tight">
            Begin your ritual tonight.
          </h2>
          <p className="mt-5 text-[#F4ECD8]/85 max-w-md mx-auto leading-relaxed">
            Every bottle made to order, shipped pan-India. Cash on delivery
            available. Your hair has waited long enough.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="bg-[#2C2416] hover:bg-[#2C2416]/85 text-[#F4ECD8] rounded-full px-8 py-6 text-[12px] tracking-[0.2em] uppercase font-medium"
            >
              <a href="#shop">
                Shop the Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <a
              href="tel:+919502194263"
              className="text-[12px] tracking-[0.2em] uppercase underline-offset-8 hover:underline inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              +91 95021 94263
            </a>
          </div>

          {/* WhatsApp Share */}
          <div className="mt-8 pt-8 border-t border-[#F4ECD8]/10">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#F4ECD8]/60 mb-3">
              Know someone who'd love HAIR LAB.?
            </p>
            <div className="flex justify-center">
              <WhatsAppShare
                text="Hey! Found this hand-blended hair oil brand — HAIR LAB. Ancient luxury, handcrafted. Check it out:"
                label="Share on WhatsApp"
                variant="outline"
                size="sm"
                className="border-[#F4ECD8]/30 text-[#F4ECD8] hover:bg-[#F4ECD8]/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2C2416] text-[#F4ECD8] mt-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              { }
              <img
                src="/hairlab-logo-green.png"
                alt="HAIR LAB."
                className="h-12 sm:h-14 w-auto object-contain mb-4"
              />
              <p className="text-sm text-[#F4ECD8]/60 leading-relaxed max-w-xs">
                Ancient luxury, handcrafted. Plant-derived, cruelty-free hair care
                made in small batches, with intention.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#7A8450] hover:text-[#F4ECD8] transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" />
                @yourhairourlab
              </a>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#7A8450] mb-5">
                Shop
              </h4>
              <ul className="space-y-3 text-sm text-[#F4ECD8]/70">
                {products.map((p) => (
                  <li key={p.id}>
                    <a
                      href="#shop"
                      className="hover:text-[#F4ECD8] transition-colors"
                    >
                      {p.name} — ₹{(p.price / 100).toFixed(0)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#7A8450] mb-5">
                Explore
              </h4>
              <ul className="space-y-3 text-sm text-[#F4ECD8]/70">
                <li>
                  <a href="#story" className="hover:text-[#F4ECD8] transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#promise" className="hover:text-[#F4ECD8] transition-colors">
                    Our Promise
                  </a>
                </li>
                <li>
                  <a href="#herbs" className="hover:text-[#F4ECD8] transition-colors">
                    Our Fav Herbs
                  </a>
                </li>
                <li>
                  <a
                    href={SUBSTACK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    Read Our Substack
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#7A8450] mb-5">
                Reach Us
              </h4>
              <ul className="space-y-3 text-sm text-[#F4ECD8]/70">
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <a
                    href="tel:+919502194263"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    +91 95021 94263
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <a
                    href={`mailto:${EMAIL}`}
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    {EMAIL}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Instagram className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    @yourhairourlab
                  </a>
                </li>
                <li className="text-xs text-[#F4ECD8]/50 leading-relaxed pt-2">
                  Hyderabad, Telangana 500029
                  <br />
                  India
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-[#F4ECD8]/10 my-10" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] tracking-[0.2em] uppercase text-[#F4ECD8]/40">
            <CopyrightTrigger>
              <span>© {new Date().getFullYear()} HAIR LAB. · All rights reserved</span>
            </CopyrightTrigger>
            <div className="flex items-center gap-4">
              <span>UPI · Cards · COD</span>
              <span className="text-[#7A8450]">✦</span>
              <span>Made with intention in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
