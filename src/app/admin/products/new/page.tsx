import { createServiceClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProductPage() {
  const supabase = await createServiceClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#3D4A1E] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to Products
      </Link>
      <h1 className="font-serif text-3xl text-[#3D4A1E] mb-8">New Product</h1>
      <ProductForm categories={categories ?? []} />
    </div>
  );
}
