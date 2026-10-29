import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createOrder, updateOrder } from "@/lib/orders";
import { z } from "zod";

const CheckoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingPincode: z.string().min(6),
  shippingState: z.string().min(2),
  paymentMethod: z.enum(["online", "cod"]).default("online"),
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
  if (!key_id || !key_secret) {
    return null;
  }
  if (
    key_id.includes("YOUR_") ||
    key_id.includes("rzp_test_YOUR") ||
    key_secret.includes("YOUR_")
  ) {
    return null;
  }
  return new Razorpay({ key_id, key_secret });
}

// COD fee (₹30 extra for COD orders)
const COD_FEE = 3000;
// Free shipping threshold
const SHIPPING_FREE_THRESHOLD = 79900; // ₹799
const SHIPPING_FEE = 5900; // ₹59 (mandatory shipping)

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
    const itemsTotal = data.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    if (itemsTotal < 100) {
      return NextResponse.json(
        { error: "Order amount too low" },
        { status: 400 }
      );
    }

    // Calculate shipping
    const shipping =
      itemsTotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FEE;

    // Add COD fee if payment method is COD
    const codFee = data.paymentMethod === "cod" ? COD_FEE : 0;

    const totalAmount = itemsTotal + shipping + codFee;

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
      paymentMethod: data.paymentMethod,
    });

    // Update order with totals
    updateOrder(order.id, {
      amount: totalAmount,
      shipping,
      codFee,
    });

    // COD orders don't need Razorpay — they're paid on delivery
    if (data.paymentMethod === "cod") {
      return NextResponse.json({
        orderId: order.id,
        razorpayOrderId: null,
        amount: totalAmount,
        itemsTotal,
        shipping,
        codFee,
        currency: "INR",
        cod: true,
        key: null,
      });
    }

    // Online payment — try Razorpay
    const razorpay = getRazorpay();
    if (!razorpay) {
      console.warn("⚠️ Razorpay keys not set or invalid. Running in DEMO mode.");
      return NextResponse.json({
        orderId: order.id,
        razorpayOrderId: `demo_${order.id}`,
        amount: totalAmount,
        itemsTotal,
        shipping,
        codFee,
        currency: "INR",
        demo: true,
        key: "demo_mode",
      });
    }

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: totalAmount,
        currency: "INR",
        receipt: order.id,
        notes: {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          paymentMethod: data.paymentMethod,
        },
      });
    } catch (rpError: any) {
      console.error("❌ Razorpay API error:", JSON.stringify(rpError, null, 2));
      const errMsg =
        rpError?.error?.description ||
        rpError?.message ||
        "Razorpay API call failed";
      return NextResponse.json(
        {
          error: "Payment gateway error: " + errMsg,
          details: rpError?.error || rpError,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      itemsTotal,
      shipping,
      codFee,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e: any) {
    console.error("❌ /api/checkout/create-order error:", e);
    return NextResponse.json(
      {
        error: "Could not create order",
        message: e?.message || String(e),
        stack: process.env.NODE_ENV === "development" ? e?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
