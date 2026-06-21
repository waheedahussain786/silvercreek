import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs text-[#7B3C8E] font-semibold uppercase tracking-widest mb-3">Our Story</p>
      <h1 className="font-serif text-5xl text-[#3D4A1E] mb-8 leading-tight">About Silver Creek Boutique</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-[#2C2C2C] leading-relaxed">
        <p className="text-lg text-[#6B6B6B] leading-relaxed">
          Silver Creek Boutique was born from a love of beautiful, thoughtfully made clothing and a desire to share that with women everywhere.
        </p>
        <p>
          Every piece in our collection is handpicked with care — chosen for its quality, fit, and the way it makes you feel when you wear it. We believe that getting dressed should be a joy, not a chore, and that great style doesn't have to cost a fortune.
        </p>
        <p>
          We're a small, one-woman operation, which means you're not just a transaction — you're a valued customer. We take pride in fast shipping, easy returns, and making sure every order leaves our hands with care.
        </p>
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        {[
          { title: "Handpicked", body: "Every item is personally selected for quality and style." },
          { title: "Small batch", body: "Limited quantities mean you're wearing something special." },
          { title: "Real care", body: "Questions? We're a real person — reach out anytime." },
        ].map(({ title, body }) => (
          <div key={title} className="bg-white rounded-2xl border border-[#E2DDD7] p-5">
            <div className="w-2 h-2 rounded-full bg-[#7B3C8E] mb-3" />
            <p className="font-semibold text-[#2C2C2C] mb-1.5">{title}</p>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#3D4A1E] rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-serif text-2xl mb-1">Ready to shop?</p>
          <p className="text-white/70 text-sm">Browse our latest collection.</p>
        </div>
        <Link href="/shop" className="shrink-0 bg-white text-[#3D4A1E] px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#FAF8F5] transition-colors">
          Shop Now
        </Link>
      </div>
    </div>
  );
}
