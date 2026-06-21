"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface Props {
  onCartOpen: () => void;
}

export default function Header({ onCartOpen }: Props) {
  const pathname = usePathname();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#E2DDD7] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-xl text-[#3D4A1E] font-light tracking-wide">Silver Creek</span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#7B3C8E] font-semibold">Boutique</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors",
                pathname.startsWith(href)
                  ? "text-[#3D4A1E]"
                  : "text-[#6B6B6B] hover:text-[#2C2C2C]"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors text-[#2C2C2C]"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#7B3C8E] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-1">
                {count}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors text-[#2C2C2C]"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E2DDD7] bg-white px-4 py-4 space-y-1">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#2C2C2C] hover:bg-[#FAF8F5]"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
