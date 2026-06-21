import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { items } = await request.json();
  if (!items?.length) return NextResponse.json({ error: "No items" }, { status: 400 });

  const supabase = await createClient();
  const { data: settings } = await supabase.from("store_settings").select("shipping_rate, free_shipping_threshold").single();

  const subtotal = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
  const shippingRate = settings?.free_shipping_threshold && subtotal >= settings.free_shipping_threshold
    ? 0
    : (settings?.shipping_rate ?? 8);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item: { name: string; price: number; image: string | null; size: string | null; quantity: number }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.size ? `${item.name} — Size ${item.size}` : item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    shipping_address_collection: { allowed_countries: ["US"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: Math.round(shippingRate * 100), currency: "usd" },
          display_name: shippingRate === 0 ? "Free Shipping" : "Standard Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
    ],
    success_url: `${siteUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/shop`,
    metadata: {
      items: JSON.stringify(items.map((i: { product_id: string; size: string | null; quantity: number; price: number; name: string; image: string | null }) => ({
        product_id: i.product_id,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
        name: i.name,
        image: i.image,
      }))),
    },
  });

  return NextResponse.json({ url: session.url });
}
