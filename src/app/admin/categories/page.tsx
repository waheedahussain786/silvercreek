"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, X, Check } from "lucide-react";
import { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/categories");
    setCategories(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setName("");
    setDescription("");
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description ?? "");
    setShowForm(true);
  }

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    if (editing) {
      await fetch(`/api/admin/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, sort_order: editing.sort_order }),
      });
    } else {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
    }
    setSaving(false);
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Products in it will become uncategorized.")) return;
    setDeleting(id);
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-[#3D4A1E]">Categories</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#3D4A1E] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#4f6027] transition-colors">
          <Plus size={16} /> New Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#E2DDD7] rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-[#2C2C2C] mb-4">{editing ? "Edit Category" : "New Category"}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-1.5">Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E2DDD7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D4A1E]"
                placeholder="e.g. Tops, Dresses, Accessories"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-1.5">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E2DDD7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D4A1E]"
                placeholder="Optional short description"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={save} disabled={saving || !name.trim()} className="flex items-center gap-2 bg-[#3D4A1E] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4f6027] transition-colors disabled:opacity-50">
                <Check size={15} /> {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={() => setShowForm(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-[#E2DDD7] hover:bg-[#FAF8F5] transition-colors">
                <X size={15} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2DDD7] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-[#6B6B6B]">Loading…</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#6B6B6B] text-sm">No categories yet. Create your first one above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#E2DDD7]">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-4 px-5 py-4">
                <GripVertical size={16} className="text-[#C5C9A8] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#2C2C2C] text-sm">{cat.name}</p>
                  {cat.description && <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">{cat.description}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(cat)} className="p-2 rounded-lg hover:bg-[#FAF8F5] text-[#6B6B6B] hover:text-[#3D4A1E] transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove(cat.id)} disabled={deleting === cat.id} className="p-2 rounded-lg hover:bg-red-50 text-[#6B6B6B] hover:text-red-600 transition-colors disabled:opacity-40">
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
