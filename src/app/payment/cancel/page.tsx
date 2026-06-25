"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center bg-red-100 rounded-full p-5 mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="font-montserrat font-extrabold text-3xl text-brand-charcoal mb-3">
          Payment Cancelled
        </h1>
        <p className="font-opensans text-gray-500 mb-8">
          No charge was made. You can try again whenever you're ready.
        </p>
        <div className="space-y-3">
          <Link href="/dealer/register" className="btn-primary w-full flex items-center justify-center">
            Try Again
          </Link>
          <Link href="/" className="btn-secondary w-full flex items-center justify-center">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
