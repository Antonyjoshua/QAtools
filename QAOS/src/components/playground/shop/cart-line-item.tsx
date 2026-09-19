"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CartLine } from "@/lib/playground/shop/hooks/use-cart";

interface Props {
  line: CartLine;
  unitPrice: number;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

export function CartLineItem({ line, unitPrice, onUpdateQuantity, onRemove }: Props) {
  const { item, product } = line;
  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-0">
      <div className="flex size-12 items-center justify-center rounded-md bg-muted text-2xl">
        {product.emoji}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{product.name}</div>
        <div className="text-xs text-muted-foreground">${unitPrice.toFixed(2)} each</div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="icon-sm"
          variant="outline"
          aria-label="Decrease quantity"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="size-3.5" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
          className="h-7 w-14 text-center"
        />
        <Button
          size="icon-sm"
          variant="outline"
          aria-label="Increase quantity"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>
      <div className="w-16 text-right text-sm font-semibold">
        ${(unitPrice * item.quantity).toFixed(2)}
      </div>
      <Button size="icon-sm" variant="ghost" aria-label="Remove item" onClick={() => onRemove(item.id)}>
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}
