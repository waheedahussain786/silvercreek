"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { Category, Product } from "@/lib/types";

interface SizeRow { size: string; quantity: number; }

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

interface Props {
  categories: Category[];
  product?: Product;
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [compareAt, setCompareAt] = useState(product?.compare_at_price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [hasSizes, setHasSizes] = useState(product?.has_sizes ?? false);
  const [quantity, setQuantity] = useState(product?.quantity?.toString() ?? "0");
  const [sizeRows, setSizeRows] = useState<SizeRow[]>(
    product?.size_inventory?.map((s) => ({ size: s.size, quantity: s.quantity })) ??
    DEFAULT_SIZES.map((s) => ({ size: s, quantity: 0 }))
  );
  const [customSize, setCustomSize] = useState("");

  function addCustomSize() {
    const s = customSize.trim().toUpperCase();
    if (!s || sizeRows.find((r) => r.size === s)) return;
    setSizeRows([...sizeRows, { size: s, quantity: 0 }]);
    setCustomSize("");
  }

  function updateSizeQty(idx: number, qty: number) {
    setSizeRows(sizeRows.map((r, i) => i === idx ? { ...r, quantity: qty } : r));
  }

  function removeSize(idx: number) {
    setSizeRows(sizeRows.filter((_, i) => i !== idx));
  }

  async function save() {
    if (!name.trim() || !price) { setError("Name and price are required."); return; }
    setSaving(true);
    setError("");

    const payload = {
      name,
      description,
      price: parseFloat(price),
      compare_at_price: compareAt ? parseFloat(compareAt) : null,
      category_id: categoryId || null,
      images,
      is_active: isActive,
      featured,
      has_sizes: hasSizes,
      sizes: hasSizes ? sizeRows.map((r) => r.size) : [],
      quantity: hasSizes ? 0 : parseInt(quantity),
      size_inventory: hasSizes ? sizeRows : [],
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const { error: msg } = await res.json();
      setError(msg ?? "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-[#E2DDD7] p-6 space-y-5">
        <h2 className="font-semibold text-[#2C2C2C]">Basic Info</h2>
        <div>
          <label className="field-label">Product Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="field-input" placeholder="e.g. Floral Sundress" />
        </div>
        <div>
          <label className="field-label">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="field-input resize-none" placeholder="Describe the product…" />
        </div>
        <div>
          <label className="field-label">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="field-input">
            <option value="">— No category —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-2xl border border-[#E2DDD7] p-6 space-y-5">
        <h2 className="font-semibold text-[#2C2C2C]">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Price *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] text-sm">$</span>
              <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="field-input pl-7" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="field-label">Compare-at Price <span className="normal-case font-normal">(optional, shows crossed out)</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] text-sm">$</span>
              <input type="number" min="0" step="0.01" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} className="field-input pl-7" placeholder="0.00" />
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-[#E2DDD7] p-6 space-y-4">
        <h2 className="font-semibold text-[#2C2C2C]">Photos</h2>
        <ImageUpload images={images} onChange={setImages} />
      </div>

      {/* Inventory */}
      <div className="bg-white rounded-2xl border border-[#E2DDD7] p-6 space-y-5">
        <h2 className="font-semibold text-[#2C2C2C]">Inventory</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={hasSizes} onChange={(e) => setHasSizes(e.target.checked)} className="w-4 h-4 accent-[#3D4A1E]" />
          <span className="text-sm font-medium text-[#2C2C2C]">This product has sizes</span>
        </label>

        {hasSizes ? (
          <div className="space-y-3">
            {sizeRows.map((row, idx) => (
              <div key={row.size} className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#2C2C2C] w-12">{row.size}</span>
                <input
                  type="number" min="0"
                  value={row.quantity}
                  onChange={(e) => updateSizeQty(idx, parseInt(e.target.value) || 0)}
                  className="field-input w-28"
                  placeholder="Qty"
                />
                <span className="text-xs text-[#6B6B6B]">in stock</span>
                <button type="button" onClick={() => removeSize(idx)} className="ml-auto p-1.5 rounded-lg hover:bg-red-50 text-[#6B6B6B] hover:text-red-600">
                  <X size={14} />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <input
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSize())}
                className="field-input w-28"
                placeholder="Custom size"
              />
              <button type="button" onClick={addCustomSize} className="flex items-center gap-1.5 text-xs text-[#7B3C8E] hover:underline font-semibold">
                <Plus size={13} /> Add size
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className="field-label">Quantity in Stock</label>
            <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="field-input w-40" />
          </div>
        )}
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-2xl border border-[#E2DDD7] p-6 space-y-4">
        <h2 className="font-semibold text-[#2C2C2C]">Visibility</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#3D4A1E]" />
          <span className="text-sm text-[#2C2C2C]">Visible in shop</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-[#3D4A1E]" />
          <span className="text-sm text-[#2C2C2C]">Featured on homepage</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={save} disabled={saving} className="bg-[#3D4A1E] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#4f6027] transition-colors disabled:opacity-50">
          {saving ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="px-6 py-3 rounded-xl text-sm font-medium border border-[#E2DDD7] hover:bg-[#FAF8F5] transition-colors">
          Cancel
        </button>
      </div>

      <style>{`
        .field-label { display: block; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #6B6B6B; margin-bottom: 0.375rem; }
        .field-input { width: 100%; padding: 0.625rem 1rem; border: 1px solid #E2DDD7; border-radius: 0.75rem; font-size: 0.875rem; outline: none; background: #FAF8F5; }
        .field-input:focus { box-shadow: 0 0 0 2px #3D4A1E; border-color: transparent; }
      `}</style>
    </div>
  );
}
