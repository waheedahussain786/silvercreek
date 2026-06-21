import { createServiceClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, ClipboardList, AlertTriangle, DollarSign } from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  const supabase = await createServiceClient();

  const [ordersRes, productsRes, revenueRes] = await Promise.all([
    supabase.from("orders").select("id, status, total, customer_name, created_at, order_items(product_name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("products").select("id, name, quantity, has_sizes, is_active, size_inventory:product_size_inventory(quantity)"),
    supabase.from("orders").select("total").eq("status", "paid"),
  ]);

  const lowStock = (productsRes.data ?? []).filter((p) => {
    if (!p.is_active) return false;
    if (p.has_sizes) {
      const total = (p.size_inventory as { quantity: number }[]).reduce((s, i) => s + i.quantity, 0);
      return total <= 3;
    }
    return p.quantity <= 3;
  });

  const revenue = (revenueRes.data ?? []).reduce((s, o) => s + Number(o.total), 0);

  return {
    recentOrders: ordersRes.data ?? [],
    lowStock,
    revenue,
    totalProducts: productsRes.data?.length ?? 0,
  };
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function AdminDashboard() {
  const { recentOrders, lowStock, revenue, totalProducts } = await getDashboardData();

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl text-[#3D4A1E] mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Revenue", value: formatPrice(revenue), icon: DollarSign, color: "text-[#3D4A1E]" },
          { label: "Total Products", value: totalProducts, icon: ShoppingBag, color: "text-[#7B3C8E]" },
          { label: "Recent Orders", value: recentOrders.length, icon: ClipboardList, color: "text-[#3D4A1E]" },
          { label: "Low Stock", value: lowStock.length, icon: AlertTriangle, color: lowStock.length > 0 ? "text-red-500" : "text-[#6B6B6B]" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E2DDD7] p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">{label}</p>
              <Icon size={16} className={color} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E2DDD7] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#2C2C2C]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[#7B3C8E] hover:underline">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-[#6B6B6B]">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF8F5] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#2C2C2C]">{order.customer_name}</p>
                    <p className="text-xs text-[#6B6B6B]">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-semibold text-[#3D4A1E]">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E2DDD7] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#2C2C2C]">Low Stock Alerts</h2>
            <Link href="/admin/products" className="text-xs text-[#7B3C8E] hover:underline">Manage</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-[#6B6B6B]">All products are well stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => {
                const total = p.has_sizes
                  ? (p.size_inventory as { quantity: number }[]).reduce((s, i) => s + i.quantity, 0)
                  : p.quantity;
                return (
                  <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF8F5] transition-colors">
                    <p className="text-sm font-medium text-[#2C2C2C]">{p.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${total === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                      {total === 0 ? "Out of stock" : `${total} left`}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
