import Link from "next/link";
import { MapPin, Gauge, Fuel, Settings, Phone } from "lucide-react";
import type { Vehicle } from "@/lib/data";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(price);
}

function formatMileage(km: number) {
  return new Intl.NumberFormat("en-ZA").format(km) + " km";
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="vehicle-card group">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-charcoal to-gray-700">
          <div className="text-center text-gray-400">
            <Settings className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="font-poppins text-sm font-semibold opacity-50">
              {vehicle.year} {vehicle.make}
            </p>
          </div>
        </div>
        {vehicle.featured && (
          <div className="absolute top-3 left-3 bg-brand-red text-white text-xs font-poppins font-semibold px-2 py-1 rounded">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-poppins px-2 py-1 rounded">
          {vehicle.transmission}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <Link href={`/vehicles/${vehicle.id}`}>
            <h3 className="font-montserrat font-bold text-brand-charcoal text-lg group-hover:text-brand-red transition-colors leading-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
          </Link>
          <p className="font-poppins font-bold text-brand-red text-xl mt-1">
            {formatPrice(vehicle.price)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-100">
          <div className="flex flex-col items-center text-center">
            <Gauge className="w-4 h-4 text-gray-400 mb-1" />
            <span className="font-opensans text-xs text-gray-600">{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Fuel className="w-4 h-4 text-gray-400 mb-1" />
            <span className="font-opensans text-xs text-gray-600">{vehicle.fuelType}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Settings className="w-4 h-4 text-gray-400 mb-1" />
            <span className="font-opensans text-xs text-gray-600">{vehicle.bodyType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="font-opensans text-xs">{vehicle.dealerLocation}</span>
          </div>
          <Link
            href={`/vehicles/${vehicle.id}`}
            className="text-brand-red font-poppins text-xs font-semibold hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
