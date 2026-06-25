import Link from "next/link";
import { ArrowRight, Shield, Star, Car } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-brand-charcoal min-h-[600px] flex items-center overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #D72638 0px,
            #D72638 1px,
            transparent 1px,
            transparent 60px
          )`,
        }}
      />
      {/* Red accent bar top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-red" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/40 rounded-full px-4 py-1.5 mb-6">
            <Car className="w-4 h-4 text-brand-red" />
            <span className="text-brand-red text-sm font-poppins font-semibold">
              South Africa's Premier Vehicle Marketplace
            </span>
          </div>

          <h1 className="font-montserrat font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            Find Your
            <br />
            <span className="text-brand-red">Perfect Car</span>
            <br />
            Today
          </h1>

          <p className="font-opensans text-gray-300 text-lg sm:text-xl mb-8 max-w-xl leading-relaxed">
            Thousands of quality vehicles from verified dealers across South Africa.
            Browse, compare and connect — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/vehicles" className="btn-primary flex items-center justify-center gap-2 text-base py-4 px-8">
              Browse All Vehicles
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dealer/register" className="btn-secondary flex items-center justify-center gap-2 text-base py-4 px-8 border-2 border-white/30 text-white hover:border-brand-red hover:text-brand-red">
              List Your Dealership
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-gray-600">
            <div>
              <p className="font-montserrat font-extrabold text-3xl text-white">500+</p>
              <p className="font-opensans text-gray-400 text-sm mt-1">Vehicles Listed</p>
            </div>
            <div>
              <p className="font-montserrat font-extrabold text-3xl text-white">50+</p>
              <p className="font-opensans text-gray-400 text-sm mt-1">Verified Dealers</p>
            </div>
            <div>
              <p className="font-montserrat font-extrabold text-3xl text-white">30</p>
              <p className="font-opensans text-gray-400 text-sm mt-1">Day Listings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative right-side shape */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-2/5">
        <div className="absolute inset-0 bg-gradient-to-l from-brand-red/5 to-transparent" />
        <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-5">
          <Car className="w-96 h-96 text-white" />
        </div>
      </div>
    </section>
  );
}
