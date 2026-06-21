import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug), size_inventory:product_size_inventory(*), product_tags(tags(id,name,slug))")
    .eq("id", id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const body = await request.json();
  const supabase = await createServiceClient();

  const { data: product, error } = await supabase
    .from("products")
    .update({
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
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.has_sizes) {
    await supabase.from("product_size_inventory").delete().eq("product_id", id);
    if (body.size_inventory?.length) {
      const inventory = body.size_inventory.map((s: { size: string; quantity: number }) => ({
        product_id: id,
        size: s.size,
        quantity: s.quantity,
      }));
      await supabase.from("product_size_inventory").insert(inventory);
    }
  }

  // Always sync tags (replace all)
  await supabase.from("product_tags").delete().eq("product_id", id);
  if (body.tag_ids?.length) {
    await supabase.from("product_tags").insert(
      body.tag_ids.map((tag_id: string) => ({ product_id: id, tag_id }))
    );
  }

  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const supabase = await createServiceClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
