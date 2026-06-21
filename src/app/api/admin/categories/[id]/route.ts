import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const body = await request.json();
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || null,
      sort_order: body.sort_order,
      ...(body.is_active !== undefined && { is_active: body.is_active }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const supabase = await createServiceClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
