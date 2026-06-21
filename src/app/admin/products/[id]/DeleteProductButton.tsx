"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors disabled:opacity-50">
      <Trash2 size={15} /> {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
