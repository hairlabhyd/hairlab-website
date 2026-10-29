import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/orders";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = getOrder(id);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      paymentMethod: order.paymentMethod,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingPincode: order.shippingPincode,
      shippingState: order.shippingState,
      items: order.items,
      status: order.status,
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
