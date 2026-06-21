import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  await requireAuth();
  const supabase = await createServiceClient();
  const { data, error } = await supabase.from("store_settings").select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  await requireAuth();
  const body = await request.json();
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("store_settings")
    .update({
      shipping_rate: body.shipping_rate,
      free_shipping_threshold: body.free_shipping_threshold || null,
      store_announcement: body.store_announcement || null,
    })
    .eq("id", 1)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
