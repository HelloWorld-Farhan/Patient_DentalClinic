import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Signup() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [firstName, setFirstName] = useState('Sarah');
  const [lastName, setLastName] = useState('Jenkins');
  const [dob, setDob] = useState('24 / 08 / 1994');
  const [phone, setPhone] = useState('(555) 349-8821');
  const [email, setEmail] = useState('sarah.jenkins@example.com');
  const [password, setPassword] = useState('SmileHealth2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isExistingPatient, setIsExistingPatient] = useState(false);
  const [chartNumber, setChartNumber] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('delta');
  const [insuranceMemberId, setInsuranceMemberId] = useState('DD-99201-P');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [receiveSms, setReceiveSms] = useState(true);

  // Step 2 Fields
  const [visitReason, setVisitReason] = useState('Routine Cleaning & Comprehensive Exam');
  const [lastVisit, setLastVisit] = useState('Within the last 6 months');
  const [allergies, setAllergies] = useState<string[]>(['None']);

  // Step 3 Fields
  const [twoFactorMethod, setTwoFactorMethod] = useState<'sms' | 'app'>('sms');
  const [preferredBranch, setPreferredBranch] = useState('Downtown Main Pavilion (100 Smile Way)');
  const [electronicSignature, setElectronicSignature] = useState('Sarah Jenkins');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Password requirements dynamic check
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasMinLength || !hasUppercase || !hasSymbol) {
      alert("Please ensure your password meets all 3 security requirements.");
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('smileclinic_patient_auth', 'true');
      navigate('/dashboard');
    }, 600);
  };

  const toggleAllergy = (allergy: string) => {
    if (allergy === 'None') {
      setAllergies(['None']);
      return;
    }
    const filtered = allergies.filter(a => a !== 'None');
    if (filtered.includes(allergy)) {
      const next = filtered.filter(a => a !== allergy);
      setAllergies(next.length ? next : ['None']);
    } else {
      setAllergies([...filtered, allergy]);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed relative">
      {/* Top Header */}
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,119,130,0.06)] border-b border-surface-container-high z-30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">dentistry</span>
            </div>
            <span className="font-headline font-bold text-xl text-primary">Smile Clinic</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-on-surface-variant text-xs font-medium bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-container-high">
              <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
              <span>HIPAA Compliant 256-Bit SSL</span>
            </div>
            <Link
              to="/support"
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">help_outline</span>
              <span>Support</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col w-full max-w-6xl mx-auto py-2 sm:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Hero/Context Panel (Desktop 4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-surface-container-high/60 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary-fixed/20 blur-2xl pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[28px] text-primary">dentistry</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Smile Network</span>
                    <span className="font-headline font-bold text-base sm:text-lg text-on-surface">Smile Clinic Portal</span>
                  </div>
                </div>

                <div className="space-y-1 mb-8">
                  <h1 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
                    Create Your Patient Account
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Access appointment scheduling, digital X-rays, treatment plans, and instant billing.
                  </p>
                </div>

                {/* Step Indicator (Vertical Navigation Experience) */}
                <div className="space-y-3 pt-1">
                  {/* Step 1 Item */}
                  <div className={`flex items-start gap-3 transition-opacity ${step === 1 ? 'opacity-100' : 'opacity-80'}`}>
                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                      step >= 1 ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {step > 1 ? <span className="material-symbols-outlined text-[16px]">check</span> : '1'}
                    </div>
                    <div className="min-w-0">
                      <span className={`text-xs font-bold block ${step === 1 ? 'text-primary' : 'text-on-surface'}`}>
                        Step 1: Personal Details
                      </span>
                      <span className="text-[11px] text-on-surface-variant block">Identity, contact, & credentials</span>
                    </div>
                  </div>

                  <div className={`h-6 w-0.5 ml-4 transition-colors ${step > 1 ? 'bg-primary' : 'bg-surface-container-high'}`}></div>

                  {/* Step 2 Item */}
                  <div className={`flex items-start gap-3 transition-opacity ${step === 2 ? 'opacity-100' : step > 2 ? 'opacity-80' : 'opacity-60'}`}>
                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                      step >= 2 ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {step > 2 ? <span className="material-symbols-outlined text-[16px]">check</span> : '2'}
                    </div>
                    <div className="min-w-0">
                      <span className={`text-xs font-bold block ${step === 2 ? 'text-primary' : 'text-on-surface'}`}>
                        Step 2: Dental History
                      </span>
                      <span className="text-[11px] text-on-surface-variant block">Prior records, allergies & coverage</span>
                    </div>
                  </div>

                  <div className={`h-6 w-0.5 ml-4 transition-colors ${step > 2 ? 'bg-primary' : 'bg-surface-container-high'}`}></div>

                  {/* Step 3 Item */}
                  <div className={`flex items-start gap-3 transition-opacity ${step === 3 ? 'opacity-100' : 'opacity-60'}`}>
                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                      step === 3 ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      3
                    </div>
                    <div className="min-w-0">
                      <span className={`text-xs font-bold block ${step === 3 ? 'text-primary' : 'text-on-surface'}`}>
                        Step 3: Security & Verification
                      </span>
                      <span className="text-[11px] text-on-surface-variant block">2-factor auth & electronic consent</span>
                    </div>
                  </div>
                </div>

                {/* Clinic Photo Accent (Desktop) */}
                <div className="hidden lg:block mt-8 rounded-xl overflow-hidden relative shadow-sm border border-surface-container-high">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzkdhELD1wZKp2_kTNJxIE8Qy1AQzlBGtzLar04x0Xq8Zn5CwCZu80v5B_waa-YhuM5G4rvhkqZto0K5sk8GZ4yvFoYM-PMYi0wGM8571FVoQAkgkeQXyZHjIT8Pu9e_YVCMmeH5zfCIAfvdnIj6BdKcSD0GIQQgLk05pwMRvHdtW-uH3rd4hIqa1ST0M4Dsme_JinopgmIWNnrZcBCqwVDI-o0iwNHK87gPv73y9hpsk42lg91dDB"
                    alt="Modern high-tech dental operatory clinic room"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <div className="flex items-center gap-1.5 text-white text-[11px] font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-teal-300">verified</span>
                      <span>Accepting 30+ premier health networks</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Assurance Box (Desktop) */}
              <div className="hidden lg:flex bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-container-high/60 items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0 border border-surface-container-high">
                  <span className="material-symbols-outlined text-[22px]">lock</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block mb-0.5">HIPAA Compliant Platform</span>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Your health data is protected by HIPAA compliant 256-bit encryption. Smile Clinic never shares or sells your medical records.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Form Workspace (Desktop 8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-surface-container-high/60">
                <AnimatePresence mode="wait">
                  {/* ==================== STEP 1: PERSONAL DETAILS ==================== */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Step Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2 border-b border-surface-container-high mb-6">
                        <div>
                          <h2 className="font-headline font-bold text-xl sm:text-2xl text-on-surface">Personal Information</h2>
                          <p className="text-xs text-on-surface-variant mt-0.5">Please provide your details as they appear on legal photo ID.</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary text-xs font-semibold bg-surface-container-low px-3 py-1 rounded-full self-start border border-surface-container-high">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span>Est. completion: 3 mins</span>
                        </div>
                      </div>

                      <form onSubmit={handleStep1Submit} className="space-y-5">
                        {/* Legal Names */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="firstName">
                              First Name <span className="text-error">*</span>
                            </label>
                            <input
                              id="firstName"
                              type="text"
                              required
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="e.g. Sarah"
                              className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="lastName">
                              Last Name <span className="text-error">*</span>
                            </label>
                            <input
                              id="lastName"
                              type="text"
                              required
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="e.g. Jenkins"
                              className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                          </div>
                        </div>

                        {/* Date of Birth & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="dob">
                              Date of Birth (DD / MM / YYYY) <span className="text-error">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <input
                                id="dob"
                                type="text"
                                required
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                placeholder="24 / 08 / 1994"
                                className="w-full h-11 px-4 pr-10 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                              />
                              <span className="material-symbols-outlined absolute right-3 text-on-surface-variant pointer-events-none text-[20px]">
                                calendar_today
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="phone">
                              Preferred Phone Number <span className="text-error">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <input
                                id="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(555) 349-8821"
                                className="w-full h-11 px-4 pr-10 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                              />
                              <span className="material-symbols-outlined absolute right-3 text-on-surface-variant pointer-events-none text-[20px]">
                                call
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="email">
                            Email Address <span className="text-error">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="sarah.jenkins@example.com"
                              className="w-full h-11 px-4 pr-10 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                            <span className="material-symbols-outlined absolute right-3 text-on-surface-variant pointer-events-none text-[20px]">
                              mail
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-1">
                            Used for appointment confirmations, clinical test results, and billing receipts.
                          </p>
                        </div>

                        {/* Password Creation & Dynamic Strength Indicator */}
                        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="password">
                              Create Secure Password <span className="text-error">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full h-11 px-4 pr-10 rounded-xl bg-surface-container-lowest text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:outline-none focus:border-primary transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Dynamic Password Check chips */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                            <div className={`flex items-center gap-1.5 transition-colors ${
                              hasMinLength ? 'text-teal-700 font-semibold' : 'text-on-surface-variant'
                            }`}>
                              <span className="material-symbols-outlined text-[16px]">
                                {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span>Min. 8 characters</span>
                            </div>
                            <div className={`flex items-center gap-1.5 transition-colors ${
                              hasUppercase ? 'text-teal-700 font-semibold' : 'text-on-surface-variant'
                            }`}>
                              <span className="material-symbols-outlined text-[16px]">
                                {hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span>1 uppercase letter</span>
                            </div>
                            <div className={`flex items-center gap-1.5 transition-colors ${
                              hasSymbol ? 'text-teal-700 font-semibold' : 'text-on-surface-variant'
                            }`}>
                              <span className="material-symbols-outlined text-[16px]">
                                {hasSymbol ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span>1 special symbol</span>
                            </div>
                          </div>
                        </div>

                        {/* Existing Patient Chart linking */}
                        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high space-y-2">
                          <label className="flex items-start gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isExistingPatient}
                              onChange={(e) => setIsExistingPatient(e.target.checked)}
                              className="w-5 h-5 rounded text-primary accent-primary mt-0.5 cursor-pointer"
                            />
                            <div>
                              <span className="text-xs sm:text-sm font-semibold text-on-surface block">
                                I am an existing Smile Clinic patient linking my clinic chart
                              </span>
                              <span className="text-[11px] text-on-surface-variant block">
                                Allows our clinic reception to automatically reconcile past diagnostic X-rays & treatments.
                              </span>
                            </div>
                          </label>

                          {isExistingPatient && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="pt-2 pl-7"
                            >
                              <label className="block text-xs font-semibold text-on-surface mb-1">
                                Existing Patient Chart # (optional)
                              </label>
                              <input
                                type="text"
                                value={chartNumber}
                                onChange={(e) => setChartNumber(e.target.value)}
                                placeholder="e.g. SC-84920"
                                className="w-full sm:w-72 h-10 px-3 rounded-lg bg-white border border-surface-container-high text-xs font-medium focus:outline-none focus:border-primary"
                              />
                              <span className="text-[10px] text-on-surface-variant block mt-1">
                                Found on previous physical receipts or appointment reminder cards.
                              </span>
                            </motion.div>
                          )}
                        </div>

                        {/* Primary Dental Insurance Provider */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="insuranceProvider">
                            Primary Dental Insurance Provider <span className="text-error">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="insuranceProvider"
                              required
                              value={insuranceProvider}
                              onChange={(e) => setInsuranceProvider(e.target.value)}
                              className="w-full h-11 px-4 pr-10 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:outline-none focus:border-primary appearance-none cursor-pointer"
                            >
                              <option value="delta">Delta Dental Premier / PPO</option>
                              <option value="metlife">MetLife Dental</option>
                              <option value="cigna">Cigna Dental Network</option>
                              <option value="aetna">Aetna Dental Advantage</option>
                              <option value="guardian">Guardian DentalGuard</option>
                              <option value="humana">Humana Dental Coverage</option>
                              <option value="united">UnitedHealthcare Dental</option>
                              <option value="selfpay">Self-Pay / Smile Clinic Membership Plan (No Insurance)</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[20px]">
                              expand_more
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-1">
                            You will have the option to review full coverage and member IDs in Step 2.
                          </p>
                        </div>

                        {/* Consents */}
                        <div className="space-y-2 pt-1">
                          <label className="flex items-start gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              required
                              checked={agreedTerms}
                              onChange={(e) => setAgreedTerms(e.target.checked)}
                              className="w-5 h-5 rounded text-primary accent-primary mt-0.5 cursor-pointer"
                            />
                            <span className="text-xs text-on-surface">
                              I agree to the <Link to="/terms-of-service" target="_blank" className="text-primary hover:underline font-semibold">Terms of Service</Link> and acknowledge the <Link to="/privacy-policy" target="_blank" className="text-primary hover:underline font-semibold">HIPAA Notice of Privacy Practices</Link>. <span className="text-error">*</span>
                            </span>
                          </label>
                          <label className="flex items-start gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={receiveSms}
                              onChange={(e) => setReceiveSms(e.target.checked)}
                              className="w-5 h-5 rounded text-primary accent-primary mt-0.5 cursor-pointer"
                            />
                            <span className="text-xs text-on-surface">
                              Receive SMS appointment notifications, cleaning reminders, and immediate schedule updates.
                            </span>
                          </label>
                        </div>

                        {/* Action CTA */}
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-container-high">
                          <button
                            type="submit"
                            className="w-full sm:w-auto px-8 h-12 bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-primary/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Continue to Dental History</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
                          <div className="text-xs text-on-surface-variant flex items-center gap-1.5">
                            <span>Already have an account?</span>
                            <Link to="/login" className="text-primary font-bold hover:underline">
                              Sign in
                            </Link>
                          </div>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* ==================== STEP 2: DENTAL HISTORY ==================== */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2 border-b border-surface-container-high mb-6">
                        <div>
                          <h2 className="font-headline font-bold text-xl sm:text-2xl text-on-surface">Dental History & Coverage</h2>
                          <p className="text-xs text-on-surface-variant mt-0.5">Help our dental doctors tailor your clinical intake and examinations.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary self-start">
                          Step 2 of 3
                        </span>
                      </div>

                      <form onSubmit={handleStep2Submit} className="space-y-5">
                        {/* Primary Reason for Visit */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider text-outline">
                            Primary Reason for Visiting Smile Clinic
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {[
                              'Routine Cleaning & Comprehensive Exam',
                              'Toothache / Cavity / Immediate Discomfort',
                              'Orthodontics & Clear Aligners Consultation',
                              'Cosmetic Teeth Whitening & Veneers',
                              'Dental Crown, Bridge or Implant Assessment'
                            ].map((reason) => (
                              <button
                                key={reason}
                                type="button"
                                onClick={() => setVisitReason(reason)}
                                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                  visitReason === reason
                                    ? 'bg-primary text-white border-primary shadow-xs'
                                    : 'bg-surface-container-low border-surface-container-high text-on-surface hover:bg-surface-container'
                                }`}
                              >
                                <span>{reason}</span>
                                {visitReason === reason && (
                                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Last Dental Visit */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider text-outline">
                            When was your last dental hygiene visit or cleaning?
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              'Within 6 months',
                              '6–12 months ago',
                              '1–2 years ago',
                              'More than 2 years'
                            ].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setLastVisit(option)}
                                className={`py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                                  lastVisit === option
                                    ? 'bg-primary text-white border-primary shadow-xs'
                                    : 'bg-surface-container-low border-surface-container-high text-on-surface hover:bg-surface-container'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Insurance Member ID */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">
                            Insurance Member / Subscriber ID
                          </label>
                          <input
                            type="text"
                            required
                            value={insuranceMemberId}
                            onChange={(e) => setInsuranceMemberId(e.target.value)}
                            placeholder="e.g. DD-8849-209"
                            className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                          />
                        </div>

                        {/* Known Allergies */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider text-outline">
                            Known Medical Allergies & Sensitivity
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['None', 'Penicillin', 'Latex', 'Local Anesthetics / Lidocaine', 'Sulfa Drugs', 'Codeine', 'Aspirin'].map((item) => {
                              const active = allergies.includes(item);
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleAllergy(item)}
                                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                                    active
                                      ? 'bg-primary text-white border-primary shadow-xs'
                                      : 'bg-surface-container-low text-on-surface border-surface-container-high hover:bg-surface-container'
                                  }`}
                                >
                                  {active && <span className="material-symbols-outlined text-[14px]">check</span>}
                                  <span>{item}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-4 flex items-center justify-between gap-4 border-t border-surface-container-high">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-5 h-11 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold hover:bg-surface-container border border-surface-container-high cursor-pointer flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            <span>Back</span>
                          </button>
                          <button
                            type="submit"
                            className="px-8 h-12 bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <span>Continue to Verification</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* ==================== STEP 3: SECURITY & VERIFICATION ==================== */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2 border-b border-surface-container-high mb-6">
                        <div>
                          <h2 className="font-headline font-bold text-xl sm:text-2xl text-on-surface">Security & Electronic Consent</h2>
                          <p className="text-xs text-on-surface-variant mt-0.5">Finalize two-factor credentials and authorized digital signatures.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start">
                          Step 3 of 3
                        </span>
                      </div>

                      <form onSubmit={handleFinalSubmit} className="space-y-5">
                        {/* 2FA Preference */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider text-outline">
                            Two-Factor Authentication (2FA) Channel
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label
                              onClick={() => setTwoFactorMethod('sms')}
                              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                twoFactorMethod === 'sms'
                                  ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                  : 'bg-surface-container-low border-surface-container-high'
                              }`}
                            >
                              <span className="material-symbols-outlined text-primary text-[22px]">sms</span>
                              <div>
                                <span className="font-bold text-xs sm:text-sm text-on-surface block">SMS One-Time Passcode</span>
                                <span className="text-[11px] text-on-surface-variant block mt-0.5">Secure SMS code sent to {phone}</span>
                              </div>
                            </label>

                            <label
                              onClick={() => setTwoFactorMethod('app')}
                              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                twoFactorMethod === 'app'
                                  ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                  : 'bg-surface-container-low border-surface-container-high'
                              }`}
                            >
                              <span className="material-symbols-outlined text-primary text-[22px]">lock_clock</span>
                              <div>
                                <span className="font-bold text-xs sm:text-sm text-on-surface block">Authenticator App (TOTP)</span>
                                <span className="text-[11px] text-on-surface-variant block mt-0.5">Google Authenticator or 1Password passkey</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Preferred Dental Branch */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">
                            Primary Smile Clinic Location
                          </label>
                          <select
                            value={preferredBranch}
                            onChange={(e) => setPreferredBranch(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                          >
                            <option value="Downtown Main Pavilion (100 Smile Way)">Downtown Main Pavilion (100 Smile Way)</option>
                            <option value="Northside Specialty & Pediatric Clinic">Northside Specialty & Pediatric Clinic</option>
                            <option value="Metro Dental Implant & Surgery Suite">Metro Dental Implant & Surgery Suite</option>
                          </select>
                        </div>

                        {/* Electronic Signature */}
                        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high space-y-2">
                          <label className="block text-xs font-bold text-on-surface">
                            Electronic Digital Consent Signature
                          </label>
                          <input
                            type="text"
                            required
                            value={electronicSignature}
                            onChange={(e) => setElectronicSignature(e.target.value)}
                            placeholder="Type your full legal name"
                            className="w-full h-11 px-4 rounded-xl bg-white text-on-surface text-xs sm:text-sm font-semibold border border-surface-container-high focus:outline-none focus:border-primary font-serif tracking-wide"
                          />
                          <p className="text-[11px] text-on-surface-variant">
                            By typing your full legal name, you authorize Smile Clinic to maintain your electronic health records and diagnostic charts under HIPAA guidelines.
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-4 flex items-center justify-between gap-4 border-t border-surface-container-high">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="px-5 h-11 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold hover:bg-surface-container border border-surface-container-high cursor-pointer flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            <span>Back</span>
                          </button>

                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 h-12 bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-primary/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                          >
                            {isLoading ? (
                              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <>
                                <span>Complete Registration & Enter Portal</span>
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-4 border-t border-surface-container-high shadow-[0_-1px_8px_rgba(0,119,130,0.03)] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant text-xs text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">shield_with_heart</span>
            <span>© 2026 Smile Clinic Health System. All health records encrypted.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 text-[11px] font-medium">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/patient-rights" className="hover:text-primary transition-colors">Patient Rights</Link>
            <Link to="/support" className="hover:text-primary transition-colors">Support Desk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
