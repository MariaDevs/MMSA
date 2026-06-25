"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

const makes = ["All Makes", "Toyota", "BMW", "Mercedes-Benz", "Volkswagen", "Ford", "Honda", "Audi", "Hyundai", "Kia", "Nissan"];
const bodyTypes = ["All Types", "Sedan", "SUV", "Hatchback", "Bakkie", "Coupe", "Convertible", "Van", "Minibus"];
const priceRanges = ["Any Price", "Under R100k", "R100k–R200k", "R200k–R400k", "R400k–R600k", "R600k+"];

export default function SearchBar() {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [keyword, setKeyword] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (make && make !== "All Makes") params.set("make", make);
    if (bodyType && bodyType !== "All Types") params.set("type", bodyType);
    if (priceRange && priceRange !== "Any Price") params.set("price", priceRange);
    if (keyword) params.set("q", keyword);
    router.push(`/vehicles?${params.toString()}`);
  }

  return (
    <section className="bg-white shadow-xl -mt-6 relative z-10 max-w-6xl mx-auto rounded-xl mx-4 lg:mx-auto">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-brand-red" />
          <h2 className="font-montserrat font-bold text-brand-charcoal text-lg">Search Vehicles</h2>
        </div>
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Search make, model..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="form-input lg:col-span-1"
          />
          <select value={make} onChange={(e) => setMake(e.target.value)} className="form-input">
            {makes.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className="form-input">
            {bodyTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="form-input">
            {priceRanges.map((p) => <option key={p}>{p}</option>)}
          </select>
          <button type="submit" className="btn-primary flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
