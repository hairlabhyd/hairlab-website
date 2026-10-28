import { db } from "@/lib/db";

async function syncFromSmartBiz() {
  console.log("📋 Syncing real content from SmartBiz (hairlab.one)...");

  // Real product data copied from hairlab.one
  const updates = [
    {
      slug: "mane",
      subtitle: "Hair Oil",
      description:
        "Handcrafted scalp and hair oil, made with intention. Massage in, repeat. A featherweight daily oil for softness without weight — cold-pressed coconut base woven with hibiscus, black seed, and fenugreek.",
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
      subtitle: "Blue Bhring Oil",
      description:
        "A botanical hair oil crafted with indigo and bringraj to nourish the hair and support a naturally dark, lustrous finish. Inspired by time-honoured plant-based hair rituals, Neelam brings together botanical ingredients in a considered blend for your haircare routine.",
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
      subtitle: "Power Mix Hair Mask",
      description:
        "Handcrafted all-in-one power masks. Blend fresh, apply, repeat. A weekly ritual of hibiscus, fenugreek, and Ayurvedic herbs mixed fresh into a powder base — activated with water or yogurt when you're ready.",
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
      subtitle: "Neem Wood Comb",
      description:
        "Hand-carved from a single piece of neem wood. Anti-bacterial by nature, gentle by design. The comb your grandmother used, made the way it was always meant to be made — no plastic, no lacquer, no compromise.",
      ingredients: JSON.stringify([
        "Neem Wood",
        "Hand-carved",
        "Anti-bacterial",
        "Plastic-free",
      ]),
    },
    {
      slug: "resham",
      subtitle: "Everyday Night Oil",
      description:
        "Handcrafted scalp and hair oil, made with intention. A silken nightly ritual — massaged in for two minutes, washed out by morning light. Each bottle comes with a 30-night ritual calendar printed on the side.",
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
      ]),
    },
  ];

  for (const u of updates) {
    const updated = await db.product.update({
      where: { slug: u.slug },
      data: {
        subtitle: u.subtitle,
        description: u.description,
        ingredients: u.ingredients,
      },
    });
    console.log(`✓ ${updated.name} — synced real SmartBiz copy`);
  }

  console.log("✅ All products synced with SmartBiz content!");
}

syncFromSmartBiz()
  .catch((e) => {
    console.error("❌ Sync failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
