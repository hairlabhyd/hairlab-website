"use client";

import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import Link from "next/link";

interface AddToCartButtonProps {
  product: {
    id: string;
    slug: string;
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
    <div className="flex items-center gap-2">
      {/* View Details button */}
      <Button
        asChild
        size="sm"
        variant="outline"
        className="border-[#2C2416]/20 text-[#2C2416] hover:bg-[#2C2416]/5 rounded-full px-3 text-[10px] tracking-[0.15em] uppercase"
      >
        <Link href={`/product/${product.slug}`}>
          <Eye className="h-3 w-3 mr-1" />
          View
        </Link>
      </Button>

      {/* Add to Cart button */}
      <Button
        onClick={() => {
          addItem({
            id: product.id,
            slug: product.slug,
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
    </div>
  );
}
