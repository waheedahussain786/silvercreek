import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center">
        {/* Check mark */}
        <div className="w-20 h-20 bg-[#3D4A1E] rounded-full flex items-center justify-center mx-auto mb-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B3C8E] font-semibold mb-3">Order Confirmed</p>
        <h1 className="font-serif text-4xl text-[#3D4A1E] mb-4">Thank you!</h1>
        <p className="text-[#6B6B6B] leading-relaxed mb-2">
          Your order is placed and we're getting it ready for you.
        </p>
        <p className="text-sm text-[#6B6B6B] mb-10">
          Have questions?{" "}
          <Link href="/contact" className="text-[#7B3C8E] font-medium hover:underline">
            Get in touch
          </Link>
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-block bg-[#3D4A1E] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#4f6027] transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/contact"
            className="inline-block border border-[#E2DDD7] text-[#6B6B6B] px-8 py-3.5 rounded-full text-sm font-medium hover:border-[#3D4A1E] hover:text-[#3D4A1E] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
