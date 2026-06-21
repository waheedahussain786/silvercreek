"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, X, Check, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Category } from "@/lib/types";

type CategoryWithCount = Category & { product_count: number };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [confirmHide, setConfirmHide] = useState<CategoryWithCount | null>(null);

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

  function requestToggle(cat: CategoryWithCount) {
    if (cat.is_active && cat.product_count > 0) {
      setConfirmHide(cat);
    } else {
      doToggle(cat);
    }
  }

  async function doToggle(cat: CategoryWithCount) {
    setConfirmHide(null);
    setToggling(cat.id);
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: cat.name,
        description: cat.description,
        sort_order: cat.sort_order,
        is_active: !cat.is_active,
      }),
    });
    setToggling(null);
    load();
  }

  return (
    <div className="max-w-2xl">
      {/* Confirm hide modal */}
      {confirmHide && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={17} className="text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-[#2C2C2C] text-sm mb-1">Hide &ldquo;{confirmHide.name}&rdquo;?</p>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  This category has {confirmHide.product_count} {confirmHide.product_count === 1 ? "product" : "products"}.
                  Hiding it will also hide {confirmHide.product_count === 1 ? "that product" : "those products"} from the shop.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmHide(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-[#E2DDD7] hover:bg-[#FAF8F5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => doToggle(confirmHide)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
              >
                Hide Category
              </button>
            </div>
          </div>
        </div>
      )}

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
                placeholder="e.g. Printing, Engraving, Art"
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
              <li key={cat.id} className={`flex items-center gap-4 px-5 py-4 transition-opacity ${!cat.is_active ? "opacity-50" : ""}`}>
                <GripVertical size={16} className="text-[#C5C9A8] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-[#2C2C2C] text-sm">{cat.name}</p>
                    {!cat.is_active && (
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B6B6B] bg-[#F0EDE8] px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                    {cat.product_count > 0 && (
                      <span className="text-[10px] font-semibold text-[#7B3C8E] bg-purple-50 px-2 py-0.5 rounded-full">
                        {cat.product_count} {cat.product_count === 1 ? "product" : "products"}
                      </span>
                    )}
                  </div>
                  {cat.description && (
                    <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">{cat.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => requestToggle(cat)}
                    disabled={toggling === cat.id}
                    title={cat.is_active ? "Hide from shop" : "Show in shop"}
                    className="p-2 rounded-lg hover:bg-[#FAF8F5] text-[#6B6B6B] hover:text-[#3D4A1E] transition-colors disabled:opacity-40"
                  >
                    {cat.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 rounded-lg hover:bg-[#FAF8F5] text-[#6B6B6B] hover:text-[#3D4A1E] transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(cat.id)}
                    disabled={deleting === cat.id}
                    className="p-2 rounded-lg hover:bg-red-50 text-[#6B6B6B] hover:text-red-600 transition-colors disabled:opacity-40"
                  >
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
