"use client";

import { useState } from "react";
import { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "cancelled"];

const COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [saving, setSaving] = useState(false);

  async function update(newStatus: OrderStatus) {
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setStatus(newStatus);
    setSaving(false);
  }

  return (
    <div className="flex items-center gap-2">
      {saving && <span className="text-xs text-[#6B6B6B]">Saving…</span>}
      <select
        value={status}
        onChange={(e) => update(e.target.value as OrderStatus)}
        disabled={saving}
        className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${COLORS[status]}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
    </div>
  );
}
