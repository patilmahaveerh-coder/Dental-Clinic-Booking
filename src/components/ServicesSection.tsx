import { Clock, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceAndBook: (serviceId: string) => void;
}

export function ServicesSection({ services, onSelectServiceAndBook }: ServicesSectionProps) {
  const activeServices = services.filter(s => s.is_active);

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Dental Care</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Your Health & Comfort
          </h2>
          <p className="text-lg text-slate-600">
            Explore our professional dental treatments delivered with precision, modern technology, and a warm touch.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service) => (
            <div
              key={service.id}
              className="group bg-slate-50/60 rounded-3xl overflow-hidden border border-slate-200/80 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5 transition duration-300 flex flex-col justify-between"
            >
              {/* Service Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                <img
                  src={service.image_url || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-slate-900 font-bold text-sm">
                  ${service.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-xs font-semibold text-teal-700">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.duration_minutes} mins</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Standard Care</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition">
                    {service.name}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <button
                  onClick={() => onSelectServiceAndBook(service.id)}
                  className="w-full py-3 px-4 bg-white text-teal-700 border border-teal-200 rounded-xl font-semibold text-sm hover:bg-teal-700 hover:text-white hover:border-teal-700 transition flex items-center justify-center space-x-2 shadow-xs group-hover:shadow-md"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
