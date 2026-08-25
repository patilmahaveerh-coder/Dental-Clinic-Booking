import { useState } from 'react';
import { Sparkles, Calendar, Shield, Database, Menu, X, Phone } from 'lucide-react';
import { ClinicSetting } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface NavbarProps {
  clinicSettings: ClinicSetting;
  onOpenBooking: () => void;
  onOpenAdminLogin: () => void;
  onOpenConfig: () => void;
}

export function Navbar({ clinicSettings, onOpenBooking, onOpenAdminLogin, onOpenConfig }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-teal-600/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              {clinicSettings.clinic_name.split('&')[0] || 'Lumina Dental'}
            </span>
            <span className="text-xs font-medium text-teal-700 tracking-wider uppercase block">
              Advanced Dental Care
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a href="#services" className="hover:text-teal-700 transition">Services</a>
          <a href="#about" className="hover:text-teal-700 transition">About Us</a>
          <a href="#technology" className="hover:text-teal-700 transition">Technology</a>
          <a href="#testimonials" className="hover:text-teal-700 transition">Testimonials</a>
          <a href="#contact" className="hover:text-teal-700 transition">Contact</a>
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={onOpenConfig}
            title="Database Connection Status"
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 border transition ${
              isSupabaseConfigured 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Configure Supabase'}</span>
          </button>

          <button
            onClick={onOpenAdminLogin}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 rounded-xl transition flex items-center space-x-1.5"
          >
            <Shield className="w-4 h-4 text-slate-500" />
            <span>Admin Portal</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-medium text-sm shadow-md shadow-teal-600/25 hover:from-teal-700 hover:to-teal-800 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-3 md:hidden">
          <button
            onClick={onOpenBooking}
            className="px-3 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold shadow-sm"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
          >
            Services
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
          >
            About Us
          </a>
          <a
            href="#technology"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
          >
            Technology
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
          >
            Testimonials
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
          >
            Contact
          </a>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenConfig(); }}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center space-x-2 bg-slate-100 text-slate-700"
            >
              <Database className="w-4 h-4 text-teal-600" />
              <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Configure Supabase'}</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdminLogin(); }}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center space-x-2 bg-slate-100 text-slate-700"
            >
              <Shield className="w-4 h-4 text-slate-600" />
              <span>Admin Portal Login</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
              className="w-full py-3 bg-teal-600 text-white rounded-xl font-medium text-sm text-center shadow-md flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
