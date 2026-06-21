"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CartItem, Product } from "./types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  add: (product: Product, size: string | null, quantity: number) => void;
  remove: (productId: string, size: string | null) => void;
  updateQty: (productId: string, size: string | null, quantity: number) => void;
  clear: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("scb_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("scb_cart", JSON.stringify(items));
  }, [items]);

  const key = (productId: string, size: string | null) => `${productId}__${size ?? ""}`;

  const add = useCallback((product: Product, size: string | null, quantity: number) => {
    setItems((prev) => {
      const k = key(product.id, size);
      const existing = prev.find((i) => key(i.product.id, i.size) === k);
      if (existing) {
        return prev.map((i) => key(i.product.id, i.size) === k ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, size, quantity }];
    });
  }, []);

  const remove = useCallback((productId: string, size: string | null) => {
    setItems((prev) => prev.filter((i) => key(i.product.id, i.size) !== key(productId, size)));
  }, []);

  const updateQty = useCallback((productId: string, size: string | null, quantity: number) => {
    if (quantity <= 0) { remove(productId, size); return; }
    setItems((prev) => prev.map((i) => key(i.product.id, i.size) === key(productId, size) ? { ...i, quantity } : i));
  }, [remove]);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, add, remove, updateQty, clear, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
