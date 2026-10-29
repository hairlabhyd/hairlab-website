// Simple in-memory order storage (no database needed)
// Orders are kept in memory during the request lifecycle
// In production, you'd want to add email notifications or a webhook to save these

import { products } from "@/lib/products";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPincode: string;
  shippingState: string;
  amount: number;
  itemsTotal: number;
  shipping: number;
  codFee: number;
  paymentMethod: "online" | "cod";
  currency: string;
  status: "CREATED" | "PAID" | "FAILED";
  createdAt: string;
  items: OrderItem[];
}

// In-memory store (per-instance, NOT persistent across deployments)
// This is intentional - we want orders to work without database setup
// For production: replace with email/SMS notification or save to a real DB
const orders = new Map<string, Order>();

export function createOrder(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPincode: string;
  shippingState: string;
  items: OrderItem[];
  paymentMethod?: "online" | "cod";
}): Order {
  const id = `order_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const itemsTotal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order: Order = {
    id,
    razorpayOrderId: null,
    razorpayPaymentId: null,
    razorpaySignature: null,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    shippingAddress: data.shippingAddress,
    shippingCity: data.shippingCity,
    shippingPincode: data.shippingPincode,
    shippingState: data.shippingState,
    amount: itemsTotal,
    itemsTotal,
    shipping: 0,
    codFee: 0,
    paymentMethod: data.paymentMethod || "online",
    currency: "INR",
    status: "CREATED",
    createdAt: new Date().toISOString(),
    items: data.items,
  };

  orders.set(id, order);
  console.log(`📦 Order created: ${id} for ${data.customerName} - ₹${(itemsTotal / 100).toFixed(0)}`);
  return order;
}

export function updateOrder(
  id: string,
  updates: Partial<Order>
): Order | undefined {
  const order = orders.get(id);
  if (!order) return undefined;
  const updated = { ...order, ...updates };
  orders.set(id, updated);
  return updated;
}

export function getOrder(id: string): Order | undefined {
  return orders.get(id);
}

export { products };
