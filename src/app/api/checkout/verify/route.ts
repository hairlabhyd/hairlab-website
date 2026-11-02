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

// GET handler — for Razorpay redirect callback
// Razorpay redirects here after payment with query params:
// ?razorpay_payment_id=xxx&razorpay_order_id=xxx&razorpay_signature=xxx
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const razorpay_payment_id = url.searchParams.get("razorpay_payment_id");
    const razorpay_order_id = url.searchParams.get("razorpay_order_id");
    const razorpay_signature = url.searchParams.get("razorpay_signature");
    const order_id = url.searchParams.get("order_id");

    // If no payment params — redirect to home
    if (!razorpay_payment_id || !razorpay_order_id) {
      return NextResponse.redirect("https://www.hairlab.one");
    }

    // Verify the payment signature
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Payment failed verification
      return NextResponse.redirect("https://www.hairlab.one?payment=failed");
    }

    // Find the internal order (by razorpay_order_id)
    // We need to get the order — but our in-memory store doesn't have a findByRazorpayId
    // So we pass the internal order_id in the callback_url
    let internalOrderId = order_id;

    if (internalOrderId) {
      const internalOrder = getOrder(internalOrderId);
      if (internalOrder) {
        const updated = updateOrder(internalOrderId, {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "PAID",
          paymentMethod: "online",
        });

        // Send notifications
        await sendOrderNotifications(updated || internalOrder);
      }
    }

    // Redirect to order confirmation page
    return NextResponse.redirect(
      `https://www.hairlab.one/order-confirmation?id=${internalOrderId || ""}`
    );
  } catch (e: any) {
    console.error("❌ GET /api/checkout/verify error:", e);
    return NextResponse.redirect("https://www.hairlab.one?payment=error");
  }
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
