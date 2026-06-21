import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Silver Creek Boutique",
    template: "%s | Silver Creek Boutique",
  },
  description: "Handmade art and goods crafted with care. Shop one-of-a-kind pieces at Silver Creek Boutique.",
  openGraph: {
    type: "website",
    siteName: "Silver Creek Boutique",
    title: "Silver Creek Boutique",
    description: "Handmade art and goods, crafted with care.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#2C2C2C] antialiased">
        {children}
      </body>
    </html>
  );
}
