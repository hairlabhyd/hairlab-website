// This script seeds the database with products
// Runs automatically during Vercel build (see package.json "build" script)
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding Hairlab products...");

  const products = [
    {
      slug: "mane",
      name: "Mane",
      subtitle: "Hair Oil",
      description:
        "Handcrafted scalp and hair oil, made with intention. Massage in, repeat. A featherweight daily oil for softness without weight — cold-pressed coconut base woven with hibiscus, black seed, and fenugreek.",
      price: 28900,
      volume: "100 ml",
      image: "/products/mane.jpg",
      tagline: "Bestseller",
      nights: null,
      accentFrom: "#7A8450",
      accentTo: "#5C6B3A",
      ingredients: JSON.stringify([
        "Hibiscus",
        "Black Seed",
        "Fenugreek",
        "Coconut",
        "Amla",
        "Curry Leaf",
      ]),
    },
    {
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
      ingredients: JSON.stringify([
        "Indigo",
        "Bhringraj",
        "Amla",
        "Brahmi",
        "Sesame",
      ]),
    },
    {
      slug: "ojas",
      name: "Ojas",
      subtitle: "Power Mix Hair Mask",
      description:
        "Handcrafted all-in-one power masks. Blend fresh, apply, repeat. A weekly ritual of hibiscus, fenugreek, and Ayurvedic herbs mixed fresh into a powder base — activated with water or yogurt when you're ready.",
      price: 18900,
      volume: "100 g",
      image: "/products/ojas.jpg",
      tagline: "Weekly ritual",
      nights: null,
      accentFrom: "#B8860B",
      accentTo: "#8C6708",
      ingredients: JSON.stringify([
        "Hibiscus",
        "Fenugreek",
        "Amla",
        "Bhringraj",
        "Brahmi",
        "Shikakai",
      ]),
    },
    {
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
      ingredients: JSON.stringify([
        "Neem Wood",
        "Hand-carved",
        "Anti-bacterial",
        "Plastic-free",
      ]),
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`✓ ${p.name} — ₹${(p.price / 100).toFixed(0)} / ${p.volume}`);
  }

  // Remove any products that are no longer in the list
  const slugs = products.map((p) => p.slug);
  const deleted = await prisma.product.deleteMany({
    where: { slug: { notIn: slugs } },
  });
  if (deleted.count > 0) {
    console.log(`🧹 Removed ${deleted.count} old product(s)`);
  }

  console.log("✅ Seed complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    // Don't fail the build — just log
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
