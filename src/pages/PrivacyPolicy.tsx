import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f7fafc] font-sans text-on-surface min-h-screen flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-surface-container-high shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">dentistry</span>
            </div>
            <div>
              <span className="font-headline font-bold text-lg text-primary block leading-none">Smile Clinic</span>
              <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider">Patient Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold rounded-lg border border-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Policy</span>
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-primary text-white hover:bg-primary-container text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-surface-container-high space-y-8"
        >
          {/* Document Header */}
          <div className="border-b border-surface-container-high pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
                HIPAA Notice of Privacy Practices
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                256-Bit SSL Encrypted
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">Privacy Policy & Health Information Protections</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
              Effective Date: January 1, 2026 • Last Reviewed: October 14, 2026 • Smile Clinic Oral Healthcare Network
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
              <span>Our Commitment to Your Dental Privacy</span>
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Smile Clinic is committed to protecting your Protected Health Information (PHI) under the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and applicable state health information regulations. This notice describes how oral health records, radiographs, periodontal charting, and diagnostic notes are safeguarded.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
              <span>Information Collected via the Patient Portal</span>
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              When accessing our patient portal and clinical services, we maintain records necessary to provide safe and effective dental treatment:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-on-surface-variant">
              <li><strong>Clinical Records:</strong> Diagnostic radiographs (OPG, bitewings, cephalometric scans), 3D intraoral scans, odontograms, periodontal probing measurements, and clinicians' consultation notes.</li>
              <li><strong>Administrative & Contact Data:</strong> Name, contact phone, residential address, emergency contact, date of birth, and identity credentials.</li>
              <li><strong>Insurance & Payment Ledger:</strong> Dental benefit provider details, group numbers, claim adjudication histories, and credit card authorization tokens.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
              <span>Permitted Uses & Disclosures of Dental Data</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container-high space-y-1">
                <span className="font-bold text-xs text-primary block">Clinical Treatment</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Coordination between general dentists, orthodontists, periodontists, and dental hygienists within our clinic.
                </p>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container-high space-y-1">
                <span className="font-bold text-xs text-primary block">Insurance Settlement</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Submitting claims, pre-authorizations, and itemized CDT procedure codes to dental carriers (e.g. Delta Dental).
                </p>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container-high space-y-1">
                <span className="font-bold text-xs text-primary block">Healthcare Operations</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Sterilization quality assurance, accreditation auditing, automated appointment SMS reminders, and EHR encryption audits.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">4</span>
              <span>Your Rights as a Dental Patient</span>
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Under federal regulations, you hold the right to:
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
              <div className="p-3 rounded-xl border border-surface-container-high flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">verified_user</span>
                <div>
                  <strong>Right to Inspect & Export Health Records:</strong> You may inspect, print, or download electronic copies of your DICOM radiographs and consultation notes directly through this portal.
                </div>
              </div>
              <div className="p-3 rounded-xl border border-surface-container-high flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">lock_person</span>
                <div>
                  <strong>Right to Request Confidential Communications:</strong> You may elect preferred contact channels (SMS, email, or telephone) for reminder notices and billing statements.
                </div>
              </div>
              <div className="p-3 rounded-xl border border-surface-container-high flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">edit_note</span>
                <div>
                  <strong>Right to Request Record Amendments:</strong> If you believe a clinical note contains inaccurate medical history or allergy notes, you may file a written amendment request.
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">contact_support</span>
              <span>Privacy Officer Inquiries & Grievances</span>
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              If you have questions regarding our privacy practices or believe your privacy rights have been violated, please contact our Privacy Compliance Officer at <strong className="text-on-surface">privacy@smileclinic.com</strong> or call our Dedicated Patient Line at <strong className="text-on-surface">(555) 234-5678</strong>. You will not face retaliation for filing a grievance.
            </p>
          </section>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-surface-container-high py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <span>© 2026 Smile Clinic Health System. All health records encrypted under HIPAA standards.</span>
          <div className="flex items-center gap-6 font-semibold">
            <Link to="/privacy-policy" className="text-primary font-bold">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/patient-rights" className="hover:text-primary transition-colors">Patient Rights</Link>
            <Link to="/support" className="hover:text-primary transition-colors">Support & Help Desk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
