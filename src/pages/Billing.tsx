import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { initialPatientProfile } from '../data/mockData';

interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  insuranceCovered: number;
  patientAmount: number;
  status: 'Pending' | 'Paid';
  procedureCode: string;
  dentist: string;
  paymentMethod?: string;
  transactionRef?: string;
}

const defaultInvoices: InvoiceItem[] = [
  {
    id: '#INV-2026-892',
    date: 'Nov 14, 2026',
    description: 'Comprehensive Periodic Exam & Ultrasonic Cleaning',
    procedureCode: 'CDT D0120 / D1110',
    dentist: 'Dr. Priya Patel, DDS',
    insuranceCovered: 120.00,
    patientAmount: 45.50,
    status: 'Pending',
    paymentMethod: 'Delta Dental Direct Claim'
  },
  {
    id: '#INV-2026-741',
    date: 'Oct 02, 2026',
    description: 'Posterior Nanohybrid Composite Restoration (MOD)',
    procedureCode: 'CDT D2391',
    dentist: 'Dr. Rohan Chauhan, DMD',
    insuranceCovered: 280.00,
    patientAmount: 100.00,
    status: 'Paid',
    paymentMethod: 'Visa •••• 4092',
    transactionRef: 'TXN-8492019'
  },
  {
    id: '#INV-2026-512',
    date: 'May 20, 2026',
    description: 'Invisalign Treatment Phase II & 3D Intraoral Scan',
    procedureCode: 'CDT D8080',
    dentist: 'Dr. Vikram Chawla, DMD',
    insuranceCovered: 600.00,
    patientAmount: 350.00,
    status: 'Paid',
    paymentMethod: 'Visa •••• 4092',
    transactionRef: 'TXN-8491823'
  },
  {
    id: '#INV-2026-304',
    date: 'Jan 11, 2026',
    description: 'Diagnostic Bitewing Radiographs & Fluoride Prophylaxis',
    procedureCode: 'CDT D0274 / D1206',
    dentist: 'Dr. Priya Patel, DDS',
    insuranceCovered: 200.00,
    patientAmount: 0.00,
    status: 'Paid',
    paymentMethod: 'Delta Dental 100% Preventive',
    transactionRef: 'TXN-8490011'
  },
  {
    id: '#INV-2025-912',
    date: 'Nov 05, 2025',
    description: 'Periodontal Quadrant Debridement & Therapy',
    procedureCode: 'CDT D4341',
    dentist: 'Dr. Sarah Sharma, DDS',
    insuranceCovered: 330.00,
    patientAmount: 90.00,
    status: 'Paid',
    paymentMethod: 'Visa •••• 4092',
    transactionRef: 'TXN-7940212'
  },
  {
    id: '#INV-2025-680',
    date: 'Jul 18, 2025',
    description: 'Precision CAD/CAM Ceramic Inlay Restoration',
    procedureCode: 'CDT D2610',
    dentist: 'Dr. Rohan Chauhan, DMD',
    insuranceCovered: 450.00,
    patientAmount: 170.00,
    status: 'Paid',
    paymentMethod: 'Visa •••• 4092',
    transactionRef: 'TXN-7829104'
  },
  {
    id: '#INV-2025-410',
    date: 'Mar 02, 2025',
    description: 'Custom Dual-Laminate Bruxism Occlusal Guard',
    procedureCode: 'CDT D9944',
    dentist: 'Dr. Vikram Chawla, DMD',
    insuranceCovered: 320.00,
    patientAmount: 160.00,
    status: 'Paid',
    paymentMethod: 'Visa •••• 4092',
    transactionRef: 'TXN-7612984'
  },
  {
    id: '#INV-2024-820',
    date: 'Dec 12, 2024',
    description: 'Biannual Adult Dental Prophylaxis & Polish',
    procedureCode: 'CDT D1110',
    dentist: 'Dr. Priya Patel, DDS',
    insuranceCovered: 150.00,
    patientAmount: 0.00,
    status: 'Paid',
    paymentMethod: 'Delta Dental 100% Preventive',
    transactionRef: 'TXN-6920194'
  },
  {
    id: '#INV-2024-550',
    date: 'Aug 24, 2024',
    description: 'In-Office Zoom Laser Teeth Whitening Treatment',
    procedureCode: 'CDT D9972',
    dentist: 'Dr. Priya Patel, DDS',
    insuranceCovered: 0.00,
    patientAmount: 390.00,
    status: 'Paid',
    paymentMethod: 'Visa •••• 4092',
    transactionRef: 'TXN-6582910'
  },
  {
    id: '#INV-2024-210',
    date: 'Feb 19, 2024',
    description: 'Preventative Pit & Fissure Sealant Application',
    procedureCode: 'CDT D1351',
    dentist: 'Dr. Rohan Chauhan, DMD',
    insuranceCovered: 180.00,
    patientAmount: 0.00,
    status: 'Paid',
    paymentMethod: 'Delta Dental 100% Preventive',
    transactionRef: 'TXN-6204918'
  },
  {
    id: '#INV-2023-770',
    date: 'Oct 15, 2023',
    description: 'Periodontal Charting & Maintenance Cleaning',
    procedureCode: 'CDT D4910',
    dentist: 'Dr. Sarah Sharma, DDS',
    insuranceCovered: 190.00,
    patientAmount: 40.00,
    status: 'Paid',
    paymentMethod: 'Visa •••• 4092',
    transactionRef: 'TXN-5910283'
  },
  {
    id: '#INV-2023-140',
    date: 'Apr 04, 2023',
    description: 'Emergency Cold Sensitivity Evaluation & Desensitizer',
    procedureCode: 'CDT D0140',
    dentist: 'Dr. Priya Patel, DDS',
    insuranceCovered: 145.00,
    patientAmount: 0.00,
    status: 'Paid',
    paymentMethod: 'Delta Dental 100% Preventive',
    transactionRef: 'TXN-5309182'
  }
];

export default function Billing() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(defaultInvoices);
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

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInvoices(invoices.map(inv => ({ ...inv, status: 'Paid' })));
    setPayModalOpen(false);
    showToast('Payment processed successfully! Official receipt sent to your email.');
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

    const step1 = setTimeout(() => setPdfDownloadProgress(60), 350);
    const step2 = setTimeout(() => setPdfDownloadProgress(90), 750);
    const step3 = setTimeout(() => {
      setPdfDownloadProgress(100);
      setIsGeneratingPdf(false);

      // Trigger text / receipt document download
      const receiptContent = `========================================================
SMILE CLINIC ADVANCED ORAL HEALTH - OFFICIAL STATEMENT
========================================================
Invoice Reference: ${inv.id}
Date: ${inv.date}
Patient: ${initialPatientProfile.name} (ID: ${initialPatientProfile.id})
Attending Clinician: ${inv.dentist}
Procedure: ${inv.description}
CDT Code: ${inv.procedureCode}

Fee Breakdown:
- Gross Fee: $${(inv.insuranceCovered + inv.patientAmount).toFixed(2)}
- Insurance Settlement: -$${inv.insuranceCovered.toFixed(2)}
- Patient Copay: $${inv.patientAmount.toFixed(2)}
Status: ${inv.status.toUpperCase()}
Payment Method: ${inv.paymentMethod || 'Visa •••• 4092'}
Authorization: ${inv.transactionRef || 'DIRECT-AUTH-7492'}
========================================================
Thank you for entrusting your dental health to Smile Clinic.
========================================================`;

      const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `SmileClinic_Statement_${inv.id.replace('#', '')}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Itemized PDF receipt for ${inv.id} downloaded successfully!`);
      setSelectedInvoiceForPdf(null);
      setPdfDownloadProgress(0);
    }, 1200);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

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
              <h2 className="text-3xl sm:text-4xl font-bold text-on-primary-container font-mono">
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
              <span className="font-semibold">Nov 28, 2026</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-on-primary-container/90">
              <span>Last Statement Issued</span>
              <span className="font-semibold">Nov 14, 2026</span>
            </div>
          </div>

          <div className="relative z-10 flex gap-3">
            <button
              onClick={() => setPayModalOpen(true)}
              className="flex-1 bg-surface-container-lowest text-primary font-bold py-3 px-6 rounded-lg hover:bg-surface-bright transition-all shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>{pendingTotal > 0 ? `Pay $${pendingTotal.toFixed(2)} Securely` : 'Account Settled'}</span>
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
                  <h3 className="text-lg sm:text-xl font-bold text-on-surface">{initialPatientProfile.insurance.provider}</h3>
                </div>
              </div>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-bold text-xs px-3 py-1 rounded-full">
                Verified Active
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
              ${initialPatientProfile.insurance.deductibleTotal - initialPatientProfile.insurance.deductibleMet} remaining until 100% copay threshold
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
                    <td className="p-3.5 text-right">
                      {/* PDF Receipt Button with Animated Modal */}
                      <button
                        onClick={() => setSelectedInvoiceForPdf(inv)}
                        className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                        title="View & Download PDF Receipt"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>PDF</span>
                      </button>
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
                  <strong className="text-slate-900 text-sm block">{initialPatientProfile.name}</strong>
                  <span className="text-slate-600 block">ID: #{initialPatientProfile.id}</span>
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
                  ${pendingTotal > 0 ? pendingTotal.toFixed(2) : '45.50'}
                </span>
              </div>
              <span className="text-xs font-bold bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full">
                Invoice #INV-2026-892
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
                  <span>Authorize Payment (${pendingTotal > 0 ? pendingTotal.toFixed(2) : '45.50'})</span>
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
