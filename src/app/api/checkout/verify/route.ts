import { NextRequest, NextResponse } from "next/server";
import { updateOrder, getOrder } from "@/lib/orders";
import { z } from "zod";

const VerifySchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string().nullable(),
  razorpayPaymentId: z.string().nullable(),
  razorpaySignature: z.string().nullable(),
  paymentMethod: z.enum(["online", "cod"]).default("online"),
});

async function sendOrderConfirmationEmail(order: any) {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.log("📧 Email not configured. Skipping. Set EMAIL_USER + EMAIL_PASS env vars.");
      return { sent: false };
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
    });

    const itemsList = order.items
      .map((i: any) => `• ${i.name} × ${i.quantity} — ₹${(i.price / 100).toFixed(0)}`)
      .join("\n");

    const subject = order.paymentMethod === "cod"
      ? `HAIR LAB. · Order Confirmed (COD) — ₹${(order.amount / 100).toFixed(0)}`
      : `HAIR LAB. · Payment Successful — ₹${(order.amount / 100).toFixed(0)}`;

    const text = `
Hi ${order.customerName},

${order.paymentMethod === "cod"
  ? "Your order is confirmed! Pay ₹" + (order.amount / 100).toFixed(0) + " when it arrives (5-10 days)."
  : "Payment received! Your ritual begins tonight."}

ORDER DETAILS
─────────────
Order ID: ${order.id}
Total: ₹${(order.amount / 100).toFixed(0)} ${order.currency}
Payment: ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid online"}

PRODUCTS
─────────────
${itemsList}

SHIPPING TO
─────────────
${order.customerName}
${order.shippingAddress}
${order.shippingCity}, ${order.shippingState} ${order.shippingPincode}
Phone: ${order.customerPhone}

We'll send you a tracking link once it ships.

Made with intention,
Sruwa Kesiraju
HAIR LAB.
hairlabhyd@gmail.com · +91 95021 94263
https://hairlab.one
    `;

    // Send to customer
    await transporter.sendMail({
      from: `"HAIR LAB." <${emailUser}>`,
      to: order.customerEmail,
      subject,
      text,
    });

    // Send to Sruwa (notification)
    await transporter.sendMail({
      from: `"HAIR LAB. Orders" <${emailUser}>`,
      to: "hairlabhyd@gmail.com",
      subject: `🛒 New Order: ${order.customerName} — ₹${(order.amount / 100).toFixed(0)} (${order.paymentMethod.toUpperCase()})`,
      text,
    });

    return { sent: true };
  } catch (e: any) {
    console.error("📧 Email send failed:", e.message);
    return { sent: false, error: e.message };
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
        status: "PAID", // Will be marked PAID when cash collected; for now order is "confirmed"
        paymentMethod: "cod",
      });

      // Send email (won't fail the request if email not configured)
      await sendOrderConfirmationEmail(updated || internalOrder);

      return NextResponse.json({
        success: true,
        orderId: data.orderId,
        status: "CONFIRMED",
        cod: true,
        message: "Order confirmed. Pay on delivery.",
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

      await sendOrderConfirmationEmail(updated || internalOrder);

      return NextResponse.json({
        success: true,
        orderId: data.orderId,
        status: "PAID",
        demo: true,
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

    // Send email confirmation
    await sendOrderConfirmationEmail(updated || internalOrder);

    return NextResponse.json({
      success: true,
      orderId: data.orderId,
      status: "PAID",
    });
  } catch (e: any) {
    console.error("❌ /api/checkout/verify error:", e);
    return NextResponse.json(
      { error: "Could not verify payment", message: e.message },
      { status: 500 }
    );
  }
}
