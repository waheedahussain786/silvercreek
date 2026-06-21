import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/store/ProductCard";
import Link from "next/link";
import { Product, Category } from "@/lib/types";

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const supabase = await createClient();

  const [{ data: categories }, productsRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    (async () => {
      let query = supabase
        .from("products")
        .select("*, category:categories(id,name,slug), size_inventory:product_size_inventory(quantity)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (category) {
        const { data: cat } = await supabase.from("categories").select("id").eq("slug", category).single();
        if (cat) query = query.eq("category_id", cat.id);
      }
      return query;
    })(),
  ]);

  const products = productsRes.data as Product[];
  const activeCategory = (categories as Category[] | null)?.find((c) => c.slug === category);

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-[#E2DDD7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="font-serif text-4xl text-[#3D4A1E] mb-6">
            {activeCategory ? activeCategory.name : "Shop All"}
          </h1>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/shop"
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? "bg-[#3D4A1E] text-white"
                  : "border border-[#E2DDD7] text-[#6B6B6B] hover:border-[#3D4A1E] hover:text-[#3D4A1E]"
              }`}
            >
              All
            </Link>
            {(categories as Category[] | null)?.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.slug
                    ? "bg-[#3D4A1E] text-white"
                    : "border border-[#E2DDD7] text-[#6B6B6B] hover:border-[#3D4A1E] hover:text-[#3D4A1E]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {products?.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#3D4A1E] mb-2">Nothing in this category yet</p>
            <p className="text-sm text-[#6B6B6B] mb-6">Browse our full collection instead.</p>
            <Link
              href="/shop"
              className="inline-block bg-[#3D4A1E] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#4f6027] transition-colors"
            >
              View All
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#6B6B6B] mb-8 uppercase tracking-widest font-medium">
              {products?.length} {products?.length === 1 ? "item" : "items"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
