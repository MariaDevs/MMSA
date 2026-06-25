const steps = [
  { num: "01", title: "Register as Dealer", desc: "Create your account with business details, contact info, and dealership information." },
  { num: "02", title: "Choose a Package", desc: "Select from Starter (20), Growth (40), Professional (60), or Enterprise (200) vehicle slots." },
  { num: "03", title: "Make Payment Online", desc: "Securely pay online via South African payment gateway to activate your listing space." },
  { num: "04", title: "Upload Your Vehicles", desc: "Add vehicle photos, specs, mileage, price, and description to go live instantly." },
  { num: "05", title: "Manage Your Dashboard", desc: "Track views, manage stock, renew your package, and update listings any time." },
  { num: "06", title: "Connect with Buyers", desc: "Buyers contact you directly via WhatsApp or phone — no middleman." },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-red font-poppins font-semibold text-sm uppercase tracking-widest mb-2">
            Simple Process
          </p>
          <h2 className="section-title text-3xl sm:text-4xl inline-block">
            How It Works for Dealers
          </h2>
          <div className="w-16 h-1 bg-brand-red mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="relative p-6 border border-gray-100 rounded-xl hover:border-brand-red/30 hover:shadow-md transition-all duration-200 group">
              <div className="text-5xl font-montserrat font-extrabold text-brand-red/10 group-hover:text-brand-red/20 transition-colors mb-3">
                {step.num}
              </div>
              <h3 className="font-montserrat font-bold text-brand-charcoal text-base mb-2">{step.title}</h3>
              <p className="font-opensans text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
