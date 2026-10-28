"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useSyncExternalStore } from "react";

// Subscribe to cart items so we re-render on cart change
function useCartCount() {
  return useSyncExternalStore(
    (callback) => {
      const unsub = useCart.subscribe(callback);
      return unsub;
    },
    () => useCart.getState().items.reduce((sum, i) => sum + i.quantity, 0),
    () => 0 // SSR snapshot
  );
}

export function CartButton() {
  const toggleCart = useCart((s) => s.toggleCart);
  const count = useCartCount();

  return (
    <Button
      onClick={toggleCart}
      className="relative bg-[#F4ECD8] hover:bg-[#F4ECD8]/85 text-[#1A3D2A] rounded-full px-4 sm:px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-medium"
      aria-label="Open cart"
    >
      <ShoppingBag className="h-3.5 w-3.5 sm:mr-1.5" />
      <span className="hidden sm:inline">
        Cart{count > 0 ? ` · ${count}` : ""}
      </span>
      {count > 0 && (
        <span className="sm:hidden ml-1 bg-[#B8553C] text-[#F4ECD8] rounded-full h-4 min-w-4 px-1 text-[10px] flex items-center justify-center">
          {count}
        </span>
      )}
    </Button>
  );
}
