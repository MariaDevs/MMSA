import { Shield, CheckCircle, Zap, Users } from "lucide-react";

const badges = [
  { icon: Shield, title: "Verified Dealers", desc: "All dealers reviewed & approved by admin" },
  { icon: CheckCircle, title: "Quality Listings", desc: "Full vehicle details, photos & history" },
  { icon: Zap, title: "Instant Activation", desc: "Go live in minutes after payment" },
  { icon: Users, title: "30-Day Exposure", desc: "Maximum visibility for every listing" },
];

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center p-4">
              <div className="bg-brand-red/10 rounded-full p-3 mb-3">
                <Icon className="w-6 h-6 text-brand-red" />
              </div>
              <h3 className="font-montserrat font-bold text-brand-charcoal text-sm mb-1">{title}</h3>
              <p className="font-opensans text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
