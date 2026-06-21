import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  await requireAuth();
  const supabase = await createServiceClient();

  const [{ data: cats, error }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("category_id").eq("is_active", true),
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const countMap: Record<string, number> = {};
  products?.forEach((p) => {
    if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
  });

  return NextResponse.json(
    (cats ?? []).map((c) => ({ ...c, product_count: countMap[c.id] || 0 }))
  );
}

export async function POST(request: NextRequest) {
  await requireAuth();
  const body = await request.json();
  const supabase = await createServiceClient();

  const { data: last } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || null,
      sort_order: (last?.sort_order ?? -1) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
