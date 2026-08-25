import { ShieldCheck, Heart, Smile, CheckCircle2 } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-teal-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Images Composition */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                    alt="Dentist and patient smiling"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="col-span-4 pt-8">
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce6395?auto=format&fit=crop&w=600&q=80"
                    alt="Modern clinic equipment"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 left-8 bg-gradient-to-r from-teal-700 to-blue-800 text-white p-6 rounded-2xl shadow-xl flex items-center space-x-4">
              <div className="text-4xl font-black">15+</div>
              <div className="text-xs uppercase tracking-wider font-semibold text-teal-100">
                Years of Trusted Dental Excellence
              </div>
            </div>
          </div>

          {/* Right Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold tracking-wide uppercase">
              <Heart className="w-3.5 h-3.5 text-teal-600" />
              <span>About Lumina Dental</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Where Compassionate Care Meets Cutting-Edge Dentistry
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Founded with a singular vision to transform the dental experience, Lumina Dental combines world-class clinical expertise with state-of-the-art technology and genuine human warmth. We believe visiting the dentist should feel relaxing, transparent, and empowering.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Patient-Centric Comfort</h4>
                  <p className="text-slate-600 text-xs mt-0.5">Noise-canceling headphones, warm aromatherapy towels, and sedation options for absolute relaxation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Rigorous Sterilization Standards</h4>
                  <p className="text-slate-600 text-xs mt-0.5">Hospital-grade autoclave sterilization and advanced air filtration systems ensuring 100% safety.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Transparent, Predictable Pricing</h4>
                  <p className="text-slate-600 text-xs mt-0.5">No hidden surprises. Clear treatment estimates before any procedure begins.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
