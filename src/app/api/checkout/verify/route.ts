import { NextRequest, NextResponse } from "next/server";
import { updateOrder, getOrder } from "@/lib/orders";
import { sendOrderNotifications } from "@/lib/notifications";
import { z } from "zod";

const VerifySchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string().nullable(),
  razorpayPaymentId: z.string().nullable(),
  razorpaySignature: z.string().nullable(),
  paymentMethod: z.enum(["online", "cod"]).default("online"),
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

    // Look up our internal order
    const internalOrder = getOrder(data.orderId);
    if (!internalOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // COD orders — mark as "PENDING_PAYMENT" (paid on delivery)
    if (data.paymentMethod === "cod" || data.razorpayOrderId?.startsWith("cod_")) {
      const updated = updateOrder(data.orderId, {
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: null,
        razorpaySignature: null,
        status: "PAID",
        paymentMethod: "cod",
      });

      // Send notifications (email + WhatsApp + Telegram — whichever are configured)
      const notifResults = await sendOrderNotifications(updated || internalOrder);
      console.log("📱 COD order notifications:", notifResults);

      return NextResponse.json({
        success: true,
        orderId: data.orderId,
        status: "CONFIRMED",
        cod: true,
        message: "Order confirmed. Pay on delivery.",
        notifications: notifResults,
      });
    }

    // Demo mode (no real Razorpay keys)
    if (data.razorpayOrderId?.startsWith("demo_")) {
      const updated = updateOrder(data.orderId, {
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
        status: "PAID",
        paymentMethod: "online",
      });

      const notifResults = await sendOrderNotifications(updated || internalOrder);
      console.log("📱 Demo order notifications:", notifResults);

      return NextResponse.json({
        success: true,
        orderId: data.orderId,
        status: "PAID",
        demo: true,
        notifications: notifResults,
      });
    }

    // Real mode: verify signature
    if (!data.razorpayOrderId || !data.razorpayPaymentId || !data.razorpaySignature) {
      return NextResponse.json(
        { error: "Missing Razorpay payment fields" },
        { status: 400 }
      );
    }

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

    const updated = updateOrder(data.orderId, {
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
      status: "PAID",
      paymentMethod: "online",
    });

    // Send notifications (email + WhatsApp + Telegram — whichever are configured)
    const notifResults = await sendOrderNotifications(updated || internalOrder);
    console.log("📱 Paid order notifications:", notifResults);

    return NextResponse.json({
      success: true,
      orderId: data.orderId,
      status: "PAID",
      notifications: notifResults,
    });
  } catch (e: any) {
    console.error("❌ /api/checkout/verify error:", e);
    return NextResponse.json(
      { error: "Could not verify payment", message: e.message },
      { status: 500 }
    );
  }
}
