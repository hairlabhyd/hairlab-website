import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createOrder } from "@/lib/orders";
import { z } from "zod";

const CheckoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingPincode: z.string().min(6),
  shippingState: z.string().min(2),
  items: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      name: z.string(),
      price: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret || key_id.includes("YOUR_") || key_id.includes("rzp_test_YOUR")) {
    return null;
  }
  return new Razorpay({ key_id, key_secret });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const amountInPaise = data.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: "Order amount too low" },
        { status: 400 }
      );
    }

    // Create order in memory
    const order = createOrder({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      shippingPincode: data.shippingPincode,
      shippingState: data.shippingState,
      items: data.items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    const razorpay = getRazorpay();
    if (!razorpay) {
      console.warn("⚠️ Razorpay keys not set. Running in DEMO mode.");
      return NextResponse.json({
        orderId: order.id,
        razorpayOrderId: `demo_${order.id}`,
        amount: amountInPaise,
        currency: "INR",
        demo: true,
        key: "demo_mode",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.id,
      notes: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
      },
    });

    updateOrder(order.id, { razorpayOrderId: razorpayOrder.id });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error("❌ /api/checkout/create-order error:", e);
    return NextResponse.json(
      { error: "Could not create order: " + (e as Error).message },
      { status: 500 }
    );
  }
}

// Need to import updateOrder
import { updateOrder } from "@/lib/orders";
