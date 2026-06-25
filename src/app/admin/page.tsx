"use client";

import { useState } from "react";
import { Car, Users, Package, CheckCircle, XCircle, Clock, BarChart3, Eye, Trash2, RefreshCw } from "lucide-react";
import { SAMPLE_VEHICLES } from "@/lib/data";

type DealerStatus = "pending" | "approved" | "rejected";

const mockDealers = [
  { id: "1", name: "ABC Motors", contact: "John Smith", email: "info@abcmotors.co.za", location: "Johannesburg, GP", package: "Growth (40)", status: "approved" as DealerStatus, registered: "2024-06-01", vehicles: 3, expires: "2024-07-01" },
  { id: "2", name: "Premium Auto SA", contact: "Sarah Lee", email: "info@premiumauto.co.za", location: "Cape Town, WC", package: "Professional (60)", status: "pending" as DealerStatus, registered: "2024-06-20", vehicles: 0, expires: "-" },
  { id: "3", name: "Durban Auto Hub", contact: "Mike Naidoo", email: "info@durbanautohub.co.za", location: "Durban, KZN", package: "Starter (20)", status: "approved" as DealerStatus, registered: "2024-05-15", vehicles: 8, expires: "2024-07-15" },
  { id: "4", name: "VW Specialists", contact: "David Grobler", email: "vwspec@email.co.za", location: "Pretoria, GP", package: "Enterprise (200)", status: "pending" as DealerStatus, registered: "2024-06-22", vehicles: 0, expires: "-" },
];

const adminStats = [
  { label: "Total Dealers", value: "4", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Pending Approval", value: "2", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
  { label: "Active Listings", value: "11", icon: Car, color: "text-brand-red", bg: "bg-red-50" },
  { label: "Packages Active", value: "4", icon: Package, color: "text-green-500", bg: "bg-green-50" },
];

export default function AdminPage() {
  const [dealers, setDealers] = useState(mockDealers);
  const [activeTab, setActiveTab] = useState<"dealers" | "listings">("dealers");

  function updateStatus(id: string, status: DealerStatus) {
    setDealers((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  }

  const statusBadge = (status: DealerStatus) => {
    if (status === "approved") return <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 text-xs font-poppins font-semibold px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" />Approved</span>;
    if (status === "pending") return <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-100 text-xs font-poppins font-semibold px-2 py-1 rounded-full"><Clock className="w-3 h-3" />Pending</span>;
    return <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 text-xs font-poppins font-semibold px-2 py-1 rounded-full"><XCircle className="w-3 h-3" />Rejected</span>;
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <header className="bg-brand-charcoal px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Car className="text-brand-red w-6 h-6" />
          <div>
            <p className="font-montserrat font-extrabold text-white">MM<span className="text-brand-red">SA</span> <span className="text-gray-400 font-opensans font-normal text-sm">Admin Panel</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400 font-opensans text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Admin
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {adminStats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-opensans text-gray-400 text-xs">{label}</p>
                <div className={`${bg} rounded-full p-1.5`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <p className="font-montserrat font-extrabold text-3xl text-brand-charcoal">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "dealers", label: "Dealers", icon: Users },
            { id: "listings", label: "Listings", icon: Car },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-poppins text-sm font-semibold transition-colors ${
                activeTab === id ? "bg-brand-red text-white" : "bg-white text-gray-500 hover:text-brand-charcoal border border-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Dealers table */}
        {activeTab === "dealers" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-montserrat font-bold text-lg text-brand-charcoal">Dealer Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-light">
                  <tr>
                    {["Dealer", "Package", "Location", "Vehicles", "Status", "Expires", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-poppins font-semibold text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dealers.map((dealer) => (
                    <tr key={dealer.id} className="hover:bg-brand-light/50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-poppins font-semibold text-sm text-brand-charcoal">{dealer.name}</p>
                        <p className="font-opensans text-xs text-gray-400">{dealer.email}</p>
                      </td>
                      <td className="px-4 py-4 font-opensans text-sm text-gray-600">{dealer.package}</td>
                      <td className="px-4 py-4 font-opensans text-sm text-gray-600">{dealer.location}</td>
                      <td className="px-4 py-4 font-poppins font-semibold text-sm text-brand-charcoal">{dealer.vehicles}</td>
                      <td className="px-4 py-4">{statusBadge(dealer.status)}</td>
                      <td className="px-4 py-4 font-opensans text-sm text-gray-600">{dealer.expires}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {dealer.status === "pending" && (
                            <>
                              <button onClick={() => updateStatus(dealer.id, "approved")} className="text-green-600 hover:text-green-700 transition-colors" title="Approve">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => updateStatus(dealer.id, "rejected")} className="text-red-500 hover:text-red-700 transition-colors" title="Reject">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {dealer.status === "approved" && (
                            <button className="text-blue-500 hover:text-blue-700 transition-colors" title="Extend">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings table */}
        {activeTab === "listings" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-montserrat font-bold text-lg text-brand-charcoal">All Vehicle Listings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-light">
                  <tr>
                    {["Vehicle", "Price", "Mileage", "Dealer", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-poppins font-semibold text-xs text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SAMPLE_VEHICLES.map((v) => (
                    <tr key={v.id} className="hover:bg-brand-light/50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-poppins font-semibold text-sm text-brand-charcoal">{v.year} {v.make} {v.model}</p>
                        <p className="font-opensans text-xs text-gray-400">{v.bodyType} · {v.transmission}</p>
                      </td>
                      <td className="px-4 py-4 font-poppins font-semibold text-sm text-brand-red">R {v.price.toLocaleString()}</td>
                      <td className="px-4 py-4 font-opensans text-sm text-gray-600">{v.mileage.toLocaleString()} km</td>
                      <td className="px-4 py-4 font-opensans text-sm text-gray-600">{v.dealerName}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 text-xs font-poppins font-semibold px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />Active
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <a href={`/vehicles/${v.id}`} className="text-gray-400 hover:text-brand-red transition-colors"><Eye className="w-4 h-4" /></a>
                          <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
