"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  Hash,
  ShoppingBag,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Tags", href: "/admin/tags", icon: Hash },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-[#E2DDD7] flex flex-col min-h-screen">
      <div className="p-6 border-b border-[#E2DDD7]">
        <p className="font-serif text-xl text-[#3D4A1E] font-light tracking-wide">Silver Creek</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#7B3C8E] mt-0.5">Boutique</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-[#3D4A1E] text-white"
                  : "text-[#6B6B6B] hover:bg-[#FAF8F5] hover:text-[#2C2C2C]"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#E2DDD7]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-[#6B6B6B] hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
