import { CartProvider } from "@/lib/cart-context";
import AnnouncementBanner from "@/components/store/AnnouncementBanner";
import StoreShell from "@/components/store/StoreShell";
import Footer from "@/components/store/Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AnnouncementBanner />
      <StoreShell>
        <div className="flex-1">{children}</div>
      </StoreShell>
      <Footer />
    </CartProvider>
  );
}
