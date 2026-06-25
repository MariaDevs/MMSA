"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Plus, Clock, BarChart3, Package, Settings, LogOut, Eye, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { SAMPLE_VEHICLES } from "@/lib/data";

const dealerVehicles = SAMPLE_VEHICLES.slice(0, 3);

const stats = [
  { label: "Active Listings", value: "3", icon: Car, color: "text-brand-red" },
  { label: "Days Remaining", value: "18", icon: Clock, color: "text-blue-500" },
  { label: "Total Views", value: "247", icon: Eye, color: "text-green-500" },
  { label: "Package", value: "Growth", icon: Package, color: "text-purple-500" },
];

export default function DealerDashboard() {
  const [activeTab, setActiveTab] = useState<"listings" | "upload" | "account">("listings");

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-charcoal text-gray-300 min-h-screen">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Car className="text-brand-red w-6 h-6" />
            <span className="font-montserrat font-extrabold text-white">MM<span className="text-brand-red">SA</span></span>
          </div>
          <p className="font-opensans text-xs text-gray-500 mt-1">Dealer Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "listings", label: "My Listings", icon: Car },
            { id: "upload", label: "Upload Vehicle", icon: Plus },
            { id: "account", label: "Account Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-poppins text-sm font-medium transition-colors ${
                activeTab === id ? "bg-brand-red text-white" : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-brand-red font-poppins text-sm transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-montserrat font-bold text-xl text-brand-charcoal">Welcome, ABC Motors</h1>
            <p className="font-opensans text-gray-400 text-sm">Growth Package · 18 days remaining</p>
          </div>
          <button
            onClick={() => setActiveTab("upload")}
            className="btn-primary flex items-center gap-2 text-sm py-2"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        </header>

        <main className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-opensans text-gray-400 text-xs">{label}</p>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="font-montserrat font-extrabold text-2xl text-brand-charcoal">{value}</p>
              </div>
            ))}
          </div>

          {/* Package info bar */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-brand-red/10 rounded-full p-2">
                <Package className="w-5 h-5 text-brand-red" />
              </div>
              <div>
                <p className="font-poppins font-semibold text-brand-charcoal text-sm">Growth Dealer Package</p>
                <p className="font-opensans text-gray-400 text-xs">3 / 40 vehicle slots used · Expires in 18 days</p>
              </div>
            </div>
            <Link href="/packages" className="text-brand-red font-poppins text-sm font-semibold hover:underline">
              Upgrade
            </Link>
          </div>

          {/* Listings tab */}
          {activeTab === "listings" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-montserrat font-bold text-lg text-brand-charcoal">My Vehicle Listings</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {dealerVehicles.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-4 hover:bg-brand-light transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-gradient-to-br from-brand-charcoal to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-poppins font-semibold text-brand-charcoal text-sm">
                          {v.year} {v.make} {v.model}
                        </p>
                        <p className="font-opensans text-gray-400 text-xs">
                          R {v.price.toLocaleString()} · {v.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-green-600 text-xs font-poppins font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active
                      </span>
                      <Link href={`/vehicles/${v.id}`} className="text-gray-400 hover:text-brand-red transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="text-gray-400 hover:text-blue-500 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload tab */}
          {activeTab === "upload" && (
            <UploadVehicleForm />
          )}

          {/* Account tab */}
          {activeTab === "account" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-montserrat font-bold text-lg text-brand-charcoal mb-4">Account Settings</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Business Name", value: "ABC Motors" },
                  { label: "Contact Person", value: "John Smith" },
                  { label: "Email", value: "info@abcmotors.co.za" },
                  { label: "Phone", value: "+27 11 000 0000" },
                  { label: "Location", value: "Johannesburg" },
                  { label: "Province", value: "Gauteng" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="form-label">{label}</label>
                    <input defaultValue={value} className="form-input" />
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-6">Save Changes</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function UploadVehicleForm() {
  const [form, setForm] = useState({
    make: "", model: "", year: "", price: "", mileage: "",
    transmission: "", fuelType: "", bodyType: "", color: "", description: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Vehicle submitted for admin approval!");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-montserrat font-bold text-lg text-brand-charcoal mb-6">Upload New Vehicle</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {[
          { key: "make", label: "Make", placeholder: "Toyota" },
          { key: "model", label: "Model", placeholder: "Hilux 2.8 GD-6" },
          { key: "year", label: "Year", placeholder: "2022" },
          { key: "price", label: "Price (R)", placeholder: "350000" },
          { key: "mileage", label: "Mileage (km)", placeholder: "45000" },
          { key: "color", label: "Color", placeholder: "White" },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="form-label">{label} *</label>
            <input required className="form-input" placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <div>
          <label className="form-label">Transmission *</label>
          <select required className="form-input" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
            <option value="">Select</option>
            <option>Manual</option>
            <option>Automatic</option>
          </select>
        </div>
        <div>
          <label className="form-label">Fuel Type *</label>
          <select required className="form-input" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })}>
            <option value="">Select</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Hybrid</option>
            <option>Electric</option>
          </select>
        </div>
        <div>
          <label className="form-label">Body Type *</label>
          <select required className="form-input" value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value })}>
            <option value="">Select</option>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hatchback</option>
            <option>Bakkie</option>
            <option>Coupe</option>
            <option>Van</option>
            <option>Minibus</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label">Description *</label>
        <textarea required rows={4} className="form-input resize-none" placeholder="Full vehicle description, service history, condition notes..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="mb-6">
        <label className="form-label">Vehicle Photos</label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-brand-red/50 transition-colors cursor-pointer">
          <Car className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="font-opensans text-gray-400 text-sm">Click to upload vehicle photos</p>
          <p className="font-opensans text-gray-300 text-xs mt-1">JPG, PNG up to 10MB each</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <p className="font-opensans text-xs">Vehicle will be reviewed by admin before going live.</p>
      </div>
      <button type="submit" className="btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Submit Vehicle
      </button>
    </form>
  );
}
