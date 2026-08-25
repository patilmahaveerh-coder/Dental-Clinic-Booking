import { Service, BusinessHour, ClinicSetting } from '../types';

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Comprehensive Dental Examination',
    description: 'Thorough checkup including digital X-rays, oral cancer screening, gum health evaluation, and personalized treatment planning.',
    duration_minutes: 45,
    price: 120,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv-2',
    name: 'Professional Teeth Cleaning (Prophylaxis)',
    description: 'Gentle ultrasonic plaque removal, tartar polishing, and fluoride treatment to protect your enamel and brighten your smile.',
    duration_minutes: 60,
    price: 150,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv-3',
    name: 'Advanced Laser Teeth Whitening',
    description: 'Professional in-office whitening system that brightens your smile up to 8 shades in just 60 minutes with zero sensitivity.',
    duration_minutes: 60,
    price: 399,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv-4',
    name: 'Tooth-Colored Composite Filling',
    description: 'Natural-looking aesthetic restorations for cavities or chipped teeth using premium biocompatible composite resins.',
    duration_minutes: 45,
    price: 180,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv-5',
    name: 'Painless Root Canal Therapy',
    description: 'Advanced microscopic endodontic treatment to save infected teeth comfortably and relieve pain efficiently.',
    duration_minutes: 90,
    price: 650,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1606811841689-23dfddce6395?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv-6',
    name: 'Emergency Dental Consultation',
    description: 'Urgent care for severe toothaches, broken teeth, lost fillings, or trauma with same-day priority relief.',
    duration_minutes: 30,
    price: 95,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
  }
];

export const DEFAULT_BUSINESS_HOURS: BusinessHour[] = [
  { id: 'bh-0', weekday: 0, is_open: false, start_time: '09:00', end_time: '17:00' }, // Sunday
  { id: 'bh-1', weekday: 1, is_open: true, start_time: '08:00', end_time: '18:00' }, // Monday
  { id: 'bh-2', weekday: 2, is_open: true, start_time: '08:00', end_time: '18:00' }, // Tuesday
  { id: 'bh-3', weekday: 3, is_open: true, start_time: '08:00', end_time: '18:00' }, // Wednesday
  { id: 'bh-4', weekday: 4, is_open: true, start_time: '08:00', end_time: '18:00' }, // Thursday
  { id: 'bh-5', weekday: 5, is_open: true, start_time: '08:00', end_time: '17:00' }, // Friday
  { id: 'bh-6', weekday: 6, is_open: true, start_time: '09:00', end_time: '15:00' }, // Saturday
];

export const DEFAULT_CLINIC_SETTING: ClinicSetting = {
  id: 'settings-1',
  clinic_name: 'Lumina Dental & Implant Center',
  clinic_email: 'care@luminadental.com',
  clinic_phone: '+1 (555) 382-9264',
  clinic_address: '742 Evergreen Terrace, Suite 300, Beverly Hills, CA 90210',
  slot_interval_minutes: 30,
  booking_notice_hours: 2
};
