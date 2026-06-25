import Link from "next/link";
import { Check } from "lucide-react";
import { PACKAGES } from "@/lib/data";

export default function PackagesSection() {
  return (
    <section className="py-16 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-red font-poppins font-semibold text-sm uppercase tracking-widest mb-2">
            Choose Your Plan
          </p>
          <h2 className="section-title text-3xl sm:text-4xl inline-block">
            Dealer Packages
          </h2>
          <div className="w-16 h-1 bg-brand-red mx-auto mt-3" />
          <p className="font-opensans text-gray-500 mt-4 max-w-xl mx-auto text-sm">
            All packages include 30-day listing space. Prices to be confirmed based on final business model.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-xl p-6 border-2 transition-all duration-200 hover:shadow-xl ${
                pkg.popular ? "border-brand-red shadow-lg" : "border-gray-200 hover:border-brand-red/50"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-red text-white text-xs font-poppins font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-montserrat font-bold text-brand-charcoal text-lg">{pkg.name}</h3>
                <div className="flex items-end gap-1 mt-2">
                  <span className="font-poppins font-bold text-brand-red text-3xl">{pkg.vehicleLimit}</span>
                  <span className="font-opensans text-gray-400 text-sm mb-1">vehicles</span>
                </div>
                <p className="font-opensans text-gray-400 text-xs">{pkg.durationDays} days listing</p>
              </div>

              <p className="font-opensans text-gray-500 text-sm mb-6 leading-relaxed">{pkg.description}</p>

              <ul className="space-y-2 mb-6">
                {[
                  `Up to ${pkg.vehicleLimit} vehicle listings`,
                  "30-day active listing period",
                  "Vehicle photos & full details",
                  "Dealer dashboard access",
                  "Direct buyer contact",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs font-opensans text-gray-600">
                    <Check className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/dealer/register?package=${pkg.id}`}
                className={`block text-center font-poppins font-semibold text-sm py-3 px-4 rounded transition-colors duration-200 ${
                  pkg.popular
                    ? "bg-brand-red text-white hover:bg-red-700"
                    : "border-2 border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
