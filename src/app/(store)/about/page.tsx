import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Silver Creek Boutique",
  description: "Handpicked fashion for the modern woman. Learn the story behind Silver Creek Boutique.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-[#3D4A1E] text-white py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8BC34A] font-semibold mb-4">Our Story</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light leading-tight">
            Fashion curated<br />from the heart
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-6 text-[#2C2C2C] leading-relaxed mb-16">
          <p className="text-xl text-[#6B6B6B] leading-relaxed font-light">
            Silver Creek Boutique was born from a love of beautiful, thoughtfully made clothing and a desire to share that with women everywhere.
          </p>
          <p>
            Every piece in our collection is handpicked with care — chosen for its quality, fit, and the way it makes you feel when you wear it. We believe getting dressed should be a joy, and that great style doesn't have to cost a fortune.
          </p>
          <p>
            We're a small, one-woman operation, which means you're never just a transaction. We take pride in fast shipping, easy returns, and making sure every order leaves with care.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {[
            { num: "01", title: "Handpicked", body: "Every item is personally selected for quality and style — nothing makes it in unless it earns its place." },
            { num: "02", title: "Small batch", body: "Limited quantities mean what you're wearing is something special, not mass-produced." },
            { num: "03", title: "Personal care", body: "Questions? You're talking to a real person who genuinely cares about your experience." },
          ].map(({ num, title, body }) => (
            <div key={num} className="bg-white rounded-2xl border border-[#E2DDD7] p-6">
              <p className="font-serif text-3xl text-[#C5C9A8] mb-3">{num}</p>
              <p className="font-semibold text-[#3D4A1E] mb-2">{title}</p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#7B3C8E] rounded-2xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-2xl mb-1">Ready to find your new favourite?</p>
            <p className="text-white/65 text-sm">New pieces arrive regularly.</p>
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
