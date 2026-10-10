import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { initialOdontogramTeeth, initialClinicalNotes, initialRadiographs } from '../data/mockData';
import { OdontogramTooth, DentalRadiograph } from '../types';

export default function DentalRecords() {
  const [teeth] = useState<OdontogramTooth[]>(initialOdontogramTeeth);
  const [selectedTooth, setSelectedTooth] = useState<OdontogramTooth>(initialOdontogramTeeth[17]); // default tooth 18
  const [activeLightboxImage, setActiveLightboxImage] = useState<DentalRadiograph | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
          <button
            onClick={() => showToast('Exporting full clinical summary (PDF & DICOM)...')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-container transition-all text-xs font-bold shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Full Record</span>
          </button>
          <button
            onClick={() => window.print()}
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
                <div key={note.id} className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2 border border-surface-container-high/60">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${
                        note.category === 'Routine Checkup'
                          ? 'bg-tertiary-container text-white'
                          : 'bg-secondary text-white'
                      }`}>
                        {note.category}
                      </span>
                      <span className="font-bold text-on-surface">{note.dentist}</span>
                    </div>
                    <span className="text-xs text-on-surface-variant">{note.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {note.diagnosis}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/20 text-xs">
                    <span className="font-bold text-on-surface">Prescribed Treatment:</span>
                    <span className="bg-surface-container-highest px-2 py-0.5 rounded text-on-surface font-medium">
                      {note.treatment}
                    </span>
                    {note.medication && (
                      <span className="text-primary font-semibold ml-auto">
                        Rx: {note.medication}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: X-ray & Imaging Archive (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-headline font-bold text-lg sm:text-xl text-on-surface">Imaging Archive</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Diagnostic scans & panoramic radiographs.</p>
              </div>
              <span className="material-symbols-outlined text-secondary text-[26px]">radiology</span>
            </div>

            <div className="flex flex-col gap-4">
              {initialRadiographs.map((scan) => (
                <div
                  key={scan.id}
                  className="bg-surface-container-low rounded-xl overflow-hidden border border-surface-container-high/60 group shadow-xs"
                >
                  <div
                    className="relative h-44 w-full overflow-hidden bg-slate-900 cursor-pointer"
                    onClick={() => setActiveLightboxImage(scan)}
                  >
                    <img
                      src={scan.imageUrl}
                      alt={scan.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 bg-black/75 text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      {scan.type}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white">
                      <span className="material-symbols-outlined text-3xl">zoom_in</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] text-teal-300 font-semibold block">{scan.date} • {scan.dentist}</span>
                      <h4 className="font-bold text-sm truncate leading-tight">{scan.title}</h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <p className="text-on-surface-variant leading-relaxed line-clamp-2">
                      {scan.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-surface-container-high text-xs">
                      <span className="text-outline font-mono text-[11px]">{scan.resolution}</span>
                      <button
                        onClick={() => showToast(`Downloaded DICOM scan package for ${scan.title}!`)}
                        className="inline-flex items-center gap-1 font-bold text-secondary hover:underline cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>Download DICOM</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
