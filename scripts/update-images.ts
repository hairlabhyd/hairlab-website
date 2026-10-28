import { db } from "@/lib/db";

async function updateProductImages() {
  console.log("📸 Updating product images...");

  const updates = [
    { slug: "mane", image: "/products/mane.jpg" },
    { slug: "neelam", image: "/products/neelam.jpg" },
    { slug: "ojas", image: "/products/ojas.jpg" },
    { slug: "karu", image: "/products/karu.jpg" },
    // Resham stays on the packaging placeholder until product photo is taken
  ];

  for (const u of updates) {
    const updated = await db.product.update({
      where: { slug: u.slug },
      data: { image: u.image },
    });
    console.log(`✓ ${updated.name} → ${u.image}`);
  }

  console.log("✅ All product images updated!");
}

updateProductImages()
  .catch((e) => {
    console.error("❌ Update failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
