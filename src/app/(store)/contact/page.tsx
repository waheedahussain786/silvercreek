"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs text-[#7B3C8E] font-semibold uppercase tracking-widest mb-3">Get in Touch</p>
      <h1 className="font-serif text-5xl text-[#3D4A1E] mb-3 leading-tight">Contact Us</h1>
      <p className="text-[#6B6B6B] mb-10 leading-relaxed">
        Have a question about an order, a product, or just want to say hello? We'd love to hear from you.
      </p>

      {status === "sent" ? (
        <div className="bg-[#3D4A1E] text-white rounded-2xl p-10 text-center">
          <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={22} />
          </div>
          <p className="font-serif text-2xl mb-2">Message sent!</p>
          <p className="text-white/70 text-sm">We'll get back to you within 1–2 business days.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E2DDD7] p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-1.5">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E2DDD7] rounded-xl text-sm bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#3D4A1E]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E2DDD7] rounded-xl text-sm bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#3D4A1E]"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-1.5">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#E2DDD7] rounded-xl text-sm bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#3D4A1E] resize-none"
              placeholder="What's on your mind?"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">Something went wrong. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-[#3D4A1E] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#4f6027] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {status === "sending" ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
