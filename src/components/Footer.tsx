import Link from "next/link";
import { Car, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="text-brand-red w-7 h-7" />
              <span className="font-montserrat font-extrabold text-2xl text-white">
                MM<span className="text-brand-red">SA</span>
              </span>
            </div>
            <p className="text-sm font-opensans mb-4 leading-relaxed">
              South Africa's trusted vehicle marketplace. Connecting quality dealers with serious buyers.
            </p>
            <p className="text-brand-red text-xs font-poppins font-semibold tracking-widest uppercase">
              Quality Cars. Trusted Service. Great Value.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm font-opensans">
              <li><Link href="/vehicles" className="hover:text-brand-red transition-colors">Browse Vehicles</Link></li>
              <li><Link href="/dealers" className="hover:text-brand-red transition-colors">Find Dealers</Link></li>
              <li><Link href="/packages" className="hover:text-brand-red transition-colors">Dealer Packages</Link></li>
              <li><Link href="/dealer/register" className="hover:text-brand-red transition-colors">Register as Dealer</Link></li>
              <li><Link href="/dealer/login" className="hover:text-brand-red transition-colors">Dealer Login</Link></li>
            </ul>
          </div>

          {/* Dealer Packages */}
          <div>
            <h4 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider mb-4">
              Dealer Packages
            </h4>
            <ul className="space-y-2 text-sm font-opensans">
              <li className="flex justify-between"><span>Starter</span><span className="text-brand-red">20 vehicles</span></li>
              <li className="flex justify-between"><span>Growth</span><span className="text-brand-red">40 vehicles</span></li>
              <li className="flex justify-between"><span>Professional</span><span className="text-brand-red">60 vehicles</span></li>
              <li className="flex justify-between"><span>Enterprise</span><span className="text-brand-red">200 vehicles</span></li>
            </ul>
            <p className="text-xs mt-3 text-gray-500">All packages: 30-day listing period</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm font-opensans">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>South Africa</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>+27 000 000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>info@motormarketsa.co.za</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-brand-red transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-brand-red transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-brand-red transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-opensans">© {new Date().getFullYear()} MotorsMarket SA. All rights reserved.</p>
          <div className="flex gap-4 text-xs font-opensans">
            <Link href="/privacy" className="hover:text-brand-red transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-red transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
