"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { SAMPLE_VEHICLES } from "@/lib/data";

export default function EnquiryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const vehicle = SAMPLE_VEHICLES.find((v) => v.id === params.id);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Enquiry sent! The dealer will contact you shortly.");
    router.push(`/vehicles/${params.id}`);
  }

  return (
    <div className="min-h-screen bg-brand-light py-12">
      <div className="max-w-xl mx-auto px-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-red font-poppins text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="font-montserrat font-extrabold text-2xl text-brand-charcoal mb-1">Quick Enquiry</h1>
          {vehicle && (
            <p className="font-opensans text-gray-500 text-sm mb-6">
              About: <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Your Name</label>
              <input required className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Smith" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input required type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@email.com" />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input type="tel" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+27 000 000 0000" />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea required rows={4} className="form-input resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="I'm interested in this vehicle. Is it still available?" />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Send Enquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
