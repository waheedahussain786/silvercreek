"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { StoreSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [shippingRate, setShippingRate] = useState("");
  const [freeThreshold, setFreeThreshold] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s: StoreSettings) => {
        setSettings(s);
        setShippingRate(s.shipping_rate.toString());
        setFreeThreshold(s.free_shipping_threshold?.toString() ?? "");
        setAnnouncement(s.store_announcement ?? "");
      });
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipping_rate: parseFloat(shippingRate) || 0,
        free_shipping_threshold: freeThreshold ? parseFloat(freeThreshold) : null,
        store_announcement: announcement || null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!settings) return <div className="text-sm text-[#6B6B6B]">Loading…</div>;

  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-3xl text-[#3D4A1E] mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#E2DDD7] p-6 space-y-5">
          <h2 className="font-semibold text-[#2C2C2C]">Shipping</h2>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-1.5">Flat Shipping Rate</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] text-sm">$</span>
              <input
                type="number" min="0" step="0.01"
                value={shippingRate}
                onChange={(e) => setShippingRate(e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 border border-[#E2DDD7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D4A1E] bg-[#FAF8F5]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-1.5">
              Free Shipping Threshold <span className="normal-case font-normal">(optional — leave blank to always charge)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] text-sm">$</span>
              <input
                type="number" min="0" step="0.01"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 border border-[#E2DDD7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D4A1E] bg-[#FAF8F5]"
                placeholder="e.g. 75"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2DDD7] p-6 space-y-5">
          <h2 className="font-semibold text-[#2C2C2C]">Store Announcement</h2>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-1.5">
              Banner message <span className="normal-case font-normal">(shown at top of site — leave blank to hide)</span>
            </label>
            <input
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E2DDD7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3D4A1E] bg-[#FAF8F5]"
              placeholder="e.g. Free shipping on orders over $75!"
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#3D4A1E] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#4f6027] transition-colors disabled:opacity-50"
        >
          {saved ? <><Check size={15} /> Saved!</> : saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
