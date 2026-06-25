"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function DealerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error === "AccountBlocked") {
      setError("Your account has been blocked. Contact support.");
      return;
    }

    if (res?.error || !res?.ok) {
      setError("Invalid email or password");
      return;
    }

    // Redirect based on role — fetch session to check
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if ((session?.user as any)?.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dealer/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-brand-charcoal rounded-full p-3 mb-4">
            <Car className="w-7 h-7 text-brand-red" />
          </div>
          <h1 className="font-montserrat font-extrabold text-3xl text-brand-charcoal">Dealer Login</h1>
          <p className="font-opensans text-gray-500 mt-2">Access your dealer or admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 font-opensans text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@yourdealership.co.za"
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                className="form-input pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* Demo credentials hint */}
          <div className="bg-brand-light rounded-lg p-3 text-xs font-opensans text-gray-500 space-y-1">
            <p className="font-semibold text-gray-600">Demo credentials:</p>
            <p>Admin: <span className="font-mono">admin@motormarketsa.co.za</span> / <span className="font-mono">admin@MMSA2024!</span></p>
            <p>Dealer: <span className="font-mono">demo@abcmotors.co.za</span> / <span className="font-mono">dealer123!</span></p>
          </div>
        </form>

        <p className="text-center font-opensans text-gray-400 text-sm mt-4">
          Not a dealer yet?{" "}
          <Link href="/dealer/register" className="text-brand-red hover:underline font-semibold">Register here</Link>
        </p>
      </div>
    </div>
  );
}
