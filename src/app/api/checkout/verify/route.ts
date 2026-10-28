import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/lib/db";
import { z } from "zod";

const VerifySchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret || key_id.includes("YOUR_")) {
    return null;
  }
  return new Razorpay({ key_id, key_secret });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid verification payload" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Look up our internal order
    const internalOrder = await db.order.findUnique({
      where: { id: data.orderId },
      include: { items: true },
    });

    if (!internalOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // 2. DEMO mode (no keys set): trust the client, mark as PAID
    const razorpay = getRazorpay();
    if (!razorpay || data.razorpayOrderId.startsWith("demo_")) {
      await db.order.update({
        where: { id: internalOrder.id },
        data: {
          razorpayOrderId: data.razorpayOrderId,
          razorpayPaymentId: data.razorpayPaymentId,
          razorpaySignature: data.razorpaySignature,
          status: "PAID",
        },
      });

      return NextResponse.json({
        success: true,
        orderId: internalOrder.id,
        status: "PAID",
        demo: true,
      });
    }

    // 3. REAL mode: verify signature
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== data.razorpaySignature) {
      await db.order.update({
        where: { id: internalOrder.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    // 4. Mark as PAID
    await db.order.update({
      where: { id: internalOrder.id },
      data: {
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
        status: "PAID",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: internalOrder.id,
      status: "PAID",
    });
  } catch (e) {
    console.error("❌ /api/checkout/verify error:", e);
    return NextResponse.json(
      { error: "Could not verify payment" },
      { status: 500 }
    );
  }
}
