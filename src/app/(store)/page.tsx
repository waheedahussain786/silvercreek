import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import { Product } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featured }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, size_inventory:product_size_inventory(quantity)")
      .eq("is_active", true)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase.from("categories").select("*").order("sort_order").limit(6),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#3D4A1E] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #7B3C8E 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8BC34A 0%, transparent 50%)" }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 sm:py-36">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8BC34A] font-semibold mb-4">New Arrivals</p>
          <h1 className="font-serif text-5xl sm:text-7xl font-light leading-none mb-6">
            Pieces that<br />tell your story
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-10 max-w-md leading-relaxed">
            Handpicked fashion for the modern woman. Curated with care, shipped with love.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-[#3D4A1E] px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#FAF8F5] transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-serif text-3xl text-[#3D4A1E] mb-8">Shop by Category</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="px-5 py-2.5 rounded-full border border-[#3D4A1E] text-sm font-medium text-[#3D4A1E] hover:bg-[#3D4A1E] hover:text-white transition-colors">
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="px-5 py-2.5 rounded-full border border-[#E2DDD7] text-sm font-medium text-[#6B6B6B] hover:border-[#3D4A1E] hover:text-[#3D4A1E] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      {featured && featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-3xl text-[#3D4A1E]">Featured Pieces</h2>
            <Link href="/shop" className="text-sm text-[#7B3C8E] font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
            {(featured as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {(!featured || featured.length === 0) && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
          <p className="font-serif text-3xl text-[#3D4A1E] mb-3">Coming Soon</p>
          <p className="text-[#6B6B6B]">New pieces are on their way. Check back soon!</p>
        </section>
      )}
    </div>
  );
}
