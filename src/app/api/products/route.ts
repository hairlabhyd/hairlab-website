import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "hairlab2026";

const ProductSchema = z.object({
  passcode: z.string(),
  name: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(5),
  price: z.number().int().positive(),
  volume: z.string().min(1),
  image: z.string().default("/products/resham-packaging.png"),
  tagline: z.string().optional().nullable(),
  nights: z.number().int().nullable().optional(),
  accentFrom: z.string().default("#B8553C"),
  accentTo: z.string().default("#8C3A24"),
  ingredients: z.array(z.string()).default([]),
});

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (e) {
    console.error("❌ GET /api/products error:", e);
    return NextResponse.json(
      { error: "Could not fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    if (data.passcode !== ADMIN_PASSCODE) {
      return NextResponse.json(
        { error: "Invalid passcode" },
        { status: 401 }
      );
    }

    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const product = await db.product.create({
      data: {
        slug,
        name: data.name,
        subtitle: data.subtitle,
        description: data.description,
        price: data.price,
        volume: data.volume,
        image: data.image,
        tagline: data.tagline || null,
        nights: data.nights ?? null,
        accentFrom: data.accentFrom,
        accentTo: data.accentTo,
        ingredients: JSON.stringify(data.ingredients),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error("❌ POST /api/products error:", e);
    return NextResponse.json(
      { error: "Could not create product" },
      { status: 500 }
    );
  }
}
