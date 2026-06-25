import Link from "next/link";
import { MapPin, Car, ArrowRight } from "lucide-react";

const dealers = [
  { id: "1", name: "ABC Motors", location: "Johannesburg, GP", vehicles: 3, package: "Growth", since: "June 2024" },
  { id: "2", name: "Premium Auto SA", location: "Cape Town, WC", vehicles: 12, package: "Professional", since: "May 2024" },
  { id: "3", name: "Durban Auto Hub", location: "Durban, KZN", vehicles: 8, package: "Starter", since: "May 2024" },
  { id: "4", name: "VW Specialists", location: "Pretoria, GP", vehicles: 25, package: "Enterprise", since: "March 2024" },
  { id: "5", name: "Luxury Cars SA", location: "Sandton, GP", vehicles: 18, package: "Professional", since: "April 2024" },
  { id: "6", name: "Hyundai Central", location: "Port Elizabeth, EC", vehicles: 6, package: "Starter", since: "June 2024" },
];

export const metadata = {
  title: "Dealers | MotorsMarket SA",
};

export default function DealersPage() {
  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-brand-charcoal py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl text-white mb-3">Our Dealers</h1>
          <p className="font-opensans text-gray-400">Verified dealerships across South Africa</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealers.map((dealer) => (
            <div key={dealer.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-6 group">
              <div className="w-14 h-14 bg-brand-charcoal rounded-xl flex items-center justify-center mb-4">
                <Car className="w-7 h-7 text-brand-red" />
              </div>
              <h2 className="font-montserrat font-bold text-lg text-brand-charcoal group-hover:text-brand-red transition-colors">
                {dealer.name}
              </h2>
              <div className="flex items-center gap-1 text-gray-400 mt-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-brand-red" />
                <span className="font-opensans text-sm">{dealer.location}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex gap-4">
                  <div>
                    <p className="font-montserrat font-bold text-brand-charcoal text-lg">{dealer.vehicles}</p>
                    <p className="font-opensans text-gray-400 text-xs">Vehicles</p>
                  </div>
                  <div>
                    <p className="font-poppins font-semibold text-brand-red text-sm">{dealer.package}</p>
                    <p className="font-opensans text-gray-400 text-xs">Package</p>
                  </div>
                </div>
                <Link href={`/vehicles?dealer=${dealer.id}`} className="flex items-center gap-1 text-brand-red font-poppins text-sm font-semibold hover:gap-2 transition-all">
                  View <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center bg-brand-charcoal rounded-2xl p-10">
          <h2 className="font-montserrat font-extrabold text-3xl text-white mb-3">
            Become a Listed Dealer
          </h2>
          <p className="font-opensans text-gray-400 mb-6 max-w-lg mx-auto">
            Register your dealership today and reach thousands of buyers across South Africa.
          </p>
          <Link href="/dealer/register" className="btn-primary inline-flex items-center gap-2">
            Register Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
