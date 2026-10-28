"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    subtitle: string;
    price: number;
    image: string;
    accentFrom: string;
    accentTo: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCart((s) => s.addItem);

  return (
    <Button
      onClick={() => {
        addItem({
          id: product.id,
          slug: product.id,
          name: product.name,
          subtitle: product.subtitle,
          price: product.price,
          image: product.image,
          accentFrom: product.accentFrom,
          accentTo: product.accentTo,
        });
        toast.success(`${product.name} added to cart 🍃`);
      }}
      size="sm"
      className="bg-[#B8553C] hover:bg-[#8C3A24] text-[#F4ECD8] rounded-full px-4 text-[11px] tracking-[0.15em] uppercase"
    >
      <Plus className="h-3.5 w-3.5 mr-1" />
      Add
    </Button>
  );
}
