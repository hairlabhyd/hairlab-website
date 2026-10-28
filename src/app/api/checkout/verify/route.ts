import { NextRequest, NextResponse } from "next/server";
import { updateOrder } from "@/lib/orders";
import { z } from "zod";

const VerifySchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

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

    // Demo mode (no real Razorpay keys)
    if (data.razorpayOrderId.startsWith("demo_")) {
      updateOrder(data.orderId, {
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
        status: "PAID",
      });

      return NextResponse.json({
        success: true,
        orderId: data.orderId,
        status: "PAID",
        demo: true,
      });
    }

    // Real mode: verify signature
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== data.razorpaySignature) {
      updateOrder(data.orderId, { status: "FAILED" });
      return NextResponse.json(
        { error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    updateOrder(data.orderId, {
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
      status: "PAID",
    });

    return NextResponse.json({
      success: true,
      orderId: data.orderId,
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
