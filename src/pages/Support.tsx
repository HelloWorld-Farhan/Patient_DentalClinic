import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Support() {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [formData, setFormData] = useState({
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    category: 'Appointment Scheduling',
    priority: 'Normal',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 600);
  };

  const faqs = [
    {
      q: 'How do I download my 3D intraoral scans and radiographs?',
      a: 'Navigate to the "Records" tab in your portal. Click the "Download Full Records" button or select individual radiographic studies (OPG, bitewings) and click the download icon to save diagnostic-resolution DICOM or high-res PNG files.'
    },
    {
      q: 'What should I do if I have acute tooth pain outside normal office hours?',
      a: 'Call our 24/7 Dental Emergency Hotline at (555) 234-5678 immediately. An on-call dental triage surgeon will assess your condition, prescribe emergency palliative care if appropriate, or dispatch you to our emergency operatory.'
    },
    {
      q: 'How do insurance claims and copay balances work in the portal?',
      a: 'In the "Billing" section, you can review itemized statements, track claims filed with Delta Dental, Cigna, or MetLife, and pay remaining patient responsibilities securely using Visa, Mastercard, or HSA/FSA cards.'
    },
    {
      q: 'Can I reschedule an upcoming dental hygiene or procedure appointment?',
      a: 'Yes, in the "Appointments" tab, click "Reschedule" next to any upcoming visit at least 24 hours prior to your scheduled time to select an alternate opening with your doctor without incurring a late cancellation fee.'
    }
  ];

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
            <a
              href="tel:5552345678"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Emergency 24/7:</span>
              <span className="font-bold">(555) 234-5678</span>
            </a>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        {/* Emergency Triage Notice Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-50 to-orange-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">medical_services</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-rose-950 flex items-center gap-2">
                <span>Immediate Dental Emergency Hotline</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-semibold uppercase tracking-wider">
                  24/7 Available
                </span>
              </h3>
              <p className="text-xs text-rose-800/90 mt-0.5">
                Experiencing severe swelling, acute continuous pain, dental trauma, or a knocked-out tooth? Do not wait. Call our emergency triage doctor directly.
              </p>
            </div>
          </div>
          <a
            href="tel:5552345678"
            className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shrink-0 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>Call (555) 234-5678</span>
          </a>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-surface-container-high shadow-xs hover:border-primary/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[20px]">calendar_clock</span>
            </div>
            <h4 className="text-sm font-bold text-on-surface">Appointments Desk</h4>
            <p className="text-xs text-on-surface-variant mt-1 mb-3">Schedule, reschedule, or inquire regarding clinic openings.</p>
            <a href="tel:5552345679" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>(555) 234-5679</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-surface-container-high shadow-xs hover:border-primary/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <h4 className="text-sm font-bold text-on-surface">Billing & Insurance</h4>
            <p className="text-xs text-on-surface-variant mt-1 mb-3">Questions on claim adjudication, copays, or itemized receipts.</p>
            <a href="mailto:billing@smileclinic.com" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
              <span>billing@smileclinic.com</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-surface-container-high shadow-xs hover:border-primary/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <h4 className="text-sm font-bold text-on-surface">Records & Radiographs</h4>
            <p className="text-xs text-on-surface-variant mt-1 mb-3">Request full clinical records transfer to another practitioner.</p>
            <a href="mailto:records@smileclinic.com" className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1">
              <span>records@smileclinic.com</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-surface-container-high shadow-xs hover:border-primary/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
            </div>
            <h4 className="text-sm font-bold text-on-surface">Clinic Location</h4>
            <p className="text-xs text-on-surface-variant mt-1 mb-3">1200 Health Park Blvd, Suite 400. Mon–Sat: 8am–6pm.</p>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span>Validated Patient Parking</span>
            </span>
          </div>
        </div>

        {/* Support Ticket Submission Form & FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Support Ticket Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-surface-container-high shadow-xs">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                  Patient Support Desk
                </span>
                <span className="text-xs text-on-surface-variant">• Typical reply &lt; 2 business hours</span>
              </div>
              <h2 className="text-xl font-extrabold text-on-surface">Submit an Inquiry or Request Assistance</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Have a question regarding your upcoming visit, tooth sensitivity, or portal access? Send a secure note directly to our care team.
              </p>
            </div>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <h3 className="text-base font-bold text-emerald-950">Inquiry Received Successfully</h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Thank you! Ticket reference <strong>#TK-{Math.floor(100000 + Math.random() * 900000)}</strong> has been opened. Our patient care coordinator will review your chart notes and respond to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ ...formData, subject: '', message: '' });
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5">Patient Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-medium focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-medium focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5">Inquiry Department</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-medium focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    >
                      <option>Appointment Scheduling</option>
                      <option>Billing & Insurance Claims</option>
                      <option>Post-Operative Question</option>
                      <option>Dental Radiographs & Records</option>
                      <option>Portal Login & Account</option>
                      <option>General Feedback</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5">Urgency Level</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-medium focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    >
                      <option>Normal (Routine question)</option>
                      <option>Priority (Need reply today)</option>
                      <option>Urgent (Discomfort / Bleeding)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-medium focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    placeholder="Brief summary of your question"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5">Message / Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-medium focus:outline-none focus:border-primary focus:bg-white transition-colors resize-none"
                    placeholder="Please include relevant symptoms, tooth numbers (if known), or dates..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Submitting Secure Ticket...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Send Support Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: FAQs & Emergency First Aid */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick First-Aid Advice */}
            <div className="bg-white rounded-2xl p-6 border border-surface-container-high shadow-xs">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-[20px]">medical_information</span>
                <span>Dental Emergency Quick Actions</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <span className="font-bold text-on-surface block mb-0.5">🦷 Knocked-Out Tooth:</span>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Hold only by the crown (never touch root). Rinse gently in milk or water. Place in cold milk or saliva and reach our clinic within 60 minutes for highest re-implantation success.
                  </p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <span className="font-bold text-on-surface block mb-0.5">🩹 Post-Extraction Bleeding:</span>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Bite firmly on a sterile, damp gauze pad or caffeinated tea bag for 45 minutes without spitting or using a straw. Call us if bleeding persists.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive FAQs Accordion */}
            <div className="bg-white rounded-2xl p-6 border border-surface-container-high shadow-xs">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">help</span>
                <span>Patient Portal FAQs</span>
              </h3>
              <div className="space-y-2.5">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={index} className="border border-surface-container-high rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-3 text-left flex items-center justify-between gap-2 bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-bold text-on-surface">{faq.q}</span>
                        <span className={`material-symbols-outlined text-[18px] text-primary transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}>
                          expand_more
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-3 bg-surface-container-low/50 text-[11px] text-on-surface-variant leading-relaxed border-t border-surface-container-high"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-4 border-t border-surface-container-high mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-xs">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">shield_with_heart</span>
            <span>© 2026 Smile Clinic Health System. All health records encrypted.</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-medium">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/patient-rights" className="hover:text-primary transition-colors">Patient Rights</Link>
            <Link to="/support" className="text-primary font-bold">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
