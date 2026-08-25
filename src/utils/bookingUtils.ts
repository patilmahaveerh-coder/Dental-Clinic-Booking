import { BusinessHour, Appointment, BlockedDate, TimeSlot, ClinicSetting } from '../types';

export function generateAvailableTimeSlots(
  selectedDateStr: string, // YYYY-MM-DD
  serviceDurationMinutes: number,
  businessHours: BusinessHour[],
  appointments: Appointment[],
  blockedDates: BlockedDate[],
  clinicSettings: ClinicSetting
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  if (!selectedDateStr) return slots;

  // Check if date is blocked
  const isBlocked = blockedDates.some(b => b.blocked_date === selectedDateStr);
  if (isBlocked) {
    return [];
  }

  // Parse date
  const dateParts = selectedDateStr.split('-').map(Number);
  const targetDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const weekday = targetDate.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

  // Find business hour for this weekday
  const daySchedule = businessHours.find(bh => bh.weekday === weekday);
  if (!daySchedule || !daySchedule.is_open) {
    return [];
  }

  const [openHour, openMinute] = daySchedule.start_time.split(':').map(Number);
  const [closeHour, closeMinute] = daySchedule.end_time.split(':').map(Number);

  const openTotalMinutes = openHour * 60 + openMinute;
  const closeTotalMinutes = closeHour * 60 + closeMinute;

  const interval = clinicSettings.slot_interval_minutes || 30;
  const noticeHours = clinicSettings.booking_notice_hours || 2;

  const now = new Date();
  const isToday = targetDate.toDateString() === now.toDateString();
  const nowTotalMinutes = now.getHours() * 60 + now.getMinutes() + noticeHours * 60;

  // Filter relevant active appointments for this date
  const dateAppointments = appointments.filter(
    app => app.appointment_date === selectedDateStr && app.status !== 'cancelled'
  );

  for (let currentMinutes = openTotalMinutes; currentMinutes + serviceDurationMinutes <= closeTotalMinutes; currentMinutes += interval) {
    const startHour = Math.floor(currentMinutes / 60);
    const startMin = currentMinutes % 60;
    const endMinutes = currentMinutes + serviceDurationMinutes;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;

    const startTimeStr = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
    const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    const label = `${formatTime12Hour(startTimeStr)} - ${formatTime12Hour(endTimeStr)}`;

    // Check if slot is in the past + notice hours for today
    let available = true;
    if (isToday && currentMinutes <= nowTotalMinutes) {
      available = false;
    }

    // Check overlap with existing appointments:
    // new_start < existing_end AND new_end > existing_start
    if (available) {
      for (const app of dateAppointments) {
        const [appStartH, appStartM] = app.start_time.split(':').map(Number);
        const [appEndH, appEndM] = app.end_time.split(':').map(Number);
        const appStartMin = appStartH * 60 + appStartM;
        const appEndMin = appEndH * 60 + appEndM;

        if (currentMinutes < appEndMin && endMinutes > appStartMin) {
          available = false;
          break;
        }
      }
    }

    slots.push({
      start: startTimeStr,
      end: endTimeStr,
      label,
      available
    });
  }

  return slots;
}

export function formatTime12Hour(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // the hour '0' should be '12'
  return `${h}:${m} ${ampm}`;
}

export function formatDateReadable(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
