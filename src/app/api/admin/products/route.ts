import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  await requireAuth();
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug), size_inventory:product_size_inventory(*)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  await requireAuth();
  const body = await request.json();
  const supabase = await createServiceClient();

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      category_id: body.category_id || null,
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || null,
      price: body.price,
      compare_at_price: body.compare_at_price || null,
      images: body.images || [],
      has_sizes: body.has_sizes ?? false,
      sizes: body.sizes || [],
      quantity: body.has_sizes ? 0 : (body.quantity ?? 0),
      is_active: body.is_active ?? true,
      featured: body.featured ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.has_sizes && body.size_inventory?.length) {
    const inventory = body.size_inventory.map((s: { size: string; quantity: number }) => ({
      product_id: product.id,
      size: s.size,
      quantity: s.quantity,
    }));
    await supabase.from("product_size_inventory").insert(inventory);
  }

  return NextResponse.json(product, { status: 201 });
}
