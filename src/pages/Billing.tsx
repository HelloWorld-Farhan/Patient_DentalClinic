import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { initialPatientProfile, initialInvoices } from '../data/mockData';
import { Invoice } from '../types';

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePayBalance = () => {
    setInvoices(invoices.map(inv => inv.status === 'Pending' ? { ...inv, status: 'Paid' } : inv));
    setPayModalOpen(false);
    showToast("Statement balance settled in full ($45.50)! Receipt sent to email.");
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingAmount = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.patientAmount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && typeof document !== 'undefined' && createPortal(
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[10000] bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-teal-400">check_circle</span>
            <span>{toastMessage}</span>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Billing, Claims & Insurance</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Monitor real-time dental insurance coverage, review itemized statements, and settle copays.
          </p>
        </div>

        {pendingAmount > 0 && (
          <button
            onClick={() => setPayModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">credit_card</span>
            <span>Pay Statement (${pendingAmount.toFixed(2)})</span>
          </button>
        )}
      </div>

      {/* Active Insurance Policy & Deductible Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-xs border border-surface-container-high space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">health_and_safety</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Active Dental Policy</span>
              <h2 className="font-headline font-bold text-lg text-on-surface">{initialPatientProfile.insurance.provider}</h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-fixed text-on-secondary-fixed self-start sm:self-auto">
            Policy Status: Active
          </span>
        </div>

        {/* Policy Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
            <span className="text-[11px] text-on-surface-variant font-medium block mb-1">Policy / Member ID</span>
            <span className="text-sm font-bold text-on-surface font-mono">{initialPatientProfile.insurance.policyNumber}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
            <span className="text-[11px] text-on-surface-variant font-medium block mb-1">Preventive Coverage</span>
            <span className="text-sm font-bold text-primary">{initialPatientProfile.insurance.coverageLevel}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high col-span-2 md:col-span-1">
            <span className="text-[11px] text-on-surface-variant font-medium block mb-1">Employer / Group ID</span>
            <span className="text-sm font-bold text-on-surface font-mono">{initialPatientProfile.insurance.groupId}</span>
          </div>
        </div>

        {/* Annual Deductible Progress Bar */}
        <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low border border-surface-container-high space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-on-surface">Annual Calendar Deductible Met</span>
            <span className="font-extrabold text-primary font-mono">
              ${initialPatientProfile.insurance.deductibleMet} / ${initialPatientProfile.insurance.deductibleTotal}
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500" 
              style={{ width: `${(initialPatientProfile.insurance.deductibleMet / initialPatientProfile.insurance.deductibleTotal) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-on-surface-variant">
            <span>70% fulfilled</span>
            <span>${initialPatientProfile.insurance.deductibleTotal - initialPatientProfile.insurance.deductibleMet} remaining until 100% copay threshold</span>
          </div>
        </div>
      </div>

      {/* Invoice & Payment History */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container-high space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-headline font-bold text-base text-on-surface">Invoice & Statement History</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Review itemized statements, download clinical receipts, and track claim settlements.
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by invoice ID or service..."
              className="w-full sm:w-64 pl-9 pr-3 py-2 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
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
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Clinical Service</th>
                <th className="py-3 px-4">Insurance Covered</th>
                <th className="py-3 px-4">Patient Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{inv.id}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant whitespace-nowrap">{inv.date}</td>
                  <td className="py-3.5 px-4 font-semibold text-on-surface">{inv.description}</td>
                  <td className="py-3.5 px-4 font-mono text-on-surface-variant">${inv.insuranceCovered.toFixed(2)}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-on-surface">${inv.patientAmount.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'Paid'
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-error-container text-on-error-container'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => showToast(`Generated and downloaded PDF receipt for ${inv.id}!`)}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-bold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">download</span>
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Statement Modal */}
      <AnimatePresence>
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
              className="relative bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high max-w-md w-full overflow-hidden flex flex-col z-10 my-auto text-xs"
            >
              <div className="p-4 sm:p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[24px]">payments</span>
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-on-surface">Authorize Payment</h2>
                    <p className="text-xs text-outline">Encrypted 256-bit checkout gateway</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer shrink-0"
                  aria-label="Close dialog"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="p-4 bg-surface-container-low rounded-xl space-y-1.5 text-center border border-surface-container-high">
                  <span className="text-on-surface-variant">Outstanding Statement Total</span>
                  <div className="text-3xl font-extrabold text-on-surface font-mono">${pendingAmount.toFixed(2)}</div>
                  <span className="text-[11px] text-primary block font-medium">✓ Fully eligible for HSA / FSA reimbursement</span>
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">Select Payment Card</label>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
                      <span className="font-bold text-on-surface">Visa ending in •••• 4092</span>
                    </div>
                    <span className="text-[10px] text-outline font-medium">Expires 09/28</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-surface-container-low/50 border-t border-surface-container-low flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-container text-on-surface font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePayBalance}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Confirm & Pay ${pendingAmount.toFixed(2)}
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}
