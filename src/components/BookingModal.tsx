import React, { useState, useMemo } from 'react';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight, ArrowLeft, User, Mail, Phone, FileText } from 'lucide-react';
import { Service, BusinessHour, BlockedDate, Appointment, ClinicSetting } from '../types';
import { generateAvailableTimeSlots, formatTime12Hour, formatDateReadable } from '../utils/bookingUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  businessHours: BusinessHour[];
  blockedDates: BlockedDate[];
  appointments: Appointment[];
  clinicSettings: ClinicSetting;
  preSelectedServiceId?: string;
  onAppointmentCreated: (newAppt: Partial<Appointment>) => Promise<void>;
}

export function BookingModal({
  isOpen,
  onClose,
  services,
  businessHours,
  blockedDates,
  appointments,
  clinicSettings,
  preSelectedServiceId,
  onAppointmentCreated
}: BookingModalProps) {
  const activeServices = services.filter(s => s.is_active);

  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preSelectedServiceId || activeServices[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // tomorrow default
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null);
  
  // Patient Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);

  const currentService = services.find(s => s.id === selectedServiceId) || activeServices[0];

  // Generate available slots for selected date & service
  const availableSlots = useMemo(() => {
    if (!currentService || !selectedDate) return [];
    return generateAvailableTimeSlots(
      selectedDate,
      currentService.duration_minutes,
      businessHours,
      appointments,
      blockedDates,
      clinicSettings
    );
  }, [selectedDate, currentService, businessHours, appointments, blockedDates, clinicSettings]);

  if (!isOpen) return null;

  const handleNextFromStep1 = () => {
    if (!selectedServiceId) return;
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!selectedTimeSlot) return;
    setStep(3);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !selectedTimeSlot || !currentService) return;

    setSubmitting(true);
    try {
      const newAppointmentPayload = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service_id: currentService.id,
        appointment_date: selectedDate,
        start_time: selectedTimeSlot.start,
        end_time: selectedTimeSlot.end,
        status: 'pending' as const,
        notes: notes.trim() || undefined
      };

      await onAppointmentCreated(newAppointmentPayload);

      setConfirmedAppt({
        id: 'app-' + Date.now(),
        ...newAppointmentPayload,
        services: currentService
      });
      setStep(4);
    } catch (err) {
      console.error('Failed to book appointment:', err);
      alert('Failed to submit appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedTimeSlot(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setConfirmedAppt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-blue-800 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-200 block">
              Online Appointment System
            </span>
            <h2 className="text-xl font-bold">
              {step === 4 ? 'Appointment Confirmed!' : 'Schedule Your Dental Visit'}
            </h2>
          </div>
          <button
            onClick={resetAndClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-teal-700' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
              <span>Select Service</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-teal-700' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
              <span>Date & Time</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-teal-700' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
              <span>Your Details</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Choose Dental Service</h3>
              
              <div className="space-y-3">
                {activeServices.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                      selectedServiceId === service.id
                        ? 'border-teal-600 bg-teal-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      <div className="font-bold text-slate-900 text-base">{service.name}</div>
                      <p className="text-xs text-slate-600 line-clamp-2">{service.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-teal-700 font-semibold pt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{service.duration_minutes} mins</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-extrabold text-slate-900">${service.price}</div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-2 mx-auto ${
                        selectedServiceId === service.id ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                      }`}>
                        {selectedServiceId === service.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNextFromStep1}
                  disabled={!selectedServiceId}
                  className="px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold text-sm hover:bg-teal-800 transition shadow-md disabled:opacity-50 flex items-center space-x-2"
                >
                  <span>Continue to Date & Time</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-teal-700 flex items-center space-x-1 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Services</span>
                </button>
                <div className="text-xs font-medium text-slate-500">
                  Selected: <span className="font-bold text-slate-900">{currentService?.name}</span> (${currentService?.price})
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Date Picker */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Select Appointment Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTimeSlot(null);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm font-medium text-slate-800 outline-none"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {formatDateReadable(selectedDate)}
                  </p>
                </div>

                {/* Available Time Slots */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Available Time Slots
                  </label>

                  {availableSlots.length === 0 ? (
                    <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center text-amber-800 text-xs">
                      No available time slots on this date (clinic is closed, fully booked, or date is blocked). Please choose another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {availableSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot({ start: slot.start, end: slot.end })}
                          className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                            !slot.available
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : selectedTimeSlot?.start === slot.start
                              ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  disabled={!selectedTimeSlot}
                  className="px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold text-sm hover:bg-teal-800 transition shadow-md disabled:opacity-50 flex items-center space-x-2"
                >
                  <span>Continue to Patient Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Details Form */}
          {step === 3 && (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  type="button"
                  className="text-xs font-semibold text-teal-700 flex items-center space-x-1 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Time Slots</span>
                </button>
                <div className="text-xs font-medium text-slate-500">
                  {formatDateReadable(selectedDate)} at {selectedTimeSlot && formatTime12Hour(selectedTimeSlot.start)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-teal-700 font-semibold block uppercase">Selected Service</span>
                  <span className="font-bold text-slate-900 text-base">{currentService?.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total Price</span>
                  <span className="font-extrabold text-teal-700 text-lg">${currentService?.price}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-teal-600" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Notes or Special Requests (Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any sensitivity, previous dental history, or specific questions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 bg-teal-700 text-white rounded-xl font-semibold text-sm hover:bg-teal-800 transition shadow-md disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? 'Confirming Appointment...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && confirmedAppt && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">You're All Set, {confirmedAppt.full_name}!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  We have received your appointment request and sent a confirmation email to <span className="font-semibold text-slate-800">{confirmedAppt.email}</span>.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200/80 max-w-md mx-auto space-y-3">
                <div className="flex justify-between text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500">Service</span>
                  <span className="font-bold text-slate-900">{confirmedAppt.services?.name || currentService?.name}</span>
                </div>
                <div className="flex justify-between text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500">Date</span>
                  <span className="font-bold text-slate-900">{formatDateReadable(confirmedAppt.appointment_date)}</span>
                </div>
                <div className="flex justify-between text-xs pb-3 border-b border-slate-200">
                  <span className="text-slate-500">Time</span>
                  <span className="font-bold text-teal-700">
                    {formatTime12Hour(confirmedAppt.start_time)} - {formatTime12Hour(confirmedAppt.end_time)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Clinic Location</span>
                  <span className="font-medium text-slate-800 text-right max-w-[200px]">{clinicSettings.clinic_address}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-8 py-3 bg-teal-700 text-white rounded-xl font-semibold text-sm hover:bg-teal-800 transition shadow-md"
                >
                  Done / Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
