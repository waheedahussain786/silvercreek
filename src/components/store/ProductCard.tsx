import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const totalStock = product.has_sizes
    ? (product.size_inventory ?? []).reduce((s, i) => s + i.quantity, 0)
    : product.quantity;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F0EDE8] mb-4">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#C5C9A8]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </div>
        )}
        {totalStock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">Sold Out</span>
          </div>
        )}
        {product.compare_at_price && product.compare_at_price > product.price && (
          <div className="absolute top-3 left-3 bg-[#7B3C8E] text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide">
            Sale
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-[#2C2C2C] group-hover:text-[#3D4A1E] transition-colors leading-tight">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-[#3D4A1E]">{formatPrice(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xs text-[#6B6B6B] line-through">{formatPrice(product.compare_at_price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
