import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";
import { z } from "zod";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "hairlab2026";

// GET returns all products (read-only from products.ts file)
export async function GET() {
  try {
    return NextResponse.json({ products });
  } catch (e) {
    console.error("❌ GET /api/products error:", e);
    return NextResponse.json(
      { error: "Could not fetch products" },
      { status: 500 }
    );
  }
}

// Note: To add/edit/delete products, edit /src/lib/products.ts directly
// and redeploy. The admin panel is for viewing only on this version.
