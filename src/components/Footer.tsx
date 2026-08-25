import { Sparkles, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { ClinicSetting } from '../types';

interface FooterProps {
  clinicSettings: ClinicSetting;
  onOpenBooking: () => void;
  onOpenAdminLogin: () => void;
}

export function Footer({ clinicSettings, onOpenBooking, onOpenAdminLogin }: FooterProps) {
  return (
    <footer id="contact" className="bg-slate-950 text-white pt-20 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {clinicSettings.clinic_name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Providing exceptional, pain-free dental care with advanced technology and compassionate professionals.
            </p>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-semibold text-xs hover:bg-teal-700 transition shadow-md"
            >
              Book Online Now
            </button>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-white transition">Our Services</a></li>
              <li><a href="#about" className="hover:text-white transition">About Us</a></li>
              <li><a href="#technology" className="hover:text-white transition">Advanced Technology</a></li>
              <li><a href="#testimonials" className="hover:text-white transition">Patient Testimonials</a></li>
              <li><button onClick={onOpenAdminLogin} className="hover:text-white transition text-left">Admin Portal Login</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400">Contact Us</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-teal-500 shrink-0 mt-1" />
                <span>{clinicSettings.clinic_address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-teal-500 shrink-0" />
                <span>{clinicSettings.clinic_phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-teal-500 shrink-0" />
                <span>{clinicSettings.clinic_email}</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400">Office Hours</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center justify-between">
                <span>Mon - Thu</span>
                <span className="font-medium text-white">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Friday</span>
                <span className="font-medium text-white">8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Saturday</span>
                <span className="font-medium text-white">9:00 AM - 3:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sunday</span>
                <span className="text-rose-400 font-medium">Closed</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {clinicSettings.clinic_name}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition">Patient Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
