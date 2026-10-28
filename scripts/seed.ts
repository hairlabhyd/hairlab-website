import { db } from "@/lib/db";

async function seed() {
  console.log("🌱 Seeding REAL Hairlab products from SmartBiz...");

  const products = [
    {
      slug: "mane",
      name: "Mane",
      subtitle: "Hair Oil",
      description:
        "A featherweight daily oil for softness without weight. Cold-pressed coconut base woven with hibiscus, black seed, and fenugreek — for hair that moves like it remembers silk. Massaged in for two minutes, rinsed by morning light.",
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
      slug: "neelam",
      name: "Neelam",
      subtitle: "Blue Bhring Oil",
      description:
        "The deep indigo of true bhringraj. For scalp health, strength, and the kind of hair that remembers it has roots. Steeped slow for 72 hours in cold-pressed sesame, infused with brahmi and amla.",
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
    {
      slug: "ojas",
      name: "Ojas",
      subtitle: "Power Mix Hair Mask",
      description:
        "A weekly power mask for hair that needs more. Hibiscus, fenugreek, and a chorus of Ayurvedic herbs mixed fresh into a powder base — activated with water or yogurt when you're ready. Strength in a bowl.",
      price: 18900, // ₹189
      volume: "100 g",
      image: "/products/resham-packaging.png",
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
      price: 18900, // ₹189
      volume: "1 piece",
      image: "/products/resham-packaging.png",
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
    await db.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`✓ ${p.name} — ₹${(p.price / 100).toFixed(0)} / ${p.volume}`);
  }

  // Delete any products not in this list (e.g., the old "resham" sample)
  const slugs = products.map((p) => p.slug);
  const deleted = await db.product.deleteMany({
    where: { slug: { notIn: slugs } },
  });
  if (deleted.count > 0) {
    console.log(`🧹 Removed ${deleted.count} old sample product(s)`);
  }

  console.log("✅ Seed complete — 4 real products live!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
