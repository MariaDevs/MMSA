import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Gauge, Fuel, Settings, Phone, MessageCircle, ArrowLeft, Calendar, Palette } from "lucide-react";
import { SAMPLE_VEHICLES } from "@/lib/data";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(price);
}

export async function generateStaticParams() {
  return SAMPLE_VEHICLES.map((v) => ({ id: v.id }));
}

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = SAMPLE_VEHICLES.find((v) => v.id === params.id);
  if (!vehicle) notFound();

  const whatsappMsg = `Hi ${vehicle.dealerName}, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} listed on MotorsMarket SA.`;

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link href="/vehicles" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-red font-poppins text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Image + specs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image placeholder */}
            <div className="aspect-[16/9] bg-gradient-to-br from-brand-charcoal to-gray-700 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Settings className="w-20 h-20 mx-auto mb-3 opacity-20" />
                <p className="font-montserrat font-bold text-2xl text-white opacity-30">
                  {vehicle.year} {vehicle.make}
                </p>
              </div>
            </div>

            {/* Title + price */}
            <div>
              <h1 className="font-montserrat font-extrabold text-3xl text-brand-charcoal">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="font-poppins font-bold text-brand-red text-4xl mt-2">
                {formatPrice(vehicle.price)}
              </p>
            </div>

            {/* Specs grid */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-montserrat font-bold text-brand-charcoal text-lg mb-4">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: Calendar, label: "Year", value: vehicle.year },
                  { icon: Gauge, label: "Mileage", value: `${vehicle.mileage.toLocaleString()} km` },
                  { icon: Fuel, label: "Fuel Type", value: vehicle.fuelType },
                  { icon: Settings, label: "Transmission", value: vehicle.transmission },
                  { icon: Settings, label: "Body Type", value: vehicle.bodyType },
                  { icon: Palette, label: "Color", value: vehicle.color },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-brand-light rounded-lg">
                    <Icon className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-opensans text-xs text-gray-400">{label}</p>
                      <p className="font-poppins font-semibold text-brand-charcoal text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-montserrat font-bold text-brand-charcoal text-lg mb-3">Description</h2>
              <p className="font-opensans text-gray-600 leading-relaxed">{vehicle.description}</p>
            </div>
          </div>

          {/* Right: Dealer contact card */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="border-b border-gray-100 pb-4 mb-4">
                <h3 className="font-montserrat font-bold text-brand-charcoal text-lg">{vehicle.dealerName}</h3>
                <div className="flex items-center gap-1 text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 text-brand-red" />
                  <span className="font-opensans text-sm">{vehicle.dealerLocation}</span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${vehicle.dealerPhone}`}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call Dealer
                </a>
                <a
                  href={`https://wa.me/${vehicle.dealerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-poppins font-semibold py-3 px-6 rounded transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Dealer
                </a>
                <Link
                  href={`/enquiry/${vehicle.id}`}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  Quick Enquiry
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="font-opensans text-xs text-gray-400 text-center">
                  Always inspect vehicle before purchasing. MotorsMarket SA does not sell vehicles directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
