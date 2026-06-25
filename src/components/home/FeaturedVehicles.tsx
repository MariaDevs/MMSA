import Link from "next/link";
import { ArrowRight } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";
import { SAMPLE_VEHICLES } from "@/lib/data";

export default function FeaturedVehicles() {
  const featured = SAMPLE_VEHICLES.filter((v) => v.featured).slice(0, 6);

  return (
    <section className="py-16 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-red font-poppins font-semibold text-sm uppercase tracking-widest mb-2">
              Fresh Listings
            </p>
            <h2 className="section-title text-3xl sm:text-4xl pb-2 red-underline">
              Featured Vehicles
            </h2>
          </div>
          <Link
            href="/vehicles"
            className="hidden sm:flex items-center gap-2 text-brand-red font-poppins font-semibold text-sm hover:gap-3 transition-all"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link href="/vehicles" className="btn-primary inline-flex items-center gap-2">
            View All Vehicles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
