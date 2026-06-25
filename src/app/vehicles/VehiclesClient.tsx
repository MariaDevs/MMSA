"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, X } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";
import { SAMPLE_VEHICLES } from "@/lib/data";

const makes = ["All", "Toyota", "BMW", "Mercedes-Benz", "Volkswagen", "Ford", "Honda", "Audi", "Hyundai", "Kia", "Nissan"];
const bodyTypes = ["All", "Sedan", "SUV", "Hatchback", "Bakkie", "Coupe", "Van"];
const transmissions = ["All", "Manual", "Automatic"];
const fuelTypes = ["All", "Petrol", "Diesel", "Hybrid", "Electric"];

export default function VehiclesClient() {
  const searchParams = useSearchParams();
  const [make, setMake] = useState(searchParams.get("make") || "All");
  const [bodyType, setBodyType] = useState(searchParams.get("type") || "All");
  const [transmission, setTransmission] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return SAMPLE_VEHICLES.filter((v) => {
      if (make !== "All" && v.make !== make) return false;
      if (bodyType !== "All" && v.bodyType !== bodyType) return false;
      if (transmission !== "All" && v.transmission !== transmission) return false;
      if (fuelType !== "All" && v.fuelType !== fuelType) return false;
      if (maxPrice && v.price > parseInt(maxPrice)) return false;
      if (keyword) {
        const kw = keyword.toLowerCase();
        if (!`${v.make} ${v.model} ${v.bodyType}`.toLowerCase().includes(kw)) return false;
      }
      return true;
    });
  }, [make, bodyType, transmission, fuelType, maxPrice, keyword]);

  function clearFilters() {
    setMake("All");
    setBodyType("All");
    setTransmission("All");
    setFuelType("All");
    setMaxPrice("");
    setKeyword("");
  }

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <div className="bg-brand-charcoal py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-white mb-2">
            Browse Vehicles
          </h1>
          <p className="font-opensans text-gray-400">
            {SAMPLE_VEHICLES.length} vehicles from verified South African dealers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search make, model, type..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-dark flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          {(make !== "All" || bodyType !== "All" || transmission !== "All" || fuelType !== "All" || maxPrice) && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-brand-red font-poppins text-sm font-semibold hover:underline">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Make</label>
              <select value={make} onChange={(e) => setMake(e.target.value)} className="form-input">
                {makes.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Body Type</label>
              <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className="form-input">
                {bodyTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Transmission</label>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="form-input">
                {transmissions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Fuel Type</label>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="form-input">
                {fuelTypes.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="font-opensans text-gray-500 text-sm mb-6">
          Showing <span className="font-semibold text-brand-charcoal">{filtered.length}</span> vehicle{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-montserrat font-bold text-2xl text-gray-300 mb-2">No vehicles found</p>
            <p className="font-opensans text-gray-400 mb-6">Try adjusting your filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
