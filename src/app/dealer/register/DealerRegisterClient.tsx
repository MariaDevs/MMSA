"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Car, ArrowRight, AlertCircle } from "lucide-react";
import PaymentForm from "@/components/PaymentForm";

type Package = { id: string; name: string; vehicleLimit: number; durationDays: number; price: number; description: string };
type Step = 1 | 2 | 3 | 4;

const PROVINCES = ["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Limpopo","Mpumalanga","North West","Free State","Northern Cape"];

export default function DealerRegisterClient() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [packages, setPackages] = useState<Package[]>([]);
  const [form, setForm] = useState({
    businessName: "", contactName: "", email: "", password: "", confirmPassword: "",
    phone: "", location: "", province: "", description: "", packageId: searchParams.get("package") || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [dealerId, setDealerId] = useState("");

  useEffect(() => {
    fetch("/api/admin/packages").then((r) => r.ok ? r.json() : []).then(setPackages).catch(() => {});
    // Fallback: load packages from public endpoint
    fetch("/api/packages").then((r) => r.ok ? r.json() : []).then((d) => { if (d.length) setPackages(d); }).catch(() => {});
  }, []);

  function update(key: string, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function validate1() {
    const e: Record<string, string> = {};
    if (!form.businessName) e.businessName = "Required";
    if (!form.contactName) e.contactName = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.password || form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!form.phone) e.phone = "Required";
    if (!form.location) e.location = "Required";
    if (!form.province) e.province = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validate2() {
    if (!form.packageId) { setErrors({ packageId: "Please select a package" }); return false; }
    return true;
  }

  async function submitRegistration() {
    setLoading(true);
    setApiError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email, password: form.password,
        businessName: form.businessName, contactName: form.contactName,
        phone: form.phone, location: form.location, province: form.province,
        description: form.description, packageId: form.packageId,
      }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) { setApiError(data.error ?? "Registration failed"); return; }
    setDealerId(data.dealerId);
    setStep(4);
  }

  function nextStep() {
    if (step === 1 && validate1()) setStep(2);
    else if (step === 2 && validate2()) setStep(3);
  }

  const selectedPkg = packages.find((p) => p.id === form.packageId);

  return (
    <div className="min-h-screen bg-brand-light py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-brand-red rounded-full p-3 mb-4">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-montserrat font-extrabold text-3xl text-brand-charcoal">Register as Dealer</h1>
          <p className="font-opensans text-gray-500 mt-2">Join MotorsMarket SA and start selling today</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { n: 1, label: "Details" },
            { n: 2, label: "Package" },
            { n: 3, label: "Review" },
            { n: 4, label: "Payment" },
          ].map(({ n, label }, idx) => (
            <div key={n} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-poppins font-bold text-sm ${step > n ? "bg-brand-red text-white" : step === n ? "bg-brand-charcoal text-white" : "bg-gray-200 text-gray-400"}`}>
                  {step > n ? <Check className="w-4 h-4" /> : n}
                </div>
                <span className={`font-opensans text-xs mt-1 ${step === n ? "text-brand-charcoal font-semibold" : "text-gray-400"}`}>{label}</span>
              </div>
              {idx < 3 && <div className={`w-12 h-0.5 mx-2 mt-[-12px] ${step > n ? "bg-brand-red" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-4">Business Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "businessName", label: "Business Name", placeholder: "ABC Motors" },
                  { key: "contactName", label: "Contact Person", placeholder: "John Smith" },
                  { key: "email", label: "Email", placeholder: "info@dealer.co.za", type: "email" },
                  { key: "phone", label: "Phone", placeholder: "+27 11 000 0000", type: "tel" },
                  { key: "location", label: "City / Town", placeholder: "Johannesburg" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="form-label">{label} *</label>
                    <input type={type ?? "text"} className={`form-input ${errors[key] ? "border-red-500" : ""}`} placeholder={placeholder} value={(form as any)[key]} onChange={(e) => update(key, e.target.value)} />
                    {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                  </div>
                ))}
                <div>
                  <label className="form-label">Province *</label>
                  <select className={`form-input ${errors.province ? "border-red-500" : ""}`} value={form.province} onChange={(e) => update("province", e.target.value)}>
                    <option value="">Select</option>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                </div>
                <div>
                  <label className="form-label">Password *</label>
                  <input type="password" className={`form-input ${errors.password ? "border-red-500" : ""}`} placeholder="Min 8 characters" value={form.password} onChange={(e) => update("password", e.target.value)} />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="form-label">Confirm Password *</label>
                  <input type="password" className={`form-input ${errors.confirmPassword ? "border-red-500" : ""}`} value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
              <div>
                <label className="form-label">Dealership Description</label>
                <textarea rows={3} className="form-input resize-none" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Tell buyers about your dealership..." />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-2">Choose Your Package</h2>
              <p className="font-opensans text-gray-500 text-sm mb-6">All packages include 30 days of listing space</p>
              {errors.packageId && <p className="text-red-500 text-sm mb-3">{errors.packageId}</p>}
              <div className="space-y-3">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => update("packageId", pkg.id)}
                    className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-between transition-all ${form.packageId === pkg.id ? "border-brand-red bg-red-50" : "border-gray-200 hover:border-brand-red/40"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.packageId === pkg.id ? "border-brand-red bg-brand-red" : "border-gray-300"}`}>
                        {form.packageId === pkg.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <p className="font-montserrat font-bold text-brand-charcoal">{pkg.name}</p>
                        <p className="font-opensans text-gray-500 text-sm">{pkg.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-poppins font-bold text-brand-red text-xl">{pkg.vehicleLimit} <span className="text-sm font-normal text-gray-400">vehicles</span></p>
                      <p className="font-poppins font-bold text-brand-charcoal">R {pkg.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div>
              <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-6">Review Your Details</h2>
              {apiError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 font-opensans text-sm">
                  <AlertCircle className="w-4 h-4" /> {apiError}
                </div>
              )}
              <div className="bg-brand-light rounded-xl p-4 space-y-2 mb-4 text-sm font-opensans">
                {[
                  ["Business", form.businessName],
                  ["Contact", form.contactName],
                  ["Email", form.email],
                  ["Phone", form.phone],
                  ["Location", `${form.location}, ${form.province}`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between"><span className="text-gray-500">{l}</span><span className="font-semibold">{v}</span></div>
                ))}
                {selectedPkg && (
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between"><span className="text-gray-500">Package</span><span className="font-semibold">{selectedPkg.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Vehicles</span><span className="font-semibold text-brand-red">{selectedPkg.vehicleLimit}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-brand-red text-base">R {selectedPkg.price.toLocaleString()}</span></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4 — Payment */}
          {step === 4 && (
            <div>
              <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-6">Complete Payment</h2>
              <PaymentForm packageId={form.packageId} onSuccess={() => {}} />
            </div>
          )}

          {/* Navigation (steps 1-3 only) */}
          {step < 4 && (
            <div className={`flex mt-8 ${step > 1 ? "justify-between" : "justify-end"}`}>
              {step > 1 && (
                <button type="button" onClick={() => setStep((s) => (s - 1) as Step)} className="btn-secondary">Back</button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="button" onClick={submitRegistration} disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                  {loading ? "Creating account..." : <>Proceed to Payment <ArrowRight className="w-4 h-4" /></>}
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-center font-opensans text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <a href="/dealer/login" className="text-brand-red hover:underline font-semibold">Login here</a>
        </p>
      </div>
    </div>
  );
}
