import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialOdontogramTeeth, initialClinicalNotes, initialRadiographs } from '../data/mockData';
import { OdontogramTooth, DentalRadiograph } from '../types';

export default function DentalRecords() {
  const [teeth, setTeeth] = useState<OdontogramTooth[]>(initialOdontogramTeeth);
  const [selectedTooth, setSelectedTooth] = useState<OdontogramTooth>(initialOdontogramTeeth[17]); // default tooth 18
  const [activeLightboxImage, setActiveLightboxImage] = useState<DentalRadiograph | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const upperArch = teeth.filter(t => t.arch === 'upper');
  const lowerArch = teeth.filter(t => t.arch === 'lower');

  const getToothStatusClass = (status: OdontogramTooth['status'], isSelected: boolean) => {
    const base = 'w-9 h-12 sm:w-11 sm:h-14 rounded-xl flex flex-col items-center justify-between p-1.5 transition-all transform hover:-translate-y-1 shadow-xs cursor-pointer border';
    const ring = isSelected ? 'ring-2 ring-primary ring-offset-2 scale-105 z-10' : '';

    switch (status) {
      case 'crown':
        return `${base} ${ring} bg-secondary text-white border-secondary/50`;
      case 'cavity':
        return `${base} ${ring} bg-amber-500 text-white border-amber-600/50`;
      case 'watch':
        return `${base} ${ring} bg-purple-500 text-white border-purple-600/50`;
      case 'healthy':
      default:
        return `${base} ${ring} bg-surface-container-high hover:bg-primary-tint/60 text-on-surface border-surface-container-highest`;
    }
  };

  const getToothIcon = (status: OdontogramTooth['status']) => {
    switch (status) {
      case 'crown':
        return 'verified';
      case 'cavity':
        return 'warning';
      case 'watch':
        return 'visibility';
      case 'healthy':
      default:
        return 'check';
    }
  };

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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Dental Records & Radiographs</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Interactive adult odontogram charting, clinical consultation notes, and 3D imaging archive.
          </p>
        </div>
        <button
          onClick={() => showToast("Exporting comprehensive clinical health record (DICOM + PDF)...")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high hover:border-primary/40 text-on-surface text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">download</span>
          <span>Export Full Records</span>
        </button>
      </div>

      {/* Split Section: Odontogram Chart & Notes (7 cols) + Imaging Archive (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Odontogram & Clinical Notes */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Odontogram Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container-high space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">dentistry</span>
                  <span>Adult Dental Chart (Odontogram)</span>
                </h2>
                <p className="text-[11px] text-on-surface-variant">Click any tooth below to view restoration status & notes.</p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] font-semibold">
                <span className="flex items-center gap-1 text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest border border-outline/30"></span> Healthy
                </span>
                <span className="flex items-center gap-1 text-secondary">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Crown
                </span>
                <span className="flex items-center gap-1 text-amber-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Watch
                </span>
              </div>
            </div>

            {/* Tooth Grid Viewport */}
            <div className="bg-surface-container-low p-4 sm:p-6 rounded-2xl border border-surface-container-high flex flex-col items-center gap-6">
              {/* Upper Arch (1-16) */}
              <div className="w-full">
                <span className="text-[11px] font-bold text-on-surface-variant block text-center mb-2.5 uppercase tracking-wider">
                  Upper Arch (Maxillary Teeth 1 – 16)
                </span>
                <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                  {upperArch.map((tooth) => (
                    <button
                      key={tooth.number}
                      type="button"
                      onClick={() => setSelectedTooth(tooth)}
                      className={getToothStatusClass(tooth.status, selectedTooth.number === tooth.number)}
                      title={`Tooth #${tooth.number}: ${tooth.name}`}
                    >
                      <span className="text-[10px] font-bold opacity-80">{tooth.number}</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {getToothIcon(tooth.status)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arch Divider */}
              <div className="w-full flex items-center justify-center gap-3 my-1">
                <div className="flex-1 h-[1px] bg-surface-container-high"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Occlusal Plane</span>
                <div className="flex-1 h-[1px] bg-surface-container-high"></div>
              </div>

              {/* Lower Arch (32 down to 17) */}
              <div className="w-full">
                <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                  {lowerArch.map((tooth) => (
                    <button
                      key={tooth.number}
                      type="button"
                      onClick={() => setSelectedTooth(tooth)}
                      className={getToothStatusClass(tooth.status, selectedTooth.number === tooth.number)}
                      title={`Tooth #${tooth.number}: ${tooth.name}`}
                    >
                      <span className="text-[10px] font-bold opacity-80">{tooth.number}</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {getToothIcon(tooth.status)}
                      </span>
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-on-surface-variant block text-center mt-2.5 uppercase tracking-wider">
                  Lower Arch (Mandibular Teeth 32 – 17)
                </span>
              </div>
            </div>

            {/* Selected Tooth Detail Banner */}
            <motion.div 
              key={selectedTooth.number}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                  {selectedTooth.number}
                </div>
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">{selectedTooth.name}</h4>
                  <p className="text-on-surface-variant mt-0.5">
                    <strong>Status:</strong>{' '}
                    <span className="capitalize font-semibold text-primary">{selectedTooth.status}</span>
                    {selectedTooth.notes && ` — ${selectedTooth.notes}`}
                  </p>
                </div>
              </div>
              <div className="text-right sm:self-center shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">Last Verified</span>
                <span className="font-bold text-primary">{selectedTooth.lastInspected}</span>
              </div>
            </motion.div>
          </div>

          {/* 2. Doctor Consultation Notes Archive */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">clinical_notes</span>
                  <span>Consultation Notes & Treatments</span>
                </h2>
                <p className="text-[11px] text-on-surface-variant">Chronological archive of clinical diagnoses and therapy plans.</p>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {initialClinicalNotes.length} Reports
              </span>
            </div>

            <div className="space-y-3">
              {initialClinicalNotes.map((note) => (
                <div key={note.id} className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        note.category === 'Routine Checkup' 
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : note.category === 'Restorative'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {note.category}
                      </span>
                      <strong className="text-on-surface">{note.dentist}</strong>
                      <span className="text-outline text-[11px] hidden sm:inline">({note.dentistTitle})</span>
                    </div>
                    <span className="text-outline font-medium text-[11px]">{note.date}</span>
                  </div>

                  <p className="text-on-surface-variant leading-relaxed">
                    {note.diagnosis}
                  </p>

                  <div className="pt-2 border-t border-surface-container-high/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]">
                    <div>
                      <strong className="text-on-surface">Treatment:</strong>{' '}
                      <span className="text-on-surface-variant">{note.treatment}</span>
                    </div>
                    {note.medication && (
                      <div className="text-primary font-semibold">
                        Rx: {note.medication}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): High-Resolution Imaging Archive */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">radiology</span>
                  <span>Imaging Archive</span>
                </h2>
                <p className="text-[11px] text-on-surface-variant">High-resolution radiographs & 3D DICOM scans.</p>
              </div>
              <span className="text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full">
                Encrypted
              </span>
            </div>

            <div className="space-y-4">
              {initialRadiographs.map((scan) => (
                <div 
                  key={scan.id}
                  className="bg-surface-container-low rounded-2xl overflow-hidden border border-surface-container-high shadow-xs group"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => setActiveLightboxImage(scan)}>
                    <img 
                      src={scan.imageUrl} 
                      alt={scan.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <span className="absolute top-3 right-3 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-md">
                      {scan.type}
                    </span>
                    <button 
                      onClick={() => setActiveLightboxImage(scan)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white"
                    >
                      <span className="material-symbols-outlined text-3xl">zoom_in</span>
                    </button>
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <span className="text-[10px] text-teal-300 font-semibold block">{scan.date} • {scan.dentist}</span>
                      <h4 className="font-bold text-xs truncate leading-tight">{scan.title}</h4>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 text-xs">
                    <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">
                      {scan.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/60 text-[11px]">
                      <span className="text-outline font-mono text-[10px]">{scan.resolution}</span>
                      <button
                        onClick={() => showToast(`Downloaded DICOM package for ${scan.title}!`)}
                        className="inline-flex items-center gap-1 font-bold text-secondary hover:underline cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">download</span>
                        <span>Download Scan</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Radiographs */}
      <AnimatePresence>
        {activeLightboxImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 text-white space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-headline font-bold text-base text-white">{activeLightboxImage.title}</h3>
                  <span className="text-xs text-slate-400">{activeLightboxImage.date} • {activeLightboxImage.dentist} • {activeLightboxImage.resolution}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                    title="Zoom in"
                  >
                    <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                  </button>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                    title="Zoom out"
                  >
                    <span className="material-symbols-outlined text-[18px]">zoom_out</span>
                  </button>
                  <button 
                    onClick={() => {
                      setActiveLightboxImage(null);
                      setZoomLevel(1);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                    title="Close viewer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>

              {/* Viewport */}
              <div className="h-[420px] w-full overflow-hidden bg-black/90 rounded-2xl flex items-center justify-center relative">
                <img 
                  src={activeLightboxImage.imageUrl} 
                  alt={activeLightboxImage.title} 
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="max-h-full max-w-full object-contain transition-transform duration-200"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 pt-2">
                <p className="max-w-xl text-[11px] leading-relaxed">
                  {activeLightboxImage.description}
                </p>
                <button
                  onClick={() => {
                    showToast(`High-resolution radiograph exported successfully!`);
                    setActiveLightboxImage(null);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                >
                  Download Original DICOM
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
