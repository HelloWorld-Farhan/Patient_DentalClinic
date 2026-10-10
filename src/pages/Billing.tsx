import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { initialPatientProfile } from '../data/mockData';

interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  insuranceCovered: number;
  patientAmount: number;
  status: 'Pending' | 'Paid';
}

const defaultInvoices: InvoiceItem[] = [
  {
    id: '#INV-2023-892',
    date: 'Nov 14, 2023',
    description: 'Comprehensive Periodic Exam & Cleaning',
    insuranceCovered: 120.00,
    patientAmount: 45.50,
    status: 'Pending'
  },
  {
    id: '#INV-2023-741',
    date: 'Oct 02, 2023',
    description: 'Posterior Composite Restoration (Fillings)',
    insuranceCovered: 280.00,
    patientAmount: 100.00,
    status: 'Paid'
  },
  {
    id: '#INV-2023-512',
    date: 'May 20, 2023',
    description: 'Routine Dental Cleaning & Fluoride Treatment',
    insuranceCovered: 150.00,
    patientAmount: 0.00,
    status: 'Paid'
  },
  {
    id: '#INV-2023-304',
    date: 'Jan 11, 2023',
    description: 'Initial Consult & Full Mouth X-Rays',
    insuranceCovered: 200.00,
    patientAmount: 0.00,
    status: 'Paid'
  }
];

export default function Billing() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(defaultInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Form states for checkout modal
  const [cardName, setCardName] = useState('Ananya Verma');
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [cardExpiry, setCardExpiry] = useState('09 / 28');
  const [cardCvv, setCardCvv] = useState('123');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInvoices(invoices.map(inv => ({ ...inv, status: 'Paid' })));
    setPayModalOpen(false);
    showToast('Payment processed successfully! Receipt sent to your email.');
  };

  const downloadPDF = (id: string) => {
    showToast(`Downloading itemized PDF receipt for ${id}...`);
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTotal = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((acc, curr) => acc + curr.patientAmount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* PDF / Alert Toast */}
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

      {/* Top Financial Overview Hero / Bento Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Outstanding Balance Summary Card (Primary Focus) */}
        <div className="lg:col-span-5 bg-primary-container text-on-primary-container rounded-xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_20px_rgba(0,119,130,0.1)]">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-sm" />
          
          <div className="flex items-start justify-between relative z-10 mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-on-primary-container/80 mb-1 block font-semibold">
                Current Balance
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-on-primary-container">
                ${pendingTotal > 0 ? pendingTotal.toFixed(2) : '0.00'}
              </h2>
            </div>
            <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-md text-white">
              <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            </div>
          </div>

          <div className="relative z-10 space-y-2 mb-6">
            <div className="flex justify-between text-xs sm:text-sm text-on-primary-container/90">
              <span>Due Date</span>
              <span className="font-semibold">Nov 28, 2023</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-on-primary-container/90">
              <span>Last Statement</span>
              <span className="font-semibold">Nov 01, 2023</span>
            </div>
          </div>

          <div className="relative z-10 flex gap-3">
            <button
              onClick={() => setPayModalOpen(true)}
              className="flex-1 bg-surface-container-lowest text-primary font-bold py-3 px-6 rounded-lg hover:bg-surface-bright transition-all shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Pay Now Securely</span>
            </button>
          </div>
        </div>

        {/* Insurance Provider Details Card */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,119,130,0.06)] flex flex-col justify-between border border-surface-container-high/60">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[26px]">verified</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Active Policy</span>
                  <h3 className="text-lg sm:text-xl font-bold text-on-surface">{initialPatientProfile.insurance.provider}</h3>
                </div>
              </div>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-bold text-xs px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-5">
              <div className="bg-surface-container-low p-3.5 rounded-lg border border-surface-container-high/60">
                <span className="text-xs text-on-surface-variant block mb-1">Policy Number</span>
                <span className="text-sm font-bold text-on-surface font-mono">{initialPatientProfile.insurance.policyNumber}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-lg border border-surface-container-high/60">
                <span className="text-xs text-on-surface-variant block mb-1">Coverage Level</span>
                <span className="text-sm font-bold text-primary">{initialPatientProfile.insurance.coverageLevel}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-lg border border-surface-container-high/60 col-span-2 md:col-span-1">
                <span className="text-xs text-on-surface-variant block mb-1">Group ID</span>
                <span className="text-sm font-bold text-on-surface font-mono">{initialPatientProfile.insurance.groupId}</span>
              </div>
            </div>
          </div>

          {/* Deductible Progress */}
          <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-lg border border-surface-container-high/60">
            <div className="flex justify-between text-xs sm:text-sm mb-1.5">
              <span className="text-on-surface-variant font-medium">Annual Deductible Met</span>
              <span className="text-on-surface font-bold font-mono">
                ${initialPatientProfile.insurance.deductibleMet} / ${initialPatientProfile.insurance.deductibleTotal}
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${(initialPatientProfile.insurance.deductibleMet / initialPatientProfile.insurance.deductibleTotal) * 100}%` }}
              />
            </div>
            <span className="text-xs text-on-surface-variant mt-1.5 block text-right">
              ${initialPatientProfile.insurance.deductibleTotal - initialPatientProfile.insurance.deductibleMet} remaining until deductible is met
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Payment and Invoice History Section */}
      <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="font-headline font-bold text-xl text-on-surface">Invoice & Payment History</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">View past statements, download PDF receipts, and track claim settlements.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoices..."
                className="bg-surface-container-low text-on-surface text-xs sm:text-sm px-4 py-2.5 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-primary w-56 sm:w-64 border border-surface-container-high"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-on-surface-variant text-[18px]">search</span>
            </div>
            <button
              onClick={() => showToast("Filters applied: Showing all active billing items.")}
              className="bg-surface-container-low hover:bg-surface-container text-on-surface p-2.5 rounded-lg transition-colors flex items-center justify-center border border-surface-container-high cursor-pointer"
              title="Filter"
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="text-on-surface-variant bg-surface-container-low text-xs font-semibold">
                <th className="p-3.5 rounded-l-lg">Invoice ID</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Insurance Covered</th>
                <th className="p-3.5">Patient Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-primary">{inv.id}</td>
                  <td className="p-3.5 text-on-surface-variant whitespace-nowrap">{inv.date}</td>
                  <td className="p-3.5 text-on-surface font-medium">{inv.description}</td>
                  <td className="p-3.5 text-on-surface-variant font-mono">${inv.insuranceCovered.toFixed(2)}</td>
                  <td className="p-3.5 font-bold font-mono text-on-surface">${inv.patientAmount.toFixed(2)}</td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block ${
                      inv.status === 'Paid'
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-error-container text-on-error-container'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => downloadPDF(inv.id)}
                      className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1 text-xs font-bold cursor-pointer"
                      title="Download PDF"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-surface-container-high gap-3 text-xs text-on-surface-variant">
          <span>Showing {filteredInvoices.length} of {invoices.length} total invoices</span>
          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                currentPage === 1 ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                currentPage === 2 ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                currentPage === 3 ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              3
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, 3))}
              className="px-3 py-1.5 bg-surface-container-low text-on-surface rounded-lg hover:bg-surface-container transition-colors cursor-pointer font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Secure Checkout Modal (Portal with z-[9999]) */}
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
              className="relative bg-surface-container-lowest rounded-2xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-surface-container-high z-10 my-auto text-xs sm:text-sm max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setPayModalOpen(false)}
                className="absolute right-4 top-4 p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-low cursor-pointer transition-colors"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg sm:text-xl text-on-surface">Secure Patient Checkout</h3>
                  <p className="text-xs text-on-surface-variant">Smile Clinic Encrypted Patient Portal</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-xl mb-6 flex justify-between items-center border border-surface-container-high">
                <div>
                  <span className="text-xs text-on-surface-variant block">Total Due</span>
                  <span className="text-2xl font-extrabold text-primary font-mono">
                    ${pendingTotal > 0 ? pendingTotal.toFixed(2) : '145.50'}
                  </span>
                </div>
                <span className="text-xs font-bold bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full">
                  Invoice #INV-2023-892
                </span>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-on-surface mb-1 text-xs">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Ananya Verma"
                    className="w-full bg-surface text-on-surface border border-outline-variant px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1 text-xs">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-surface text-on-surface border border-outline-variant px-3.5 py-2.5 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-primary font-mono font-medium"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">credit_card</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-on-surface mb-1 text-xs">Expiration Date</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="w-full bg-surface text-on-surface border border-outline-variant px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-on-surface mb-1 text-xs">CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-surface text-on-surface border border-outline-variant px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono font-medium"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-container text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>Authorize Payment (${pendingTotal > 0 ? pendingTotal.toFixed(2) : '145.50'})</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
}
