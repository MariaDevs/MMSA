"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CreditCard, Lock, CheckCircle, AlertCircle } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CARD_STYLE = {
  style: {
    base: {
      fontSize: "14px",
      fontFamily: "Open Sans, sans-serif",
      color: "#2B2B2B",
      "::placeholder": { color: "#9CA3AF" },
    },
    invalid: { color: "#DC2626" },
  },
};

function CheckoutForm({
  clientSecret,
  amount,
  packageName,
  packageId,
  onSuccess,
}: {
  clientSecret: string;
  amount: number;
  packageName: string;
  packageId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) { setProcessing(false); return; }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumber,
        billing_details: { name: cardholderName },
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id, packageId }),
      });
      onSuccess();
    }

    setProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order summary */}
      <div className="bg-brand-light rounded-xl p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-montserrat font-bold text-brand-charcoal">{packageName}</p>
            <p className="font-opensans text-gray-400 text-sm">30-day listing package</p>
          </div>
          <p className="font-poppins font-bold text-brand-red text-2xl">
            R {amount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Cardholder name */}
      <div>
        <label className="form-label">Cardholder Name</label>
        <input
          required
          type="text"
          className="form-input"
          placeholder="Name as it appears on card"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
        />
      </div>

      {/* Card number */}
      <div>
        <label className="form-label">Card Number</label>
        <div className="form-input flex items-center gap-2 h-12">
          <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="flex-1">
            <CardNumberElement options={CARD_STYLE} />
          </div>
          <div className="flex gap-1">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/32px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 w-auto opacity-60" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/32px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 w-auto opacity-60" />
          </div>
        </div>
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Expiry Date</label>
          <div className="form-input flex items-center h-12">
            <div className="flex-1">
              <CardExpiryElement options={CARD_STYLE} />
            </div>
          </div>
        </div>
        <div>
          <label className="form-label">CVV / CVC</label>
          <div className="form-input flex items-center gap-2 h-12">
            <div className="flex-1">
              <CardCvcElement options={CARD_STYLE} />
            </div>
            <Lock className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 font-opensans text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center gap-2 text-gray-400 font-opensans text-xs">
        <Lock className="w-3.5 h-3.5" />
        Secured by Stripe. Your card details are encrypted and never stored.
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4 disabled:opacity-60"
      >
        <Lock className="w-4 h-4" />
        {processing ? "Processing Payment..." : `Pay R ${amount.toLocaleString()}`}
      </button>
    </form>
  );
}

export default function PaymentForm({
  packageId,
  onSuccess,
}: {
  packageId: string;
  onSuccess: () => void;
}) {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [packageName, setPackageName] = useState("");
  const [paid, setPaid] = useState(false);
  const [loadError, setLoadError] = useState("");

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
        setClientSecret(d.clientSecret);
        setAmount(d.amount);
        setPackageName(d.packageName);
      })
      .catch(() => setLoadError("Failed to initialize payment"));
  }, [packageId]);

  if (paid) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-4 mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="font-montserrat font-bold text-2xl text-brand-charcoal mb-2">Payment Successful!</h3>
        <p className="font-opensans text-gray-500 mb-6">Your dealer account is now active. Start uploading vehicles.</p>
        <a href="/dealer/dashboard" className="btn-primary">Go to Dashboard</a>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-opensans text-sm">
        <AlertCircle className="w-4 h-4" />
        {loadError}
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        clientSecret={clientSecret}
        amount={amount}
        packageName={packageName}
        packageId={packageId}
        onSuccess={() => { setPaid(true); onSuccess(); }}
      />
    </Elements>
  );
}
