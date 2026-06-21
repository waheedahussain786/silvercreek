import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const totalStock = product.has_sizes
    ? (product.size_inventory ?? []).reduce((s, i) => s + i.quantity, 0)
    : product.quantity;

  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#EDE9E3] mb-3.5">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#C5C9A8]" />
          </div>
        )}

        {/* Overlays */}
        {totalStock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6B6B6B]">Sold Out</span>
          </div>
        )}
        {onSale && totalStock > 0 && (
          <span className="absolute top-3 left-3 bg-[#7B3C8E] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
            Sale
          </span>
        )}
      </div>

      <div className="px-0.5">
        <p className="text-sm font-medium text-[#2C2C2C] group-hover:text-[#3D4A1E] transition-colors leading-snug mb-1">
          {product.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#3D4A1E]">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-xs text-[#6B6B6B] line-through">{formatPrice(product.compare_at_price!)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
