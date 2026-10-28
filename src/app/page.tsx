import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Leaf,
  Sparkles,
  Droplets,
  Moon,
  Star,
  ArrowRight,
  ShoppingBag,
  Mail,
  Phone,
  Instagram,
  Truck,
  ShieldCheck,
  Heart,
  Plus,
} from "lucide-react";
import { CartDrawer } from "@/components/cart-drawer";
import { CartButton } from "@/components/cart-button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { AdminModal } from "@/components/admin-modal";
import { CopyrightTrigger } from "@/components/copyright-trigger";

const INSTAGRAM_URL = "https://www.instagram.com/yourhairourlab/";
const WHATSAPP_URL = "https://wa.me/919502194263";

const rituals = [
  {
    icon: Droplets,
    title: "Two minutes",
    body: "Massage into damp or dry scalp each night. Not more. Ritual lives in restraint.",
  },
  {
    icon: Moon,
    title: "Let it rest",
    body: "Sleep with the oil on. The actives work while you dream. Cover with a silk cap if you have one.",
  },
  {
    icon: Sparkles,
    title: "Morning rinse",
    body: "A mild cleanser, warm water, gentle hands. The hair emerges softer, scalier, alive.",
  },
  {
    icon: Leaf,
    title: "Repeat for 30",
    body: "Mark each night on your calendar. By night 30, the difference is no longer a question.",
  },
];

const ingredients = [
  { name: "Bhringraj", note: "The king of hair herbs" },
  { name: "Amla", note: "Vitamin C-rich, cold-pressed" },
  { name: "Brahmi", note: "Calms the scalp, soothes the mind" },
  { name: "Hibiscus", note: "Softens, conditions, revives" },
  { name: "Fenugreek", note: "Protein, shine, strength" },
  { name: "Black Seed", note: "Anti-inflammatory heritage" },
  { name: "Neem", note: "Purifying, antimicrobial" },
  { name: "Coconut", note: "Deep conditioning base" },
];

const testimonials = [
  {
    quote:
      "Three weeks in. My mother asked what I was doing differently. I told her: nothing — just the oil, every night.",
    name: "Ananya R.",
    place: "Bengaluru",
  },
  {
    quote:
      "I bought Mane for the bottle. I stayed for the way my hair feels in the morning.",
    name: "Meera K.",
    place: "Pune",
  },
  {
    quote:
      "The Neelam smells like my grandmother's house. That alone is worth it. The hair growth is a bonus.",
    name: "Priya S.",
    place: "Jaipur",
  },
];

export default async function Home() {
  const products = await db.product.findMany({
    orderBy: { price: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F4ECD8]">
      <CartDrawer />
      <AdminModal />

      {/* ANNOUNCEMENT BAR */}
      <div className="bg-[#2C2416] text-[#F4ECD8] text-center text-[11px] tracking-[0.25em] uppercase py-2.5 px-4">
        Handcrafted in small batches · Free delivery above ₹800 · Delivered in 5–10 days
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40 bg-[#F4ECD8]/85 backdrop-blur-md border-b border-[#2C2416]/10">
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-8 text-[12px] tracking-[0.2em] uppercase text-[#2C2416]/70">
            <a href="#ritual" className="hover:text-[#B8553C] transition-colors">
              The Ritual
            </a>
            <a href="#shop" className="hover:text-[#B8553C] transition-colors">
              Shop
            </a>
            <a href="#ingredients" className="hover:text-[#B8553C] transition-colors">
              Ingredients
            </a>
          </div>

          <a
            href="#top"
            className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl tracking-[0.15em] uppercase text-[#2C2416] mx-auto md:mx-0"
          >
            Hair Lab.
          </a>

          <div className="flex items-center gap-3">
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
              for modern hair.
            </h1>

            <p className="mt-8 text-[#2C2416]/75 text-base sm:text-lg leading-relaxed max-w-md font-[family-name:var(--font-inter)]">
              All-natural, cruelty-free hair care. Cold-pressed botanicals, slow
              infusions, hand-blended formulas. Each bottle made in small
              batches — never mass produced, never rushed.
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
                href="#ritual"
                className="text-[12px] tracking-[0.2em] uppercase text-[#2C2416] underline-offset-8 hover:underline hover:text-[#B8553C] transition-colors"
              >
                Discover the ritual
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
                src="/products/resham-packaging.png"
                alt="HAIR LAB. handcrafted hair oil"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/30 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div className="text-[#F4ECD8]">
                  <p className="text-[10px] tracking-[0.3em] uppercase opacity-80">
                    Made with intention
                  </p>
                  <p className="font-[family-name:var(--font-playfair)] text-2xl italic mt-1">
                    Hand-blended
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

      {/* MARQUEE */}
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
              <span>No silicones</span>
              <span className="text-[#7A8450]">✦</span>
              <span>Cruelty-free</span>
              <span className="text-[#7A8450]">✦</span>
              <span>Made with intention</span>
              <span className="text-[#7A8450]">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* BRAND STORY */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
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
                HAIR LAB. was born from a quiet frustration with the modern hair
                aisle — neon bottles, sixteen-syllable ingredients, promises
                shouted in capital letters. We wanted the opposite. We wanted
                the oil our grandmothers massaged into our scalps on Sunday
                evenings, made with the patience it deserves.
              </p>
              <p>
                Each batch is hand-blended in small quantities. We cold-press
                our bases, slow-infuse our herbs over days — not minutes — and
                bottle them in glass that you can return, refill, or keep.
              </p>
              <p className="font-[family-name:var(--font-playfair)] italic text-xl text-[#7A8450]">
                No shortcuts. No noise. Just the ritual, restored.
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
                src="/products/resham-packaging.png"
                alt="HAIR LAB. product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="bg-[#7A8450] text-[#F4ECD8] p-6 rounded-sm flex flex-col justify-between aspect-square">
                <span className="text-[11px] tracking-[0.25em] uppercase opacity-80">
                  Small batch
                </span>
                <div>
                  <p className="font-[family-name:var(--font-playfair)] text-5xl">
                    48
                  </p>
                  <p className="text-xs opacity-80 mt-1">bottles per blend</p>
                </div>
              </div>
              <div className="bg-[#2C2416] text-[#F4ECD8] p-6 rounded-sm flex flex-col justify-between aspect-square">
                <span className="text-[11px] tracking-[0.25em] uppercase opacity-80">
                  Slow infusion
                </span>
                <div>
                  <p className="font-[family-name:var(--font-playfair)] text-5xl">
                    72h
                  </p>
                  <p className="text-xs opacity-80 mt-1">minimum steep time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RITUAL */}
      <section
        id="ritual"
        className="bg-[#2C2416] text-[#F4ECD8] py-20 sm:py-28"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#7A8450]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#7A8450]">
                The Ritual
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl leading-tight">
              Four steps.
              <br />
              <span className="italic text-[#7A8450]">One promise.</span>
              <br />
              Hair that remembers.
            </h2>
            <p className="mt-6 text-[#F4ECD8]/70 leading-relaxed">
              A simple ritual, repeated. Massaged in for two minutes, left to
              work through the night, rinsed by morning light. By the thirtieth
              night, the difference is no longer a question.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rituals.map((r, i) => (
              <div
                key={r.title}
                className="bg-[#F4ECD8]/5 border border-[#F4ECD8]/10 p-6 rounded-sm hover:bg-[#F4ECD8]/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-[family-name:var(--font-playfair)] italic text-[#7A8450] text-2xl">
                    0{i + 1}
                  </span>
                  <r.icon
                    className="h-5 w-5 text-[#7A8450]"
                    strokeWidth={1.4}
                  />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-2">
                  {r.title}
                </h3>
                <p className="text-sm text-[#F4ECD8]/60 leading-relaxed">
                  {r.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button
              asChild
              className="bg-[#7A8450] hover:bg-[#5C6B3A] text-[#F4ECD8] rounded-full px-8 py-6 text-[12px] tracking-[0.2em] uppercase font-medium"
            >
              <a href="#shop">
                Begin Your Ritual
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
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
              Four rituals,
              <br />
              <span className="italic text-[#B8553C]">one promise.</span>
            </h2>
          </div>
          <p className="text-sm text-[#2C2416]/60 max-w-xs">
            Hand-blended in small batches. Shipped pan-India. Cash on delivery
            available.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((p) => {
            const ingredientsList = JSON.parse(p.ingredients) as string[];
            const isUpcoming =
              (p.tagline || "").toLowerCase().includes("coming soon") ||
              (p.tagline || "").toLowerCase().includes("upcoming");
            return (
              <Card
                key={p.id}
                className={`overflow-hidden border-0 bg-[#FBF6E9] rounded-sm shadow-sm hover:shadow-xl hover:shadow-[#2C2416]/10 transition-all duration-500 group flex flex-col ${
                  isUpcoming ? "opacity-90" : ""
                }`}
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
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                      isUpcoming ? "grayscale-[20%]" : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/40 via-transparent to-transparent" />

                  {p.tagline && (
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`rounded-full px-3 text-[10px] tracking-[0.15em] uppercase backdrop-blur-sm ${
                          isUpcoming
                            ? "bg-[#B8860B] text-[#2C2416] hover:bg-[#B8860B]"
                            : "bg-[#F4ECD8]/90 text-[#2C2416] hover:bg-[#F4ECD8]/90"
                        }`}
                      >
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

                  {isUpcoming ? (
                    <div className="mt-auto">
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/50">
                            {p.volume}
                          </p>
                          <p className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416]/60 mt-1 italic">
                            Price TBA
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-[#2C2416] hover:bg-[#B8860B] text-[#F4ECD8] rounded-full px-4 py-2 text-[11px] tracking-[0.15em] uppercase"
                      >
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Notify Me When Launched
                        </a>
                      </Button>
                    </div>
                  ) : (
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
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* INGREDIENTS */}
      <section
        id="ingredients"
        className="bg-[#FBF6E9] py-20 sm:py-28 border-y border-[#2C2416]/8"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#7A8450]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#5C6B3A]">
                The Pantry
              </span>
              <div className="h-px w-10 bg-[#7A8450]" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#2C2416] leading-tight">
              Every bottle begins
              <br />
              <span className="italic text-[#7A8450]">in the soil.</span>
            </h2>
            <p className="mt-6 text-[#2C2416]/70 leading-relaxed">
              No synthesized actives. No lab-born silicones. Just herbs grown by
              farmers we know, cold-pressed in batches we can count on one hand.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#2C2416]/10 rounded-sm overflow-hidden">
            {ingredients.map((ing) => (
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
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
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

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="bg-[#FBF6E9] border-0 rounded-sm p-8 flex flex-col"
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
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl tracking-[0.15em] uppercase">
                Hair Lab.
              </h3>
              <p className="mt-4 text-sm text-[#F4ECD8]/60 leading-relaxed max-w-xs">
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
                House
              </h4>
              <ul className="space-y-3 text-sm text-[#F4ECD8]/70">
                <li>
                  <a href="#ritual" className="hover:text-[#F4ECD8] transition-colors">
                    The Ritual
                  </a>
                </li>
                <li>
                  <a href="#ingredients" className="hover:text-[#F4ECD8] transition-colors">
                    Ingredients
                  </a>
                </li>
                <li>
                  <a href="#top" className="hover:text-[#F4ECD8] transition-colors">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#F4ECD8] transition-colors">
                    WhatsApp Us
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
                    href="mailto:hello@hairlab.one"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    hello@hairlab.one
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
