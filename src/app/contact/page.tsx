"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Message sent! We'll get back to you shortly.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-brand-charcoal py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl text-white mb-4">Contact Us</h1>
          <p className="font-opensans text-gray-300">We're here to help. Reach out any time.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-4">Get in Touch</h2>
              <p className="font-opensans text-gray-500 text-sm leading-relaxed">
                Have a question about listing your vehicles or using the platform? Contact us directly.
              </p>
            </div>
            {[
              { icon: Phone, label: "Phone", value: "+27 000 000 0000" },
              { icon: Mail, label: "Email", value: "info@motormarketsa.co.za" },
              { icon: MapPin, label: "Location", value: "South Africa" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="bg-brand-red/10 rounded-full p-2.5 flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <p className="font-poppins font-semibold text-sm text-brand-charcoal">{label}</p>
                  <p className="font-opensans text-gray-500 text-sm">{value}</p>
                </div>
              </div>
            ))}
            <a
              href="https://wa.me/27000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-poppins font-semibold py-3 px-5 rounded-lg transition-colors w-full justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-4">
              <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-2">Send a Message</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input required className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" required className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+27 000 000 0000" />
                </div>
                <div>
                  <label className="form-label">Subject</label>
                  <select className="form-input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    <option value="">Select subject</option>
                    <option>Dealer Registration</option>
                    <option>Package Enquiry</option>
                    <option>Technical Support</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea required rows={5} className="form-input resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" />
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
