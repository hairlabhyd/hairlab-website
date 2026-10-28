import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "hairlab2026";

const UpdateSchema = z.object({
  passcode: z.string(),
  name: z.string().min(1).optional(),
  subtitle: z.string().min(1).optional(),
  description: z.string().min(5).optional(),
  price: z.number().int().positive().optional(),
  volume: z.string().min(1).optional(),
  image: z.string().optional(),
  tagline: z.string().nullable().optional(),
  nights: z.number().int().nullable().optional(),
  accentFrom: z.string().optional(),
  accentTo: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
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

    const updateData: Record<string, unknown> = { ...data };
    delete updateData.passcode;
    if (data.ingredients) {
      updateData.ingredients = JSON.stringify(data.ingredients);
    }

    const product = await db.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error("❌ PUT /api/products/[id] error:", e);
    return NextResponse.json(
      { error: "Could not update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const passcode = url.searchParams.get("passcode");

    if (passcode !== ADMIN_PASSCODE) {
      return NextResponse.json(
        { error: "Invalid passcode" },
        { status: 401 }
      );
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("❌ DELETE /api/products/[id] error:", e);
    return NextResponse.json(
      { error: "Could not delete product" },
      { status: 500 }
    );
  }
}
