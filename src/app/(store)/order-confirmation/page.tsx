import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
      <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={30} className="text-white" />
      </div>

      <h1 className="font-serif text-4xl text-[#3D4A1E] mb-3">Thank you!</h1>
      <p className="text-[#6B6B6B] mb-2 leading-relaxed">
        Your order has been placed and we're getting it ready for you.
      </p>
      <p className="text-sm text-[#6B6B6B] mb-10">
        You'll receive a confirmation email shortly. If you have any questions, don't hesitate to{" "}
        <Link href="/contact" className="text-[#7B3C8E] hover:underline">reach out</Link>.
      </p>

      <Link
        href="/shop"
        className="inline-block bg-[#3D4A1E] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#4f6027] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
