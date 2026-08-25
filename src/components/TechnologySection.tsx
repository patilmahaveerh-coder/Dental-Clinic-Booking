import { Cpu, Zap, Eye, Shield } from 'lucide-react';

export function TechnologySection() {
  const techItems = [
    {
      icon: Cpu,
      title: '3D Digital Impressions',
      description: 'Say goodbye to messy dental putty. Our intraoral 3D scanners capture your teeth in seconds with micron-level precision.'
    },
    {
      icon: Zap,
      title: 'Painless Laser Dentistry',
      description: 'Advanced soft-tissue lasers eliminate discomfort, minimize bleeding, and dramatically accelerate healing times.'
    },
    {
      icon: Eye,
      title: 'Low-Radiation Digital X-Rays',
      description: 'State-of-the-art imaging produces crystal-clear diagnostic views with up to 90% less radiation than traditional X-rays.'
    },
    {
      icon: Shield,
      title: 'Biocompatible Restorations',
      description: 'Metal-free ceramic crowns and composite fillings that look, feel, and function exactly like natural tooth enamel.'
    }
  ];

  return (
    <section id="technology" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-900/80 text-teal-300 text-xs font-semibold tracking-wide uppercase border border-teal-700/50">
            <span>Modern Innovation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Advanced Dental Technology
          </h2>
          <p className="text-lg text-slate-400">
            We invest in the world's most advanced dental innovations to make your visits faster, safer, and entirely comfortable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 hover:border-teal-500/50 transition duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-600/20 text-teal-400 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
