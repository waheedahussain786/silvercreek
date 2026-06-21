"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AddToCartSection({ product }: { product: Product }) {
  const { add } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.has_sizes && product.sizes.length > 0 ? null : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const sizeInventory = product.size_inventory ?? [];
  const totalStock = product.has_sizes
    ? sizeInventory.reduce((s, i) => s + i.quantity, 0)
    : product.quantity;

  const selectedSizeStock = product.has_sizes && selectedSize
    ? sizeInventory.find((i) => i.size === selectedSize)?.quantity ?? 0
    : product.quantity;

  function handleAdd() {
    setError("");
    if (product.has_sizes && !selectedSize) { setError("Please select a size."); return; }
    if (totalStock === 0) return;
    add(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (totalStock === 0) return null;

  return (
    <div className="space-y-5">
      {/* Size selector */}
      {product.has_sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">Size</label>
            {selectedSize && <span className="text-xs text-[#6B6B6B]">{selectedSizeStock} in stock</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const inStock = sizeInventory.find((i) => i.size === size)?.quantity ?? 0;
              return (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setError(""); }}
                  disabled={inStock === 0}
                  className={cn(
                    "px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
                    inStock === 0 && "opacity-30 cursor-not-allowed line-through",
                    selectedSize === size
                      ? "bg-[#3D4A1E] text-white border-[#3D4A1E]"
                      : "border-[#E2DDD7] text-[#2C2C2C] hover:border-[#3D4A1E]"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-3 block">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E2DDD7] text-[#6B6B6B] hover:bg-[#FAF8F5] text-lg font-light"
          >−</button>
          <span className="w-8 text-center font-semibold text-[#2C2C2C]">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E2DDD7] text-[#6B6B6B] hover:bg-[#FAF8F5] text-lg font-light"
          >+</button>
        </div>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        className={cn(
          "w-full py-4 rounded-2xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all",
          added
            ? "bg-[#8BC34A] text-white"
            : "bg-[#3D4A1E] text-white hover:bg-[#4f6027]"
        )}
      >
        {added ? <><Check size={16} /> Added to Cart</> : <><ShoppingBag size={16} /> Add to Cart</>}
      </button>
    </div>
  );
}
