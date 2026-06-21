import { createServiceClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function OrdersPage() {
  const supabase = await createServiceClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-[#3D4A1E] mb-8">Orders</h1>

      <div className="bg-white rounded-2xl border border-[#E2DDD7] overflow-hidden">
        {!orders?.length ? (
          <div className="p-12 text-center">
            <p className="text-[#6B6B6B] text-sm">No orders yet. They'll appear here once customers start purchasing.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2DDD7]">
                {["Date", "Customer", "Items", "Total", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DDD7]">
              {(orders as Order[]).map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="px-5 py-3 text-sm text-[#6B6B6B] whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-[#2C2C2C]">{order.customer_name}</p>
                    <p className="text-xs text-[#6B6B6B]">{order.customer_email}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-[#6B6B6B]">{order.order_items?.length ?? 0}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-[#2C2C2C]">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs text-[#7B3C8E] hover:underline font-semibold">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
