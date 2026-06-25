import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";

export default function DealerCTA() {
  return (
    <section className="bg-brand-charcoal py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center bg-brand-red/20 rounded-full p-4 mb-6">
          <Car className="w-8 h-8 text-brand-red" />
        </div>
        <h2 className="font-montserrat font-extrabold text-4xl sm:text-5xl text-white mb-4">
          Ready to Grow Your <span className="text-brand-red">Dealership?</span>
        </h2>
        <p className="font-opensans text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Join hundreds of South African dealers already using MotorsMarket SA. Register today,
          choose your package and start selling within minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dealer/register" className="btn-primary flex items-center justify-center gap-2 text-base py-4 px-8">
            Register as Dealer
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/packages" className="flex items-center justify-center gap-2 border-2 border-gray-500 text-gray-300 hover:border-white hover:text-white font-poppins font-semibold py-4 px-8 rounded transition-colors text-base">
            View Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
