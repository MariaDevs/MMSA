"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import {
  Users, Car, Package, BarChart3, Plus, Search, Edit, Trash2,
  CheckCircle, XCircle, Clock, Shield, RefreshCw, Eye, EyeOff,
  Lock, Unlock, LogOut, ChevronDown, X, Save, AlertCircle
} from "lucide-react";

type Dealer = {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  location: string;
  province: string;
  description: string;
  status: string;
  blocked: boolean;
  packageId: string | null;
  package: { id: string; name: string; vehicleLimit: number; price: number } | null;
  subscription: { endDate: string; active: boolean } | null;
  user: { id: string; email: string; createdAt: string };
  _count: { vehicles: number };
};

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
  featured: boolean;
  dealer: { businessName: string; location: string };
};

type Package = { id: string; name: string; vehicleLimit: number; price: number; description: string };

const TABS = ["Overview", "Dealers", "Vehicles", "Add Dealer"] as const;
type Tab = typeof TABS[number];

export default function AdminClient() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editDealer, setEditDealer] = useState<Dealer | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [d, v, p] = await Promise.all([
      fetch("/api/admin/dealers").then((r) => r.json()),
      fetch("/api/admin/vehicles").then((r) => r.json()),
      fetch("/api/admin/packages").then((r) => r.json()),
    ]);
    setDealers(Array.isArray(d) ? d : []);
    setVehicles(Array.isArray(v) ? v : []);
    setPackages(Array.isArray(p) ? p : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function patchDealer(id: string, data: object) {
    const res = await fetch(`/api/admin/dealers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showToast("Dealer updated");
      fetchAll();
    } else {
      showToast("Update failed", "error");
    }
  }

  async function deleteDealer(id: string) {
    if (!confirm("Delete this dealer and all their data?")) return;
    const res = await fetch(`/api/admin/dealers/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Dealer deleted"); fetchAll(); }
    else showToast("Delete failed", "error");
  }

  async function patchVehicle(id: string, data: object) {
    const res = await fetch(`/api/admin/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { showToast("Vehicle updated"); fetchAll(); }
    else showToast("Update failed", "error");
  }

  async function deleteVehicle(id: string) {
    if (!confirm("Delete this vehicle listing?")) return;
    const res = await fetch(`/api/admin/vehicles/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Vehicle deleted"); fetchAll(); }
    else showToast("Delete failed", "error");
  }

  const filteredDealers = dealers.filter((d) =>
    d.businessName.toLowerCase().includes(search.toLowerCase()) ||
    d.user.email.toLowerCase().includes(search.toLowerCase()) ||
    d.location.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: dealers.length,
    pending: dealers.filter((d) => d.status === "PENDING").length,
    approved: dealers.filter((d) => d.status === "APPROVED").length,
    blocked: dealers.filter((d) => d.blocked).length,
    vehicles: vehicles.length,
  };

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-charcoal text-gray-300 min-h-screen fixed top-0 left-0 z-30">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Car className="text-brand-red w-6 h-6" />
            <span className="font-montserrat font-extrabold text-white text-xl">MM<span className="text-brand-red">SA</span></span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield className="w-3.5 h-3.5 text-brand-red" />
            <span className="font-poppins text-xs text-brand-red font-semibold">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map((t) => {
            const icons: Record<Tab, any> = { Overview: BarChart3, Dealers: Users, Vehicles: Car, "Add Dealer": Plus };
            const Icon = icons[t];
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-poppins text-sm font-medium transition-colors ${
                  tab === t ? "bg-brand-red text-white" : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => signOut({ callbackUrl: "/dealer/login" })}
            className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-brand-red font-poppins text-sm transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64 flex-1">
        {/* Mobile tabs */}
        <div className="lg:hidden bg-brand-charcoal px-4 py-3 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap px-3 py-1.5 rounded text-xs font-poppins font-semibold flex-shrink-0 ${tab === t ? "bg-brand-red text-white" : "text-gray-400"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <h1 className="font-montserrat font-bold text-xl text-brand-charcoal">{tab}</h1>
        </header>

        <main className="p-6">
          {loading && <div className="text-center py-20 font-poppins text-gray-400">Loading...</div>}

          {!loading && tab === "Overview" && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[
                  { label: "Total Dealers", value: stats.total, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
                  { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
                  { label: "Blocked", value: stats.blocked, icon: Shield, color: "text-red-500", bg: "bg-red-50" },
                  { label: "Vehicles", value: stats.vehicles, icon: Car, color: "text-brand-red", bg: "bg-red-50" },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-opensans text-gray-400 text-xs">{label}</p>
                      <div className={`${bg} rounded-full p-1.5`}><Icon className={`w-4 h-4 ${color}`} /></div>
                    </div>
                    <p className="font-montserrat font-extrabold text-3xl text-brand-charcoal">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h2 className="font-montserrat font-bold text-base text-brand-charcoal mb-4">Recent Dealers</h2>
                  <div className="space-y-3">
                    {dealers.slice(0, 5).map((d) => (
                      <div key={d.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="font-poppins font-semibold text-sm text-brand-charcoal">{d.businessName}</p>
                          <p className="font-opensans text-xs text-gray-400">{d.user.email}</p>
                        </div>
                        <StatusBadge status={d.blocked ? "BLOCKED" : d.status} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h2 className="font-montserrat font-bold text-base text-brand-charcoal mb-4">Package Distribution</h2>
                  {packages.map((pkg) => {
                    const count = dealers.filter((d) => d.packageId === pkg.id).length;
                    const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    return (
                      <div key={pkg.id} className="mb-3">
                        <div className="flex justify-between font-opensans text-sm mb-1">
                          <span>{pkg.name}</span>
                          <span className="font-semibold">{count} dealers</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-brand-red rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!loading && tab === "Dealers" && (
            <div>
              <div className="flex gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search dealers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-input pl-9 text-sm"
                  />
                </div>
                <button onClick={() => setTab("Add Dealer")} className="btn-primary text-sm py-2 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Dealer
                </button>
              </div>

              <div className="space-y-3">
                {filteredDealers.map((dealer) => (
                  <DealerRow
                    key={dealer.id}
                    dealer={dealer}
                    packages={packages}
                    onPatch={patchDealer}
                    onDelete={deleteDealer}
                    onEdit={setEditDealer}
                  />
                ))}
                {filteredDealers.length === 0 && (
                  <div className="text-center py-12 text-gray-400 font-poppins">No dealers found</div>
                )}
              </div>
            </div>
          )}

          {!loading && tab === "Vehicles" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-brand-light">
                    <tr>
                      {["Vehicle", "Price", "Dealer", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-poppins font-semibold text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-brand-light/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-poppins font-semibold text-sm text-brand-charcoal">{v.year} {v.make} {v.model}</p>
                        </td>
                        <td className="px-4 py-3 font-poppins font-semibold text-sm text-brand-red">R {v.price.toLocaleString()}</td>
                        <td className="px-4 py-3 font-opensans text-sm text-gray-600">{v.dealer.businessName}</td>
                        <td className="px-4 py-3">
                          <select
                            value={v.status}
                            onChange={(e) => patchVehicle(v.id, { status: e.target.value })}
                            className="text-xs font-poppins border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-red"
                          >
                            {["PENDING", "ACTIVE", "REJECTED", "EXPIRED"].map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => patchVehicle(v.id, { featured: !v.featured })}
                              title={v.featured ? "Remove featured" : "Mark featured"}
                              className={`text-xs font-poppins font-semibold px-2 py-1 rounded transition-colors ${v.featured ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-gray-100 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"}`}
                            >
                              {v.featured ? "★ Featured" : "☆ Feature"}
                            </button>
                            <button onClick={() => deleteVehicle(v.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {vehicles.length === 0 && <div className="text-center py-12 text-gray-400 font-poppins">No vehicles</div>}
              </div>
            </div>
          )}

          {!loading && tab === "Add Dealer" && (
            <AddDealerForm packages={packages} onSuccess={() => { fetchAll(); setTab("Dealers"); showToast("Dealer created!"); }} />
          )}
        </main>
      </div>

      {/* Edit Dealer Modal */}
      {editDealer && (
        <EditDealerModal
          dealer={editDealer}
          packages={packages}
          onClose={() => setEditDealer(null)}
          onSave={async (id, data) => { await patchDealer(id, data); setEditDealer(null); }}
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
    BLOCKED: "bg-gray-200 text-gray-600",
  };
  return (
    <span className={`text-xs font-poppins font-semibold px-2 py-1 rounded-full ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

function DealerRow({ dealer, packages, onPatch, onDelete, onEdit }: {
  dealer: Dealer;
  packages: Package[];
  onPatch: (id: string, data: object) => void;
  onDelete: (id: string) => void;
  onEdit: (d: Dealer) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-brand-light/30 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-charcoal rounded-lg flex items-center justify-center flex-shrink-0">
            <Car className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <p className="font-poppins font-semibold text-brand-charcoal">{dealer.businessName}</p>
            <p className="font-opensans text-xs text-gray-400">{dealer.user.email} · {dealer.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={dealer.blocked ? "BLOCKED" : dealer.status} />
          <span className="font-opensans text-xs text-gray-400 hidden sm:block">
            {dealer._count.vehicles} vehicles
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-brand-light/20">
          <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm font-opensans">
            <div><span className="text-gray-400">Contact:</span> <span className="font-semibold">{dealer.contactName}</span></div>
            <div><span className="text-gray-400">Phone:</span> <span className="font-semibold">{dealer.phone}</span></div>
            <div><span className="text-gray-400">Province:</span> <span className="font-semibold">{dealer.province}</span></div>
            <div><span className="text-gray-400">Package:</span> <span className="font-semibold text-brand-red">{dealer.package?.name ?? "None"}</span></div>
            <div><span className="text-gray-400">Subscription:</span> <span className="font-semibold">{dealer.subscription ? new Date(dealer.subscription.endDate).toLocaleDateString() : "None"}</span></div>
            <div><span className="text-gray-400">Vehicles:</span> <span className="font-semibold">{dealer._count.vehicles} / {dealer.package?.vehicleLimit ?? 0}</span></div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status */}
            <select
              value={dealer.status}
              onChange={(e) => onPatch(dealer.id, { status: e.target.value })}
              className="text-xs font-poppins border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-red bg-white"
            >
              <option value="PENDING">Set Pending</option>
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
            </select>

            {/* Package */}
            <select
              value={dealer.packageId ?? ""}
              onChange={(e) => onPatch(dealer.id, { packageId: e.target.value })}
              className="text-xs font-poppins border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-red bg-white"
            >
              <option value="">No Package</option>
              {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            {/* Block/Unblock */}
            <button
              onClick={() => onPatch(dealer.id, { blocked: !dealer.blocked })}
              className={`flex items-center gap-1.5 text-xs font-poppins font-semibold px-3 py-2 rounded transition-colors ${dealer.blocked ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
            >
              {dealer.blocked ? <><Unlock className="w-3.5 h-3.5" /> Unblock</> : <><Lock className="w-3.5 h-3.5" /> Block</>}
            </button>

            {/* Extend 30 days */}
            <button
              onClick={() => onPatch(dealer.id, { extendSubscription: true, packageId: dealer.packageId })}
              className="flex items-center gap-1.5 text-xs font-poppins font-semibold px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Extend 30 days
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit(dealer)}
              className="flex items-center gap-1.5 text-xs font-poppins font-semibold px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" /> Edit Info & Password
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(dealer.id)}
              className="flex items-center gap-1.5 text-xs font-poppins font-semibold px-3 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EditDealerModal({ dealer, packages, onClose, onSave }: {
  dealer: Dealer;
  packages: Package[];
  onClose: () => void;
  onSave: (id: string, data: object) => void;
}) {
  const [form, setForm] = useState({
    businessName: dealer.businessName,
    contactName: dealer.contactName,
    phone: dealer.phone,
    location: dealer.location,
    province: dealer.province,
    description: dealer.description,
    email: dealer.user.email,
    newPassword: "",
    packageId: dealer.packageId ?? "",
  });
  const [showPw, setShowPw] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = { ...form };
    if (!form.newPassword) delete payload.newPassword;
    if (!form.packageId) delete payload.packageId;
    onSave(dealer.id, payload);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-montserrat font-bold text-xl text-brand-charcoal">Edit Dealer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "businessName", label: "Business Name" },
              { key: "contactName", label: "Contact Name" },
              { key: "phone", label: "Phone" },
              { key: "location", label: "Location" },
              { key: "province", label: "Province" },
              { key: "email", label: "Email" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="form-label text-xs">{label}</label>
                <input
                  className="form-input text-sm"
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="form-label text-xs">Description</label>
            <textarea rows={2} className="form-input text-sm resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="form-label text-xs">Package</label>
            <select className="form-input text-sm" value={form.packageId} onChange={(e) => setForm({ ...form, packageId: e.target.value })}>
              <option value="">No Package</option>
              {packages.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.vehicleLimit} vehicles)</option>)}
            </select>
          </div>
          <div>
            <label className="form-label text-xs">New Password (leave blank to keep current)</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                className="form-input text-sm pr-10"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                placeholder="Leave blank to keep current"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddDealerForm({ packages, onSuccess }: { packages: Package[]; onSuccess: () => void }) {
  const [form, setForm] = useState({
    businessName: "", contactName: "", email: "", password: "",
    phone: "", location: "", province: "", description: "", packageId: "", status: "APPROVED",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const PROVINCES = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/dealers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      onSuccess();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to create dealer");
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <h2 className="font-montserrat font-bold text-xl text-brand-charcoal mb-6">Create New Dealer Account</h2>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 font-opensans text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: "businessName", label: "Business Name", placeholder: "ABC Motors" },
              { key: "contactName", label: "Contact Person", placeholder: "John Smith" },
              { key: "email", label: "Email", placeholder: "info@dealer.co.za" },
              { key: "password", label: "Password", placeholder: "Min 8 characters", type: "password" },
              { key: "phone", label: "Phone", placeholder: "+27 11 000 0000" },
              { key: "location", label: "City / Town", placeholder: "Johannesburg" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="form-label">{label} *</label>
                <input
                  required
                  type={type ?? "text"}
                  className="form-input"
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <label className="form-label">Province *</label>
              <select required className="form-input" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>
                <option value="">Select</option>
                {PROVINCES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Package</label>
              <select className="form-input" value={form.packageId} onChange={(e) => setForm({ ...form, packageId: e.target.value })}>
                <option value="">No Package</option>
                {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Initial Status</label>
            <select className="form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="APPROVED">Approved (active immediately)</option>
              <option value="PENDING">Pending (awaiting approval)</option>
            </select>
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea rows={3} className="form-input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create Dealer Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
