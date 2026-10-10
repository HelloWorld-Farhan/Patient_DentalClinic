import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface UpcomingApt {
  id: string;
  dentist: string;
  dentistImg: string;
  procedure: string;
  location: string;
  month: string;
  day: string;
  fullDate: string;
  timeSlot: string;
  note: string;
  status: 'Confirmed' | 'Pending Confirmation';
}

interface PastApt {
  id: string;
  date: string;
  time: string;
  dentist: string;
  treatment: string;
  notes: string;
  status: 'Completed';
}

const initialUpcoming: UpcomingApt[] = [
  {
    id: 'APT-1',
    dentist: 'Dr. Priya Patel, DDS',
    dentistImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6hrazIG_NsiGGYzWnDz0m5A333wxrviBRPqIFBOs8QjhjyclfL_nyvgWFig0hw4yV2tWGA_1HuEAfZZNC494yj0oCb5v2S3wxppMSO5VjDuMBxIr1JRnweFq0fm1N213Pp6_RLmSxLx7Vcoa7_AjoO5EiOhmwUpJPDbIpTnyOiAOEyLRRniQQ5kpIIBlD1px1-FvX48OzeoIFBbfLlYvccFYXVluhs9awRBIBrrUhEYTv6SpSHI65',
    procedure: 'Routine Checkup & Cleaning',
    location: 'Smile Clinic Main Branch, Suite 402, Downtown',
    month: 'OCT',
    day: '24',
    fullDate: 'Thursday, 10:00 AM - 11:00 AM',
    timeSlot: '10:00 AM - 11:00 AM',
    note: 'Please arrive 10 mins early for paperwork.',
    status: 'Confirmed'
  },
  {
    id: 'APT-2',
    dentist: 'Dr. Vikram Chawla, DMD',
    dentistImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXeNJ08d85ETK0TSzaE-HTxsfkltSc69VdgoDDmXIucrfMQg9lqLj73uvPZQx3L9PWWuIeSpka9etRy-fJ0Zyv-2g0WCv89kJMEO5ezi_VXYTekmOkuHvOYbWTHFh09CK1TUCPmMSjyvfJsE5ST8xfSX5OSIj90uLcZQXfiq3JME61-135_DtCuC3d2duhy_w0ChoFZvMVYboUziB5xuEJZQH3b1YEeY9Uw8vOykw5Z5A-KofgVgjS',
    procedure: 'Orthodontic Adjustment',
    location: 'Smile Clinic North Practice, 789 Medical Plaza',
    month: 'NOV',
    day: '05',
    fullDate: 'Sunday, 02:30 PM - 03:15 PM',
    timeSlot: '02:30 PM - 03:15 PM',
    note: 'Awaiting final confirmation from front desk.',
    status: 'Pending Confirmation'
  }
];

const initialPast: PastApt[] = [
  {
    id: 'REC-2023-0912',
    date: 'Sep 12, 2023',
    time: '09:00 AM',
    dentist: 'Dr. Priya Patel',
    treatment: 'Composite Filling (Tooth #14)',
    notes: 'Procedure went smoothly. Local anesthesia used. Cavity cleaned and sealed with tooth-colored resin composite. Patient advised to avoid hard foods for 24h. Next recall in 6 months.',
    status: 'Completed'
  },
  {
    id: 'REC-2023-0701',
    date: 'Jul 01, 2023',
    time: '11:15 AM',
    dentist: 'Dr. Vikram Chawla',
    treatment: 'Initial Consultation & X-Ray',
    notes: 'Comprehensive periodontal examination. Panorex X-ray taken. Treatment plan established for orthodontics. Panorex imaging shows mild crowding in lower anterior region. Patient selected aligner roadmap.',
    status: 'Completed'
  }
];

export default function Appointments() {
  const [upcomingList, setUpcomingList] = useState<UpcomingApt[]>(initialUpcoming);
  const [pastList] = useState<PastApt[]>(initialPast);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<UpcomingApt | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState<UpcomingApt | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<{ title: string; body: string } | null>(null);

  // New Booking State
  const [newService, setNewService] = useState('Routine Cleaning & Exam');
  const [newDentist, setNewDentist] = useState('Dr. Priya Patel, DDS (Main Branch)');
  const [newDate, setNewDate] = useState('2023-11-20');
  const [newTime, setNewTime] = useState('10:00 AM - Morning');
  const [newNotes, setNewNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(newDate);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthStr = months[dateObj.getMonth()] || 'DEC';
    const dayStr = String(dateObj.getDate()).padStart(2, '0');

    const newAppointment: UpcomingApt = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      dentist: newDentist.split('(')[0].trim(),
      dentistImg: newDentist.includes('Chawla')
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXeNJ08d85ETK0TSzaE-HTxsfkltSc69VdgoDDmXIucrfMQg9lqLj73uvPZQx3L9PWWuIeSpka9etRy-fJ0Zyv-2g0WCv89kJMEO5ezi_VXYTekmOkuHvOYbWTHFh09CK1TUCPmMSjyvfJsE5ST8xfSX5OSIj90uLcZQXfiq3JME61-135_DtCuC3d2duhy_w0ChoFZvMVYboUziB5xuEJZQH3b1YEeY9Uw8vOykw5Z5A-KofgVgjS'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6hrazIG_NsiGGYzWnDz0m5A333wxrviBRPqIFBOs8QjhjyclfL_nyvgWFig0hw4yV2tWGA_1HuEAfZZNC494yj0oCb5v2S3wxppMSO5VjDuMBxIr1JRnweFq0fm1N213Pp6_RLmSxLx7Vcoa7_AjoO5EiOhmwUpJPDbIpTnyOiAOEyLRRniQQ5kpIIBlD1px1-FvX48OzeoIFBbfLlYvccFYXVluhs9awRBIBrrUhEYTv6SpSHI65',
      procedure: newService,
      location: newDentist.includes('North') ? 'Smile Clinic North Practice, 789 Medical Plaza' : 'Smile Clinic Main Branch, Suite 402, Downtown',
      month: monthStr,
      day: dayStr,
      fullDate: `${newDate}, ${newTime}`,
      timeSlot: newTime,
      note: newNotes || 'Confirmed appointment booked online.',
      status: 'Confirmed'
    };

    setUpcomingList([newAppointment, ...upcomingList]);
    setBookModalOpen(false);
    showToast(`Appointment booked successfully with ${newAppointment.dentist}!`);
  };

  const handleCancelAppointment = (id: string) => {
    setUpcomingList(upcomingList.filter(apt => apt.id !== id));
    setCancelModalOpen(null);
    showToast('Appointment cancelled successfully.');
  };

  const filteredPast = pastList.filter(p =>
    p.dentist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && typeof document !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-[10000] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5"
        >
          <span className="material-symbols-outlined text-teal-400 text-[20px]">task_alt</span>
          <span>{toastMessage}</span>
        </motion.div>,
        document.body
      )}

      {/* Top Bar / Header Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-primary font-bold block mb-1">
            Schedule Management
          </span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">Your Appointments</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Manage upcoming visits, book new treatments, and access past clinical notes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBookModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:bg-primary-container transition-all shadow-md hover:shadow-lg cursor-pointer text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* Quick Stats / Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.04)] border border-surface-container-high/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
            <span className="material-symbols-outlined text-[24px]">calendar_month</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant block">Next Visit</span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface mt-0.5">Oct 24, 10:00 AM</h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.04)] border border-surface-container-high/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[24px]">clinical_notes</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant block">Active Treatment Plan</span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface mt-0.5">Orthodontics Phase II</h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.04)] border border-surface-container-high/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant block">Completed Visits</span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface mt-0.5">8 Recorded Sessions</h3>
          </div>
        </div>
      </div>

      {/* Main Section: Upcoming Appointments */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">upcoming</span>
            <span>Upcoming Appointments</span>
          </h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {upcomingList.length} Scheduled
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingList.map((apt) => (
            <div
              key={apt.id}
              className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 flex flex-col justify-between relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 text-[11px] px-3 py-1 rounded-bl-lg font-bold ${
                apt.status === 'Confirmed'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-secondary-fixed text-on-secondary-fixed'
              }`}>
                {apt.status}
              </div>

              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0 border border-surface-container-high"
                    style={{ backgroundImage: `url('${apt.dentistImg}')` }}
                  />
                  <div>
                    <span className="text-xs text-primary uppercase font-bold block">{apt.procedure}</span>
                    <h3 className="text-base sm:text-lg font-bold text-on-surface">{apt.dentist}</h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                      <span>{apt.location}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-lg mb-4 flex items-center justify-between border border-surface-container-high/60">
                  <div className="flex items-center gap-3">
                    <div className="text-center px-3 py-1 bg-surface-container-lowest rounded shadow-sm border border-surface-container-high">
                      <span className="block text-[10px] text-primary font-bold uppercase">{apt.month}</span>
                      <span className="block text-lg font-bold text-on-surface leading-tight">{apt.day}</span>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-on-surface block">{apt.fullDate}</span>
                      <span className="text-xs text-on-surface-variant">{apt.note}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-surface-container-high">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast(`Added appointment for ${apt.dentist} to calendar!`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-secondary bg-secondary-fixed/50 hover:bg-secondary-fixed transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">event_available</span>
                    <span>Add to Calendar</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRescheduleModalOpen(apt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setCancelModalOpen(apt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Appointments Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            <span>Past Appointment History</span>
          </h2>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search past visits..."
              className="bg-surface-container-lowest px-4 py-2 rounded-lg text-xs sm:text-sm text-on-surface border border-outline-variant focus:outline-none focus:border-primary pl-9 w-56 sm:w-64"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-[18px]">search</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.04)] overflow-hidden border border-surface-container-high/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-5">Date & Time</th>
                  <th className="py-3.5 px-5">Dentist & Treatment</th>
                  <th className="py-3.5 px-5">Summary Notes</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filteredPast.map((past) => (
                  <tr key={past.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-5 text-on-surface font-medium whitespace-nowrap">
                      {past.date}
                      <br />
                      <span className="text-xs text-on-surface-variant">{past.time}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-on-surface block">{past.dentist}</span>
                      <span className="text-xs text-primary font-medium">{past.treatment}</span>
                    </td>
                    <td className="py-3.5 px-5 text-on-surface-variant max-w-xs truncate">
                      {past.notes}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">
                        {past.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedNotes({ title: `${past.date} - ${past.dentist}`, body: past.notes })}
                          className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="View Summary Notes"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button
                          onClick={() => showToast(`Receipt ${past.id} downloaded.`)}
                          className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Download Receipt"
                        >
                          <span className="material-symbols-outlined text-[20px]">receipt</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BOOKING MODAL (Portal with z-[9999]) */}
      {bookModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setBookModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-primary text-white shrink-0">
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">add_circle</span>
                  <span>Book New Dental Appointment</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setBookModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto flex-1">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Select Treatment Type *</label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary font-medium"
                    required
                  >
                    <option value="Routine Cleaning & Exam">Routine Cleaning & Exam</option>
                    <option value="Cavity Filling / Restoration">Cavity Filling / Restoration</option>
                    <option value="Orthodontic Consultation / Adjustment">Orthodontic Consultation / Adjustment</option>
                    <option value="Teeth Whitening">Teeth Whitening</option>
                    <option value="Emergency Toothache Relief">Emergency Toothache Relief</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Preferred Dentist *</label>
                  <select
                    value={newDentist}
                    onChange={(e) => setNewDentist(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary font-medium"
                    required
                  >
                    <option value="Dr. Priya Patel, DDS (Main Branch)">Dr. Priya Patel, DDS (Main Branch)</option>
                    <option value="Dr. Vikram Chawla, DMD (North Clinic)">Dr. Vikram Chawla, DMD (North Clinic)</option>
                    <option value="Dr. Rohan Chauhan, DMD (Implant Specialist)">Dr. Rohan Chauhan, DMD (Implant Specialist)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-on-surface mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface focus:outline-none focus:border-primary font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-on-surface mb-1">Preferred Time Slot *</label>
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary font-medium"
                      required
                    >
                      <option value="09:00 AM - Morning">09:00 AM - Morning</option>
                      <option value="11:00 AM - Late Morning">11:00 AM - Late Morning</option>
                      <option value="02:00 PM - Afternoon">02:00 PM - Afternoon</option>
                      <option value="04:00 PM - Late Afternoon">04:00 PM - Late Afternoon</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Additional Notes or Symptoms (Optional)</label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Describe any sensitivity, pain, or specific requests..."
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface focus:outline-none focus:border-primary font-medium"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-surface-container shrink-0">
                  <button
                    type="button"
                    onClick={() => setBookModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-container transition-colors shadow-sm font-bold cursor-pointer"
                  >
                    Confirm Booking Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>,
          document.body
        )}

      {/* NOTES SUMMARY MODAL (Portal with z-[9999]) */}
      {selectedNotes && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedNotes(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low border-b border-surface-container-high shrink-0">
                <h3 className="font-bold text-base text-on-surface">{selectedNotes.title}</h3>
                <button
                  type="button"
                  onClick={() => setSelectedNotes(null)}
                  className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                <p className="text-on-surface-variant leading-relaxed">{selectedNotes.body}</p>
              </div>

              <div className="px-6 py-3 bg-surface-container-low/50 border-t border-surface-container-high flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedNotes(null)}
                  className="px-4 py-2 bg-primary text-white font-bold rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

      {/* RESCHEDULE MODAL (Portal with z-[9999]) */}
      {rescheduleModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setRescheduleModalOpen(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-surface-container-high shrink-0">
                <h3 className="font-bold text-base text-on-surface">Reschedule Appointment</h3>
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(null)}
                  className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <p className="text-on-surface-variant">
                  Select a new slot for <strong>{rescheduleModalOpen.procedure}</strong> with {rescheduleModalOpen.dentist}:
                </p>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Select New Date *</label>
                  <input
                    type="date"
                    defaultValue="2023-11-20"
                    className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-lg border border-surface-container-high font-medium text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="p-4 bg-surface-container-low/50 border-t border-surface-container-high flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(null)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRescheduleModalOpen(null);
                    showToast('Appointment rescheduled! Confirmation SMS dispatched.');
                  }}
                  className="px-4 py-2 bg-primary text-white font-bold rounded-lg cursor-pointer"
                >
                  Update Slot
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

      {/* CANCEL CONFIRMATION MODAL (Portal with z-[9999]) */}
      {cancelModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setCancelModalOpen(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-surface-container-lowest w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto text-xs max-h-[90vh]"
            >
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[26px]">event_busy</span>
                </div>
                <h3 className="font-bold text-base text-on-surface">Cancel Appointment?</h3>
                <p className="text-on-surface-variant leading-relaxed text-xs">
                  Are you sure you want to cancel your visit for <strong>{cancelModalOpen.procedure}</strong> with {cancelModalOpen.dentist}?
                </p>
              </div>

              <div className="p-4 bg-surface-container-low/50 border-t border-surface-container-high flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(null)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-lg cursor-pointer"
                >
                  Keep Visit
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelAppointment(cancelModalOpen.id)}
                  className="px-4 py-2 bg-error text-white font-bold rounded-lg cursor-pointer"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
}
