import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  Clock,
  Ban,
  Settings,
  LogOut,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  Filter,
  DollarSign,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Service, Appointment, BusinessHour, BlockedDate, ClinicSetting, AppointmentStatus } from '../types';
import { formatDateReadable, formatTime12Hour } from '../utils/bookingUtils';

interface AdminDashboardProps {
  services: Service[];
  appointments: Appointment[];
  businessHours: BusinessHour[];
  blockedDates: BlockedDate[];
  clinicSettings: ClinicSetting;
  onLogout: () => void;
  onUpdateService: (service: Service) => Promise<void>;
  onAddService: (service: Omit<Service, 'id'>) => Promise<void>;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  onUpdateBusinessHours: (hours: BusinessHour[]) => Promise<void>;
  onAddBlockedDate: (blockedDate: Omit<BlockedDate, 'id'>) => Promise<void>;
  onRemoveBlockedDate: (id: string) => Promise<void>;
  onUpdateClinicSettings: (settings: ClinicSetting) => Promise<void>;
}

export function AdminDashboard({
  services,
  appointments,
  businessHours,
  blockedDates,
  clinicSettings,
  onLogout,
  onUpdateService,
  onAddService,
  onUpdateAppointmentStatus,
  onUpdateBusinessHours,
  onAddBlockedDate,
  onRemoveBlockedDate,
  onUpdateClinicSettings
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'services' | 'hours' | 'blocked' | 'settings'>('overview');

  // Appointments filter state
  const [apptFilter, setApptFilter] = useState<string>('all');
  const [apptSearch, setApptSearch] = useState<string>('');

  // Services modal/form state
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    duration_minutes: 45,
    price: 120,
    is_active: true,
    image_url: ''
  });

  // Business hours editable state
  const [hoursState, setHoursState] = useState<BusinessHour[]>(businessHours);

  // Blocked date form state
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  // Clinic settings editable state
  const [settingsForm, setSettingsForm] = useState<ClinicSetting>(clinicSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Overview Stats
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const activeServicesCount = services.filter(s => s.is_active).length;

  // Estimated revenue from non-cancelled appointments
  const estimatedRevenue = appointments
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => {
      const s = services.find(serv => serv.id === a.service_id);
      return sum + (s?.price || 100);
    }, 0);

  // Filtered appointments
  const filteredAppointments = appointments.filter(app => {
    const matchesFilter = apptFilter === 'all' || app.status === apptFilter;
    const matchesSearch = 
      app.full_name.toLowerCase().includes(apptSearch.toLowerCase()) ||
      app.email.toLowerCase().includes(apptSearch.toLowerCase()) ||
      app.phone.includes(apptSearch);
    return matchesFilter && matchesSearch;
  });

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      description: '',
      duration_minutes: 45,
      price: 120,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
    });
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      duration_minutes: service.duration_minutes,
      price: service.price,
      is_active: service.is_active,
      image_url: service.image_url || ''
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      await onUpdateService({
        ...editingService,
        ...serviceForm
      });
    } else {
      await onAddService(serviceForm);
    }
    setServiceModalOpen(false);
  };

  const handleSaveHours = async () => {
    await onUpdateBusinessHours(hoursState);
    alert('Business hours updated successfully!');
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    await onAddBlockedDate({
      blocked_date: newBlockedDate,
      reason: newBlockedReason.trim() || 'Clinic Holiday / Closure'
    });
    setNewBlockedDate('');
    setNewBlockedReason('');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateClinicSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Admin Dashboard</h2>
              <span className="text-xs text-teal-400 font-medium">Lumina Dental Manager</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'overview' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                activeTab === 'appointments' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CalendarDays className="w-4 h-4" />
                <span>Appointments</span>
              </div>
              {pendingAppointments > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-xs">
                  {pendingAppointments}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'services' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Services</span>
            </button>

            <button
              onClick={() => setActiveTab('hours')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'hours' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Business Hours</span>
            </button>

            <button
              onClick={() => setActiveTab('blocked')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'blocked' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Ban className="w-4 h-4" />
              <span>Blocked Dates</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'settings' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Clinic Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
              <p className="text-sm text-slate-600">Welcome back! Here is what's happening at {clinicSettings.clinic_name}.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Appointments</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{totalAppointments}</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{pendingAppointments}</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Services</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{activeServicesCount}</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Revenue</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">${estimatedRevenue}</div>
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Recent Appointment Requests</h3>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  View All ({appointments.length})
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No appointments booked yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="pb-3 px-3">Patient</th>
                        <th className="pb-3 px-3">Service</th>
                        <th className="pb-3 px-3">Date & Time</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {appointments.slice(0, 5).map(app => {
                        const s = services.find(serv => serv.id === app.service_id);
                        return (
                          <tr key={app.id} className="hover:bg-slate-50 transition">
                            <td className="py-4 px-3">
                              <div className="font-bold text-slate-900">{app.full_name}</div>
                              <div className="text-xs text-slate-500">{app.phone}</div>
                            </td>
                            <td className="py-4 px-3 text-slate-700 font-medium">{s?.name || 'Dental Service'}</td>
                            <td className="py-4 px-3 text-slate-600 text-xs">
                              <div>{formatDateReadable(app.appointment_date)}</div>
                              <div className="font-semibold text-teal-700 mt-0.5">
                                {formatTime12Hour(app.start_time)} - {formatTime12Hour(app.end_time)}
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                app.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                app.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-4 px-3 text-right space-x-2">
                              {app.status === 'pending' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(app.id, 'confirmed')}
                                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                                >
                                  Confirm
                                </button>
                              )}
                              {app.status !== 'completed' && app.status !== 'cancelled' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(app.id, 'completed')}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                                >
                                  Complete
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Appointments Management</h1>
                <p className="text-sm text-slate-600">Review, approve, and track all patient visits.</p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search patient name, email..."
                    value={apptSearch}
                    onChange={(e) => setApptSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <select
                  value={apptFilter}
                  onChange={(e) => setApptFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium text-slate-700 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm">
                  No appointments found matching your filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                        <th className="py-3.5 px-4">Patient Details</th>
                        <th className="py-3.5 px-4">Service</th>
                        <th className="py-3.5 px-4">Date & Time</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Notes</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredAppointments.map(app => {
                        const s = services.find(serv => serv.id === app.service_id);
                        return (
                          <tr key={app.id} className="hover:bg-slate-50 transition">
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900">{app.full_name}</div>
                              <div className="text-xs text-slate-500">{app.email}</div>
                              <div className="text-xs text-teal-700 font-medium">{app.phone}</div>
                            </td>
                            <td className="py-4 px-4 text-slate-800 font-medium">
                              <div>{s?.name || 'Dental Care'}</div>
                              <div className="text-xs text-slate-500">${s?.price} • {s?.duration_minutes}m</div>
                            </td>
                            <td className="py-4 px-4 text-xs text-slate-700 font-medium">
                              <div>{formatDateReadable(app.appointment_date)}</div>
                              <div className="text-teal-700 font-bold mt-0.5">
                                {formatTime12Hour(app.start_time)} - {formatTime12Hour(app.end_time)}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                app.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                app.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-xs text-slate-500 max-w-xs truncate">
                              {app.notes || 'None'}
                            </td>
                            <td className="py-4 px-4 text-right space-x-1.5">
                              {app.status === 'pending' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(app.id, 'confirmed')}
                                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
                                >
                                  Confirm
                                </button>
                              )}
                              {app.status !== 'completed' && app.status !== 'cancelled' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(app.id, 'completed')}
                                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
                                >
                                  Complete
                                </button>
                              )}
                              {app.status !== 'cancelled' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(app.id, 'cancelled')}
                                  className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-semibold transition"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Services Management</h1>
                <p className="text-sm text-slate-600">Add, edit, and activate/deactivate dental treatments.</p>
              </div>

              <button
                onClick={handleOpenAddService}
                className="px-5 py-2.5 bg-teal-700 text-white rounded-xl font-semibold text-xs hover:bg-teal-800 transition shadow-md flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <div
                  key={service.id}
                  className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between space-y-4 ${
                    service.is_active ? 'border-slate-200' : 'border-slate-300 opacity-60 bg-slate-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        service.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-lg font-extrabold text-teal-700">${service.price}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{service.description}</p>
                    <div className="text-xs font-semibold text-slate-500">Duration: {service.duration_minutes} minutes</div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditService(service)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Service</span>
                    </button>

                    <button
                      onClick={() => onUpdateService({ ...service, is_active: !service.is_active })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        service.is_active ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {service.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Modal */}
            {serviceModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fadeIn">
                <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      {editingService ? 'Edit Dental Service' : 'Add New Dental Service'}
                    </h3>
                    <button onClick={() => setServiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Service Name</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Price ($)</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Duration (Minutes)</label>
                        <input
                          type="number"
                          required
                          min={10}
                          step={5}
                          value={serviceForm.duration_minutes}
                          onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Image URL</label>
                      <input
                        type="url"
                        value={serviceForm.image_url}
                        onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={serviceForm.is_active}
                        onChange={(e) => setServiceForm({ ...serviceForm, is_active: e.target.checked })}
                        className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                      />
                      <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active on public website booking</label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setServiceModalOpen(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800 transition shadow-md"
                      >
                        {editingService ? 'Save Changes' : 'Create Service'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BUSINESS HOURS */}
        {activeTab === 'hours' && (
          <div className="space-y-6 animate-fadeIn max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Business Hours Configuration</h1>
                <p className="text-sm text-slate-600">Configure opening and closing times for each weekday.</p>
              </div>

              <button
                onClick={handleSaveHours}
                className="px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold text-xs hover:bg-teal-800 transition shadow-md flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Hours Schedule</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
              {hoursState.map((bh, idx) => (
                <div key={bh.id || idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 gap-4">
                  <div className="flex items-center space-x-4 min-w-[140px]">
                    <input
                      type="checkbox"
                      checked={bh.is_open}
                      onChange={(e) => {
                        const updated = [...hoursState];
                        updated[idx].is_open = e.target.checked;
                        setHoursState(updated);
                      }}
                      className="w-5 h-5 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <span className="font-bold text-slate-900 text-sm">{weekdayNames[bh.weekday]}</span>
                  </div>

                  {bh.is_open ? (
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <input
                        type="time"
                        value={bh.start_time}
                        onChange={(e) => {
                          const updated = [...hoursState];
                          updated[idx].start_time = e.target.value;
                          setHoursState(updated);
                        }}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium outline-none"
                      />
                      <span className="text-slate-400 text-xs">to</span>
                      <input
                        type="time"
                        value={bh.end_time}
                        onChange={(e) => {
                          const updated = [...hoursState];
                          updated[idx].end_time = e.target.value;
                          setHoursState(updated);
                        }}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium outline-none"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">
                      Closed All Day
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BLOCKED DATES */}
        {activeTab === 'blocked' && (
          <div className="space-y-6 animate-fadeIn max-w-3xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Blocked Dates Management</h1>
              <p className="text-sm text-slate-600">Block specific dates (holidays, staff training) to prevent patient bookings.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <form onSubmit={handleAddBlock} className="grid sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Date to Block</label>
                  <input
                    type="date"
                    required
                    value={newBlockedDate}
                    onChange={(e) => setNewBlockedDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Reason / Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Christmas Holiday"
                    value={newBlockedReason}
                    onChange={(e) => setNewBlockedReason(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-700 text-white rounded-xl font-semibold text-xs hover:bg-teal-800 transition shadow-md"
                  >
                    Add Block
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Active Blocked Dates</h3>
              {blockedDates.length === 0 ? (
                <p className="text-xs text-slate-500">No blocked dates configured.</p>
              ) : (
                <div className="space-y-3">
                  {blockedDates.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{formatDateReadable(b.blocked_date)}</div>
                        <div className="text-xs text-slate-500">{b.reason}</div>
                      </div>
                      <button
                        onClick={() => onRemoveBlockedDate(b.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CLINIC SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-3xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Clinic Settings</h1>
              <p className="text-sm text-slate-600">Update clinic information, contact details, and booking parameters.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              {settingsSaved && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-medium">
                  Settings saved successfully!
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Clinic Name</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.clinic_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, clinic_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Clinic Email</label>
                    <input
                      type="email"
                      required
                      value={settingsForm.clinic_email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, clinic_email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Clinic Phone</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.clinic_phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, clinic_phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Clinic Address</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.clinic_address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, clinic_address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Slot Interval (Minutes)</label>
                    <select
                      value={settingsForm.slot_interval_minutes}
                      onChange={(e) => setSettingsForm({ ...settingsForm, slot_interval_minutes: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none bg-white"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Minimum Booking Notice (Hours)</label>
                    <input
                      type="number"
                      min={0}
                      value={settingsForm.booking_notice_hours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, booking_notice_hours: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-teal-700 text-white rounded-xl font-semibold text-sm hover:bg-teal-800 transition shadow-md flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Clinic Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
