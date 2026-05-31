import { Shield, Truck, CreditCard, Award } from 'lucide-react';

const reasons = [
  {
    icon: <Shield size={20} />,
    title: 'Highly Secured',
    description: 'Every vehicle passes a rigorous 150-point inspection before listing.',
  },
  {
    icon: <Truck size={20} />,
    title: 'Free Delivery',
    description: 'Schedule a free test drive or get free delivery to your doorstep.',
  },
  {
    icon: <CreditCard size={20} />,
    title: 'Trusted Deals',
    description: 'Get pre-approved in minutes with rates starting from 2.9% APR.',
  },
  {
    icon: <Award size={20} />,
    title: 'Quality Assured',
    description: 'Every purchase includes a complimentary 2-year warranty.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white border-t border-gray-100" aria-label="Why choose us">
      <div className="max-w-[95rem] mx-auto px-6 grid lg:grid-cols-12 gap-x-12 gap-y-14">
        {/* Left — heading, CTA, stats */}
        <div className="lg:col-span-4">
          <h2 className="display text-3xl md:text-5xl font-semibold text-gray-900 leading-[1.05] tracking-tight mb-6">
            A better way to buy your next car
          </h2>
          <p className="text-gray-500 text-lg font-light leading-relaxed mb-8">
            We go beyond selling cars — we deliver an experience that puts you first at
            every step, with a transparent process you can trust.
          </p>
          <button className="btn-primary">Learn more</button>

          <div className="mt-12 grid grid-cols-2 gap-8 max-w-xs">
            <div>
              <p className="display text-4xl font-semibold text-gray-900">15k+</p>
              <p className="text-sm text-gray-500 mt-1">Vehicles delivered</p>
            </div>
            <div>
              <p className="display text-4xl font-semibold text-gray-900">4.9★</p>
              <p className="text-sm text-gray-500 mt-1">Average rating</p>
            </div>
          </div>
        </div>

        {/* Right — numbered index of reasons */}
        <div className="lg:col-span-7 lg:col-start-6">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className="group flex items-start gap-6 py-7 border-t border-gray-200"
            >
              <span className="w-8 shrink-0 pt-1 text-xs font-semibold tracking-widest text-gray-300 group-hover:text-gray-900 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{r.title}</h3>
                <p className="text-gray-500 text-[0.95rem] leading-relaxed font-light">
                  {r.description}
                </p>
              </div>
              <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 shrink-0 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-colors">
                {r.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
