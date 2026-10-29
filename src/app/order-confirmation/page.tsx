"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Phone, MessageCircle, Package } from "lucide-react";

interface OrderInfo {
  id: string;
  amount: number;
  paymentMethod: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (e) {
        console.error("Could not fetch order:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4ECD8] flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-[#7A8450] mx-auto mb-4 animate-pulse" strokeWidth={1.4} />
          <p className="font-[family-name:var(--font-playfair)] text-xl text-[#2C2416]">
            Loading your order...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F4ECD8] flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <Package className="h-12 w-12 text-[#2C2416]/20 mx-auto mb-4" strokeWidth={1} />
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416] mb-3">
            Order not found
          </h1>
          <p className="text-sm text-[#2C2416]/60 mb-6">
            We couldn&apos;t find this order. Please check your email for the order confirmation link.
          </p>
          <Button
            asChild
            className="bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
          >
            <a href="/">Back to home</a>
          </Button>
        </div>
      </div>
    );
  }

  const isCod = order.paymentMethod === "cod";

  return (
    <div className="min-h-screen bg-[#F4ECD8] flex items-center justify-center px-5 py-12">
      <div className="max-w-lg w-full">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#7A8450] text-[#F4ECD8] mb-5">
            <Check className="h-8 w-8" strokeWidth={2} />
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl text-[#2C2416] leading-tight">
            Your ritual begins
            <br />
            <span className="italic text-[#B8553C]">tonight.</span>
          </h1>
          <p className="mt-4 text-[#2C2416]/70 leading-relaxed">
            {isCod
              ? "Order confirmed. Pay when it arrives (5-10 days)."
              : "Payment received. We're hand-blending your bottle now."}
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-white rounded-sm shadow-lg shadow-[#2C2416]/8 p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#2C2416]/10">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#2C2416]/60">
              Order ID
            </span>
            <span className="font-mono text-xs text-[#2C2416] font-medium">
              {order.id}
            </span>
          </div>

          <div className="py-4 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-[#2C2416]/85">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-[#2C2416]">
                  ₹{(item.price / 100).toFixed(0)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#2C2416]/10 flex items-end justify-between">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/60">
                Total
              </p>
              <p className="text-[11px] text-[#2C2416]/50 mt-1">
                {isCod ? "Pay on delivery" : "Paid online"}
              </p>
            </div>
            <span className="font-[family-name:var(--font-playfair)] text-3xl text-[#2C2416]">
              ₹{(order.amount / 100).toFixed(0)}
            </span>
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-[#FBF6E9] rounded-sm p-5 mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C6B3A] mb-3">
            Shipping to
          </p>
          <p className="font-medium text-[#2C2416]">{order.customerName}</p>
          <p className="text-sm text-[#2C2416]/70 mt-1">
            We&apos;ll send tracking info to your email once it ships.
          </p>
        </div>

        {/* Next steps */}
        <div className="bg-[#1A3D2A] text-[#F4ECD8] rounded-sm p-5 mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#B8860B] mb-3">
            What happens next
          </p>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#B8860B] font-bold">1.</span>
              <span>We hand-blend your order (1-2 days)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B8860B] font-bold">2.</span>
              <span>Packed + shipped via courier</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B8860B] font-bold">3.</span>
              <span>Tracking info sent to your email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#B8860B] font-bold">4.</span>
              <span>{isCod ? "Pay when delivered (5-10 days)" : "Delivered to your door (5-10 days)"}</span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            asChild
            className="bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full py-5 text-[11px] tracking-[0.2em] uppercase"
          >
            <a href={`https://wa.me/919502194263?text=${encodeURIComponent(`Hi! I have a question about my order ${order.id}`)}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp us
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="bg-[#FBF6E9] border-[#2C2416]/15 text-[#2C2416] hover:bg-[#2C2416]/5 rounded-full py-5 text-[11px] tracking-[0.2em] uppercase"
          >
            <a href="tel:+919502194263">
              <Phone className="mr-2 h-4 w-4" />
              Call us
            </a>
          </Button>
        </div>

        <p className="text-center text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/40 mt-8">
          Made with intention · HAIR LAB.
        </p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4ECD8] flex items-center justify-center">
          <div className="text-center">
            <Package className="h-12 w-12 text-[#7A8450] mx-auto mb-4 animate-pulse" strokeWidth={1.4} />
            <p className="font-[family-name:var(--font-playfair)] text-xl text-[#2C2416]">
              Loading your order...
            </p>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
