"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/types/product";

type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addItem: (product: Product) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: product.id, product, quantity: 1 }];
    });
  };

  const increment = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrement = (id: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totals = useMemo(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
    return { totalQuantity, totalPrice };
  }, [items]);

  const value: CartContextValue = {
    items,
    totalQuantity: totals.totalQuantity,
    totalPrice: totals.totalPrice,
    addItem,
    increment,
    decrement,
    remove,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

