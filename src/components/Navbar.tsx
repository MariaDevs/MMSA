"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Car, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-brand-charcoal sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Car className="text-brand-red w-7 h-7" />
              <span className="font-montserrat font-extrabold text-2xl text-white">
                MM<span className="text-brand-red">SA</span>
              </span>
            </div>
            <div className="hidden sm:block border-l border-gray-500 pl-2">
              <p className="text-gray-400 text-xs font-poppins leading-tight">
                MotorsMarket SA
              </p>
              <p className="text-gray-500 text-[10px] font-opensans">
                Quality Cars. Trusted Service.
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/vehicles" className="text-gray-300 hover:text-brand-red font-poppins text-sm font-medium transition-colors">
              Browse Vehicles
            </Link>
            <Link href="/dealers" className="text-gray-300 hover:text-brand-red font-poppins text-sm font-medium transition-colors">
              Dealers
            </Link>
            <Link href="/packages" className="text-gray-300 hover:text-brand-red font-poppins text-sm font-medium transition-colors">
              Packages
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-brand-red font-poppins text-sm font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dealer/login" className="text-gray-300 hover:text-white font-poppins text-sm font-medium transition-colors">
              Dealer Login
            </Link>
            <Link href="/dealer/register" className="btn-primary text-sm py-2 px-4">
              List Your Cars
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-dark border-t border-gray-700 px-4 pb-4 pt-2 space-y-2">
          <Link href="/vehicles" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-brand-red py-2 font-poppins text-sm">Browse Vehicles</Link>
          <Link href="/dealers" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-brand-red py-2 font-poppins text-sm">Dealers</Link>
          <Link href="/packages" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-brand-red py-2 font-poppins text-sm">Packages</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block text-gray-300 hover:text-brand-red py-2 font-poppins text-sm">Contact</Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/dealer/login" onClick={() => setOpen(false)} className="text-center border border-gray-500 text-gray-300 py-2 rounded font-poppins text-sm">Dealer Login</Link>
            <Link href="/dealer/register" onClick={() => setOpen(false)} className="btn-primary text-center text-sm py-2">List Your Cars</Link>
          </div>
        </div>
      )}
    </header>
  );
}
