import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TermsOfService() {
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
              <span>Print Terms</span>
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
              <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs uppercase tracking-wider">
                Clinical Agreement
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold">
                Patient Portal Terms of Service
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">Patient Terms of Service & Clinic Guidelines</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
              Effective Date: January 1, 2026 • Governing Practice: Smile Clinic Dental Healthcare Corporation
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
              <span>Acceptance of Portal Terms</span>
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              By registering an account, booking appointments, reviewing radiographs, or submitting payments through the Smile Clinic Patient Portal, you agree to comply with these Terms of Service. These terms govern the electronic relationship between you (the patient or legal guardian) and Smile Clinic practitioners.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
              <span>Scheduling, Rescheduling & 24-Hour Notice Policy</span>
            </h2>
            <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high space-y-2 text-xs sm:text-sm text-on-surface-variant">
              <p className="leading-relaxed">
                Our clinical operatories and dentists dedicate specific time exclusively for your treatment. We request at least <strong className="text-on-surface">24 hours advance notice</strong> if you need to reschedule or cancel a visit.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>Missed appointments without 24h prior notification may incur a nominal $35 rebooking charge.</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
              <span>Financial Agreement & Dental Insurance Estimates</span>
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              While our administrative team submits claims to your dental benefit carrier (such as Delta Dental Premier), please understand:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-on-surface-variant">
              <li><strong>Copay Estimates:</strong> Insurance coverage figures presented in this portal are estimates based on your carrier's fee schedule. Final patient financial responsibility is determined after carrier claim adjudication.</li>
              <li><strong>Copay Settlement:</strong> Outstanding copayments are due upon the date of service or within 30 days of monthly statement dispatch.</li>
              <li><strong>Payment Security:</strong> Card payments authorized through the portal are processed via PCI-DSS Level 1 compliant encryption.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">4</span>
              <span>Informed Consent & Electronic Radiographs</span>
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Diagnostic radiographs (panoramic scans, bitewings, 3D optical impressions) stored on this portal are clinical property of Smile Clinic. You have full non-exclusive access to inspect and export your DICOM radiographs for specialist consults or second opinions.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">medical_services</span>
              <span>Acute Dental Emergencies Notice</span>
            </h3>
            <p className="text-xs text-emerald-900 leading-relaxed">
              The online patient portal and messaging system are intended for non-urgent clinical communication. In the event of acute trauma, uncontrolled bleeding, severe facial swelling, or breathing difficulty, call <strong>911</strong> or report to the nearest hospital emergency room immediately.
            </p>
          </section>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-surface-container-high py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <span>© 2026 Smile Clinic Health System. All health records encrypted under HIPAA standards.</span>
          <div className="flex items-center gap-6 font-semibold">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-primary font-bold">Terms of Service</Link>
            <Link to="/patient-rights" className="hover:text-primary transition-colors">Patient Rights</Link>
            <Link to="/support" className="hover:text-primary transition-colors">Support & Help Desk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
