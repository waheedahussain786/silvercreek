import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import { Product, Category } from "@/lib/types";

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
    supabase.from("categories").select("*").order("sort_order").limit(8),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#3D4A1E] text-white overflow-hidden min-h-[520px] flex items-center">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 20% 60%, #7B3C8E 0%, transparent 55%), radial-gradient(ellipse at 85% 10%, #8BC34A 0%, transparent 45%)",
            }}
          />
          {/* Decorative floral rings */}
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/5" />
          <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full border border-white/5" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full border border-white/5" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="max-w-xl">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#8BC34A] font-semibold mb-5">
              Silver Creek Boutique
            </p>
            <h1 className="font-serif text-5xl sm:text-[4.5rem] font-light leading-[1.05] mb-6">
              Style that feels<br />like you
            </h1>
            <p className="text-white/65 text-base sm:text-lg mb-10 leading-relaxed">
              Handpicked fashion, curated for the modern woman. Every piece chosen with care.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-block bg-white text-[#3D4A1E] px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#FAF8F5] transition-colors"
              >
                Shop the Collection
              </Link>
              <Link
                href="/about"
                className="inline-block border border-white/30 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:border-white/60 transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      {categories && categories.length > 0 && (
        <section className="bg-white border-b border-[#E2DDD7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-1">
              <Link
                href="/shop"
                className="shrink-0 px-5 py-2 rounded-full bg-[#3D4A1E] text-white text-sm font-medium"
              >
                All
              </Link>
              {(categories as Category[]).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="shrink-0 px-5 py-2 rounded-full border border-[#E2DDD7] text-[#2C2C2C] text-sm font-medium hover:border-[#3D4A1E] hover:text-[#3D4A1E] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      {featured && featured.length > 0 ? (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B3C8E] font-semibold mb-2">Handpicked for you</p>
              <h2 className="font-serif text-4xl text-[#3D4A1E]">Featured Pieces</h2>
            </div>
            <Link href="/shop" className="text-sm text-[#7B3C8E] font-semibold hover:underline hidden sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-7">
            {(featured as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <Link href="/shop" className="text-sm text-[#7B3C8E] font-semibold hover:underline">
              View all →
            </Link>
          </div>
        </section>
      ) : (
        /* No featured products — show a simple shop CTA */
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B3C8E] font-semibold mb-3">New Arrivals</p>
          <h2 className="font-serif text-4xl text-[#3D4A1E] mb-4">Browse the Collection</h2>
          <p className="text-[#6B6B6B] mb-8 max-w-sm mx-auto">
            Discover handpicked pieces curated just for you.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#3D4A1E] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#4f6027] transition-colors"
          >
            Shop Now
          </Link>
        </section>
      )}

      {/* Brand strip */}
      <section className="bg-[#7B3C8E] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8 text-center sm:text-left">
            {[
              { label: "Free Returns", body: "Easy 14-day returns on all orders." },
              { label: "Secure Checkout", body: "Payments powered by Stripe." },
              { label: "Ships Fast", body: "Orders ship within 2–4 business days." },
            ].map(({ label, body }) => (
              <div key={label} className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-[#8BC34A] mt-1.5 shrink-0 hidden sm:block" />
                <div>
                  <p className="font-semibold text-sm mb-1">{label}</p>
                  <p className="text-white/65 text-sm">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
