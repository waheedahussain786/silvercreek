import Link from "next/link";
import Image from "next/image";

const ETSY_URL = "https://www.etsy.com/shop/silvercreskboutique/";

// Update these with real handles when available
const SOCIALS = {
  etsy: ETSY_URL,
  instagram: null as string | null,   // e.g. "https://instagram.com/silvercreekboutique"
  facebook: null as string | null,
};

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
            <p className="text-sm text-white/55 leading-relaxed max-w-xs mb-5">
              Handmade art and goods, crafted with care and shipped with love.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {/* Etsy always shown */}
              <a
                href={ETSY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Etsy"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#F1641E] flex items-center justify-center transition-colors"
              >
                <EtsyIcon />
              </a>
              {SOCIALS.instagram && (
                <a
                  href={SOCIALS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <InstagramIcon />
                </a>
              )}
              {SOCIALS.facebook && (
                <a
                  href={SOCIALS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <FacebookIcon />
                </a>
              )}
            </div>
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
              <li>
                <a
                  href={ETSY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/65 hover:text-white transition-colors"
                >
                  Etsy Shop ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-5">Good to know</p>
            <ul className="space-y-3">
              {[
                "All items are handmade",
                "Each piece is one of a kind",
                "Secure checkout via Stripe",
                "Ships in 2–5 business days",
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

function EtsyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.225 0C4.608 0 0 4.608 0 10.225c0 5.616 4.608 10.224 10.225 10.224 5.617 0 10.225-4.608 10.225-10.224C20.45 4.608 15.842 0 10.225 0zm-.01 3.388c.505 0 .91.406.91.91v.682h1.365c.504 0 .91.405.91.909s-.406.91-.91.91H11.12v3.41h1.593c.504 0 .91.406.91.91s-.406.91-.91.91H11.12v3.638h1.593c.504 0 .91.406.91.91s-.406.91-.91.91H9.76a.91.91 0 01-.91-.91V4.298c0-.504.406-.91.91-.91h.455z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
