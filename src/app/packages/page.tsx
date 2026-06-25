import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PACKAGES } from "@/lib/data";

export const metadata = {
  title: "Dealer Packages | MotorsMarket SA",
};

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-brand-charcoal py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-brand-red font-poppins font-semibold text-sm uppercase tracking-widest mb-3">
            Flexible Plans
          </p>
          <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl text-white mb-4">
            Dealer Packages
          </h1>
          <p className="font-opensans text-gray-300 max-w-xl mx-auto">
            Choose the right package for your dealership. All packages include 30 days of listing space.
            Prices to be confirmed.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-200 hover:shadow-2xl ${
                pkg.popular ? "border-brand-red shadow-xl" : "border-gray-200 hover:border-brand-red/40"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-brand-red text-white text-xs font-poppins font-bold px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="pt-2 mb-4">
                <h3 className="font-montserrat font-bold text-brand-charcoal text-lg">{pkg.name}</h3>
                <div className="mt-3 mb-1">
                  <span className="font-poppins font-extrabold text-brand-red text-4xl">{pkg.vehicleLimit}</span>
                  <span className="font-opensans text-gray-400 text-sm ml-1">vehicles</span>
                </div>
                <p className="font-opensans text-gray-400 text-xs">{pkg.durationDays} days listing period</p>
              </div>

              <p className="font-opensans text-gray-500 text-sm mb-6 leading-relaxed min-h-[48px]">
                {pkg.description}
              </p>

              <ul className="space-y-2.5 mb-8">
                {[
                  `${pkg.vehicleLimit} active vehicle slots`,
                  "30-day listing period",
                  "Full vehicle details + photos",
                  "Dealer profile page",
                  "Dashboard management",
                  "Direct buyer enquiries",
                  "Admin approval & support",
                  ...(pkg.vehicleLimit >= 60 ? ["Priority listing placement"] : []),
                  ...(pkg.vehicleLimit >= 200 ? ["Dedicated account manager"] : []),
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 font-opensans text-sm text-gray-600">
                    <Check className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/dealer/register?package=${pkg.id}`}
                className={`w-full flex items-center justify-center gap-2 font-poppins font-semibold py-3 px-4 rounded-lg transition-colors text-sm ${
                  pkg.popular
                    ? "bg-brand-red text-white hover:bg-red-700"
                    : "border-2 border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white"
                }`}
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="font-montserrat font-bold text-2xl text-brand-charcoal mb-4">All Packages Include</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Vehicle photo uploads",
              "Make, model, year, mileage fields",
              "Price & description",
              "Transmission & fuel type",
              "30-day active listing",
              "Admin review & approval",
              "Dealer contact visibility",
              "WhatsApp enquiry integration",
              "Package renewal option",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 font-opensans text-sm text-gray-600">
                <Check className="w-4 h-4 text-brand-red flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
