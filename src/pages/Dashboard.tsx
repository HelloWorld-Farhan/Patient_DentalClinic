import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface VisitRecord {
  id: string;
  date: string;
  service: string;
  dentist: string;
  status: 'Completed';
  notes: string;
}

const recentVisits: VisitRecord[] = [
  {
    id: 'VIS-1',
    date: 'Apr 12, 2023',
    service: 'Comprehensive Exam',
    dentist: 'Dr. Priya Patel',
    status: 'Completed',
    notes: 'Comprehensive clinical oral exam and periodontal charting. Pocket depths 1-3mm with no signs of active inflammation. Ultrasonic prophylaxis completed.'
  },
  {
    id: 'VIS-2',
    date: 'Jan 15, 2023',
    service: 'Cavity Filling (Tooth #14)',
    dentist: 'Dr. Vikram Chawla',
    status: 'Completed',
    notes: 'Posterior occlusal composite restoration placed on maxillary first molar. Local anesthetic administered without complications. Polished and bite verified.'
  },
  {
    id: 'VIS-3',
    date: 'Oct 02, 2022',
    service: 'Routine Cleaning',
    dentist: 'Dr. Priya Patel',
    status: 'Completed',
    notes: 'Standard preventative hygiene scaling, coronal polish, and topical fluoride varnish application. Patient reminded to maintain daily interdental flossing.'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedVisit, setSelectedVisit] = useState<VisitRecord | null>(null);
  const [tipsModalOpen, setTipsModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
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

      {/* Top Section: Welcome Banner & Health Summary (Bento Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Welcome & Next Appointment Banner (8 Cols) */}
        <div className="lg:col-span-8 bg-primary-container text-on-primary-container rounded-xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(0,119,130,0.06)]">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-primary/20 pointer-events-none blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-on-primary-container/10 text-on-primary-container text-xs uppercase tracking-wider font-semibold">
                Priority Reminder
              </span>
              <span className="text-xs text-on-primary-container/80 font-mono">ID: #SC-84920</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-primary-container mb-1">
              Welcome back, Ananya.
            </h1>
            <p className="text-sm sm:text-base text-on-primary-container/90 max-w-xl leading-relaxed">
              Your dental hygiene streak is looking great! Here is your upcoming visit overview and active care status.
            </p>
          </div>

          <div className="relative z-10 mt-8 pt-4 border-t border-on-primary-container/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
              </div>
              <div>
                <div className="text-xs text-on-primary-container/80 uppercase font-bold tracking-wider">Next Appointment</div>
                <div className="text-base sm:text-lg font-bold text-on-primary-container leading-tight">Routine Cleaning & Checkup</div>
                <div className="text-xs text-on-primary-container/90 mt-0.5">Dr. Priya Patel • Oct 24, 10:00 AM</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setRescheduleModalOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-surface-container-lowest text-primary font-bold text-xs sm:text-sm hover:bg-surface-container-low transition-colors shadow-sm cursor-pointer"
              >
                Reschedule
              </button>
              <button
                onClick={() => navigate('/dashboard/appointments')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Dental Health Summary Widget (4 Cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-on-surface">Health Summary</h2>
              <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            </div>
            
            <div className="flex items-center justify-center py-4 relative">
              <div className="w-32 h-32 rounded-full border-8 border-surface-container flex flex-col items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin"
                  style={{ animationDuration: '8s' }}
                />
                <span className="text-3xl font-extrabold text-on-surface leading-none">92%</span>
                <span className="text-xs text-outline font-semibold mt-1">Score</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-surface-container text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-outline">Last Checkup</span>
              <span className="font-semibold text-on-surface">Apr 12, 2023</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-outline">Next Recommended</span>
              <span className="font-bold text-primary">Oct 24, 2023</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-on-surface">Quick Actions</h3>
          <span className="text-xs text-outline font-medium">Frequently used tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Book Appointment */}
          <div
            onClick={() => navigate('/dashboard/appointments')}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">add_alarm</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-on-surface mb-1">Book Appointment</h4>
              <p className="text-xs text-outline leading-relaxed">Schedule your next cleaning or consultation with ease.</p>
            </div>
          </div>

          {/* View X-Rays */}
          <div
            onClick={() => navigate('/dashboard/records')}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">radiology</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-on-surface mb-1">View X-Rays</h4>
              <p className="text-xs text-outline leading-relaxed">Access high-resolution scans and panoramic imagery.</p>
            </div>
          </div>

          {/* Pay Bill */}
          <div
            onClick={() => setPayModalOpen(true)}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-on-surface mb-1">Pay Bill</h4>
              <p className="text-xs text-outline leading-relaxed">Review invoices, insurance claims, and settle balances.</p>
            </div>
          </div>

          {/* Dental Care Tips */}
          <div
            onClick={() => setTipsModalOpen(true)}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">clinical_notes</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-on-surface mb-1">Dental Care Tips</h4>
              <p className="text-xs text-outline leading-relaxed">Expert advice on brushing, flossing, and gum health.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Treatment Plan Progress Tracker & Recent Visit History (Split Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Treatment Plan Tracker (4 Cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-on-surface">Active Treatments</h3>
              <span className="text-xs text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full">2 Active</span>
            </div>

            <div className="space-y-5">
              {/* Treatment 1: Teeth Whitening */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs sm:text-sm">
                  <span className="font-bold text-on-surface">Laser Teeth Whitening</span>
                  <span className="text-xs text-primary font-bold">100%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <p className="text-xs text-outline mt-1 font-medium">Completed • Maintenance phase</p>
              </div>

              {/* Treatment 2: Invisalign */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs sm:text-sm">
                  <span className="font-bold text-on-surface">Invisalign Aligners</span>
                  <span className="text-xs text-primary font-bold">30%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '30%' }} />
                </div>
                <p className="text-xs text-outline mt-1 font-medium">Aligner 6 of 20 • Next swap in 4 days</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-surface-container">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-container-low border border-surface-container-high/60">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">info</span>
              <span className="text-xs text-on-surface-variant leading-tight">Wear aligners 22 hours daily for optimal tracking results.</span>
            </div>
          </div>
        </div>

        {/* Recent Visit History Table (8 Cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-on-surface">Recent Visit History</h3>
            <button
              onClick={() => navigate('/dashboard/appointments')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              View All History
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-surface-container text-xs text-outline uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Dentist</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {recentVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-3 text-on-surface font-semibold whitespace-nowrap">{visit.date}</td>
                    <td className="py-3.5 px-3 text-on-surface font-medium">{visit.service}</td>
                    <td className="py-3.5 px-3 text-outline">{visit.dentist}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                        {visit.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedVisit(visit)}
                        className="text-xs text-primary hover:underline font-bold cursor-pointer"
                      >
                        Summary
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VISIT SUMMARY MODAL (Portal with z-[9999]) */}
      {selectedVisit && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedVisit(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[90vh]"
            >
              <div className="p-5 sm:p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[24px]">calendar_today</span>
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-on-surface">Visit Summary</h2>
                    <p className="text-xs text-outline">{selectedVisit.date} • {selectedVisit.dentist}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVisit(null)}
                  className="p-1.5 text-outline hover:text-on-surface rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">Procedure / Service</span>
                  <span className="font-bold text-base text-on-surface block mt-0.5">{selectedVisit.service}</span>
                </div>

                <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high leading-relaxed text-on-surface-variant">
                  <span className="font-bold text-on-surface block mb-1">Clinical Notes & Observations:</span>
                  {selectedVisit.notes}
                </div>
              </div>

              <div className="p-4 bg-surface-container-low/50 border-t border-surface-container-low flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedVisit(null)}
                  className="px-4 py-2 bg-primary text-white font-bold rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

      {/* QUICK RESCHEDULE MODAL (Portal with z-[9999]) */}
      {rescheduleModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setRescheduleModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-surface-container-high shrink-0">
                <h3 className="font-bold text-base text-on-surface">Reschedule Upcoming Visit</h3>
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                <p className="text-on-surface-variant">
                  Select a new slot for <strong>Routine Cleaning & Checkup</strong> with Dr. Priya Patel:
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
                  onClick={() => setRescheduleModalOpen(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRescheduleModalOpen(false);
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

      {/* QUICK PAY MODAL (Portal with z-[9999]) */}
      {payModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setPayModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto text-xs max-h-[90vh]"
            >
              <div className="p-5 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[24px]">credit_card</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-on-surface">Pay Patient Copay</h2>
                    <p className="text-xs text-outline">Direct clinic copay settlement</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="p-1.5 text-outline hover:text-on-surface rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
                  <span className="text-xs text-emerald-800 font-medium">Outstanding Statement Balance</span>
                  <div className="text-3xl font-extrabold text-emerald-950 font-mono">$145.50</div>
                  <span className="text-[11px] text-emerald-700 block">Delta Dental Paid: $120.00</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-on-surface">Saved Payment Method</label>
                  <div className="p-3 rounded-xl border border-primary/40 bg-primary/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
                      <span className="font-bold text-on-surface">Visa ending in 4092</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Primary</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low/50 border-t border-surface-container-low flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPayModalOpen(false);
                    showToast("Payment of $145.50 settled successfully! Receipt sent to email.");
                  }}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Authorize $145.50
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

      {/* DENTAL CARE TIPS MODAL (Portal with z-[9999]) */}
      {tipsModalOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setTipsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto max-h-[90vh] sm:max-h-[92vh]"
            >
              <div className="p-5 sm:p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[24px]">dentistry</span>
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-on-surface">Personalized Oral Care Guide</h2>
                    <p className="text-xs text-outline">Customized hygiene advice curated by your care team</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTipsModalOpen(false)}
                  className="p-1.5 text-outline hover:text-on-surface rounded-lg cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-3 overflow-y-auto flex-1 text-xs text-on-surface-variant">
                <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container-high">
                  <strong className="text-on-surface block mb-1">1. Aligner Care & Hygiene:</strong>
                  Clean aligner trays with lukewarm water and antibacterial crystal soak. Never use hot water to prevent plastic distortion.
                </div>
                <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container-high">
                  <strong className="text-on-surface block mb-1">2. Interdental Cleaning:</strong>
                  Floss once daily prior to bedtime. Focus on mandibular anterior lingual margins where calculus naturally accumulates.
                </div>
                <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container-high">
                  <strong className="text-on-surface block mb-1">3. Enamel Protection:</strong>
                  Wait 30 minutes after consuming acidic beverages (citrus, coffee) before brushing to avoid enamel micro-abrasion.
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-surface-container-low/50 border-t border-surface-container-low flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setTipsModalOpen(false)}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all"
                >
                  Got it, thank you
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
}
