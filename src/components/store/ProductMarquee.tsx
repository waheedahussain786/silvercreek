import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/types";

interface Props {
  products: Product[];
}

function MarqueeCard({ product }: { product: Product }) {
  const totalStock = product.has_sizes
    ? (product.size_inventory ?? []).reduce((s, i) => s + i.quantity, 0)
    : product.quantity;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group shrink-0 w-52 mx-3 block"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#EDE9E3] mb-3">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-[#C5C9A8]" />
          </div>
        )}
        {totalStock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B6B6B]">Sold Out</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-white leading-snug truncate group-hover:text-[#8BC34A] transition-colors">
        {product.name}
      </p>
      <p className="text-sm font-bold text-[#8BC34A] mt-0.5">{formatPrice(product.price)}</p>
    </Link>
  );
}

export default function ProductMarquee({ products }: Props) {
  if (products.length < 4) return null;

  const scrolling = products.length >= 10;
  const filled = scrolling ? [...products, ...products] : products;

  return (
    <section className="bg-[#3D4A1E] py-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8BC34A] font-semibold mb-2">
            Just added
          </p>
          <h2 className="font-serif text-4xl text-white font-light">New in the Shop</h2>
        </div>
        <Link
          href="/shop"
          className="text-sm font-semibold text-white/60 hover:text-white transition-colors hidden sm:block"
        >
          View all →
        </Link>
      </div>

      {scrolling ? (
        /* Animated marquee — 10+ products */
        <div className="marquee-track relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
            style={{ background: "linear-gradient(to right, #3D4A1E, transparent)" }} />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
            style={{ background: "linear-gradient(to left, #3D4A1E, transparent)" }} />
          <div className="flex animate-marquee w-max">
            {filled.map((product, i) => (
              <MarqueeCard key={`${product.id}-${i}`} product={product} />
            ))}
          </div>
        </div>
      ) : (
        /* Static row — 4–9 products, no scroll */
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {products.map((product) => (
              <MarqueeCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 sm:hidden">
        <Link href="/shop" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">
          View all →
        </Link>
      </div>
    </section>
  );
}
