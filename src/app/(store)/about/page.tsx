import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Silver Creek Boutique",
  description: "Silver Creek Boutique makes custom and one-of-a-kind pieces — printing, engraving, art, accessories, business cards, flyers, and more.",
};

const ETSY_URL = "https://www.etsy.com/shop/silvercreskboutique/";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-[#3D4A1E] text-white py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8BC34A] font-semibold mb-4">About</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light leading-tight">
            What we do
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-6 text-[#2C2C2C] leading-relaxed mb-16">
          <p className="text-xl text-[#6B6B6B] leading-relaxed font-light">
            Silver Creek Boutique is a small shop that makes custom and one-of-a-kind work — printing, engraving, original art, accessories, business cards, flyers, and more.
          </p>
          <p>
            Everything is made by hand, one at a time. No mass production, no duplicates. If it's in the shop, it exists in limited quantity — and custom orders are always welcome.
          </p>
          <p>
            We're a one-person operation. When you order, you're working directly with the maker. If you need something specific or don't see what you're looking for, reach out.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {[
            { num: "01", title: "Custom work", body: "Printing, engraving, art, accessories, business cards, flyers — made to order." },
            { num: "02", title: "One of a kind", body: "In-stock pieces are limited. When they sell, they don't get restocked." },
            { num: "03", title: "Direct from maker", body: "One-person shop. You're ordering straight from the person making it." },
          ].map(({ num, title, body }) => (
            <div key={num} className="bg-white rounded-2xl border border-[#E2DDD7] p-6">
              <p className="font-serif text-3xl text-[#C5C9A8] mb-3">{num}</p>
              <p className="font-semibold text-[#3D4A1E] mb-2">{title}</p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Also on Etsy */}
        <div className="bg-white rounded-2xl border border-[#E2DDD7] p-8 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-1">Also find us on</p>
            <p className="font-serif text-2xl text-[#3D4A1E]">Etsy</p>
            <p className="text-sm text-[#6B6B6B] mt-1">We also list products on Etsy.</p>
          </div>
          <a
            href={ETSY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-[#F1641E] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#d95a1a] transition-colors"
          >
            Visit Etsy Shop ↗
          </a>
        </div>

        <div className="bg-[#7B3C8E] rounded-2xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-2xl mb-1">Need something specific?</p>
            <p className="text-white/65 text-sm">Custom orders welcome — reach out if you don't see what you need.</p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 bg-white text-[#7B3C8E] px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#FAF8F5] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
