import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Service, Appointment, BusinessHour, BlockedDate, ClinicSetting, AppointmentStatus } from './types';
import { DEFAULT_SERVICES, DEFAULT_BUSINESS_HOURS, DEFAULT_CLINIC_SETTING } from './data/mockData';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { TechnologySection } from './components/TechnologySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';

export default function App() {
  // App state
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(DEFAULT_BUSINESS_HOURS);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [clinicSettings, setClinicSettings] = useState<ClinicSetting>(DEFAULT_CLINIC_SETTING);

  // Navigation / Routing state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Modal states
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>();
  const [configOpen, setConfigOpen] = useState(false);

  // Handle browser popstate (back/forward buttons and refresh routing)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Check admin authentication session on mount
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    setAuthChecking(true);
    try {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: adminRecord } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (adminRecord) {
            setIsAuthenticated(true);
          } else {
            // Check if 0 admins exist (auto-bootstrap first user)
            const { count } = await supabase.from('admin_users').select('*', { count: 'exact', head: true });
            if (count === 0) {
              await supabase.from('admin_users').insert([{ user_id: session.user.id }]);
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          }
        } else {
          setIsAuthenticated(false);
        }
      } else {
        // Demo mode fallback authentication
        const demoAuth = localStorage.getItem('demo_admin_auth') === 'true';
        setIsAuthenticated(demoAuth);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  // Redirect unauthenticated users trying to access /admin
  useEffect(() => {
    if (!authChecking && currentPath === '/admin' && !isAuthenticated) {
      navigateTo('/admin/login');
    }
  }, [currentPath, isAuthenticated, authChecking]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (isSupabaseConfigured) {
        // Fetch services
        const { data: servicesData, error: sErr } = await supabase.from('services').select('*');
        if (!sErr && servicesData && servicesData.length > 0) {
          setServices(servicesData);
        }

        // Fetch appointments
        const { data: apptsData, error: aErr } = await supabase.from('appointments').select('*, services(*)');
        if (!aErr && apptsData) {
          setAppointments(apptsData);
        }

        // Fetch business hours
        const { data: bhData, error: bhErr } = await supabase.from('business_hours').select('*');
        if (!bhErr && bhData && bhData.length > 0) {
          setBusinessHours(bhData);
        }

        // Fetch blocked dates
        const { data: bdData, error: bdErr } = await supabase.from('blocked_dates').select('*');
        if (!bdErr && bdData) {
          setBlockedDates(bdData);
        }

        // Fetch clinic settings
        const { data: csData, error: csErr } = await supabase.from('clinic_settings').select('*').maybeSingle();
        if (!csErr && csData) {
          setClinicSettings(csData);
        }
      } else {
        // Load from localStorage for demo mode persistence
        const localAppts = localStorage.getItem('demo_appointments');
        if (localAppts) {
          setAppointments(JSON.parse(localAppts));
        }
        const localServices = localStorage.getItem('demo_services');
        if (localServices) {
          setServices(JSON.parse(localServices));
        }
        const localHours = localStorage.getItem('demo_hours');
        if (localHours) {
          setBusinessHours(JSON.parse(localHours));
        }
        const localBlocked = localStorage.getItem('demo_blocked');
        if (localBlocked) {
          setBlockedDates(JSON.parse(localBlocked));
        }
        const localSettings = localStorage.getItem('demo_settings');
        if (localSettings) {
          setClinicSettings(JSON.parse(localSettings));
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // Handlers for booking flow
  const handleSelectServiceAndBook = (serviceId: string) => {
    setPreSelectedServiceId(serviceId);
    setBookingOpen(true);
  };

  const handleAppointmentCreated = async (newApptPayload: Partial<Appointment>) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('appointments')
        .insert([newApptPayload])
        .select('*, services(*)')
        .single();

      if (error) throw error;
      if (data) {
        setAppointments(prev => [data, ...prev]);
      }
    } else {
      // Demo mode
      const newAppt: Appointment = {
        id: 'app-' + Date.now(),
        full_name: newApptPayload.full_name || '',
        email: newApptPayload.email || '',
        phone: newApptPayload.phone || '',
        service_id: newApptPayload.service_id || '',
        appointment_date: newApptPayload.appointment_date || '',
        start_time: newApptPayload.start_time || '',
        end_time: newApptPayload.end_time || '',
        status: newApptPayload.status || 'pending',
        notes: newApptPayload.notes,
        created_at: new Date().toISOString()
      };
      const updated = [newAppt, ...appointments];
      setAppointments(updated);
      localStorage.setItem('demo_appointments', JSON.stringify(updated));
    }
  };

  // Admin mutation handlers
  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) {
        alert('Failed to update appointment status.');
        return;
      }
    }
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (!isSupabaseConfigured) {
      const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
      localStorage.setItem('demo_appointments', JSON.stringify(updated));
    }
  };

  const handleUpdateService = async (service: Service) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('services')
        .update({
          name: service.name,
          description: service.description,
          duration_minutes: service.duration_minutes,
          price: service.price,
          is_active: service.is_active,
          image_url: service.image_url
        })
        .eq('id', service.id);

      if (error) {
        alert('Failed to update service.');
        return;
      }
    }
    const updated = services.map(s => s.id === service.id ? service : s);
    setServices(updated);
    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_services', JSON.stringify(updated));
    }
  };

  const handleAddService = async (servicePayload: Omit<Service, 'id'>) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('services')
        .insert([servicePayload])
        .select()
        .single();

      if (error) {
        alert('Failed to add service.');
        return;
      }
      if (data) {
        setServices(prev => [...prev, data]);
      }
    } else {
      const newService: Service = {
        id: 'srv-' + Date.now(),
        ...servicePayload
      };
      const updated = [...services, newService];
      setServices(updated);
      localStorage.setItem('demo_services', JSON.stringify(updated));
    }
  };

  const handleUpdateBusinessHours = async (hours: BusinessHour[]) => {
    if (isSupabaseConfigured) {
      for (const h of hours) {
        await supabase
          .from('business_hours')
          .update({ is_open: h.is_open, start_time: h.start_time, end_time: h.end_time })
          .eq('id', h.id);
      }
    }
    setBusinessHours(hours);
    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_hours', JSON.stringify(hours));
    }
  };

  const handleAddBlockedDate = async (blockedPayload: Omit<BlockedDate, 'id'>) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('blocked_dates')
        .insert([blockedPayload])
        .select()
        .single();

      if (error) {
        alert('Failed to add blocked date.');
        return;
      }
      if (data) {
        setBlockedDates(prev => [...prev, data]);
      }
    } else {
      const newBlock: BlockedDate = {
        id: 'blk-' + Date.now(),
        ...blockedPayload
      };
      const updated = [...blockedDates, newBlock];
      setBlockedDates(updated);
      localStorage.setItem('demo_blocked', JSON.stringify(updated));
    }
  };

  const handleRemoveBlockedDate = async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('blocked_dates').delete().eq('id', id);
    }
    const updated = blockedDates.filter(b => b.id !== id);
    setBlockedDates(updated);
    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_blocked', JSON.stringify(updated));
    }
  };

  const handleUpdateClinicSettings = async (settings: ClinicSetting) => {
    if (isSupabaseConfigured) {
      await supabase
        .from('clinic_settings')
        .update({
          clinic_name: settings.clinic_name,
          clinic_email: settings.clinic_email,
          clinic_phone: settings.clinic_phone,
          clinic_address: settings.clinic_address,
          slot_interval_minutes: settings.slot_interval_minutes,
          booking_notice_hours: settings.booking_notice_hours
        })
        .eq('id', settings.id);
    }
    setClinicSettings(settings);
    if (!isSupabaseConfigured) {
      localStorage.setItem('demo_settings', JSON.stringify(settings));
    }
  };

  const handleAdminLogout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('demo_admin_auth');
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
    navigateTo('/admin/login');
  };

  // Render view based on currentPath
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-slate-600">Loading Lumina Dental...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      
      {currentPath === '/admin/login' ? (
        <AdminLoginPage
          onLoginSuccess={() => setIsAuthenticated(true)}
          onNavigate={navigateTo}
        />
      ) : currentPath === '/admin' ? (
        isAuthenticated ? (
          <AdminDashboard
            services={services}
            appointments={appointments}
            businessHours={businessHours}
            blockedDates={blockedDates}
            clinicSettings={clinicSettings}
            onLogout={handleAdminLogout}
            onUpdateService={handleUpdateService}
            onAddService={handleAddService}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onUpdateBusinessHours={handleUpdateBusinessHours}
            onAddBlockedDate={handleAddBlockedDate}
            onRemoveBlockedDate={handleRemoveBlockedDate}
            onUpdateClinicSettings={handleUpdateClinicSettings}
          />
        ) : null /* Will be redirected by useEffect to /admin/login */
      ) : (
        <>
          <Navbar
            clinicSettings={clinicSettings}
            onOpenBooking={() => { setPreSelectedServiceId(undefined); setBookingOpen(true); }}
            onOpenAdminLogin={() => {
              if (isAuthenticated) {
                navigateTo('/admin');
              } else {
                navigateTo('/admin/login');
              }
            }}
            onOpenConfig={() => setConfigOpen(true)}
          />

          <main>
            <Hero onOpenBooking={() => { setPreSelectedServiceId(undefined); setBookingOpen(true); }} />
            <ServicesSection services={services} onSelectServiceAndBook={handleSelectServiceAndBook} />
            <AboutSection />
            <TechnologySection />
            <TestimonialsSection />
          </main>

          <Footer
            clinicSettings={clinicSettings}
            onOpenBooking={() => { setPreSelectedServiceId(undefined); setBookingOpen(true); }}
            onOpenAdminLogin={() => {
              if (isAuthenticated) {
                navigateTo('/admin');
              } else {
                navigateTo('/admin/login');
              }
            }}
          />

          <BookingModal
            isOpen={bookingOpen}
            onClose={() => setBookingOpen(false)}
            services={services}
            businessHours={businessHours}
            blockedDates={blockedDates}
            appointments={appointments}
            clinicSettings={clinicSettings}
            preSelectedServiceId={preSelectedServiceId}
            onAppointmentCreated={handleAppointmentCreated}
          />

          <SupabaseConfigModal
            isOpen={configOpen}
            onClose={() => setConfigOpen(false)}
          />
        </>
      )}

    </div>
  );
}
