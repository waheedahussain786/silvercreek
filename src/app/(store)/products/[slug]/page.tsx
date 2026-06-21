import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AddToCartSection from "./AddToCartSection";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug), size_inventory:product_size_inventory(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const totalStock = product.has_sizes
    ? product.size_inventory.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0)
    : product.quantity;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#3D4A1E] mb-8 transition-colors">
        <ChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F0EDE8] relative">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#C5C9A8]">No image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((url: string, i: number) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[#F0EDE8] relative">
                  <Image src={url} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-24 self-start">
          {product.category && (
            <Link href={`/shop?category=${(product.category as { slug: string }).slug}`} className="text-xs text-[#7B3C8E] font-semibold uppercase tracking-widest hover:underline">
              {(product.category as { name: string }).name}
            </Link>
          )}

          <h1 className="font-serif text-4xl text-[#2C2C2C] mt-2 mb-3 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-[#3D4A1E]">{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-base text-[#6B6B6B] line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>

          {totalStock === 0 && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
              This item is currently sold out.
            </div>
          )}

          <AddToCartSection product={product} />

          {product.description && (
            <div className="mt-8 pt-8 border-t border-[#E2DDD7]">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-3">Details</h2>
              <p className="text-sm text-[#2C2C2C] leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-[#E2DDD7] space-y-3">
            {[
              "Handmade — no duplicates",
              "Secure checkout via Stripe",
              "Ships within 2–5 business days",
            ].map((line) => (
              <p key={line} className="text-xs text-[#6B6B6B] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] shrink-0" />
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
