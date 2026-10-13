import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Signup() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isExistingPatient, setIsExistingPatient] = useState(false);
  const [chartNumber, setChartNumber] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('delta');
  const [insuranceMemberId, setInsuranceMemberId] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Step 2 Fields
  const [visitReason, setVisitReason] = useState('Routine Cleaning & Comprehensive Exam');
  const [allergies, setAllergies] = useState<string[]>(['None']);

  // Step 3 Fields (Dual OTP Verification)
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mockEmailOtp, setMockEmailOtp] = useState('482910');
  const [mockMobileOtp, setMockMobileOtp] = useState('739154');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [preferredBranch, setPreferredBranch] = useState('Downtown Main Pavilion (100 Smile Way)');
  const [electronicSignature, setElectronicSignature] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Strict Password Criteria
  const hasMinLength = password.length >= 8;
  const isRecommended12 = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const numberCount = (password.match(/\d/g) || []).length;
  const hasMin2Numbers = numberCount >= 2;
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isPasswordValid = hasMinLength && hasUppercase && hasMin2Numbers && hasSymbol;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Error(null);

    if (!isPasswordValid) {
      setStep1Error(
        'Password must satisfy all criteria: 8-12+ characters, 1 uppercase letter, 2 numbers, and 1 special symbol.'
      );
      return;
    }

    if (!passwordsMatch) {
      setStep1Error('Passwords do not match. Please verify your confirm password.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setStep1Error('Please enter a valid 10-digit mobile phone number for SMS OTP verification.');
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate fresh OTP codes for Step 3
    const newEmail = Math.floor(100000 + Math.random() * 900000).toString();
    const newMobile = Math.floor(100000 + Math.random() * 900000).toString();
    setMockEmailOtp(newEmail);
    setMockMobileOtp(newMobile);
    setEmailOtp('');
    setMobileOtp('');
    setOtpError(null);
    if (!electronicSignature) {
      setElectronicSignature(`${firstName} ${lastName}`.trim());
    }
    setStep(3);
  };

  const handleAutoFillOtp = () => {
    setEmailOtp(mockEmailOtp);
    setMobileOtp(mockMobileOtp);
    setOtpError(null);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (emailOtp.trim() !== mockEmailOtp) {
      setOtpError('Invalid Email OTP code. Please enter the matching 6-digit code or click Auto-fill.');
      return;
    }

    if (mobileOtp.trim() !== mockMobileOtp) {
      setOtpError('Invalid Mobile SMS OTP code. Please enter the matching 6-digit code or click Auto-fill.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Save patient to localStorage
      const existing = JSON.parse(localStorage.getItem('smileclinic_registered_patients') || '[]');
      const newPatient = {
        name: `${firstName} ${lastName}`.trim(),
        email: email.trim(),
        phone: phone.trim(),
        dob,
        insuranceProvider,
        insuranceMemberId,
        password,
        registeredAt: new Date().toISOString(),
      };
      existing.push(newPatient);
      localStorage.setItem('smileclinic_registered_patients', JSON.stringify(existing));

      localStorage.setItem('smileclinic_patient_auth', 'true');
      localStorage.setItem('patient_email', newPatient.email);
      localStorage.setItem('patient_name', newPatient.name);

      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  const toggleAllergy = (allergy: string) => {
    if (allergy === 'None') {
      setAllergies(['None']);
      return;
    }
    const filtered = allergies.filter((a) => a !== 'None');
    if (filtered.includes(allergy)) {
      const next = filtered.filter((a) => a !== allergy);
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
            
            {/* Left Hero/Context Panel */}
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

                {/* Step Indicator */}
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
                      <span className="text-[11px] text-on-surface-variant block">Identity, mobile &amp; secure credentials</span>
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
                      <span className="text-[11px] text-on-surface-variant block">Prior records, allergies &amp; coverage</span>
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
                        Step 3: Dual OTP Verification
                      </span>
                      <span className="text-[11px] text-on-surface-variant block">Email &amp; Mobile SMS authentication</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-surface-container-high text-xs text-on-surface-variant">
                  <span>Already registered? </span>
                  <Link to="/" className="text-primary font-bold hover:underline">
                    Sign In to Portal
                  </Link>
                </div>
              </div>

              {/* Trust Assurance Box */}
              <div className="hidden lg:flex bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-container-high/60 items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0 border border-surface-container-high">
                  <span className="material-symbols-outlined text-[22px]">lock</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block mb-0.5">HIPAA Compliant Platform</span>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Your health data is protected by HIPAA compliant 256-bit encryption. Dual OTP verifies patient identity.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Form Workspace */}
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
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2 border-b border-surface-container-high mb-6">
                        <div>
                          <h2 className="font-headline font-bold text-xl sm:text-2xl text-on-surface">Personal Information</h2>
                          <p className="text-xs text-on-surface-variant mt-0.5">Please provide your details as they appear on legal photo ID.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary self-start border border-primary/20">
                          Step 1 of 3
                        </span>
                      </div>

                      {step1Error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                          <span className="material-symbols-outlined text-[18px] shrink-0 text-red-600">error</span>
                          <span>{step1Error}</span>
                        </div>
                      )}

                      <form onSubmit={handleStep1Submit} className="space-y-4">
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

                        {/* DOB and Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="dob">
                              Date of Birth <span className="text-error">*</span>
                            </label>
                            <input
                              id="dob"
                              type="text"
                              required
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              placeholder="DD / MM / YYYY"
                              className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="phone">
                              Mobile Phone (For SMS OTP) <span className="text-error">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <input
                                id="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 (555) 349-8821"
                                className="w-full h-11 px-4 pr-10 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                              />
                              <span className="material-symbols-outlined absolute right-3 text-on-surface-variant pointer-events-none text-[20px]">
                                phone_iphone
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="email">
                            Email Address (For Email OTP) <span className="text-error">*</span>
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
                        </div>

                        {/* Password and Confirm Password with Eye Icons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="password">
                              Create Password (Min 8-12 chars) <span className="text-error">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="e.g. Jenkins@Smile2026#"
                                className="w-full h-11 px-4 pr-10 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:bg-white focus:outline-none focus:border-primary transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                title={showPassword ? 'Hide password' : 'Show password'}
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="confirmPassword">
                              Confirm Password <span className="text-error">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                className="w-full h-11 px-4 pr-10 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:bg-white focus:outline-none focus:border-primary transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Real-Time Password Criteria Checklist */}
                        <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high text-[11px] space-y-1">
                          <span className="font-bold text-on-surface-variant uppercase text-[10px] block">
                            Password Criteria:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-teal-700 font-bold' : 'text-on-surface-variant'}`}>
                              <span className="material-symbols-outlined text-[16px]">
                                {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span>8–12+ Characters ({password.length}/12)</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-teal-700 font-bold' : 'text-on-surface-variant'}`}>
                              <span className="material-symbols-outlined text-[16px]">
                                {hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span>1+ Uppercase Letter (A-Z)</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${hasMin2Numbers ? 'text-teal-700 font-bold' : 'text-on-surface-variant'}`}>
                              <span className="material-symbols-outlined text-[16px]">
                                {hasMin2Numbers ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span>2+ Numbers (Found {numberCount})</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${hasSymbol ? 'text-teal-700 font-bold' : 'text-on-surface-variant'}`}>
                              <span className="material-symbols-outlined text-[16px]">
                                {hasSymbol ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span>1+ Special Symbol (!@#$%...)</span>
                            </div>
                            <div className={`flex items-center gap-1.5 sm:col-span-2 ${passwordsMatch ? 'text-teal-700 font-bold' : 'text-on-surface-variant'}`}>
                              <span className="material-symbols-outlined text-[16px]">
                                {passwordsMatch ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                              <span>
                                {passwordsMatch
                                  ? 'Passwords Match Perfectly'
                                  : confirmPassword.length > 0
                                  ? 'Passwords Do Not Match'
                                  : 'Confirm Password Required'}
                              </span>
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
                                Allows our clinic reception to automatically reconcile past diagnostic X-rays &amp; treatments.
                              </span>
                            </div>
                          </label>

                          {isExistingPatient && (
                            <div className="pt-2 pl-7">
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
                            </div>
                          )}
                        </div>

                        {/* Primary Dental Insurance Provider */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="insuranceProvider">
                            Primary Dental Insurance Provider <span className="text-error">*</span>
                          </label>
                          <select
                            id="insuranceProvider"
                            required
                            value={insuranceProvider}
                            onChange={(e) => setInsuranceProvider(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:outline-none focus:border-primary cursor-pointer"
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
                        </div>

                        {/* Terms checkbox */}
                        <div className="pt-1">
                          <label className="flex items-start gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              required
                              checked={agreedTerms}
                              onChange={(e) => setAgreedTerms(e.target.checked)}
                              className="w-5 h-5 rounded text-primary accent-primary mt-0.5 cursor-pointer"
                            />
                            <span className="text-xs text-on-surface">
                              I certify that all details provided are true and accurate. I consent to Smile Clinic&apos;s{' '}
                              <Link to="/terms-of-service" className="text-primary font-semibold hover:underline">
                                Terms of Service
                              </Link>{' '}
                              and dual Email &amp; Mobile OTP verification.
                            </span>
                          </label>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button
                            type="submit"
                            className="px-8 h-12 bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <span>Continue to Dental History</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
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
                          <h2 className="font-headline font-bold text-xl sm:text-2xl text-on-surface">Dental Background &amp; Coverage</h2>
                          <p className="text-xs text-on-surface-variant mt-0.5">Help your dental physician prepare your preliminary clinical chart.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary self-start border border-primary/20">
                          Step 2 of 3
                        </span>
                      </div>

                      <form onSubmit={handleStep2Submit} className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">
                            Primary Reason for Initial Consultation <span className="text-error">*</span>
                          </label>
                          <select
                            value={visitReason}
                            onChange={(e) => setVisitReason(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                          >
                            <option>Routine Cleaning &amp; Comprehensive Exam</option>
                            <option>Toothache, Sensitivity or Dental Emergency</option>
                            <option>Cosmetic Whitening or Veneers Consultation</option>
                            <option>Orthodontics / Clear Aligners Assessment</option>
                            <option>Dental Implant or Tooth Replacement</option>
                            <option>Periodontal / Gum Care Therapy</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">
                            Insurance Member / Subscriber ID
                          </label>
                          <input
                            type="text"
                            value={insuranceMemberId}
                            onChange={(e) => setInsuranceMemberId(e.target.value)}
                            placeholder="e.g. DD-8849-209"
                            className="w-full h-11 px-4 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                          />
                        </div>

                        {/* Known Allergies */}
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider text-outline">
                            Known Medical Allergies &amp; Sensitivity
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
                            <span>Continue to OTP Verification</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* ==================== STEP 3: SECURITY & DUAL OTP VERIFICATION ==================== */}
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
                          <h2 className="font-headline font-bold text-xl sm:text-2xl text-on-surface">Dual OTP Verification &amp; Activation</h2>
                          <p className="text-xs text-on-surface-variant mt-0.5">Enter the verification codes dispatched to your email and mobile phone.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start">
                          Step 3 of 3
                        </span>
                      </div>

                      {/* Demo Notification Banner with One-Click Autofill */}
                      <div className="mb-5 p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                            <span className="material-symbols-outlined text-[18px] text-amber-500">auto_awesome</span>
                            <span>Simulated Dispatch Verification (Demo)</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAutoFillOtp}
                            className="text-xs font-bold text-primary bg-surface px-3 py-1 rounded-lg border border-primary/30 hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            Auto-Fill Both Codes
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                          <div className="bg-surface p-2.5 rounded-lg border border-surface-container-high">
                            <span className="text-[10px] uppercase block text-outline font-sans font-semibold">
                              Email OTP Sent to ({email || 'sarah@example.com'})
                            </span>
                            <span className="text-base font-bold text-on-surface">{mockEmailOtp}</span>
                          </div>
                          <div className="bg-surface p-2.5 rounded-lg border border-surface-container-high">
                            <span className="text-[10px] uppercase block text-outline font-sans font-semibold">
                              Mobile SMS OTP ({phone.slice(-4) || '8821'})
                            </span>
                            <span className="text-base font-bold text-on-surface">{mockMobileOtp}</span>
                          </div>
                        </div>
                      </div>

                      {otpError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                          <span className="material-symbols-outlined text-[18px] shrink-0 text-red-600">error</span>
                          <span>{otpError}</span>
                        </div>
                      )}

                      <form onSubmit={handleFinalSubmit} className="space-y-4">
                        {/* Dual OTP Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1">
                              1. Email 6-Digit Code *
                            </label>
                            <div className="relative flex items-center">
                              <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                                mail
                              </span>
                              <input
                                type="text"
                                maxLength={6}
                                required
                                value={emailOtp}
                                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="e.g. 482910"
                                className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm font-mono tracking-widest text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1">
                              2. Mobile SMS 6-Digit Code *
                            </label>
                            <div className="relative flex items-center">
                              <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">
                                phone_iphone
                              </span>
                              <input
                                type="text"
                                maxLength={6}
                                required
                                value={mobileOtp}
                                onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="e.g. 739154"
                                className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm font-mono tracking-widest text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
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
                            <option value="Northside Specialty & Pediatric Clinic">Northside Specialty &amp; Pediatric Clinic</option>
                            <option value="Metro Dental Implant & Surgery Suite">Metro Dental Implant &amp; Surgery Suite</option>
                          </select>
                        </div>

                        {/* Electronic Signature */}
                        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high space-y-2">
                          <label className="block text-xs font-bold text-on-surface">
                            Electronic Digital Consent Signature *
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
                            By signing, you authorize Smile Clinic to maintain your electronic health records under HIPAA guidelines.
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
                            className="px-8 h-12 bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-primary/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {isLoading ? (
                              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <>
                                <span>Verify OTPs &amp; Enter Portal</span>
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
            <span>&copy; 2026 Smile Clinic Health System. All health records encrypted.</span>
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
