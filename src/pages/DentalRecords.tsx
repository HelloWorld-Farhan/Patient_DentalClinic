import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { initialOdontogramTeeth, initialClinicalNotes, initialRadiographs, initialPatientProfile } from '../data/mockData';
import { OdontogramTooth, DentalRadiograph } from '../types';
import ToastNotification from '../components/ToastNotification';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export default function DentalRecords() {
  const [teeth] = useState<OdontogramTooth[]>(initialOdontogramTeeth);
  const [selectedTooth, setSelectedTooth] = useState<OdontogramTooth>(initialOdontogramTeeth[17]); // default tooth 18
  const [activeLightboxImage, setActiveLightboxImage] = useState<DentalRadiograph | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Modals for Print View and Export Full Record
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'dicom' | 'csv'>('pdf');
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Lock background scroll when any modal or lightbox is active
  useBodyScrollLock(Boolean(activeLightboxImage || isPrintViewOpen || isExportModalOpen));

  const upperArch = teeth.filter(t => t.arch === 'upper');
  const lowerArch = teeth.filter(t => t.arch === 'lower');

  const getToothStatusClass = (status: OdontogramTooth['status'], isSelected: boolean) => {
    const base = 'w-9 h-12 md:w-11 md:h-14 rounded-lg flex flex-col items-center justify-between p-1 transition-all transform hover:-translate-y-1 shadow-sm font-label-sm cursor-pointer';
    const ring = isSelected ? 'ring-2 ring-primary ring-offset-2 scale-105 z-10' : '';

    switch (status) {
      case 'crown':
        return `${base} ${ring} bg-secondary text-white`;
      case 'cavity':
        return `${base} ${ring} bg-error text-white`;
      case 'healthy':
      default:
        return `${base} ${ring} bg-surface-container-highest hover:bg-primary-fixed-dim text-on-surface`;
    }
  };

  const getToothIcon = (status: OdontogramTooth['status']) => {
    switch (status) {
      case 'crown':
        return 'verified';
      case 'cavity':
        return 'warning';
      case 'healthy':
      default:
        return 'check';
    }
  };

  // Start animated export process
  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(15);

    const step1 = setTimeout(() => setExportProgress(50), 400);
    const step2 = setTimeout(() => setExportProgress(85), 900);
    const step3 = setTimeout(() => {
      setExportProgress(100);
      setIsExporting(false);

      // Trigger actual file download
      const filename =
        exportFormat === 'pdf'
          ? `SmileClinic_EHR_Dossier_PT-84920.pdf`
          : exportFormat === 'dicom'
          ? `SmileClinic_DICOM_Radiographs_PT-84920.zip`
          : `SmileClinic_Dental_Ledger_PT-84920.csv`;

      const content =
        exportFormat === 'csv'
          ? `Date,Procedure,Doctor,Status,Fee,PatientCopay\n` +
            initialClinicalNotes.map(n => `"${n.date}","${n.category}","${n.dentist}","Completed",150.00,45.00`).join('\n')
          : JSON.stringify({ patient: initialPatientProfile, notes: initialClinicalNotes, odontogram: teeth }, null, 2);

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Record exported and downloaded successfully as ${filename}!`);
      setIsExportModalOpen(false);
      setExportProgress(0);
    }, 1500);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Top Banner / Summary Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">Patient Clinical Record</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">Active File</span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">Medical & Dental Archive</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Comprehensive overview of dental charts, diagnostic imaging, and clinical consultation notes.
          </p>
        </div>
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          {/* Export Full Record Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-container transition-all text-xs font-bold shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Full Record</span>
          </button>

          {/* Print View Button */}
          <button
            onClick={() => setIsPrintViewOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-4 py-2.5 rounded-lg hover:bg-surface-variant transition-all text-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Dental Chart & Tooth Status (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Dental Chart Card */}
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="font-headline font-bold text-lg sm:text-xl text-on-surface">Interactive Dental Chart</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Click any tooth to inspect historical work, status, and active notes.</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary inline-block"></span><span>Healthy</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-secondary inline-block"></span><span>Crown</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-error inline-block"></span><span>Needs Work</span></div>
              </div>
            </div>

            {/* Tooth Visualization Grid Container */}
            <div className="bg-surface-container-low p-6 rounded-xl flex flex-col items-center justify-center gap-6 border border-surface-container-high/60">
              {/* Upper Arch */}
              <div className="w-full">
                <span className="text-xs text-on-surface-variant block text-center mb-3 uppercase tracking-wider font-bold">
                  Upper Arch (Maxillary)
                </span>
                <div className="flex justify-center gap-1.5 md:gap-2 flex-wrap overflow-x-auto no-scrollbar py-1">
                  {upperArch.map((tooth) => (
                    <button
                      key={tooth.number}
                      type="button"
                      onClick={() => setSelectedTooth(tooth)}
                      className={getToothStatusClass(tooth.status, selectedTooth.number === tooth.number)}
                      title={`Tooth #${tooth.number}: ${tooth.name}`}
                    >
                      <span className="text-[10px] opacity-75 font-mono">{tooth.number}</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {getToothIcon(tooth.status)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-outline-variant/30 my-1"></div>

              {/* Lower Arch */}
              <div className="w-full">
                <div className="flex justify-center gap-1.5 md:gap-2 flex-wrap overflow-x-auto no-scrollbar py-1 mb-3">
                  {lowerArch.map((tooth) => (
                    <button
                      key={tooth.number}
                      type="button"
                      onClick={() => setSelectedTooth(tooth)}
                      className={getToothStatusClass(tooth.status, selectedTooth.number === tooth.number)}
                      title={`Tooth #${tooth.number}: ${tooth.name}`}
                    >
                      <span className="text-[10px] opacity-75 font-mono">{tooth.number}</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {getToothIcon(tooth.status)}
                      </span>
                    </button>
                  ))}
                </div>
                <span className="text-xs text-on-surface-variant block text-center uppercase tracking-wider font-bold">
                  Lower Arch (Mandibular)
                </span>
              </div>
            </div>

            {/* Selected Tooth Details Panel */}
            <motion.div
              key={selectedTooth.number}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs font-mono">
                  {selectedTooth.number}
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface text-sm sm:text-base">{selectedTooth.name}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    <strong>Status:</strong>{' '}
                    <span className="capitalize font-semibold text-primary">{selectedTooth.status}</span>
                    {selectedTooth.notes && ` — ${selectedTooth.notes}`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary shrink-0">Last Inspected: {selectedTooth.lastInspected}</span>
            </motion.div>
          </div>

          {/* Doctor Consultation Notes & Prescribed Treatments List */}
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-headline font-bold text-lg sm:text-xl text-on-surface">Consultation Notes & Treatments</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Chronological archive of clinical diagnoses and therapy plans.</p>
              </div>
              <span className="material-symbols-outlined text-primary text-[28px]">clinical_notes</span>
            </div>

            {/* Notes List */}
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              {initialClinicalNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-surface-container-low p-5 rounded-xl border border-surface-container-high flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-on-surface-variant font-medium">{note.date}</span>
                      <h4 className="font-bold text-base text-on-surface mt-0.5">{note.category}</h4>
                      <p className="text-xs text-primary font-semibold">{note.dentist} • {note.dentistTitle}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-surface-container-highest text-on-surface font-mono text-xs rounded-lg">
                      {note.id}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-surface-container-high text-xs sm:text-sm">
                    <div>
                      <strong className="text-on-surface block">Clinical Findings & Diagnosis:</strong>
                      <p className="text-on-surface-variant mt-0.5 leading-relaxed">{note.diagnosis}</p>
                    </div>

                    <div>
                      <strong className="text-on-surface block">Treatment Administered:</strong>
                      <p className="text-on-surface-variant mt-0.5 leading-relaxed">{note.treatment}</p>
                    </div>

                    {note.medication && (
                      <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container-high/80 text-xs text-primary font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">prescriptions</span>
                        <span>{note.medication}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Radiographs & Diagnostic Scans (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-bold text-lg sm:text-xl text-on-surface">Imaging Archive</h2>
                <span className="material-symbols-outlined text-primary text-[24px]">radiology</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">High-definition panoramic, cephalometric, and bitewing scans.</p>
            </div>

            {/* Radiograph Scans Grid */}
            <div className="flex flex-col gap-4">
              {initialRadiographs.map((scan) => (
                <div
                  key={scan.id}
                  className="group relative bg-surface-container-low rounded-xl overflow-hidden border border-surface-container-high hover:border-primary/50 transition-all shadow-xs"
                >
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={scan.imageUrl}
                      alt={scan.title}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <span className="absolute top-3 left-3 bg-slate-900/90 text-teal-300 font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-xs border border-teal-500/30">
                      {scan.type}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveLightboxImage(scan);
                        setZoomLevel(1);
                      }}
                      className="absolute inset-0 m-auto w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer shadow-lg"
                      title="Inspect High-Res Scan"
                    >
                      <span className="material-symbols-outlined text-[24px]">fullscreen</span>
                    </button>
                  </div>

                  <div className="p-4 flex flex-col gap-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm text-on-surface leading-tight">{scan.title}</h4>
                      <span className="text-[10px] text-outline shrink-0 font-medium">{scan.date}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {scan.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/60 mt-1">
                      <span className="text-[11px] font-mono text-outline">{scan.resolution}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveLightboxImage(scan);
                          setZoomLevel(1);
                        }}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View High-Res</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PRINT VIEW MODAL: COMPREHENSIVE PATIENT CLINICAL DOSSIER               */}
      {/* ========================================================================= */}
      {isPrintViewOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsPrintViewOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white shrink-0 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-teal-400 text-[24px]">dentistry</span>
                  <span className="font-bold text-lg tracking-tight">SMILE CLINIC ADVANCED ORAL CARE</span>
                </div>
                <p className="text-xs text-slate-400">Complete Electronic Health Record Dossier & Dental Archive Summary</p>
                <p className="text-[10px] text-teal-300 font-mono mt-1">HIPAA COMPLIANT ARCHIVE • PRINT PREVIEW</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintViewOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Dossier Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
              {/* Patient Banner */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Patient Name</span>
                  <strong className="text-slate-900 text-sm">{initialPatientProfile.name}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Patient ID / DOB</span>
                  <span className="font-mono text-slate-800">#{initialPatientProfile.id} • {initialPatientProfile.dob}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Insurance Coverage</span>
                  <span className="text-slate-800 font-semibold">{initialPatientProfile.insurance.provider}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Contact Phone</span>
                  <span className="text-slate-800">{initialPatientProfile.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Primary Address</span>
                  <span className="text-slate-800">{initialPatientProfile.address}</span>
                </div>
              </div>

              {/* Odontogram Status Summary */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">Odontogram Chart Summary</h4>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <strong className="text-slate-900">Total Evaluated Teeth:</strong> 32 / 32 Permanent Dentition
                    </div>
                    <div>
                      <strong className="text-slate-900">Restored Crowns:</strong> Tooth #3, Tooth #14
                    </div>
                    <div>
                      <strong className="text-slate-900">Active Watch:</strong> Tooth #6 (Incipient), Tooth #30 (Occlusal attrition)
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                    Full adult permanent dentition intact. Probing depths within physiological limits (1-3mm). Zero active periodontal pockets over 4mm.
                  </p>
                </div>
              </div>

              {/* Consultation & Clinical Treatment History */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">Chronological Clinical Consultation Notes</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Doctor</th>
                        <th className="p-2.5">Clinical Findings & Treatment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {initialClinicalNotes.map((note) => (
                        <tr key={note.id}>
                          <td className="p-2.5 whitespace-nowrap font-medium text-slate-900">{note.date}</td>
                          <td className="p-2.5 font-bold text-teal-800">{note.category}</td>
                          <td className="p-2.5 whitespace-nowrap text-slate-700">{note.dentist}</td>
                          <td className="p-2.5 text-slate-600 leading-relaxed">{note.diagnosis} {note.treatment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Radiographs Log */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">Diagnostic Radiographic Archive</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Imaging ID</th>
                        <th className="p-2.5">Scan Modality</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Diagnostic Evaluation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {initialRadiographs.map((scan) => (
                        <tr key={scan.id}>
                          <td className="p-2.5 font-mono font-bold text-slate-900">{scan.id}</td>
                          <td className="p-2.5 font-semibold text-slate-800">{scan.title}</td>
                          <td className="p-2.5 whitespace-nowrap text-slate-600">{scan.date}</td>
                          <td className="p-2.5 text-slate-600">{scan.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Digital Attestation */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Medical Records Custodian</span>
                  <div className="font-serif italic text-base text-slate-900 font-semibold">Dr. Priya Patel, DDS</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Digitally Certified & Formatted for Print</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Certified Date</span>
                  <span className="font-mono text-slate-700">October 14, 2026</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">Official Clinical Print Preview</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintViewOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 2. EXPORT FULL RECORD MODAL                                               */}
      {/* ========================================================================= */}
      {isExportModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => !isExporting && setIsExportModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm"
          >
            {/* Header */}
            <div className="p-5 border-b border-surface-container-high flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[22px]">download</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Export Full Record</h3>
                  <p className="text-xs text-on-surface-variant">Download certified clinical archive</p>
                </div>
              </div>
              {!isExporting && (
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>

            <div className="p-5 space-y-4">
              <span className="text-xs font-bold text-on-surface block">Choose Export Format:</span>

              {/* Format Options */}
              <div className="space-y-2">
                <label
                  onClick={() => !isExporting && setExportFormat('pdf')}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    exportFormat === 'pdf'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-600 text-[24px]">picture_as_pdf</span>
                    <div>
                      <strong className="text-xs text-on-surface block">Comprehensive Clinical PDF Dossier</strong>
                      <span className="text-[10px] text-on-surface-variant">Complete chart, notes, odontogram & care history</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={exportFormat === 'pdf'}
                    onChange={() => setExportFormat('pdf')}
                    disabled={isExporting}
                    className="accent-primary"
                  />
                </label>

                <label
                  onClick={() => !isExporting && setExportFormat('dicom')}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    exportFormat === 'dicom'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-teal-600 text-[24px]">folder_zip</span>
                    <div>
                      <strong className="text-xs text-on-surface block">4K DICOM Imaging Bundle (.ZIP)</strong>
                      <span className="text-[10px] text-on-surface-variant">Panoramic OPG, Bitewings, and Cephalometric scans</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={exportFormat === 'dicom'}
                    onChange={() => setExportFormat('dicom')}
                    disabled={isExporting}
                    className="accent-primary"
                  />
                </label>

                <label
                  onClick={() => !isExporting && setExportFormat('csv')}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    exportFormat === 'csv'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-600 text-[24px]">table_chart</span>
                    <div>
                      <strong className="text-xs text-on-surface block">Treatment History & Ledger (.CSV)</strong>
                      <span className="text-[10px] text-on-surface-variant">Structured spreadsheet for personal accounting</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={exportFormat === 'csv'}
                    onChange={() => setExportFormat('csv')}
                    disabled={isExporting}
                    className="accent-primary"
                  />
                </label>
              </div>

              {/* Animated Progress Bar when exporting */}
              {isExporting && (
                <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                      <span>Encrypting & Bundling Medical Archive...</span>
                    </span>
                    <span className="font-mono font-bold text-primary">{exportProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-on-surface-variant block">
                    256-bit AES encryption verified under HIPAA Electronic Health Record security standards.
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-low/50 border-t border-surface-container-high flex justify-end gap-2">
              <button
                type="button"
                disabled={isExporting}
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-lg cursor-pointer text-xs disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={handleStartExport}
                className="px-5 py-2 bg-primary text-white font-bold rounded-lg cursor-pointer text-xs shadow-sm hover:bg-primary-container transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                <span>{isExporting ? 'Generating Archive...' : 'Start Export'}</span>
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Lightbox Modal for Radiographs (Portal with z-[9999]) */}
      {activeLightboxImage && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-lg"
            onClick={() => {
              setActiveLightboxImage(null);
              setZoomLevel(1);
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full text-white shadow-2xl overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
          >
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-teal-400 flex items-center justify-center shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[24px]">radiology</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base sm:text-lg text-white">{activeLightboxImage.title}</h3>
                  <span className="text-xs text-slate-400 block">{activeLightboxImage.date} • {activeLightboxImage.dentist} • {activeLightboxImage.resolution}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <span className="material-symbols-outlined text-[18px]">zoom_out</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setActiveLightboxImage(null);
                    setZoomLevel(1);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                  title="Close viewer"
                  aria-label="Close dialog"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Viewport */}
            <div className="h-[240px] sm:h-[360px] md:h-[440px] w-full overflow-hidden bg-black/90 flex items-center justify-center relative flex-1">
              <img 
                src={activeLightboxImage.imageUrl} 
                alt={activeLightboxImage.title} 
                style={{ transform: `scale(${zoomLevel})` }}
                className="max-h-full max-w-full object-contain transition-transform duration-200"
              />
            </div>

            <div className="p-4 sm:p-6 bg-slate-950/70 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 shrink-0">
              <p className="max-w-xl text-[11px] leading-relaxed">
                {activeLightboxImage.description}
              </p>
              <button
                type="button"
                onClick={() => {
                  showToast(`High-resolution radiograph exported successfully!`);
                  setActiveLightboxImage(null);
                }}
                className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0"
              >
                Download Original DICOM
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
