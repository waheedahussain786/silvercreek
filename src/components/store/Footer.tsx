import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3D4A1E] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="font-serif text-2xl font-light tracking-wide mb-1">Silver Creek</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8BC34A] font-semibold mb-4">Boutique</p>
            <p className="text-sm text-white/60 leading-relaxed">
              Handpicked pieces for the modern woman.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Shop</p>
            <ul className="space-y-2.5">
              {[["Shop All", "/shop"], ["About", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/70 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Info</p>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>Free returns within 14 days</li>
              <li>Secure checkout via Stripe</li>
              <li>Questions? <Link href="/contact" className="text-[#8BC34A] hover:underline">Get in touch</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Silver Creek Boutique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
