import Link from "next/link";
import Image from "next/image";

const ETSY_URL = "https://www.etsy.com/shop/silvercreskboutique/";
const INSTAGRAM_URL = "https://www.instagram.com/silvercreekboutique";
const TIKTOK_URL = "https://www.tiktok.com/@humanitysaveslives7";
const YOUTUBE_URL = "https://www.youtube.com/@silvercreekboutique";

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
            <p className="text-sm text-white/55 leading-relaxed max-w-xs mb-6">
              Handmade art and goods, crafted with care and shipped with love.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              <a href={ETSY_URL} target="_blank" rel="noopener noreferrer" aria-label="Etsy"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#F1641E] flex items-center justify-center transition-colors">
                <EtsyIcon />
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#E1306C] flex items-center justify-center transition-colors">
                <InstagramIcon />
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#010101] flex items-center justify-center transition-colors">
                <TikTokIcon />
              </a>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#FF0000] flex items-center justify-center transition-colors">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-5">Explore</p>
            <ul className="space-y-3">
              {[["Shop All", "/shop"], ["About Us", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/65 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
              <li>
                <a href={ETSY_URL} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-white/65 hover:text-white transition-colors">
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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.225 0C4.608 0 0 4.608 0 10.225c0 5.616 4.608 10.224 10.225 10.224 5.617 0 10.225-4.608 10.225-10.224C20.45 4.608 15.842 0 10.225 0zm-.01 3.388c.505 0 .91.406.91.91v.682h1.365c.504 0 .91.405.91.909s-.406.91-.91.91H11.12v3.41h1.593c.504 0 .91.406.91.91s-.406.91-.91.91H11.12v3.638h1.593c.504 0 .91.406.91.91s-.406.91-.91.91H9.76a.91.91 0 01-.91-.91V4.298c0-.504.406-.91.91-.91h.455z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
    </svg>
  );
}
