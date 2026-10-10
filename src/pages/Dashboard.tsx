import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { initialPatientProfile, initialAppointments } from '../data/mockData';
import { Appointment } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedVisit, setSelectedVisit] = useState<Appointment | null>(null);
  const [tipsModalOpen, setTipsModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const nextApt = initialAppointments.find(a => a.isUpcoming) || initialAppointments[0];
  const pastVisits = initialAppointments.filter(a => !a.isUpcoming);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
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

      {/* Top Bento Row: Welcome & Next Appointment Banner (8 cols) + Health Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Welcome & Next Appointment Banner */}
        <div className="lg:col-span-8 bg-gradient-to-br from-primary to-[#004f56] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-primary/10">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Priority Reminder
              </span>
              <span className="text-xs text-teal-100 font-medium">Patient ID: #{initialPatientProfile.id}</span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-white mb-1.5">
              Welcome back, {initialPatientProfile.name}.
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl leading-relaxed">
              Your dental hygiene streak is looking great! Here is your upcoming scheduled visit and active care timeline overview.
            </p>
          </div>

          <div className="relative z-10 mt-6 pt-5 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[26px]">calendar_month</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 block">Next Appointment</span>
                <h3 className="font-headline font-bold text-base sm:text-lg text-white leading-tight">{nextApt.procedure}</h3>
                <span className="text-xs text-teal-100">{nextApt.dentist} • {nextApt.date}, {nextApt.time.split('-')[0].trim()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigate('/dashboard/appointments')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors backdrop-blur-xs cursor-pointer text-center"
              >
                Reschedule
              </button>
              <button
                onClick={() => setSelectedVisit(nextApt)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white text-primary hover:bg-teal-50 text-xs font-bold transition-colors shadow-sm cursor-pointer text-center"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Oral Health Score Gauge */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-xs border border-surface-container-high flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-bold text-base text-on-surface">Oral Health Summary</h2>
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
            </div>

            <div className="flex items-center justify-center py-4 relative">
              <div className="w-32 h-32 rounded-full border-8 border-surface-container-high flex flex-col items-center justify-center relative">
                <div 
                  className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin" 
                  style={{ animationDuration: '10s' }}
                />
                <span className="text-3xl font-extrabold text-on-surface leading-none">92%</span>
                <span className="text-[11px] font-semibold text-outline mt-1 uppercase tracking-wider">Score</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-surface-container-high text-xs">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-medium">Last Routine Checkup</span>
              <span className="font-bold text-on-surface">Apr 12, 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-medium">Next Recommended</span>
              <span className="font-bold text-primary">Oct 24, 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="font-headline font-bold text-base text-on-surface">Quick Actions</h3>
          <span className="text-xs text-outline">Frequently used patient tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Book Appointment */}
          <div
            onClick={() => navigate('/dashboard/appointments')}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high hover:border-primary/40 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">add_alarm</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface mb-1 group-hover:text-primary transition-colors">
                Book Appointment
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Schedule your next cleaning or orthodontic checkup with ease.
              </p>
            </div>
          </div>

          {/* Action 2: View X-Rays */}
          <div
            onClick={() => navigate('/dashboard/records')}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high hover:border-secondary/40 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">radiology</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface mb-1 group-hover:text-secondary transition-colors">
                View 3D X-Rays
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Access high-resolution panoramic radiographs and odontogram.
              </p>
            </div>
          </div>

          {/* Action 3: Pay Bill */}
          <div
            onClick={() => setPayModalOpen(true)}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-emerald-700 transition-colors">
                  Pay Balance
                </h4>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  $45.50 Due
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Review your insurance settlement and pay outstanding copay.
              </p>
            </div>
          </div>

          {/* Action 4: Oral Care Tips */}
          <div
            onClick={() => setTipsModalOpen(true)}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high hover:border-purple-500/40 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">clinical_notes</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface mb-1 group-hover:text-purple-700 transition-colors">
                Dental Care Tips
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Clinician recommendations on brushing, flossing, and enamel care.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Split Section: Active Treatments (4 cols) & Recent Visit History (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Treatments */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container-high flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-headline font-bold text-base text-on-surface">Active Treatments</h3>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                2 Active
              </span>
            </div>

            <div className="space-y-5">
              {/* Treatment 1 */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-on-surface">Laser Teeth Whitening</span>
                  <span className="font-bold text-primary">100%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-full"></div>
                </div>
                <span className="text-[11px] text-on-surface-variant mt-1 block">Completed • Maintenance phase</span>
              </div>

              {/* Treatment 2 */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-on-surface">Invisalign Clear Aligners</span>
                  <span className="font-bold text-secondary">30%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full w-[30%]"></div>
                </div>
                <span className="text-[11px] text-on-surface-variant mt-1 block">Aligner 6 of 20 • Next tray swap in 4 days</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-container-high">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
              <span>Wear aligners 22 hours daily for optimal tracking and treatment duration.</span>
            </div>
          </div>
        </div>

        {/* Recent Visit History Table */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container-high">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-base text-on-surface">Recent Visit History</h3>
            <button
              onClick={() => navigate('/dashboard/appointments')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              View Full History →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-container-high text-outline text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Service / Treatment</th>
                  <th className="py-2.5 px-3">Attending Dentist</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {pastVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-on-surface whitespace-nowrap">{visit.date}</td>
                    <td className="py-3 px-3 font-medium text-on-surface">{visit.procedure}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{visit.dentist}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed">
                        {visit.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedVisit(visit)}
                        className="text-primary hover:underline font-bold cursor-pointer"
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

      {/* Visit Details Modal */}
      <AnimatePresence>
        {selectedVisit && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high max-w-md w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">calendar_today</span>
                  <h3 className="font-headline font-bold text-base text-on-surface">Visit Summary</h3>
                </div>
                <button
                  onClick={() => setSelectedVisit(null)}
                  className="p-1 text-outline hover:text-on-surface rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-outline block uppercase tracking-wider text-[10px] font-bold">Procedure</span>
                  <span className="font-bold text-on-surface text-sm block">{selectedVisit.procedure}</span>
                </div>
                <div>
                  <span className="text-outline block uppercase tracking-wider text-[10px] font-bold">Clinician</span>
                  <span className="text-on-surface font-medium">{selectedVisit.dentist} ({selectedVisit.dentistTitle})</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-outline block uppercase tracking-wider text-[10px] font-bold">Date & Time</span>
                    <span className="text-on-surface font-medium">{selectedVisit.date}</span>
                    <span className="text-outline block">{selectedVisit.time}</span>
                  </div>
                  <div>
                    <span className="text-outline block uppercase tracking-wider text-[10px] font-bold">Status</span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      {selectedVisit.status}
                    </span>
                  </div>
                </div>
                {selectedVisit.notes && (
                  <div className="p-3 bg-surface-container-low rounded-xl text-on-surface-variant">
                    <strong className="block text-on-surface text-[11px] mb-0.5">Clinical Instructions:</strong>
                    {selectedVisit.notes}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-surface-container-high flex justify-end gap-2">
                <button
                  onClick={() => setSelectedVisit(null)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface text-xs font-bold rounded-xl hover:bg-surface-container-highest cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedVisit(null);
                    showToast("Calendar invite synced to your device!");
                  }}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container cursor-pointer"
                >
                  Sync to Calendar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pay Bill Quick Modal */}
      <AnimatePresence>
        {payModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high max-w-sm w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[22px]">credit_card</span>
                  <h3 className="font-headline font-bold text-base text-on-surface">Pay Patient Copay</h3>
                </div>
                <button
                  onClick={() => setPayModalOpen(false)}
                  className="p-1 text-outline hover:text-on-surface rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
                <span className="text-xs text-emerald-800 font-medium">Outstanding Statement Balance</span>
                <div className="text-3xl font-extrabold text-emerald-950">$45.50</div>
                <span className="text-[11px] text-emerald-700 block">Delta Dental Paid: $120.00</span>
              </div>

              <div className="space-y-2 text-xs">
                <label className="block font-bold text-on-surface">Saved Payment Method</label>
                <div className="p-3 rounded-xl border border-primary/40 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
                    <span className="font-bold text-on-surface">Visa ending in 4092</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Primary</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setPayModalOpen(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setPayModalOpen(false);
                    showToast("Payment of $45.50 settled successfully! Receipt sent to email.");
                  }}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Authorize $45.50
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dental Care Tips Modal */}
      <AnimatePresence>
        {tipsModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high max-w-lg w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                <div className="flex items-center gap-2 text-purple-700">
                  <span className="material-symbols-outlined text-[24px]">dentistry</span>
                  <h3 className="font-headline font-bold text-base text-on-surface">Personalized Oral Care Guide</h3>
                </div>
                <button
                  onClick={() => setTipsModalOpen(false)}
                  className="p-1 text-outline hover:text-on-surface rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="space-y-3 text-xs text-on-surface-variant max-h-80 overflow-y-auto pr-1">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <strong className="text-on-surface block mb-1">1. Aligner Care & Hygiene:</strong>
                  Clean aligner trays with lukewarm water and antibacterial crystal soak. Never use hot water to prevent plastic distortion.
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <strong className="text-on-surface block mb-1">2. Interdental Cleaning:</strong>
                  Floss once daily prior to bedtime. Focus on mandibular anterior lingual margins where calculus naturally accumulates.
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <strong className="text-on-surface block mb-1">3. Enamel Protection:</strong>
                  Wait 30 minutes after consuming acidic beverages (citrus, coffee) before brushing to avoid enamel micro-abrasion.
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setTipsModalOpen(false)}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Got it, thank you
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
