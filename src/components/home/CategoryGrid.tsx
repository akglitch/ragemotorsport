import Link from 'next/link';
import CarTypeIcon from './CarTypeIcon';

const bodyStyles = ['Sedan', 'Coupe', 'SUV', 'Truck', 'Hatchback', 'Convertible'];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-white" aria-label="Select a Body Style">
      <div className="max-w-[95rem] mx-auto px-6">
        <h2 className="display text-3xl font-bold text-center text-gray-900 mb-12">Select a Body Style</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {bodyStyles.map((name) => (
            <Link
              key={name}
              href={`/cars?category=${encodeURIComponent(name)}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-8 px-4 transition-all hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_12px_30px_rgba(10,14,23,0.08)]"
            >
              <CarTypeIcon
                type={name}
                className="w-24 h-auto mb-4 text-gray-300 group-hover:text-gray-900 transition-colors duration-300"
              />
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
