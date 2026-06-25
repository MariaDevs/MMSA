"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Eye, EyeOff } from "lucide-react";

export default function DealerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Auth system integration coming soon.");
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-brand-charcoal rounded-full p-3 mb-4">
            <Car className="w-7 h-7 text-brand-red" />
          </div>
          <h1 className="font-montserrat font-extrabold text-3xl text-brand-charcoal">Dealer Login</h1>
          <p className="font-opensans text-gray-500 mt-2">Access your dealer dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-4">
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
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 font-opensans text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" className="accent-brand-red" />
              Remember me
            </label>
            <a href="#" className="font-opensans text-sm text-brand-red hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="btn-primary w-full mt-2">Login to Dashboard</button>
        </form>

        <p className="text-center font-opensans text-gray-400 text-sm mt-4">
          Not a dealer yet?{" "}
          <Link href="/dealer/register" className="text-brand-red hover:underline font-semibold">Register here</Link>
        </p>
      </div>
    </div>
  );
}
