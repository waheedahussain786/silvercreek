import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-serif text-8xl text-[#E2DDD7] mb-6 leading-none">404</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B3C8E] font-semibold mb-3">Page Not Found</p>
        <h1 className="font-serif text-3xl text-[#3D4A1E] mb-4">This page doesn't exist</h1>
        <p className="text-[#6B6B6B] text-sm mb-8">The link might be broken, or the page may have moved.</p>
        <Link
          href="/"
          className="inline-block bg-[#3D4A1E] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#4f6027] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
