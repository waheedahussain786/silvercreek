"use client";

import { useEffect, useRef, useState } from "react";
import { X, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, remove, updateQty, subtotal, clear } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleCheckout() {
    if (!items.length) return;
    setCheckingOut(true);
    setError("");
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          product_id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          image: i.product.images[0] ?? null,
          size: i.size,
          quantity: i.quantity,
        })),
      }),
    });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      setError("Couldn't start checkout. Please try again.");
      setCheckingOut(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2DDD7]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#3D4A1E]" />
            <h2 className="font-semibold text-[#2C2C2C]">Your Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#FAF8F5] text-[#6B6B6B]">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <ShoppingBag size={40} className="text-[#C5C9A8]" />
              <p className="text-sm text-[#6B6B6B]">Your cart is empty.</p>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={`${item.product.id}-${item.size}`} className="flex gap-4">
                  {item.product.images[0] ? (
                    <div className="w-18 h-18 rounded-xl overflow-hidden border border-[#E2DDD7] shrink-0 w-[72px] h-[72px]">
                      <Image src={item.product.images[0]} alt={item.product.name} width={72} height={72} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-xl bg-[#FAF8F5] border border-[#E2DDD7] shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2C2C2C] leading-tight">{item.product.name}</p>
                    {item.size && <p className="text-xs text-[#6B6B6B] mt-0.5">Size: {item.size}</p>}
                    <p className="text-sm font-semibold text-[#3D4A1E] mt-1">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.product.id, item.size, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E2DDD7] hover:bg-[#FAF8F5] text-[#6B6B6B]">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.size, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E2DDD7] hover:bg-[#FAF8F5] text-[#6B6B6B]">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => remove(item.product.id, item.size)} className="ml-auto text-xs text-[#6B6B6B] hover:text-red-600 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E2DDD7] p-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B6B6B]">Subtotal</span>
              <span className="font-semibold text-[#2C2C2C]">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-[#6B6B6B]">Shipping calculated at checkout.</p>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-[#3D4A1E] text-white py-3.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-[#4f6027] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {checkingOut ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : "Checkout"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
