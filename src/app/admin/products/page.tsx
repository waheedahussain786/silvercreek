import { createServiceClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const supabase = await createServiceClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name), size_inventory:product_size_inventory(quantity)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-[#3D4A1E]">Products</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-[#3D4A1E] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#4f6027] transition-colors">
          <Plus size={16} /> New Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2DDD7] overflow-hidden">
        {!products?.length ? (
          <div className="p-12 text-center">
            <p className="text-[#6B6B6B] text-sm mb-4">No products yet.</p>
            <Link href="/admin/products/new" className="text-sm font-semibold text-[#7B3C8E] hover:underline">Create your first product →</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2DDD7]">
                {["Product", "Category", "Price", "Stock", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] px-5 py-3 first:pl-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DDD7]">
              {products.map((p) => {
                const stock = p.has_sizes
                  ? (p.size_inventory as { quantity: number }[]).reduce((s, i) => s + i.quantity, 0)
                  : p.quantity;
                return (
                  <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2DDD7] shrink-0">
                            <Image src={p.images[0]} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E2DDD7] shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-[#2C2C2C]">{p.name}</p>
                          {p.featured && <span className="text-[10px] text-[#7B3C8E] font-semibold">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-[#6B6B6B]">{(p.category as { name: string } | null)?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-[#2C2C2C]">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${stock === 0 ? "bg-red-100 text-red-700" : stock <= 3 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                        {stock === 0 ? "Out of stock" : `${stock} left`}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-[#FAF8F5] text-[#6B6B6B]"}`}>
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/products/${p.id}`} className="p-2 rounded-lg hover:bg-[#FAF8F5] text-[#6B6B6B] hover:text-[#3D4A1E] inline-flex transition-colors">
                        <Pencil size={15} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
