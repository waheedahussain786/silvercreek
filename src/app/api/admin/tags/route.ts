import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  await requireAuth();
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  await requireAuth();
  const body = await request.json();
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("tags")
    .insert({
      name: body.name,
      slug: body.slug || slugify(body.name),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
