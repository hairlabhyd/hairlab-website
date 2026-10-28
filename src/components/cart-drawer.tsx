"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { Minus, Plus, ShoppingBag, Trash2, X, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

function formatPrice(paise: number) {
  return `₹${(paise / 100).toFixed(0)}`;
}

const SHIPPING_FREE_THRESHOLD = 59900; // ₹599
const SHIPPING_FEE = 4900; // ₹49

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems,
    clear,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingPincode: "",
    shippingState: "",
  });

  const subtotal = getSubtotal();
  const shipping =
    subtotal >= SHIPPING_FREE_THRESHOLD || subtotal === 0
      ? 0
      : SHIPPING_FEE;
  const total = subtotal + shipping;
  const totalItems = getTotalItems();
  const remainingForFree = SHIPPING_FREE_THRESHOLD - subtotal;

  function startCheckout() {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setCheckoutOpen(true);
  }

  async function handlePayment() {
    if (
      !form.customerName ||
      !form.customerEmail ||
      !form.customerPhone ||
      !form.shippingAddress ||
      !form.shippingCity ||
      !form.shippingPincode ||
      !form.shippingState
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.customerPhone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setProcessing(true);

    try {
      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || "Failed to create order");
      }

      const orderData = await createRes.json();

      // Demo mode (no Razorpay keys set)
      if (orderData.demo) {
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.orderId,
            razorpayOrderId: orderData.razorpayOrderId,
            razorpayPaymentId: `demo_pay_${Date.now()}`,
            razorpaySignature: "demo_signature",
          }),
        });

        if (verifyRes.ok) {
          toast.success("Demo order placed! Add Razorpay keys to .env for live payments.");
          clear();
          closeCart();
          setCheckoutOpen(false);
          setForm({
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            shippingAddress: "",
            shippingCity: "",
            shippingPincode: "",
            shippingState: "",
          });
        }
        return;
      }

      // Real Razorpay flow
      await loadRazorpayScript();

      const rzp = new (window as any).Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Hairlab",
        description: "Handcrafted hair care ritual",
        image: "/products/resham-packaging.png",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: form.customerName,
          email: form.customerEmail,
          contact: form.customerPhone,
        },
        notes: {
          shipping_address: form.shippingAddress,
          shipping_city: form.shippingCity,
          shipping_pincode: form.shippingPincode,
          shipping_state: form.shippingState,
        },
        theme: {
          color: "#B8553C",
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              const result = await verifyRes.json();
              toast.success("Payment successful! Your ritual begins tonight. 🍃");
              clear();
              closeCart();
              setCheckoutOpen(false);
              setForm({
                customerName: "",
                customerEmail: "",
                customerPhone: "",
                shippingAddress: "",
                shippingCity: "",
                shippingPincode: "",
                shippingState: "",
              });
            } else {
              toast.error("Payment verification failed. Please contact us.");
            }
          } catch (e) {
            toast.error("Verification error. Please contact us.");
          }
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment popup closed. Your cart is saved.");
          },
        },
      });

      rzp.on("payment.failed", function (resp: any) {
        toast.error(
          `Payment failed: ${resp.error.description || "Unknown error"}`
        );
      });

      rzp.open();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  }

  function loadRazorpayScript() {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Could not load Razorpay"));
      document.body.appendChild(script);
    });
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-[#F4ECD8] border-l border-[#2C2416]/10 p-0 flex flex-col"
        >
          <SheetHeader className="px-5 py-4 border-b border-[#2C2416]/10 flex flex-row items-center justify-between space-y-0">
            <div>
              <SheetTitle className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416]">
                Your Cart
              </SheetTitle>
              <SheetDescription className="text-[11px] tracking-[0.2em] uppercase text-[#B8553C] mt-1">
                {totalItems} {totalItems === 1 ? "ritual" : "rituals"}
              </SheetDescription>
            </div>
            <button
              onClick={closeCart}
              className="text-[#2C2416]/60 hover:text-[#2C2416] p-1"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
              <ShoppingBag
                className="h-12 w-12 text-[#2C2416]/20 mb-4"
                strokeWidth={1}
              />
              <p className="font-[family-name:var(--font-playfair)] text-xl text-[#2C2416]">
                Your cart is empty
              </p>
              <p className="text-sm text-[#2C2416]/60 mt-2">
                Begin your ritual tonight.
              </p>
              <Button
                onClick={closeCart}
                className="mt-6 bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full px-6 text-[11px] tracking-[0.2em] uppercase"
              >
                Continue shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="px-5 py-3 bg-[#7A8450]/8 border-b border-[#2C2416]/8">
                {remainingForFree > 0 ? (
                  <p className="text-xs text-[#5C6B3A] text-center">
                    Add{" "}
                    <span className="font-medium">
                      {formatPrice(remainingForFree)}
                    </span>{" "}
                    more for free shipping 🍃
                  </p>
                ) : (
                  <p className="text-xs text-[#5C6B3A] text-center font-medium">
                    ✓ You unlocked free shipping!
                  </p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div
                      className="w-20 h-24 rounded-sm flex-shrink-0 overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${item.accentFrom}, ${item.accentTo})`,
                      }}
                    >
                      { }
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/50">
                        {item.subtitle}
                      </p>
                      <p className="font-[family-name:var(--font-playfair)] text-lg text-[#2C2416] leading-tight">
                        {item.name}
                      </p>
                      <p className="text-sm text-[#B8553C] font-medium mt-1">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-6 w-6 rounded-full border border-[#2C2416]/20 flex items-center justify-center hover:bg-[#2C2416]/5"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-6 w-6 rounded-full border border-[#2C2416]/20 flex items-center justify-center hover:bg-[#2C2416]/5"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-[#2C2416]/40 hover:text-[#B8553C] p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#2C2416]/10 px-5 py-4 space-y-3 bg-[#FBF6E9]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2C2416]/70">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2C2416]/70">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <Separator className="bg-[#2C2416]/10" />
                <div className="flex justify-between items-end">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/60">
                    Total
                  </span>
                  <span className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416]">
                    {formatPrice(total)}
                  </span>
                </div>
                <Button
                  onClick={startCheckout}
                  className="w-full bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full py-6 text-[12px] tracking-[0.2em] uppercase"
                >
                  Checkout · {formatPrice(total)}
                </Button>
                <p className="text-[10px] text-center text-[#2C2416]/50 flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" />
                  Secure checkout via Razorpay · UPI, Card, COD
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout Modal */}
      <Sheet open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-[#F4ECD8] border-l border-[#2C2416]/10 p-0 flex flex-col"
        >
          <SheetHeader className="px-5 py-4 border-b border-[#2C2416]/10 flex flex-row items-center justify-between space-y-0">
            <div>
              <SheetTitle className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416]">
                Checkout
              </SheetTitle>
              <SheetDescription className="text-[11px] tracking-[0.2em] uppercase text-[#B8553C] mt-1">
                {formatPrice(total)} · {totalItems} items
              </SheetDescription>
            </div>
            <button
              onClick={() => setCheckoutOpen(false)}
              className="text-[#2C2416]/60 hover:text-[#2C2416] p-1"
              aria-label="Close checkout"
            >
              <X className="h-5 w-5" />
            </button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#2C2416] mb-3">
                Where shall we send your ritual?
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="customerName" className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  Full name
                </Label>
                <Input
                  id="customerName"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                  placeholder="Mukta K."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="customerEmail" className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                    Email
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone" className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                    Phone
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                    placeholder="9502194263"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shippingAddress" className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  Address
                </Label>
                <Input
                  id="shippingAddress"
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                  placeholder="Flat / House no, street, area"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="shippingCity" className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                    City
                  </Label>
                  <Input
                    id="shippingCity"
                    value={form.shippingCity}
                    onChange={(e) => setForm({ ...form, shippingCity: e.target.value })}
                    className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                    placeholder="Bengaluru"
                  />
                </div>
                <div>
                  <Label htmlFor="shippingPincode" className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                    Pincode
                  </Label>
                  <Input
                    id="shippingPincode"
                    value={form.shippingPincode}
                    onChange={(e) => setForm({ ...form, shippingPincode: e.target.value })}
                    className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                    placeholder="560001"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shippingState" className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  State
                </Label>
                <Input
                  id="shippingState"
                  value={form.shippingState}
                  onChange={(e) => setForm({ ...form, shippingState: e.target.value })}
                  className="bg-[#FBF6E9] border-[#2C2416]/15 mt-1"
                  placeholder="Karnataka"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#2C2416]/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#2C2416]/70">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#2C2416]/70">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between items-end pt-1">
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/60">
                  Pay now
                </span>
                <span className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2C2416]/10 px-5 py-4 bg-[#FBF6E9]">
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full py-6 text-[12px] tracking-[0.2em] uppercase"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Pay {formatPrice(total)}
                </>
              )}
            </Button>
            <p className="text-[10px] text-center text-[#2C2416]/50 mt-2">
              🔒 256-bit encrypted · UPI · Cards · Net Banking · COD
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
