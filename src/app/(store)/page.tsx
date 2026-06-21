import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import { Product, Category } from "@/lib/types";

export const revalidate = 60;

const ETSY_URL = "https://www.etsy.com/shop/silvercreskboutique/";
const INSTAGRAM_URL = "https://www.instagram.com/silvercreekboutique";
const TIKTOK_URL = "https://www.tiktok.com/@humanitysaveslives7";
const YOUTUBE_URL = "https://www.youtube.com/@silvercreekboutique";

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
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/5" />
          <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full border border-white/5" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full border border-white/5" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="max-w-xl">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#8BC34A] font-semibold mb-5">
              Handmade with love
            </p>
            <h1 className="font-serif text-5xl sm:text-[4.5rem] font-light leading-[1.05] mb-6">
              Art made by hand,<br />given with heart
            </h1>
            <p className="text-white/65 text-base sm:text-lg mb-10 leading-relaxed">
              Every piece is handcrafted and one-of-a-kind. Browse our collection or visit us on Etsy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-block bg-white text-[#3D4A1E] px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#FAF8F5] transition-colors"
              >
                Shop the Collection
              </Link>
              <a
                href={ETSY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:border-white/60 transition-colors"
              >
                <EtsyIcon />
                Visit our Etsy
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Category pills */}
      {categories && categories.length > 0 && (
        <section className="bg-white border-b border-[#E2DDD7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex items-center gap-4 overflow-x-auto pb-1">
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
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B3C8E] font-semibold mb-2">
                Handcrafted goods
              </p>
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
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B3C8E] font-semibold mb-3">Handcrafted goods</p>
          <h2 className="font-serif text-4xl text-[#3D4A1E] mb-4">Browse the Collection</h2>
          <p className="text-[#6B6B6B] mb-8 max-w-sm mx-auto">
            Discover handmade art and goods, each piece uniquely crafted.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#3D4A1E] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#4f6027] transition-colors"
          >
            Shop Now
          </Link>
        </section>
      )}

      {/* Find us online */}
      <section className="bg-[#FAF8F5] border-t border-[#E2DDD7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B3C8E] font-semibold mb-2">Follow along</p>
              <h2 className="font-serif text-3xl text-[#3D4A1E] mb-1">Find us online</h2>
              <p className="text-sm text-[#6B6B6B]">Shop, watch, and connect with us across platforms.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={ETSY_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#F1641E] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#d95a1a] transition-colors">
                <EtsyIcon /> Etsy
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#E1306C] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#c42d61] transition-colors">
                <InstagramIcon /> Instagram
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#010101] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#2c2c2c] transition-colors">
                <TikTokIcon /> TikTok
              </a>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#FF0000] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#cc0000] transition-colors">
                <YouTubeIcon /> YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="bg-[#7B3C8E] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8 text-center sm:text-left">
            {[
              { label: "Handmade", body: "Every item is crafted by hand with care and intention." },
              { label: "One of a kind", body: "Limited pieces — when it's gone, it's gone." },
              { label: "Secure Checkout", body: "Safe, easy payment powered by Stripe." },
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

function EtsyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.225 0C4.608 0 0 4.608 0 10.225c0 5.616 4.608 10.224 10.225 10.224 5.617 0 10.225-4.608 10.225-10.224C20.45 4.608 15.842 0 10.225 0zm-.01 3.388c.505 0 .91.406.91.91v.682h1.365c.504 0 .91.405.91.909s-.406.91-.91.91H11.12v3.41h1.593c.504 0 .91.406.91.91s-.406.91-.91.91H11.12v3.638h1.593c.504 0 .91.406.91.91s-.406.91-.91.91H9.76a.91.91 0 01-.91-.91V4.298c0-.504.406-.91.91-.91h.455z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
    </svg>
  );
}
