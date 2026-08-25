import React from 'react';
import { Calendar, ShieldCheck, Star, Users, Award } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-slate-50/50 to-white pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-teal-200/30 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none transform -translate-x-1/4 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold tracking-wide uppercase">
              <SparklesIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>State-of-the-Art Dental Excellence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Your Perfect Smile Deserves <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-700">Masterful Care</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
              Experience gentle, advanced dentistry in a serene, spa-like environment. From preventative cleanings to stunning smile makeovers, our expert team is dedicated to your health and confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-8 py-4 bg-teal-700 text-white rounded-2xl font-semibold text-base shadow-xl shadow-teal-700/25 hover:bg-teal-800 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Your Visit Now</span>
              </button>

              <a
                href="#services"
                className="px-7 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-semibold text-base hover:bg-slate-50 hover:border-slate-300 transition text-center shadow-xs"
              >
                Explore Services
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                  <Star className="w-5 h-5 fill-teal-600 text-teal-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">4.9 / 5.0</div>
                  <div className="text-xs text-slate-500">Over 1,200+ Reviews</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">15,000+</div>
                  <div className="text-xs text-slate-500">Happy Patients</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">100% Pain-Free</div>
                  <div className="text-xs text-slate-500">Gentle Guarantee</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-900/15 border-4 border-white aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Dental Clinic Consultation"
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                
                {/* Floating Card Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/40 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Award-Winning Dentistry</h4>
                    <p className="text-xs text-slate-600">Advanced technology & compassionate experts</p>
                  </div>
                </div>
              </div>

              {/* Decorative Secondary Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-slate-800">Accepting New Patients Today</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
