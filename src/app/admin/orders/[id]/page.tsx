import { createServiceClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import OrderStatusSelect from "./OrderStatusSelect";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServiceClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const addr = order.shipping_address as { line1: string; line2?: string; city: string; state: string; postal_code: string; country: string };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/orders" className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#3D4A1E] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#3D4A1E]">Order</h1>
          <p className="text-xs text-[#6B6B6B] mt-1 font-mono">{order.id}</p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="space-y-5">
        {/* Customer */}
        <div className="bg-white rounded-2xl border border-[#E2DDD7] p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-3">Customer</h2>
          <p className="font-medium text-[#2C2C2C]">{order.customer_name}</p>
          <p className="text-sm text-[#6B6B6B]">{order.customer_email}</p>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-2xl border border-[#E2DDD7] p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-3">Ship To</h2>
          <p className="text-sm text-[#2C2C2C]">{addr.line1}</p>
          {addr.line2 && <p className="text-sm text-[#2C2C2C]">{addr.line2}</p>}
          <p className="text-sm text-[#2C2C2C]">{addr.city}, {addr.state} {addr.postal_code}</p>
          <p className="text-sm text-[#6B6B6B]">{addr.country}</p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-[#E2DDD7] p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-4">Items</h2>
          <div className="space-y-4">
            {order.order_items?.map((item: { id: string; product_name: string; product_image: string | null; size: string | null; quantity: number; unit_price: number; total_price: number }) => (
              <div key={item.id} className="flex items-center gap-4">
                {item.product_image ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E2DDD7] shrink-0">
                    <Image src={item.product_image} alt={item.product_name} width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#E2DDD7] shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C2C2C]">{item.product_name}</p>
                  <p className="text-xs text-[#6B6B6B]">
                    {item.size && `Size: ${item.size} · `}Qty: {item.quantity} · {formatPrice(item.unit_price)} each
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#2C2C2C] shrink-0">{formatPrice(item.total_price)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E2DDD7] mt-5 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-[#6B6B6B]">
              <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#6B6B6B]">
              <span>Shipping</span><span>{order.shipping_rate === 0 ? "Free" : formatPrice(order.shipping_rate)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#2C2C2C]">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#6B6B6B]">
          Placed {new Date(order.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
