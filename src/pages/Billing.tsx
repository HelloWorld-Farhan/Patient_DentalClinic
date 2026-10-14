import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { usePatientDB, type InvoiceItem } from '../lib/patientDb';
import ToastNotification from '../components/ToastNotification';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export default function Billing() {
  const {
    invoices,
    outstandingBalance,
    profile,
    payInvoice,
    payAllPendingInvoices,
    downloadInvoiceHtml,
  } = usePatientDB();

  const [searchTerm, setSearchTerm] = useState('');
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Paid'>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [copayFilter, setCopayFilter] = useState<'All' | 'CopayDue' | 'ZeroCopay'>('All');

  // PDF Modal State
  const [selectedInvoiceForPdf, setSelectedInvoiceForPdf] = useState<InvoiceItem | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloadProgress, setPdfDownloadProgress] = useState(0);

  // Form states for checkout modal
  const [cardName, setCardName] = useState('Ananya Verma');
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [cardExpiry, setCardExpiry] = useState('09 / 28');
  const [cardCvv, setCardCvv] = useState('123');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Lock background scroll when checkout or PDF preview modal is active
  useBodyScrollLock(Boolean(payModalOpen || selectedInvoiceForPdf));

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCard = cardNumber.replace(/\s+/g, '');
    const last4 = cleanCard.length >= 4 ? cleanCard.slice(-4) : '4092';
    const settledAmount = payAllPendingInvoices(`Visa •••• ${last4}`);
    setPayModalOpen(false);
    showToast(`Payment of $${settledAmount.toFixed(2)} processed successfully! Statement reconciled.`);
  };

  const handlePaySingle = (inv: InvoiceItem) => {
    const paid = payInvoice(inv.id, 'Visa •••• 4092');
    if (paid) {
      showToast(`Copay for ${inv.id} ($${paid.patientAmount.toFixed(2)}) settled successfully!`);
    }
  };

  // Filter Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch =
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.dentist.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      const matchesYear = yearFilter === 'All' || inv.date.includes(yearFilter);
      const matchesCopay =
        copayFilter === 'All'
          ? true
          : copayFilter === 'CopayDue'
          ? inv.patientAmount > 0
          : inv.patientAmount === 0;

      return matchesSearch && matchesStatus && matchesYear && matchesCopay;
    });
  }, [invoices, searchTerm, statusFilter, yearFilter, copayFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));

  // Paginated Invoices
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage, itemsPerPage]);

  const activeFiltersCount =
    (statusFilter !== 'All' ? 1 : 0) +
    (yearFilter !== 'All' ? 1 : 0) +
    (copayFilter !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setStatusFilter('All');
    setYearFilter('All');
    setCopayFilter('All');
    setCurrentPage(1);
    setIsFilterOpen(false);
    showToast('Billing filters reset.');
  };

  // Trigger PDF download with animation
  const handleDownloadPdfReceipt = (inv: InvoiceItem) => {
    setIsGeneratingPdf(true);
    setPdfDownloadProgress(20);

    const step1 = setTimeout(() => setPdfDownloadProgress(60), 300);
    const step2 = setTimeout(() => setPdfDownloadProgress(90), 600);
    const step3 = setTimeout(() => {
      setPdfDownloadProgress(100);
      setIsGeneratingPdf(false);

      // Trigger high-definition HTML statement receipt download
      downloadInvoiceHtml(inv);

      showToast(`Itemized statement for ${inv.id} downloaded successfully!`);
      setSelectedInvoiceForPdf(null);
      setPdfDownloadProgress(0);
    }, 850);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* PDF / Alert Toast */}
      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />

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
              <h2 className="text-3xl sm:text-4xl font-bold text-on-primary-container font-mono">
                ${outstandingBalance > 0 ? outstandingBalance.toFixed(2) : '0.00'}
              </h2>
            </div>
            <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-md text-white">
              <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            </div>
          </div>

          <div className="relative z-10 space-y-2 mb-6">
            <div className="flex justify-between text-xs sm:text-sm text-on-primary-container/90">
              <span>Due Date</span>
              <span className="font-semibold">{outstandingBalance > 0 ? 'Nov 28, 2026' : 'No Payment Due'}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-on-primary-container/90">
              <span>Account Status</span>
              <span className="font-semibold">{outstandingBalance > 0 ? 'Pending Copay Settlement' : 'Account Settled & Current'}</span>
            </div>
          </div>

          <div className="relative z-10 flex gap-3">
            <button
              disabled={outstandingBalance <= 0}
              onClick={() => setPayModalOpen(true)}
              className={`flex-1 font-bold py-3 px-6 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer ${
                outstandingBalance > 0
                  ? 'bg-surface-container-lowest text-primary hover:bg-surface-bright'
                  : 'bg-white/20 text-white/70 cursor-not-allowed opacity-80'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>{outstandingBalance > 0 ? `Pay $${outstandingBalance.toFixed(2)} Securely` : 'All Settled ($0.00)'}</span>
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
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Active Insurance Policy</span>
                  <h3 className="text-lg sm:text-xl font-bold text-on-surface">{profile.insurance.provider}</h3>
                </div>
              </div>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-bold text-xs px-3 py-1 rounded-full">
                Verified Active
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-5">
              <div className="bg-surface-container-low p-3.5 rounded-lg border border-surface-container-high/60">
                <span className="text-xs text-on-surface-variant block mb-1">Policy Number</span>
                <span className="text-sm font-bold text-on-surface font-mono">{profile.insurance.policyNumber}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-lg border border-surface-container-high/60">
                <span className="text-xs text-on-surface-variant block mb-1">Coverage Level</span>
                <span className="text-sm font-bold text-primary">{profile.insurance.coverageLevel}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-lg border border-surface-container-high/60 col-span-2 md:col-span-1">
                <span className="text-xs text-on-surface-variant block mb-1">Group ID</span>
                <span className="text-sm font-bold text-on-surface font-mono">{profile.insurance.groupId}</span>
              </div>
            </div>
          </div>

          {/* Deductible Progress */}
          <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-lg border border-surface-container-high/60">
            <div className="flex justify-between text-xs sm:text-sm mb-1.5">
              <span className="text-on-surface-variant font-medium">Annual Deductible Met</span>
              <span className="text-on-surface font-bold font-mono">
                ${profile.insurance.deductibleMet.toFixed(2)} / ${profile.insurance.deductibleTotal.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (profile.insurance.deductibleMet / profile.insurance.deductibleTotal) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-on-surface-variant mt-1.5 block text-right">
              ${Math.max(0, profile.insurance.deductibleTotal - profile.insurance.deductibleMet).toFixed(2)} remaining until 100% copay threshold
            </span>
          </div>
        </div>
      </div>

      {/* Invoice & Payment History Table Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-headline font-bold text-xl text-on-surface">Invoice & Payment History</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">View past statements, download PDF receipts, and track claim settlements.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search invoices..."
                className="bg-surface-container-low text-on-surface text-xs sm:text-sm px-4 py-2.5 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-primary w-52 sm:w-64 border border-surface-container-high"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-on-surface-variant text-[18px]">search</span>
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                  activeFiltersCount > 0
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-surface-container-high'
                }`}
                title="Filter Invoices"
              >
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Filter Dropdown Popover */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high p-4 z-30 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
                    <span className="font-bold text-on-surface text-sm">Filter Invoices</span>
                    <button
                      onClick={resetFilters}
                      className="text-primary hover:underline text-[11px] font-semibold cursor-pointer"
                    >
                      Reset All
                    </button>
                  </div>

                  <div>
                    <label className="block text-on-surface-variant font-bold mb-1">Payment Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value as any);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-2.5 py-1.5 text-on-surface font-medium"
                    >
                      <option value="All">All Invoices</option>
                      <option value="Pending">Pending Balance</option>
                      <option value="Paid">Fully Paid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-on-surface-variant font-bold mb-1">Fiscal Year</label>
                    <select
                      value={yearFilter}
                      onChange={(e) => {
                        setYearFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-2.5 py-1.5 text-on-surface font-medium"
                    >
                      <option value="All">All Years</option>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-on-surface-variant font-bold mb-1">Patient Copay</label>
                    <select
                      value={copayFilter}
                      onChange={(e) => {
                        setCopayFilter(e.target.value as any);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-2.5 py-1.5 text-on-surface font-medium"
                    >
                      <option value="All">All Amounts</option>
                      <option value="CopayDue">Copay &gt; $0.00</option>
                      <option value="ZeroCopay">100% Insurance ($0.00 Copay)</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-4 py-1.5 bg-primary text-white font-bold rounded-lg cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant uppercase text-xs tracking-wider border-b border-surface-container-high font-semibold">
                <th className="p-3.5">Invoice ID</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Insurance Covered</th>
                <th className="p-3.5">Patient Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[36px] text-outline block mb-1">receipt_long</span>
                    No invoices match your selected filters.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-primary">{inv.id}</td>
                    <td className="p-3.5 text-on-surface-variant whitespace-nowrap">{inv.date}</td>
                    <td className="p-3.5">
                      <strong className="text-on-surface block">{inv.description}</strong>
                      <span className="text-[11px] text-on-surface-variant">{inv.dentist} • {inv.procedureCode}</span>
                    </td>
                    <td className="p-3.5 font-mono text-on-surface-variant">${inv.insuranceCovered.toFixed(2)}</td>
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
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {inv.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => handlePaySingle(inv)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold cursor-pointer shadow-xs"
                            title="Pay this copay"
                          >
                            <span className="material-symbols-outlined text-[15px]">credit_card</span>
                            <span>Pay ${inv.patientAmount.toFixed(2)}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceForPdf(inv)}
                          className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                          title="View & Download Statement"
                        >
                          <span className="material-symbols-outlined text-[16px]">download</span>
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-surface-container-high gap-3 text-xs text-on-surface-variant">
          <span>
            Showing {filteredInvoices.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} total invoices
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 bg-surface-container-low text-on-surface rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer font-medium"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center cursor-pointer transition-all ${
                  currentPage === page
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 bg-surface-container-low text-on-surface rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PDF DOWNLOAD & STATEMENT RECEIPT MODAL                                 */}
      {/* ========================================================================= */}
      {selectedInvoiceForPdf && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => !isGeneratingPdf && setSelectedInvoiceForPdf(null)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-teal-400 text-[24px]">receipt_long</span>
                  <span className="font-bold text-lg tracking-tight">OFFICIAL DENTAL STATEMENT</span>
                </div>
                <p className="text-xs text-slate-400">Smile Clinic Healthcare Networks • Statement #{selectedInvoiceForPdf.id}</p>
                <p className="text-[10px] text-teal-300 font-mono mt-0.5">ISSUED: {selectedInvoiceForPdf.date}</p>
              </div>
              {!isGeneratingPdf && (
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPdf(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
              {/* Patient & Billing Info */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Billed Patient</span>
                  <strong className="text-slate-900 text-sm block">{profile.name}</strong>
                  <span className="text-slate-600 block">ID: #{profile.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Status</span>
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedInvoiceForPdf.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedInvoiceForPdf.status === 'Paid' ? 'Paid in Full' : 'Payment Outstanding'}
                  </span>
                </div>
              </div>

              {/* Service Itemization */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div>
                    <strong className="text-slate-900 text-sm block">{selectedInvoiceForPdf.description}</strong>
                    <span className="text-xs text-slate-500 font-mono">{selectedInvoiceForPdf.procedureCode}</span>
                    <span className="text-xs text-slate-600 block mt-0.5">Attending: {selectedInvoiceForPdf.dentist}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Gross Treatment Fee:</span>
                    <span className="font-mono">${(selectedInvoiceForPdf.insuranceCovered + selectedInvoiceForPdf.patientAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Insurance Paid (Delta Dental):</span>
                    <span className="font-mono">-${selectedInvoiceForPdf.insuranceCovered.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                    <span>Patient Copay Amount:</span>
                    <span className="font-mono">${selectedInvoiceForPdf.patientAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-700 text-[18px]">credit_card</span>
                  <span className="font-medium text-slate-700">Method: {selectedInvoiceForPdf.paymentMethod || 'Visa •••• 4092'}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  REF: {selectedInvoiceForPdf.transactionRef || 'DIRECT-CLAIM-892'}
                </span>
              </div>

              {/* Animated Progress Bar when downloading */}
              {isGeneratingPdf && (
                <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-teal-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                      <span>Generating High-Definition PDF Receipt...</span>
                    </span>
                    <span className="font-mono font-bold text-teal-900">{pdfDownloadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-teal-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 transition-all duration-300 rounded-full"
                      style={{ width: `${pdfDownloadProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-teal-700 block">
                    Attaching digital security certificate and clinician signature stamp.
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">Official encrypted statement</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isGeneratingPdf}
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  disabled={isGeneratingPdf}
                  onClick={() => handleDownloadPdfReceipt(selectedInvoiceForPdf)}
                  className="px-4 py-2 bg-primary hover:bg-primary-container text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>{isGeneratingPdf ? 'Downloading...' : 'Download PDF Receipt'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 2. SECURE CHECKOUT MODAL                                                  */}
      {/* ========================================================================= */}
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
                  ${outstandingBalance.toFixed(2)}
                </span>
              </div>
              <span className="text-xs font-bold bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full">
                {outstandingBalance > 0 ? 'Copay Settlement' : 'No Balance Due'}
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
                  disabled={outstandingBalance <= 0}
                  className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm ${
                    outstandingBalance > 0
                      ? 'bg-primary hover:bg-primary-container text-white'
                      : 'bg-surface-container-highest text-outline cursor-not-allowed opacity-60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>
                    {outstandingBalance > 0
                      ? `Authorize Payment ($${outstandingBalance.toFixed(2)})`
                      : 'All Balance Settled ($0.00)'}
                  </span>
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
