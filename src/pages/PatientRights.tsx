import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LegalPageHeader from '../components/LegalPageHeader';

export default function PatientRights() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-[#f7fafc] font-sans text-on-surface min-h-screen flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Top Header with Adaptive Auth & Dashboard Navigation */}
      <LegalPageHeader title="Patient Rights & Responsibilities" showPrintButton={true} />

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
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                Patient Bill of Rights
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold">
                ADA & Clinical Governance Standards
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">Dental Patient Bill of Rights & Responsibilities</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
              Smile Clinic is dedicated to delivering exemplary, compassionate, and ethical oral health services. As a patient within our healthcare system, you are entitled to standard-of-care dental rights outlined below.
            </p>
          </div>

          {/* Section 1: Right to Respectful and Professional Care */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">1. Respectful, Non-Discriminatory Treatment</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1">
                  You have the right to considerate, respectful, and dignified dental care at all times, without regard to race, creed, color, national origin, gender, age, disability, or source of dental benefit coverage. Every dental practitioner and auxiliary team member is bound to uphold an environment of kindness and clinical empathy.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Informed Consent & Complete Explanations */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">2. Full Diagnostic Explanation & Informed Consent</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1">
                  Prior to any treatment, you have the right to a clear, intelligible explanation of your diagnosis, proposed restorative or surgical options, and:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high">
                    <span className="text-xs font-bold text-on-surface block mb-1">Detailed Prognosis</span>
                    <span className="text-[11px] text-on-surface-variant block leading-relaxed">
                      Realistic expectations regarding the longevity, maintenance, and clinical outcome of recommended treatments.
                    </span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high">
                    <span className="text-xs font-bold text-on-surface block mb-1">Alternative Modalities</span>
                    <span className="text-[11px] text-on-surface-variant block leading-relaxed">
                      Discussion of alternative dental techniques, materials (composite vs. ceramic), and the consequences of deferred treatment.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Right to Dental Records and Digital Imaging */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">radiology</span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">3. Access to Radiographs & Clinical Records</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1">
                  You possess the statutory right under federal HIPAA guidelines to inspect, request copies of, or transmit your electronic dental records, full-mouth series (FMX), bitewings, panoramic radiographs (OPG), periodontal charts, and treatment ledgers via our 24/7 Patient Portal or upon written request within 15 business days.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Transparent Financials & Prior Written Estimates */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">price_check</span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">4. Transparent Cost Estimates & Financial Clarity</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1">
                  You have the right to receive an itemized, written treatment plan estimate with standard ADA procedure codes prior to initiating non-emergency restorative or surgical procedures. We will verify your insurance eligibility and detail your projected copayments, deductibles, and out-of-pocket maximums before treatment begins.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Second Opinions & Right to Refuse */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">5. Second Opinions & Treatment Refusal</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1">
                  You have the absolute right to seek a second clinical opinion from another dentist or dental specialist (e.g., periodontist, oral surgeon, or endodontist) and have relevant digital diagnostics forwarded at no cost. You have the right to refuse or discontinue treatment at any stage after being informed of the clinical risks.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Emergency Care Continuity */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">6. Continuity of Care & Emergency Access</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1">
                  Patients of record are guaranteed prompt attention for acute dental emergencies (severe pain, facial swellings, dental trauma, knocked-out teeth). Our triage clinicians are available 24 hours a day, 7 days a week via phone: <strong>(555) 234-5678</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Patient Responsibilities */}
          <div className="p-4 sm:p-6 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
              <span>Patient Responsibilities for Effective Treatment</span>
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Safe dental care relies on active partnership. Patients are requested to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-on-surface-variant">
              <li>Disclose an accurate, complete medical history including medications, anticoagulants, allergies, and systemic conditions (diabetes, cardiac conditions).</li>
              <li>Provide at least 24 hours prior notice if rescheduling or cancelling appointments so chair time can be offered to urgent patients.</li>
              <li>Follow post-operative instructions (e.g., socket care after extractions, soft diet following implant placement).</li>
              <li>Fulfill financial copayments and insurance deductibles according to the agreed payment schedule.</li>
            </ul>
          </div>

          {/* Patient Advocacy & Grievances */}
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-teal-900 block">Patient Ombudsman & Quality Assurance</span>
              <span className="text-[11px] text-teal-800 block mt-0.5">
                If you have feedback, questions regarding quality of care, or concerns about your treatment, our clinical director is here to assist.
              </span>
            </div>
            <Link
              to="/support"
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-4 border-t border-surface-container-high">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant text-xs text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">shield_with_heart</span>
            <span>© 2026 Smile Clinic Health System. All health records encrypted.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 text-[11px] font-medium">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span className="text-primary font-bold">Patient Rights</span>
            <Link to="/support" className="hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
