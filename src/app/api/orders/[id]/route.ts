import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingPincode: order.shippingPincode,
      shippingState: order.shippingState,
      items: order.items.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      createdAt: order.createdAt,
    });
  } catch (e) {
    console.error("❌ /api/orders/[id] error:", e);
    return NextResponse.json(
      { error: "Could not fetch order" },
      { status: 500 }
    );
  }
}
