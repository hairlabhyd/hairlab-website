import { db } from "@/lib/db";

async function seed() {
  console.log("🌱 Seeding Hairlab products...");

  const products = [
    {
      slug: "resham",
      name: "Resham",
      subtitle: "Everyday Night Oil",
      description:
        "A silken nightly ritual of argan, grapeseed, and fenugreek — massaged in for two minutes, washed out by morning light. Each bottle comes with a 30-night ritual calendar printed on the side.",
      price: 38900, // ₹389 in paise
      volume: "30 ml",
      image: "/products/resham-packaging.png",
      tagline: "Made with intention",
      nights: 30,
      accentFrom: "#B8553C",
      accentTo: "#8C3A24",
      ingredients: JSON.stringify([
        "Argan",
        "Grapeseed",
        "Castor",
        "Almond",
        "Rosemary",
        "Jojoba",
        "Black Seed",
        "Fenugreek",
        "Hibiscus",
        "Vitamin E",
      ]),
    },
    {
      slug: "mane",
      name: "Mane",
      subtitle: "Daily Hair Oil",
      description:
        "A featherweight daily oil for softness without weight. Hibiscus and black seed woven through a cold-pressed coconut base — for hair that moves like it remembers silk.",
      price: 28900, // ₹289
      volume: "100 ml",
      image: "/products/resham-packaging.png",
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
      slug: "blue-bhring",
      name: "Blue Bhring",
      subtitle: "Bhringraj Ritual Oil",
      description:
        "The deep indigo of true bhringraj. For scalp health, strength, and the kind of hair that remembers it has roots. Steeped slow for 72 hours.",
      price: 21900, // ₹219
      volume: "100 ml",
      image: "/products/resham-packaging.png",
      tagline: "Traditional",
      nights: null,
      accentFrom: "#3A4D5C",
      accentTo: "#1F2E3A",
      ingredients: JSON.stringify([
        "Bhringraj",
        "Amla",
        "Brahmi",
        "Sesame",
        "Indigo",
        "Nilini",
      ]),
    },
  ];

  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`✓ ${p.name} — ₹${(p.price / 100).toFixed(0)} / ${p.volume}`);
  }

  console.log("✅ Seed complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
