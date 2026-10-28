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
  Instagram,
  Mail,
  Phone,
  Truck,
  ShieldCheck,
  Heart,
} from "lucide-react";

const SHOP_URL = "https://www.hairlab.one";

const products = [
  {
    name: "Resham",
    subtitle: "Everyday Night Oil",
    price: "₹389",
    volume: "30 ml",
    description:
      "A silken nightly ritual of argan, grapeseed, and fenugreek — massaged in for two minutes, washed out by morning light.",
    ingredients: ["Argan", "Grapeseed", "Castor", "Almond", "Rosemary", "Jojoba"],
    accent: "from-[#B8553C] to-[#8C3A24]",
    image: "/products/resham-packaging.png",
    tag: "Made with intention",
    nights: 30,
  },
  {
    name: "Mane",
    subtitle: "Daily Hair Oil",
    price: "₹289",
    volume: "100 ml",
    description:
      "A featherweight daily oil for softness without weight. Hibiscus and black seed woven through cold-pressed base.",
    ingredients: ["Hibiscus", "Black Seed", "Fenugreek", "Coconut"],
    accent: "from-[#7A8450] to-[#5C6B3A]",
    image: "/products/resham-packaging.png",
    tag: "Bestseller",
    nights: null,
  },
  {
    name: "Blue Bhring",
    subtitle: "Bhringraj Ritual Oil",
    price: "₹219",
    volume: "100 ml",
    description:
      "The deep indigo of true bhringraj. For scalp health, strength, and the kind of hair that remembers it has roots.",
    ingredients: ["Bhringraj", "Amla", "Brahmi", "Sesame"],
    accent: "from-[#3A4D5C] to-[#1F2E3A]",
    image: "/products/resham-packaging.png",
    tag: "Traditional",
    nights: null,
  },
];

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
  { name: "Argan", note: "Silken, daily luxury" },
  { name: "Jojoba", note: "Mirrors the scalp's own oil" },
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
      "I bought Resham for the bottle. I stayed for the way my hair feels in the morning.",
    name: "Meera K.",
    place: "Pune",
  },
  {
    quote:
      "The Blue Bhring smells like my grandmother's house. That alone is worth it. The hair growth is a bonus.",
    name: "Priya S.",
    place: "Jaipur",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4ECD8]">
      {/* ANNOUNCEMENT BAR */}
      <div className="bg-[#2C2416] text-[#F4ECD8] text-center text-[11px] tracking-[0.25em] uppercase py-2.5 px-4">
        Handcrafted in small batches · Free shipping above ₹599 · Cash on delivery available
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
            href={SHOP_URL}
            className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl tracking-[0.15em] uppercase text-[#2C2416] mx-auto md:mx-0"
          >
            Hairlab
          </a>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2C2416]/70 hover:text-[#B8553C] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <Button
              asChild
              size="sm"
              className="bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full px-5 text-[12px] tracking-[0.15em] uppercase"
            >
              <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                Shop Now
              </a>
            </Button>
          </div>

          {/* Mobile shop button */}
          <Button
            asChild
            size="sm"
            className="md:hidden bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full px-4 text-[11px] tracking-[0.15em] uppercase"
          >
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
              Shop
            </a>
          </Button>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #B8860B 0, transparent 40%), radial-gradient(circle at 80% 70%, #B8553C 0, transparent 50%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-32 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Copy */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#B8553C]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#B8553C] font-medium">
                Est. in slow rituals
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
              Cold-pressed botanicals, slow infusions, hand-blended formulas. Each
              bottle made in small batches — never mass produced, never rushed.
              Because your hair has a memory, and we&apos;d rather it remember
              care.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full px-8 py-6 text-[12px] tracking-[0.2em] uppercase font-medium"
              >
                <a href={`${SHOP_URL}`} target="_blank" rel="noopener noreferrer">
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

            {/* Trust badges */}
            <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
              {[
                { icon: Leaf, label: "Botanical" },
                { icon: ShieldCheck, label: "No nasties" },
                { icon: Truck, label: "Pan-India" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-start gap-2">
                  <t.icon className="h-5 w-5 text-[#B8553C]" strokeWidth={1.4} />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/60">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <div className="relative aspect-[4/5] sm:aspect-[5/6] overflow-hidden rounded-sm bg-[#E8DDC3] shadow-2xl shadow-[#2C2416]/20">
              {/* Use the user's packaging image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/products/resham-packaging.png"
                alt="Resham — Handcrafted Hair Oil from Hairlab"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/30 via-transparent to-transparent" />

              {/* Floating tag */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div className="text-[#F4ECD8]">
                  <p className="text-[10px] tracking-[0.3em] uppercase opacity-80">
                    Made with intention
                  </p>
                  <p className="font-[family-name:var(--font-playfair)] text-2xl italic mt-1">
                    Resham
                  </p>
                </div>
                <Badge className="bg-[#F4ECD8] text-[#2C2416] hover:bg-[#F4ECD8] rounded-full px-3 text-[10px] tracking-[0.15em] uppercase">
                  30 night ritual
                </Badge>
              </div>
            </div>

            {/* Decorative seal */}
            <div className="hidden sm:block absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#B8553C] text-[#F4ECD8] flex items-center justify-center text-center font-[family-name:var(--font-playfair)] italic text-xs leading-tight p-3 rotate-12 shadow-xl">
              Hand
              <br />
              blended
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="bg-[#2C2416] text-[#F4ECD8] py-4 overflow-hidden border-y border-[#B8860B]/20">
        <div className="flex items-center gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap text-[11px] tracking-[0.3em] uppercase">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-12">
              <span>Cold pressed</span>
              <span className="text-[#B8860B]">✦</span>
              <span>Hand blended</span>
              <span className="text-[#B8860B]">✦</span>
              <span>Small batch</span>
              <span className="text-[#B8860B]">✦</span>
              <span>No silicones</span>
              <span className="text-[#B8860B]">✦</span>
              <span>No parabens</span>
              <span className="text-[#B8860B]">✦</span>
              <span>Made with intention</span>
              <span className="text-[#B8860B]">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* BRAND STORY */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#B8553C]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#B8553C]">
                The House of Hairlab
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
                Hairlab was born from a quiet frustration with the modern hair
                aisle — neon bottles, sixteen-syllable ingredients, promises
                shouted in capital letters. We wanted the opposite. We wanted
                the oil our grandmothers massaged into our scalps on Sunday
                evenings, made with the patience it deserves.
              </p>
              <p>
                Each batch is hand-blended in small quantities. We cold-press
                our bases, slow-infuse our herbs over days — not minutes — and
                bottle them in glass that you can return, refill, or keep. Every
                formula is intentional. Every bottle is made with intention.
              </p>
              <p className="font-[family-name:var(--font-playfair)] italic text-xl text-[#B8553C]">
                No shortcuts. No noise. Just the ritual, restored.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-sm overflow-hidden bg-[#E8DDC3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/products/resham-packaging.png"
                alt="Resham bottle resting on linen"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="bg-[#B8553C] text-[#F4ECD8] p-6 rounded-sm flex flex-col justify-between aspect-square">
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

      {/* THE RITUAL */}
      <section
        id="ritual"
        className="bg-[#2C2416] text-[#F4ECD8] py-20 sm:py-28"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#B8860B]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#B8860B]">
                The 30-Night Ritual
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl leading-tight">
              Thirty nights.
              <br />
              <span className="italic text-[#B8860B]">One bottle.</span>
              <br />
              Hair that remembers.
            </h2>
            <p className="mt-6 text-[#F4ECD8]/70 leading-relaxed">
              Each Resham bottle comes with a 30-night calendar — printed right
              on the side. Mark each evening you keep the ritual. By night
              thirty, the difference is no longer a question.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rituals.map((r, i) => (
              <div
                key={r.title}
                className="bg-[#F4ECD8]/5 border border-[#F4ECD8]/10 p-6 rounded-sm hover:bg-[#F4ECD8]/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-[family-name:var(--font-playfair)] italic text-[#B8860B] text-2xl">
                    0{i + 1}
                  </span>
                  <r.icon
                    className="h-5 w-5 text-[#B8860B]"
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
              className="bg-[#B8860B] hover:bg-[#8C6708] text-[#2C2416] rounded-full px-8 py-6 text-[12px] tracking-[0.2em] uppercase font-medium"
            >
              <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
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
              <div className="h-px w-10 bg-[#B8553C]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#B8553C]">
                The Collection
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#2C2416] leading-tight">
              Three rituals,
              <br />
              <span className="italic text-[#B8553C]">one promise.</span>
            </h2>
          </div>
          <a
            href={SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] tracking-[0.2em] uppercase text-[#2C2416] hover:text-[#B8553C] transition-colors inline-flex items-center gap-2"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((p) => (
            <Card
              key={p.name}
              className="overflow-hidden border-0 bg-[#FBF6E9] rounded-sm shadow-sm hover:shadow-xl hover:shadow-[#2C2416]/10 transition-all duration-500 group"
            >
              <div
                className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${p.accent}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={`${p.name} — ${p.subtitle}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/40 via-transparent to-transparent" />

                {p.tag && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#F4ECD8]/90 text-[#2C2416] hover:bg-[#F4ECD8]/90 rounded-full px-3 text-[10px] tracking-[0.15em] uppercase backdrop-blur-sm">
                      {p.tag}
                    </Badge>
                  </div>
                )}

                {p.nights && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-[#2C2416]/80 text-[#F4ECD8] rounded-full w-14 h-14 flex flex-col items-center justify-center backdrop-blur-sm">
                      <span className="font-[family-name:var(--font-playfair)] text-lg leading-none">
                        {p.nights}
                      </span>
                      <span className="text-[8px] tracking-[0.2em] uppercase opacity-80 mt-0.5">
                        nights
                      </span>
                    </div>
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

              <div className="p-6">
                <p className="text-sm text-[#2C2416]/70 leading-relaxed mb-4 min-h-[60px]">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.ingredients.slice(0, 4).map((ing) => (
                    <span
                      key={ing}
                      className="text-[10px] tracking-[0.1em] uppercase px-2 py-1 rounded-full bg-[#B8553C]/8 text-[#8C3A24] border border-[#B8553C]/15"
                    >
                      {ing}
                    </span>
                  ))}
                </div>

                <Separator className="bg-[#2C2416]/10 mb-5" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/50">
                      {p.volume}
                    </p>
                    <p className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416] mt-1">
                      {p.price}
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#2C2416] hover:bg-[#B8553C] text-[#F4ECD8] rounded-full px-5 text-[11px] tracking-[0.15em] uppercase"
                  >
                    <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                      Buy
                      <ShoppingBag className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
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
              <div className="h-px w-10 bg-[#B8553C]" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#B8553C]">
                The Pantry
              </span>
              <div className="h-px w-10 bg-[#B8553C]" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl text-[#2C2416] leading-tight">
              Every bottle begins
              <br />
              <span className="italic text-[#B8553C]">in the soil.</span>
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
            <div className="h-px w-10 bg-[#B8553C]" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#B8553C]">
              Their Words
            </span>
            <div className="h-px w-10 bg-[#B8553C]" />
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
      <section className="bg-[#B8553C] text-[#F4ECD8] py-20 sm:py-24">
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
              <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
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
            <div className="lg:col-span-1">
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl tracking-[0.15em] uppercase">
                Hairlab
              </h3>
              <p className="mt-4 text-sm text-[#F4ECD8]/60 leading-relaxed max-w-xs">
                Ancient luxury, handcrafted. Botanical hair care made in small
                batches, with intention.
              </p>
              <p className="mt-5 text-[11px] tracking-[0.3em] uppercase text-[#B8860B]">
                Made with intention
              </p>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#B8860B] mb-5">
                Shop
              </h4>
              <ul className="space-y-3 text-sm text-[#F4ECD8]/70">
                <li>
                  <a
                    href={SHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    Resham — Night Oil
                  </a>
                </li>
                <li>
                  <a
                    href={SHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    Mane — Daily Oil
                  </a>
                </li>
                <li>
                  <a
                    href={SHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    Blue Bhring
                  </a>
                </li>
                <li>
                  <a
                    href={SHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    All Products
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#B8860B] mb-5">
                House
              </h4>
              <ul className="space-y-3 text-sm text-[#F4ECD8]/70">
                <li>
                  <a href="#ritual" className="hover:text-[#F4ECD8] transition-colors">
                    The 30-Night Ritual
                  </a>
                </li>
                <li>
                  <a href="#ingredients" className="hover:text-[#F4ECD8] transition-colors">
                    Ingredients
                  </a>
                </li>
                <li>
                  <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#F4ECD8] transition-colors">
                    Store Policies
                  </a>
                </li>
                <li>
                  <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#F4ECD8] transition-colors">
                    Shipping & Returns
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.25em] uppercase text-[#B8860B] mb-5">
                Reach Us
              </h4>
              <ul className="space-y-3 text-sm text-[#F4ECD8]/70">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a
                    href="tel:+919502194263"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    +91 95021 94263
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a
                    href="mailto:hello@hairlab.one"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    hello@hairlab.one
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F4ECD8] transition-colors"
                  >
                    @hairlab
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-[#F4ECD8]/10 my-10" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] tracking-[0.2em] uppercase text-[#F4ECD8]/40">
            <p>© {new Date().getFullYear()} Hairlab · All rights reserved</p>
            <div className="flex items-center gap-4">
              <span>UPI · Net Banking · COD</span>
              <span className="text-[#B8860B]">✦</span>
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Shop Button (mobile) */}
      <a
        href={SHOP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 sm:hidden bg-[#B8553C] text-[#F4ECD8] h-14 w-14 rounded-full flex items-center justify-center shadow-xl shadow-[#B8553C]/40"
        aria-label="Shop now"
      >
        <ShoppingBag className="h-5 w-5" />
      </a>
    </div>
  );
}
