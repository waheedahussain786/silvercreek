import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Silver Creek Boutique",
  description: "Handmade art and goods created with care. Learn the story behind Silver Creek Boutique.",
};

const ETSY_URL = "https://www.etsy.com/shop/silvercreskboutique/";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-[#3D4A1E] text-white py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8BC34A] font-semibold mb-4">Our Story</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light leading-tight">
            Made by hand,<br />made with heart
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-6 text-[#2C2C2C] leading-relaxed mb-16">
          <p className="text-xl text-[#6B6B6B] leading-relaxed font-light">
            Silver Creek Boutique is a handmade art and goods shop built on a love for creating things that are beautiful, intentional, and one of a kind.
          </p>
          <p>
            Every item in our collection is handcrafted from scratch — no mass production, no duplicates. Each piece carries its own character and is made with genuine care for the person who will receive it.
          </p>
          <p>
            We're a small, one-person operation, which means when you order from us, you're supporting an independent maker directly. We take that seriously, and we put that care into every single thing we create and ship.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {[
            { num: "01", title: "Handmade", body: "Every item is crafted by hand — no factories, no shortcuts." },
            { num: "02", title: "One of a kind", body: "Limited quantities. When a piece sells, it's truly gone." },
            { num: "03", title: "Made with care", body: "Each order is packed and shipped with personal attention." },
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
            <p className="text-sm text-[#6B6B6B] mt-1">Browse our full catalogue on Etsy.</p>
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
            <p className="font-serif text-2xl mb-1">Ready to find something special?</p>
            <p className="text-white/65 text-sm">Each piece is handmade and one of a kind.</p>
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
