"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Car, ArrowRight } from "lucide-react";
import { PACKAGES } from "@/lib/data";

type Step = 1 | 2 | 3;

type FormData = {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  province: string;
  description: string;
  packageId: string;
};

const PROVINCES = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"];

export default function DealerRegisterClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    location: "",
    province: "",
    description: "",
    packageId: searchParams.get("package") || "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validateStep1() {
    const e: Partial<FormData> = {};
    if (!form.businessName) e.businessName = "Required";
    if (!form.contactPerson) e.contactPerson = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone) e.phone = "Required";
    if (!form.location) e.location = "Required";
    if (!form.province) e.province = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    if (!form.packageId) {
      setErrors({ packageId: "Please select a package" });
      return false;
    }
    return true;
  }

  function nextStep() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Payment gateway integration goes here
    alert("Registration submitted! Payment gateway integration coming soon.");
  }

  const selectedPackage = PACKAGES.find((p) => p.id === form.packageId);

  return (
    <div className="min-h-screen bg-brand-light py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-brand-red rounded-full p-3 mb-4">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-montserrat font-extrabold text-3xl text-brand-charcoal">Register as Dealer</h1>
          <p className="font-opensans text-gray-500 mt-2">Join MotorsMarket SA and start selling today</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center mb-8 gap-0">
          {[
            { n: 1, label: "Details" },
            { n: 2, label: "Package" },
            { n: 3, label: "Payment" },
          ].map(({ n, label }, idx) => (
            <div key={n} className="flex items-center">
              <div className={`flex flex-col items-center ${idx > 0 ? "ml-2" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-poppins font-bold text-sm ${
                    step > n
                      ? "bg-brand-red text-white"
                      : step === n
                      ? "bg-brand-charcoal text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > n ? <Check className="w-4 h-4" /> : n}
                </div>
                <span className={`font-opensans text-xs mt-1 ${step === n ? "text-brand-charcoal font-semibold" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {idx < 2 && <div className={`w-16 h-0.5 mx-2 mt-[-12px] ${step > n ? "bg-brand-red" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Step 1 — Business Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-6">Business Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Business Name *</label>
                  <input className={`form-input ${errors.businessName ? "border-red-500" : ""}`} value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="ABC Motors" />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
                </div>
                <div>
                  <label className="form-label">Contact Person *</label>
                  <input className={`form-input ${errors.contactPerson ? "border-red-500" : ""}`} value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} placeholder="John Smith" />
                  {errors.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>}
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input type="email" className={`form-input ${errors.email ? "border-red-500" : ""}`} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="info@abcmotors.co.za" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" className={`form-input ${errors.phone ? "border-red-500" : ""}`} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+27 11 000 0000" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="form-label">City / Town *</label>
                  <input className={`form-input ${errors.location ? "border-red-500" : ""}`} value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Johannesburg" />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
                <div>
                  <label className="form-label">Province *</label>
                  <select className={`form-input ${errors.province ? "border-red-500" : ""}`} value={form.province} onChange={(e) => update("province", e.target.value)}>
                    <option value="">Select province</option>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                </div>
              </div>
              <div>
                <label className="form-label">Dealership Description</label>
                <textarea rows={3} className="form-input resize-none" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Tell buyers about your dealership..." />
              </div>
            </div>
          )}

          {/* Step 2 — Package Selection */}
          {step === 2 && (
            <div>
              <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-2">Choose Your Package</h2>
              <p className="font-opensans text-gray-500 text-sm mb-6">All packages include 30 days of active listing space</p>
              {errors.packageId && <p className="text-red-500 text-sm mb-4">{errors.packageId}</p>}
              <div className="space-y-3">
                {PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => update("packageId", pkg.id)}
                    className={`package-card cursor-pointer flex items-center justify-between ${form.packageId === pkg.id ? "selected" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.packageId === pkg.id ? "border-brand-red bg-brand-red" : "border-gray-300"}`}>
                        {form.packageId === pkg.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-montserrat font-bold text-brand-charcoal">{pkg.name}</h3>
                          {pkg.popular && <span className="bg-brand-red text-white text-xs font-poppins font-bold px-2 py-0.5 rounded-full">Popular</span>}
                        </div>
                        <p className="font-opensans text-gray-500 text-sm">{pkg.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-poppins font-bold text-brand-red text-xl">{pkg.vehicleLimit}</p>
                      <p className="font-opensans text-gray-400 text-xs">vehicles</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Payment */}
          {step === 3 && (
            <div>
              <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-6">Review & Payment</h2>
              <div className="bg-brand-light rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between font-opensans text-sm">
                  <span className="text-gray-500">Business</span>
                  <span className="font-semibold">{form.businessName}</span>
                </div>
                <div className="flex justify-between font-opensans text-sm">
                  <span className="text-gray-500">Contact</span>
                  <span className="font-semibold">{form.contactPerson}</span>
                </div>
                <div className="flex justify-between font-opensans text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="font-semibold">{form.location}, {form.province}</span>
                </div>
                {selectedPackage && (
                  <>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-opensans text-sm">
                        <span className="text-gray-500">Package</span>
                        <span className="font-semibold">{selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between font-opensans text-sm">
                        <span className="text-gray-500">Vehicles</span>
                        <span className="font-semibold text-brand-red">{selectedPackage.vehicleLimit} vehicles / 30 days</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="font-opensans text-sm text-yellow-800">
                  <strong>Payment gateway coming soon.</strong> Package prices will be configured. Submitting will register your account pending admin approval.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={`flex mt-8 ${step > 1 ? "justify-between" : "justify-end"}`}>
            {step > 1 && (
              <button type="button" onClick={() => setStep((s) => (s - 1) as Step)} className="btn-secondary">
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" className="btn-primary flex items-center gap-2">
                Submit Registration <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <p className="text-center font-opensans text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <a href="/dealer/login" className="text-brand-red hover:underline font-semibold">Login here</a>
        </p>
      </div>
    </div>
  );
}
