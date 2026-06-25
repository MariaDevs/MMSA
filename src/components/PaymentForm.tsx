"use client";

import { useState, useEffect, useRef } from "react";
import { CreditCard, Lock, CheckCircle, AlertCircle, ShieldCheck, ArrowRight } from "lucide-react";

export default function PaymentForm({
  packageId,
  onSuccess,
}: {
  packageId: string;
  onSuccess: () => void;
}) {
  const [data, setData] = useState<{
    payFastUrl: string;
    data: Record<string, string>;
    amount: number;
    packageName: string;
  } | null>(null);
  const [loadError, setLoadError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!packageId) return;
    fetch("/api/payment/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setLoadError(d.error); return; }
        setData(d);
      })
      .catch(() => setLoadError("Failed to initialize payment"));
  }, [packageId]);

  function handlePay() {
    setRedirecting(true);
    // Submit the hidden PayFast form
    formRef.current?.submit();
  }

  if (loadError) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-opensans text-sm">
        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {loadError}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-10 gap-3">
        <div className="w-6 h-6 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        <span className="font-poppins text-sm text-gray-400">Preparing secure payment...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order summary */}
      <div className="bg-brand-light rounded-xl p-5 border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-montserrat font-bold text-brand-charcoal text-lg">{data.packageName}</p>
            <p className="font-opensans text-gray-400 text-sm">30-day vehicle listing package</p>
          </div>
          <p className="font-poppins font-bold text-brand-red text-3xl">
            R {data.amount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* PayFast info */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="bg-[#2aa12a]/10 rounded-full p-2 flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#2aa12a]" />
          </div>
          <div>
            <p className="font-montserrat font-bold text-brand-charcoal">Pay via PayFast</p>
            <p className="font-opensans text-gray-400 text-sm">South Africa's trusted payment gateway</p>
          </div>
          <img
            src="https://www.payfast.co.za/assets/general/logos/logo-colour.svg"
            alt="PayFast"
            className="h-8 w-auto ml-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        <div className="space-y-3">
          {[
            { icon: CreditCard, text: "Visa, Mastercard & EFT accepted" },
            { icon: Lock, text: "256-bit SSL encryption — card details never touch our server" },
            { icon: ShieldCheck, text: "PCI DSS Level 1 compliant payment processing" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 font-opensans text-sm text-gray-600">
              <Icon className="w-4 h-4 text-brand-red flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 font-opensans text-xs text-blue-700">
          <strong>Test mode:</strong> You will be redirected to PayFast sandbox. Use test card <span className="font-mono font-bold">4000000000000002</span> with any future date and CVV.
        </div>
      </div>

      {/* Hidden PayFast form */}
      <form ref={formRef} action={data.payFastUrl} method="POST" className="hidden">
        {Object.entries(data.data).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
      </form>

      <button
        onClick={handlePay}
        disabled={redirecting}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4 disabled:opacity-60"
      >
        {redirecting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Redirecting to PayFast...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay Securely — R {data.amount.toLocaleString()}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-center font-opensans text-xs text-gray-400">
        By proceeding you agree to activate your 30-day dealer listing package.
        Your account is activated immediately after successful payment.
      </p>
    </div>
  );
}
