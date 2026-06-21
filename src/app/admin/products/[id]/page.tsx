import { createServiceClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import DeleteProductButton from "./DeleteProductButton";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServiceClient();

  const [{ data: product }, { data: categories }, { data: tags }] = await Promise.all([
    supabase
      .from("products")
      .select("*, size_inventory:product_size_inventory(*), product_tags(tags(id, name, slug))")
      .eq("id", id)
      .single(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("tags").select("*").order("name"),
  ]);

  if (!product) notFound();

  const productWithTags = {
    ...product,
    tags: (product.product_tags ?? []).map((pt: { tags: { id: string; name: string; slug: string } | null }) => pt.tags).filter(Boolean),
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/products" className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#3D4A1E] transition-colors">
          <ChevronLeft size={16} /> Back to Products
        </Link>
        <DeleteProductButton id={id} name={product.name} />
      </div>
      <h1 className="font-serif text-3xl text-[#3D4A1E] mb-8">Edit Product</h1>
      <ProductForm categories={categories ?? []} allTags={tags ?? []} product={productWithTags} />
    </div>
  );
}
