import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

const INSTAGRAM_URL = "https://www.instagram.com/yourhairourlab/";
const WHATSAPP_URL = "https://wa.me/919502194263";
const SUBSTACK_URL = "https://yourhairourlab.substack.com/?utm_campaign=profile_chips";
const EMAIL = "hairlabhyd@gmail.com";

const ourPromise = [
  {
    icon: Sparkles,
    title: "Assured Quality",
    body: "Every batch tested by hand. No fillers, no shortcuts — just botanicals, slow-infused.",
  },
  {
    icon: Truck,
    title: "Fast & Free Delivery",
    body: "Free delivery on orders above ₹800. Pan-India in 5–10 days. COD available.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    body: "256-bit encrypted checkout via Razorpay. UPI, cards, net banking, COD.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    body: "Not happy? Tell us within 7 days. We'll make it right.",
  },
];

const favHerbs = [
  { name: "Aparajita", note: "Butterfly pea — for natural shine" },
  { name: "Bhringraj", note: "The king of hair herbs" },
  { name: "Amla", note: "Vitamin C-rich, cold-pressed" },
  { name: "Brahmi", note: "Calms the scalp, soothes the mind" },
  { name: "Hibiscus", note: "Softens, conditions, revives" },
  { name: "Fenugreek", note: "Protein, shine, strength" },
  { name: "Black Seed Oil", note: "Anti-inflammatory heritage" },
  { name: "Sesame", note: "The Ayurvedic base, slow-infused" },
  { name: "Pumpkin Seed Oil", note: "Rich in zinc, for scalp health" },
  { name: "Curry Leaf", note: "South Indian heritage staple" },
];

const testimonials = [
  {
    quote:
      "Three weeks with Neelam. My grandmother asked what I was doing differently. I told her: just the oil, every night — like she taught me.",
    name: "Neelam R.",
    place: "Hyderabad, Telangana",
  },
  {
    quote:
      "The Mane oil has become my Sunday ritual. Two minutes, scalp to ends. My hair feels softer on Monday morning than it has in years.",
    name: "Dhanu K.",
    place: "Hyderabad, Telangana",
  },
  {
    quote:
      "The Kāru comb is the most underrated product on the site. I use it morning and night — neem wood feels different on the scalp. No static, no snags.",
    name: "Mukta S.",
    place: "Hyderabad, Telangana",
  },
  {
    quote:
      "Ojas powder mask felt dry and chalky the first time. Then Sruwa told me to mix a few drops of Mane oil into the paste before applying. Game-changer. Soft, conditioned hair after one use.",
    name: "Lakshmi P.",
    place: "Hyderabad, Telangana",
  },
];

export default function Home() {
  const products = [...allProducts].sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4ECD8]">
      <CartDrawer />
      <AdminModal />

      {/* ANNOUNCEMENT BAR — scrolling tagline */}
      <div className="bg-[#2C2416] text-[#F4ECD8] py-2.5 overflow-hidden border-b border-[#7A8450]/30">
        <div className="flex items-center gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap text-[11px] tracking-[0.3em] uppercase">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              <span>Ancient Luxury, Handcrafted</span>
              <span className="text-[#7A8450]">✦</span>
              <span>For Modern Age</span>
              <span className="text-[#7A8450]">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* NAV — Hamburger left, Logo center, Cart right */}
      <header className="sticky top-0 z-40 bg-[#F4ECD8]/85 backdrop-blur-md border-b border-[#2C2416]/10">
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between relative">
          {/* LEFT: Hamburger on mobile, nav links on desktop */}
          <div className="flex items-center gap-6 flex-1">
            <MobileMenu />
            <div className="hidden md:flex items-center gap-8 text-[12px] tracking-[0.2em] uppercase text-[#2C2416]/70">
              <a href="#shop" className="hover:text-[#B8553C] transition-colors">
                Shop
              </a>
              <a href="#story" className="hover:text-[#B8553C] transition-colors">
                Our Story
              </a>
              <a href="#herbs" className="hover:text-[#B8553C] transition-colors">
                Herbs
              </a>
            </div>
          </div>

          {/* CENTER: Hair Lab. logo — green badge with woman icon + HAIR LAB. text */}
          <a
            href="#top"
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center h-10 sm:h-12"
            aria-label="HAIR LAB. home"
          >
            { }
            <img
              src="/hairlab-logo-green.png"
              alt="HAIR LAB. logo"
              className="h-full w-auto object-contain"
            />
          </a>

          {/* RIGHT: Instagram + Cart */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-[#2C2416]/70 hover:text-[#B8553C] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <CartButton />
          </div>
        </nav>
      </header>

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
              All-natural, cruelty-free hair care rooted in Indian ritual.
              Cold-pressed botanicals, slow infusions, hand-blended formulas —
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
                { icon: Leaf, label: "Botanical" },
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
                  Small batch
                </Badge>
              </div>
            </div>

            <div className="hidden sm:block absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#7A8450] text-[#F4ECD8] flex items-center justify-center text-center font-[family-name:var(--font-playfair)] italic text-xs leading-tight p-3 rotate-12 shadow-xl">
              All
              <br />
              natural
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE — brand values */}
      <div className="bg-[#2C2416] text-[#F4ECD8] py-4 overflow-hidden border-y border-[#7A8450]/30">
        <div className="flex items-center gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap text-[11px] tracking-[0.3em] uppercase">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12">
              <span>Cold pressed</span>
              <span className="text-[#7A8450]">✦</span>
              <span>Hand blended</span>
              <span className="text-[#7A8450]">✦</span>
              <span>Small batch</span>
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
                The House of HAIR LAB.
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#2C2416] leading-tight">
              Hair has a memory.
              <br />
              We&apos;d rather it remember
              <span className="italic text-[#B8553C]"> care.</span>
            </h2>
            <div className="mt-8 space-y-5 text-[#2C2416]/75 leading-relaxed font-[family-name:var(--font-inter)]">
              <p>
                HAIR LAB. began as a love letter to the rituals our
                grandmothers knew by heart — the Sunday evening scalp massage,
                the slow infusion of bhringraj in sesame, the patience of
                waiting for herbs to give themselves to the oil. We wanted to
                honor that wisdom, not replace it.
              </p>
              <p>
                Each batch is hand-blended in small quantities. We cold-press
                our bases, slow-infuse our herbs over days, and bottle them
                with intention — a quiet inheritance passed forward, one
                ritual at a time.
              </p>
              <p className="font-[family-name:var(--font-playfair)] italic text-xl text-[#7A8450]">
                Heritage, hand-blended. Ritual, restored.
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
            Made in small batches. Shipped pan-India. Cash on delivery available.
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
            Sourced from farms across South India — slow-infused in cold-pressed
            bases, the way it has always been done.
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
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-[#B8860B] text-[#B8860B]"
                    />
                  ))}
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
                Ancient luxury, handcrafted. All-natural, cruelty-free hair care
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
