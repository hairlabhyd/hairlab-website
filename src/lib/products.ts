// Products stored as a simple JSON file - no database setup needed
// Edit this file directly to add/remove products

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number; // in paise (₹1 = 100 paise)
  volume: string;
  image: string;
  tagline: string | null;
  nights: number | null;
  accentFrom: string;
  accentTo: string;
  ingredients: string[]; // plain array now
}

export const products: Product[] = [
  {
    id: "mane",
    slug: "mane",
    name: "Mane",
    subtitle: "Hair Oil",
    description:
      "On the bottle, she looks dark and quiet — almost black. But warm a few drops between your palms and watch her turn: a deep, breathing red, stained the colour of mandaram. Fourteen botanicals — Amla, Bhringraj, Castor, Hibiscus, Methi, Moringa, Rosemary, Flaxseed and her quiet sisters — slow-infused into a base that remembers Sunday evenings. Massage in. Sleep. Rinse by morning light.",
    price: 28900,
    volume: "100 ml",
    image: "/products/mane.jpg",
    tagline: "Bestseller",
    nights: null,
    accentFrom: "#7A8450",
    accentTo: "#5C6B3A",
    ingredients: [
      "Amla",
      "Bhringraj",
      "Castor Oil",
      "Hibiscus",
      "Methi",
      "Moringa",
      "Rosemary",
      "Flaxseed",
    ],
  },
  {
    id: "neelam",
    slug: "neelam",
    name: "Neelam",
    subtitle: "Blue Bhring Oil",
    description:
      "A botanical hair oil crafted with indigo and bringraj to nourish the hair and support a naturally dark, lustrous finish. Inspired by time-honoured plant-based hair rituals, Neelam brings together botanical ingredients in a considered blend for your haircare routine.",
    price: 21900,
    volume: "100 ml",
    image: "/products/neelam.jpg",
    tagline: "Traditional",
    nights: null,
    accentFrom: "#3A4D5C",
    accentTo: "#1F2E3A",
    ingredients: [
      "Indigo",
      "Bhringraj",
      "Amla",
      "Brahmi",
      "Sesame",
    ],
  },
  {
    id: "ojas",
    slug: "ojas",
    name: "Ojas",
    subtitle: "Power Mix Hair Mask",
    description:
      "Handcrafted all-in-one power masks. Blend fresh, apply, repeat. A weekly ritual of hibiscus, fenugreek, and botanical herbs mixed fresh into a powder base — activated with water or your favourite oil.",
    price: 18900,
    volume: "100 g",
    image: "/products/ojas.jpg",
    tagline: "Weekly ritual",
    nights: null,
    accentFrom: "#B8860B",
    accentTo: "#8C6708",
    ingredients: [
      "Hibiscus",
      "Fenugreek",
      "Amla",
      "Bhringraj",
      "Brahmi",
      "Sesame",
    ],
  },
  {
    id: "karu",
    slug: "karu",
    name: "Kāru",
    subtitle: "Neem Wood Comb",
    description:
      "Hand-carved from a single piece of neem wood. Anti-bacterial by nature, gentle by design. The comb your grandmother used, made the way it was always meant to be made — no plastic, no lacquer, no compromise.",
    price: 18900,
    volume: "1 piece",
    image: "/products/karu.jpg",
    tagline: "Hand-carved",
    nights: null,
    accentFrom: "#8C6F4A",
    accentTo: "#5C4A2F",
    ingredients: [
      "Neem Wood",
      "Hand-carved",
      "Anti-bacterial",
      "Plastic-free",
    ],
  },
];

// Helper to find a product by ID (for cart operations)
export function findProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
