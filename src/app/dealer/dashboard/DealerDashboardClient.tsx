"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import {
  Car, Plus, Clock, Eye, Edit, Trash2, CheckCircle, AlertCircle,
  Package, Settings, LogOut, Save, X, EyeOff, BarChart3, Lock
} from "lucide-react";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  bodyType: string;
  color: string;
  description: string;
  status: string;
  featured: boolean;
  createdAt: string;
};

type DealerData = {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  location: string;
  province: string;
  description: string;
  status: string;
  blocked: boolean;
  package: { id: string; name: string; vehicleLimit: number } | null;
  subscription: { endDate: string; active: boolean } | null;
  vehicles: Vehicle[];
  user: { email: string };
};

type Tab = "overview" | "listings" | "upload" | "account" | "password";

const TRANSMISSIONS = ["Manual", "Automatic"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Bakkie", "Coupe", "Van", "Minibus", "Convertible"];
const PROVINCES = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"];

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "text-green-700 bg-green-100",
  PENDING: "text-yellow-700 bg-yellow-100",
  REJECTED: "text-red-700 bg-red-100",
  EXPIRED: "text-gray-600 bg-gray-100",
};

export default function DealerDashboardClient() {
  const [tab, setTab] = useState<Tab>("overview");
  const [dealer, setDealer] = useState<DealerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  const fetchDealer = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/dealer/me");
    if (res.ok) setDealer(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchDealer(); }, [fetchDealer]);

  async function deleteVehicle(id: string) {
    if (!confirm("Remove this listing?")) return;
    const res = await fetch(`/api/dealer/vehicles/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Vehicle removed"); fetchDealer(); }
    else showToast("Failed to remove", "error");
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center font-poppins text-gray-400">Loading dashboard...</div>;

  if (!dealer) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <p className="font-montserrat font-bold text-xl text-brand-charcoal">Error loading dashboard</p>
      <button onClick={() => signOut({ callbackUrl: "/dealer/login" })} className="btn-primary">Sign Out</button>
    </div>
  );

  if (dealer.blocked) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brand-light">
      <Lock className="w-16 h-16 text-red-400" />
      <h1 className="font-montserrat font-bold text-2xl text-brand-charcoal">Account Blocked</h1>
      <p className="font-opensans text-gray-500 text-center max-w-sm">Your account has been blocked. Contact MotorsMarket SA support.</p>
      <button onClick={() => signOut({ callbackUrl: "/dealer/login" })} className="btn-primary">Sign Out</button>
    </div>
  );

  const activeVehicles = dealer.vehicles.filter((v) => v.status === "ACTIVE").length;
  const pendingVehicles = dealer.vehicles.filter((v) => v.status === "PENDING").length;
  const limit = dealer.package?.vehicleLimit ?? 0;
  const daysLeft = dealer.subscription
    ? Math.max(0, Math.ceil((new Date(dealer.subscription.endDate).getTime() - Date.now()) / 86400000))
    : 0;

  const sidebarItems: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "listings", label: "My Listings", icon: Car },
    { id: "upload", label: "Upload Vehicle", icon: Plus },
    { id: "account", label: "Account", icon: Settings },
    { id: "password", label: "Change Password", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-charcoal text-gray-300 min-h-screen fixed top-0 left-0 z-30">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Car className="text-brand-red w-6 h-6" />
            <span className="font-montserrat font-extrabold text-white text-xl">MM<span className="text-brand-red">SA</span></span>
          </div>
          <p className="font-poppins text-xs text-gray-400 mt-2 truncate">{dealer.businessName}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-poppins text-sm font-medium transition-colors ${tab === id ? "bg-brand-red text-white" : "hover:bg-gray-700 text-gray-300"}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={() => signOut({ callbackUrl: "/dealer/login" })} className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-brand-red font-poppins text-sm transition-colors w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile tabs */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-brand-charcoal px-4 py-3 flex gap-2 overflow-x-auto shadow-lg">
        {sidebarItems.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} className={`whitespace-nowrap px-3 py-1.5 rounded text-xs font-poppins font-semibold flex-shrink-0 ${tab === id ? "bg-brand-red text-white" : "text-gray-400"}`}>{label}</button>
        ))}
      </div>

      <div className="lg:ml-64 flex-1 pt-14 lg:pt-0">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-montserrat font-bold text-xl text-brand-charcoal">{dealer.businessName}</h1>
            <p className="font-opensans text-gray-400 text-sm">
              {dealer.package?.name ?? "No Package"} · {daysLeft} days remaining
              {dealer.status !== "APPROVED" && <span className="ml-2 text-yellow-600 font-semibold">(Pending approval)</span>}
            </p>
          </div>
          <button onClick={() => setTab("upload")} className="btn-primary text-sm py-2 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </header>

        <main className="p-6">
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Active Listings", value: activeVehicles, icon: CheckCircle, color: "text-green-500" },
                  { label: "Pending Review", value: pendingVehicles, icon: Clock, color: "text-yellow-500" },
                  { label: "Days Remaining", value: daysLeft, icon: Clock, color: "text-blue-500" },
                  { label: "Slots Used", value: `${dealer.vehicles.filter((v) => ["ACTIVE","PENDING"].includes(v.status)).length}/${limit}`, icon: Package, color: "text-brand-red" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <p className="font-opensans text-gray-400 text-xs">{label}</p>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <p className="font-montserrat font-extrabold text-2xl text-brand-charcoal">{value}</p>
                  </div>
                ))}
              </div>

              {/* Subscription card */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-red/10 rounded-full p-2">
                    <Package className="w-5 h-5 text-brand-red" />
                  </div>
                  <div>
                    <p className="font-poppins font-semibold text-brand-charcoal">{dealer.package?.name ?? "No active package"}</p>
                    <p className="font-opensans text-gray-400 text-xs">
                      {dealer.subscription
                        ? `Expires ${new Date(dealer.subscription.endDate).toLocaleDateString()}`
                        : "No subscription active"}
                    </p>
                  </div>
                </div>
                <a href="/packages" className="text-brand-red font-poppins text-sm font-semibold hover:underline">Upgrade</a>
              </div>

              {/* Recent vehicles */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-montserrat font-bold text-base text-brand-charcoal mb-4">Recent Listings</h2>
                {dealer.vehicles.slice(0, 5).map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-poppins font-semibold text-sm text-brand-charcoal">{v.year} {v.make} {v.model}</p>
                      <p className="font-opensans text-xs text-gray-400">R {v.price.toLocaleString()}</p>
                    </div>
                    <span className={`text-xs font-poppins font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[v.status] ?? "bg-gray-100 text-gray-500"}`}>{v.status}</span>
                  </div>
                ))}
                {dealer.vehicles.length === 0 && <p className="font-opensans text-gray-400 text-sm">No vehicles yet. <button onClick={() => setTab("upload")} className="text-brand-red underline">Upload now</button></p>}
              </div>
            </div>
          )}

          {/* LISTINGS */}
          {tab === "listings" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-montserrat font-bold text-lg text-brand-charcoal">My Vehicle Listings</h2>
                <span className="font-opensans text-sm text-gray-400">{dealer.vehicles.length} / {limit} slots</span>
              </div>
              {dealer.vehicles.length === 0 && (
                <div className="text-center py-16">
                  <Car className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="font-poppins font-semibold text-gray-400">No vehicles listed yet</p>
                  <button onClick={() => setTab("upload")} className="btn-primary mt-4 text-sm">Upload First Vehicle</button>
                </div>
              )}
              <div className="divide-y divide-gray-50">
                {dealer.vehicles.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-4 hover:bg-brand-light/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-10 bg-gradient-to-br from-brand-charcoal to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-poppins font-semibold text-sm text-brand-charcoal">{v.year} {v.make} {v.model}</p>
                        <p className="font-opensans text-xs text-gray-400">R {v.price.toLocaleString()} · {v.mileage.toLocaleString()} km · {v.transmission}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-poppins font-semibold px-2 py-1 rounded-full hidden sm:inline ${STATUS_COLOR[v.status] ?? "bg-gray-100"}`}>{v.status}</span>
                      <button onClick={() => setEditVehicle(v)} className="text-gray-400 hover:text-blue-500 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deleteVehicle(v.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPLOAD */}
          {tab === "upload" && (
            <UploadVehicleForm
              dealerStatus={dealer.status}
              vehicleCount={dealer.vehicles.filter((v) => ["ACTIVE","PENDING"].includes(v.status)).length}
              limit={limit}
              onSuccess={() => { fetchDealer(); setTab("listings"); showToast("Vehicle submitted for review!"); }}
              onError={(msg) => showToast(msg, "error")}
            />
          )}

          {/* ACCOUNT */}
          {tab === "account" && (
            <AccountForm dealer={dealer} onSuccess={() => { fetchDealer(); showToast("Account updated!"); }} />
          )}

          {/* CHANGE PASSWORD */}
          {tab === "password" && (
            <ChangePasswordForm onSuccess={() => showToast("Password changed!")} onError={(m) => showToast(m, "error")} />
          )}
        </main>
      </div>

      {/* Edit vehicle modal */}
      {editVehicle && (
        <EditVehicleModal
          vehicle={editVehicle}
          onClose={() => setEditVehicle(null)}
          onSave={async (id, data) => {
            const res = await fetch(`/api/dealer/vehicles/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (res.ok) { showToast("Vehicle updated"); fetchDealer(); setEditVehicle(null); }
            else showToast("Update failed", "error");
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-xl font-poppins text-sm text-white flex items-center gap-2 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function UploadVehicleForm({ dealerStatus, vehicleCount, limit, onSuccess, onError }: {
  dealerStatus: string;
  vehicleCount: number;
  limit: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [form, setForm] = useState({ make: "", model: "", year: "", price: "", mileage: "", transmission: "", fuelType: "", bodyType: "", color: "", description: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/dealer/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, year: Number(form.year), price: Number(form.price), mileage: Number(form.mileage) }),
    });
    setLoading(false);
    if (res.ok) { onSuccess(); setForm({ make: "", model: "", year: "", price: "", mileage: "", transmission: "", fuelType: "", bodyType: "", color: "", description: "" }); }
    else { const d = await res.json(); onError(d.error ?? "Upload failed"); }
  }

  if (dealerStatus !== "APPROVED") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-montserrat font-bold text-yellow-800">Account Pending Approval</h3>
          <p className="font-opensans text-yellow-700 text-sm mt-1">Your account is waiting for admin review. You can upload vehicles once approved.</p>
        </div>
      </div>
    );
  }

  if (vehicleCount >= limit) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-montserrat font-bold text-red-800">Package Limit Reached</h3>
          <p className="font-opensans text-red-700 text-sm mt-1">You've used all {limit} vehicle slots. <a href="/packages" className="underline">Upgrade your package</a> to add more.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat font-bold text-xl text-brand-charcoal">Upload New Vehicle</h2>
          <span className="font-opensans text-sm text-gray-400">{vehicleCount}/{limit} slots used</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: "make", placeholder: "Toyota" },
              { key: "model", placeholder: "Hilux 2.8 GD-6" },
              { key: "year", placeholder: "2022", type: "number" },
              { key: "price", placeholder: "350000", type: "number" },
              { key: "mileage", placeholder: "45000", type: "number" },
              { key: "color", placeholder: "White" },
            ].map(({ key, placeholder, type }) => (
              <div key={key}>
                <label className="form-label capitalize">{key} *</label>
                <input required type={type ?? "text"} className="form-input" placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="form-label">Transmission *</label>
              <select required className="form-input" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
                <option value="">Select</option>
                {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Fuel Type *</label>
              <select required className="form-input" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })}>
                <option value="">Select</option>
                {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">Body Type *</label>
              <select required className="form-input" value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value })}>
                <option value="">Select</option>
                {BODY_TYPES.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Description *</label>
            <textarea required rows={4} className="form-input resize-none" placeholder="Full vehicle description, service history, condition notes..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="font-opensans text-xs text-blue-700">Vehicle will go live once admin approves the listing.</p>
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            <Plus className="w-4 h-4" />
            {loading ? "Submitting..." : "Submit Vehicle for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AccountForm({ dealer, onSuccess }: { dealer: DealerData; onSuccess: () => void }) {
  const [form, setForm] = useState({
    businessName: dealer.businessName,
    contactName: dealer.contactName,
    phone: dealer.phone,
    location: dealer.location,
    province: dealer.province,
    description: dealer.description,
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/dealer/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) onSuccess();
  }

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-6">Account Settings</h2>
        <p className="font-opensans text-xs text-gray-400 mb-4">Email: <strong>{dealer.user.email}</strong></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Business Name</label>
              <input className="form-input" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Contact Person</label>
              <input className="form-input" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Province</label>
              <select className="form-input" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>
                {PROVINCES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea rows={3} className="form-input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ChangePasswordForm({ onSuccess, onError }: { onSuccess: () => void; onError: (msg: string) => void }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { onError("New passwords don't match"); return; }
    if (form.newPassword.length < 8) { onError("Password must be at least 8 characters"); return; }
    setLoading(true);
    const res = await fetch("/api/dealer/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
    });
    setLoading(false);
    if (res.ok) { onSuccess(); setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    else { const d = await res.json(); onError(d.error ?? "Password change failed"); }
  }

  return (
    <div className="max-w-md">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Current Password</label>
            <div className="relative">
              <input required type={showCurrent ? "text" : "password"} className="form-input pr-10" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="form-label">New Password</label>
            <div className="relative">
              <input required type={showNew ? "text" : "password"} className="form-input pr-10" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="Min 8 characters" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="form-label">Confirm New Password</label>
            <input required type="password" className="form-input" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60 w-full justify-center">
            <Lock className="w-4 h-4" />
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function EditVehicleModal({ vehicle, onClose, onSave }: {
  vehicle: Vehicle;
  onClose: () => void;
  onSave: (id: string, data: object) => void;
}) {
  const [form, setForm] = useState({
    make: vehicle.make, model: vehicle.model, year: String(vehicle.year),
    price: String(vehicle.price), mileage: String(vehicle.mileage),
    transmission: vehicle.transmission, fuelType: vehicle.fuelType,
    bodyType: vehicle.bodyType, color: vehicle.color, description: vehicle.description,
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-montserrat font-bold text-xl text-brand-charcoal">Edit Vehicle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[["make","Make"],["model","Model"],["year","Year"],["price","Price (R)"],["mileage","Mileage (km)"],["color","Color"]].map(([k,l]) => (
              <div key={k}>
                <label className="form-label text-xs">{l}</label>
                <input className="form-input text-sm" value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="form-label text-xs">Transmission</label>
              <select className="form-input text-sm" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
                {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Fuel Type</label>
              <select className="form-input text-sm" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })}>
                {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="form-label text-xs">Body Type</label>
              <select className="form-input text-sm" value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value })}>
                {BODY_TYPES.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label text-xs">Description</label>
            <textarea rows={3} className="form-input text-sm resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => onSave(vehicle.id, { ...form, year: Number(form.year), price: Number(form.price), mileage: Number(form.mileage) })} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
