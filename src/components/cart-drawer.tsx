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
const SHIPPING_FEE = 3000; // ₹30 (actual cost, no markup)
const COD_FEE = 5900; // ₹59 (₹30 shipping + ₹29 COD handling)

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
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [showShippingInfo, setShowShippingInfo] = useState(false);
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
  const isFreeShipping = subtotal >= SHIPPING_FREE_THRESHOLD || subtotal === 0;

  // Online: ₹30 or free (above ₹599)
  // COD: ₹59 always (₹30 shipping + ₹29 COD handling, even on free shipping above ₹599)
  const shipping = isFreeShipping ? 0 : SHIPPING_FEE;
  const codFee = paymentMethod === "cod" ? (isFreeShipping ? 2900 : COD_FEE) : 0;
  // If COD + free shipping: only ₹29 COD handling fee
  // If COD + not free: ₹30 shipping + ₹29 COD = ₹59
  const totalCodFee = paymentMethod === "cod"
    ? (isFreeShipping ? 2900 : COD_FEE)
    : 0;

  const total = subtotal + (paymentMethod === "cod" ? totalCodFee : shipping);
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
        body: JSON.stringify({ ...form, items, paymentMethod }),
      });

      if (!createRes.ok) {
        let errMsg = "Failed to create order";
        try {
          const err = await createRes.json();
          errMsg = err.error || errMsg;
          if (err.message) errMsg += ` (${err.message})`;
          if (err.details) {
            console.error("Order creation error details:", err.details);
          }
        } catch (parseErr) {
          errMsg = "Server returned non-JSON response (status " + createRes.status + ")";
        }
        throw new Error(errMsg);
      }

      let orderData;
      try {
        orderData = await createRes.json();
      } catch (parseErr) {
        throw new Error("Invalid response from server. Please try again.");
      }

      // COD order — no Razorpay payment needed
      if (orderData.cod) {
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.orderId,
            razorpayOrderId: null,
            razorpayPaymentId: null,
            razorpaySignature: null,
            paymentMethod: "cod",
          }),
        });

        if (verifyRes.ok) {
          toast.success("Order placed! Pay ₹" + (orderData.amount / 100).toFixed(0) + " when it arrives. 📦");
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
          toast.error("Could not confirm order. Please contact us.");
        }
        return;
      }

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
            paymentMethod: "online",
          }),
        });

        if (verifyRes.ok) {
          toast.success("Demo order placed! Add Razorpay keys to env vars for live payments.");
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
        name: "HAIR LAB.",
        description: "Handcrafted hair care ritual",
        image: "/hairlab-logo-green.png",
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
          color: "#1A3D2A",
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
                paymentMethod: "online",
              }),
            });

            if (verifyRes.ok) {
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
                  placeholder="Sruwa K."
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

            {/* Payment Method Selection */}
            <div className="pt-2 border-t border-[#2C2416]/10">
              <div className="flex items-center justify-between mb-3 pt-2">
                <Label className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/70">
                  Payment Method
                </Label>
                <button
                  type="button"
                  onClick={() => setShowShippingInfo(true)}
                  className="text-[10px] tracking-[0.15em] uppercase text-[#B8553C] hover:text-[#8C3A24] underline underline-offset-4"
                >
                  Why COD costs more?
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`p-3 rounded-sm border-2 text-left transition-all ${
                    paymentMethod === "online"
                      ? "border-[#1A3D2A] bg-[#1A3D2A]/5"
                      : "border-[#2C2416]/10 bg-[#FBF6E9]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#2C2416]">Online</span>
                    <span className="text-[10px] text-[#5C6B3A]">
                      {isFreeShipping ? "FREE ship" : "+₹30"}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#2C2416]/60 mt-1">UPI · Card · Net Banking</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3 rounded-sm border-2 text-left transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#1A3D2A] bg-[#1A3D2A]/5"
                      : "border-[#2C2416]/10 bg-[#FBF6E9]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#2C2416]">COD</span>
                    <span className="text-[10px] text-[#B8553C]">
                      {isFreeShipping ? "+₹29" : "+₹59"}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#2C2416]/60 mt-1">Pay when it arrives</p>
                </button>
              </div>

              {paymentMethod === "cod" && (
                <p className="text-[10px] text-[#2C2416]/50 mt-2 leading-relaxed italic">
                  COD includes a small handling fee — courier charges us extra to collect cash.
                  Pay online to save ₹29.
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="pt-3 border-t border-[#2C2416]/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#2C2416]/70">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#2C2416]/70">Shipping</span>
                <span className="font-medium">
                  {paymentMethod === "cod" ? (
                    isFreeShipping ? "FREE (COD ₹29 fee)" : formatPrice(3000)
                  ) : (
                    shipping === 0 ? "FREE" : formatPrice(shipping)
                  )}
                </span>
              </div>
              {paymentMethod === "cod" && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#2C2416]/70">COD handling</span>
                  <span className="font-medium">{formatPrice(2900)}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-1">
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#2C2416]/60">
                  {paymentMethod === "cod" ? "Pay on delivery" : "Pay now"}
                </span>
                <span className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C2416]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info Popup */}
          {showShippingInfo && (
            <div
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#2C2416]/60 backdrop-blur-sm"
              onClick={() => setShowShippingInfo(false)}
            >
              <div
                className="bg-[#F4ECD8] max-w-md w-full rounded-sm shadow-2xl border border-[#B8860B]/30 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-[#1A3D2A] text-[#F4ECD8] px-5 py-4 flex items-center justify-between">
                  <span className="text-[11px] tracking-[0.3em] uppercase font-medium">
                    Honest shipping policy
                  </span>
                  <button
                    onClick={() => setShowShippingInfo(false)}
                    className="text-[#F4ECD8]/60 hover:text-[#F4ECD8] p-1"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <p className="font-[family-name:var(--font-playfair)] italic text-base text-[#2C2416]/85 leading-relaxed">
                    Look, we get it. Trusting a new brand online is hard. COD is your way of saying &ldquo;I&apos;ll believe it when I see it.&rdquo;
                  </p>
                  <p className="text-sm text-[#2C2416]/75 leading-relaxed">
                    But COD has real costs we pay:
                  </p>
                  <ul className="text-sm text-[#2C2416]/75 space-y-1 ml-4 list-disc">
                    <li>Courier charges us extra to collect cash</li>
                    <li>Money takes 7-14 days to come back to us</li>
                    <li>Failed deliveries hurt small brands like ours</li>
                  </ul>
                  <p className="text-sm text-[#2C2416]/75 leading-relaxed">
                    So we add ₹29 extra on COD orders — just to break even. We don&apos;t make money on this. Promise.
                  </p>
                  <p className="text-sm text-[#2C2416]/75 leading-relaxed">
                    If you trust us enough to pay online, we save ₹29 — and pass that saving to you. That&apos;s it.
                  </p>
                  <p className="font-[family-name:var(--font-playfair)] italic text-base text-[#7A8450] pt-2 border-t border-[#2C2416]/10">
                    Either way, we&apos;ll deliver. Made with intention. Always.
                  </p>
                </div>
                <div className="px-6 py-4 bg-[#FBF6E9] border-t border-[#2C2416]/8 flex justify-between">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[#2C2416]/60">
                    <p>Online: ₹30 (or free above ₹599)</p>
                    <p className="mt-1">COD: ₹59 (₹30 + ₹29 handling)</p>
                  </div>
                  <Button
                    onClick={() => setShowShippingInfo(false)}
                    size="sm"
                    className="bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full px-4 text-[10px] tracking-[0.2em] uppercase"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-[#2C2416]/10 px-5 py-4 bg-[#FBF6E9]">
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-[#1A3D2A] hover:bg-[#0F2A1C] text-[#F4ECD8] rounded-full py-6 text-[12px] tracking-[0.2em] uppercase"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : paymentMethod === "cod" ? (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Place Order · {formatPrice(total)} COD
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Pay {formatPrice(total)} Online
                </>
              )}
            </Button>
            <p className="text-[10px] text-center text-[#2C2416]/50 mt-2">
              {paymentMethod === "cod"
                ? "📦 Pay when delivered · 5-10 day delivery"
                : "🔒 256-bit encrypted · UPI · Cards · Net Banking"}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
