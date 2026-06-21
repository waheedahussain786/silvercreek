import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#3D4A1E] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="Silver Creek Boutique"
              width={140}
              height={46}
              className="h-9 w-auto object-contain brightness-0 invert mb-5"
            />
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              Handpicked fashion for the modern woman. Curated with care, shipped with love.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-5">Explore</p>
            <ul className="space-y-3">
              {[["Shop All", "/shop"], ["About Us", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/65 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-5">We Promise</p>
            <ul className="space-y-3">
              {[
                "Free returns within 14 days",
                "Secure checkout via Stripe",
                "Ships in 2–4 business days",
                "Real person customer care",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm text-white/65">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-1.5 shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/35">© {year} Silver Creek Boutique. All rights reserved.</p>
          <p className="text-xs text-white/25">Secure payments by Stripe</p>
        </div>
      </div>
    </footer>
  );
}
