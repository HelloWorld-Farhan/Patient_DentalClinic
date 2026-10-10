import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialAppointments } from '../data/mockData';
import { Appointment } from '../types';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<Appointment | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState<Appointment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Appointment Form State
  const [newDentist, setNewDentist] = useState('Dr. Priya Patel');
  const [newProcedure, setNewProcedure] = useState('Routine Cleaning & Comprehensive Checkup');
  const [newDate, setNewDate] = useState('2026-11-18');
  const [newTime, setNewTime] = useState('11:00 AM - 12:00 PM');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      dentist: newDentist,
      dentistTitle: newDentist.includes('Patel') ? 'DDS, Lead Clinician' : 'DMD, Orthodontist Specialist',
      procedure: newProcedure,
      category: newProcedure.includes('Orthodont') ? 'Orthodontics' : 'Checkup',
      date: newDate,
      time: newTime,
      duration: '45 mins',
      location: 'Smile Clinic Main Branch, Suite 402, Downtown',
      status: 'Confirmed',
      isUpcoming: true
    };

    setAppointments([newApt, ...appointments]);
    setBookModalOpen(false);
    showToast(`Appointment confirmed with ${newDentist} on ${newDate}!`);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Cancelled', isUpcoming: false } : a));
    setCancelModalOpen(null);
    showToast("Appointment successfully cancelled.");
  };

  const upcomingList = appointments.filter(a => a.isUpcoming && a.status !== 'Cancelled');
  const pastList = appointments.filter(a => !a.isUpcoming || a.status === 'Cancelled').filter(a => 
    a.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.dentist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-teal-400">check_circle</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Booking CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Appointment Scheduling</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Book preventative appointments, review upcoming chairside visits, and inspect session logs.
          </p>
        </div>
        <button
          onClick={() => setBookModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-md shadow-primary/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Top Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Scheduled Visits</span>
            <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
          </div>
          <div className="text-2xl font-extrabold text-on-surface">{upcomingList.length} Upcoming</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Confirmed with clinic</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Completed Sessions</span>
            <span className="material-symbols-outlined text-secondary text-[22px]">history</span>
          </div>
          <div className="text-2xl font-extrabold text-on-surface">8 Recorded</div>
          <span className="text-[11px] text-on-surface-variant font-medium mt-1 block">Full records archived</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Primary Location</span>
            <span className="material-symbols-outlined text-tertiary text-[22px]">location_on</span>
          </div>
          <div className="text-base font-extrabold text-on-surface truncate">Main Branch, Suite 402</div>
          <span className="text-[11px] text-on-surface-variant font-medium mt-1 block">Healthcare District Plaza</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Preventive Coverage</span>
            <span className="material-symbols-outlined text-emerald-600 text-[22px]">verified</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">100% Covered</div>
          <span className="text-[11px] text-on-surface-variant font-medium mt-1 block">Delta Dental Premier</span>
        </div>
      </div>

      {/* Main Section: Upcoming Appointments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">upcoming</span>
            <span>Upcoming Appointments</span>
          </h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            {upcomingList.length} Scheduled
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {upcomingList.map((apt) => (
            <div 
              key={apt.id}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container-high flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] px-3 py-1 rounded-bl-xl font-bold uppercase tracking-wider">
                {apt.status}
              </div>

              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                    <span className="material-symbols-outlined text-[28px]">dentistry</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">{apt.category}</span>
                    <h3 className="font-headline font-bold text-base text-on-surface">{apt.dentist}</h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[15px] text-outline">location_on</span>
                      <span>{apt.location}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-xl mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-center px-3 py-1 bg-surface-container-lowest rounded-lg border border-surface-container-high shadow-xs">
                      <span className="block text-[10px] text-primary font-extrabold uppercase">
                        {apt.date.split(' ')[0]}
                      </span>
                      <span className="block text-base font-bold text-on-surface leading-tight">
                        {apt.date.split(' ')[1].replace(',', '')}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface block">{apt.time}</span>
                      <span className="text-[11px] text-on-surface-variant">{apt.procedure}</span>
                    </div>
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-xs text-outline mb-4 italic">
                    Note: {apt.notes}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-surface-container-high">
                <button
                  onClick={() => showToast(`Appointment synced with Google/Apple calendar!`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-secondary bg-secondary-fixed/50 hover:bg-secondary-fixed transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">event_available</span>
                  <span>Add to Calendar</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRescheduleModalOpen(apt)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setCancelModalOpen(apt)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Appointments History Table */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container-high space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">history</span>
            <span>Past Appointment History</span>
          </h2>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by dentist, procedure, or date..."
              className="w-full sm:w-72 pl-9 pr-3 py-2 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-[18px]">
              search
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline text-[11px] uppercase tracking-wider font-semibold border-b border-surface-container-high">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Dentist & Treatment</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Clinical Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {pastList.map((apt) => (
                <tr key={apt.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface whitespace-nowrap">
                    <div>{apt.date}</div>
                    <div className="text-[10px] text-outline">{apt.time}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-on-surface block">{apt.procedure}</span>
                    <span className="text-[11px] text-on-surface-variant">{apt.dentist}</span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant max-w-[200px] truncate">
                    {apt.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      apt.status === 'Completed'
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-error-container text-on-error-container'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => showToast(`Downloaded clinical note for ${apt.procedure}!`)}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-bold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">description</span>
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book New Appointment Modal */}
      <AnimatePresence>
        {bookModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high max-w-lg w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">event_note</span>
                  <h3 className="font-headline font-bold text-base text-on-surface">Book Dental Appointment</h3>
                </div>
                <button
                  onClick={() => setBookModalOpen(false)}
                  className="p-1 text-outline hover:text-on-surface rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Select Procedure / Reason *</label>
                  <select
                    value={newProcedure}
                    onChange={(e) => setNewProcedure(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                  >
                    <option value="Routine Cleaning & Comprehensive Checkup">Routine Cleaning & Comprehensive Checkup</option>
                    <option value="Laser Teeth Whitening Consultation">Laser Teeth Whitening Consultation</option>
                    <option value="Invisalign Aligner Check & Refinement">Invisalign Aligner Check & Refinement</option>
                    <option value="Dental Crown & Bridge Fitting">Dental Crown & Bridge Fitting</option>
                    <option value="Emergency Toothache / Trauma Triage">Emergency Toothache / Trauma Triage</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Preferred Clinician *</label>
                  <select
                    value={newDentist}
                    onChange={(e) => setNewDentist(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                  >
                    <option value="Dr. Priya Patel">Dr. Priya Patel, DDS (General & Cosmetic)</option>
                    <option value="Dr. Vikram Chawla">Dr. Vikram Chawla, DMD (Orthodontics Specialist)</option>
                    <option value="Dr. Rohan Chauhan">Dr. Rohan Chauhan, DMD (Restorative & Implants)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-on-surface mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-on-surface mb-1">Available Slot *</label>
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                    >
                      <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                      <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                      <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-primary text-[11px] leading-relaxed">
                  ✓ Instant confirmation: You will receive an SMS and calendar invite upon clicking confirm.
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookModalOpen(false)}
                    className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high max-w-sm w-full p-6 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                <h3 className="font-headline font-bold text-base text-on-surface">Reschedule Visit</h3>
                <button onClick={() => setRescheduleModalOpen(null)} className="p-1 text-outline">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <p className="text-on-surface-variant">
                Select a new slot for <strong>{rescheduleModalOpen.procedure}</strong> with {rescheduleModalOpen.dentist}:
              </p>

              <div>
                <label className="block font-bold text-on-surface mb-1">Select New Date</label>
                <input
                  type="date"
                  defaultValue="2026-11-20"
                  className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container-high font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setRescheduleModalOpen(null)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setRescheduleModalOpen(null);
                    showToast("Appointment rescheduled! New confirmation dispatched via SMS.");
                  }}
                  className="px-4 py-2 bg-primary text-white font-bold rounded-xl cursor-pointer"
                >
                  Update Slot
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high max-w-sm w-full p-6 space-y-4 text-xs"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[26px]">event_busy</span>
                </div>
                <h3 className="font-headline font-bold text-base text-on-surface">Cancel Appointment?</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Are you sure you want to cancel your visit for <strong>{cancelModalOpen.procedure}</strong> on {cancelModalOpen.date}?
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setCancelModalOpen(null)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-xl cursor-pointer"
                >
                  Keep Visit
                </button>
                <button
                  onClick={() => handleCancelAppointment(cancelModalOpen.id)}
                  className="px-4 py-2 bg-error text-white font-bold rounded-xl cursor-pointer"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
