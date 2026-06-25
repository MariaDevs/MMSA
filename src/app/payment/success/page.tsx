"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Car } from "lucide-react";

export default function PaymentSuccessPage() {
  useEffect(() => {
    // ITN handles DB update; small delay then redirect
    const t = setTimeout(() => {}, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-5 mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="font-montserrat font-extrabold text-3xl text-brand-charcoal mb-3">
          Payment Successful!
        </h1>
        <p className="font-opensans text-gray-500 mb-2">
          Your MotorsMarket SA dealer package is now active.
        </p>
        <p className="font-opensans text-gray-400 text-sm mb-8">
          Your account will be approved within a few minutes. You can now upload vehicles to your dashboard.
        </p>
        <div className="space-y-3">
          <Link href="/dealer/dashboard" className="btn-primary w-full flex items-center justify-center gap-2">
            <Car className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <Link href="/" className="btn-secondary w-full flex items-center justify-center">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
