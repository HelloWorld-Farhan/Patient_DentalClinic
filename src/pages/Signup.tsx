import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('Delta Dental');
  const [policyNumber, setPolicyNumber] = useState('');
  const [allergies, setAllergies] = useState('None');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 500);
    }
  };

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Top Header */}
      <header className="w-full bg-white/80 backdrop-blur-xl border-b border-surface-container-high shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">dentistry</span>
            </div>
            <span className="font-headline font-bold text-xl text-primary">Smile Clinic</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant hidden sm:inline">Already registered?</span>
            <Link
              to="/login"
              className="text-xs font-bold text-primary px-3 py-1.5 rounded-lg border border-primary/30 hover:bg-primary-tint/30 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]"
        >
          {/* Left Context & Progress Column (4 cols) */}
          <div className="lg:col-span-4 bg-surface-container-low p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-surface-container-high">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">person_add</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Patient Network</span>
                  <span className="font-headline font-bold text-base text-on-surface">Smile Clinic Portal</span>
                </div>
              </div>

              <h1 className="font-headline font-bold text-2xl text-on-surface mb-2">
                Create Your Patient Account
              </h1>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-8">
                Access online appointment scheduling, digital 3D X-rays, treatment plans, and instant billing.
              </p>

              {/* Step Indicators */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    step >= 1 ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {step > 1 ? <span className="material-symbols-outlined text-[16px]">check</span> : '1'}
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${step === 1 ? 'text-primary' : 'text-on-surface'}`}>
                      Step 1: Personal Details
                    </span>
                    <span className="text-[11px] text-on-surface-variant">Identity, contact, credentials</span>
                  </div>
                </div>

                <div className="h-4 w-0.5 bg-surface-container-high ml-4"></div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    step >= 2 ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {step > 2 ? <span className="material-symbols-outlined text-[16px]">check</span> : '2'}
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${step === 2 ? 'text-primary' : 'text-on-surface'}`}>
                      Step 2: Dental History & Insurance
                    </span>
                    <span className="text-[11px] text-on-surface-variant">Policy, allergies, coverage</span>
                  </div>
                </div>

                <div className="h-4 w-0.5 bg-surface-container-high ml-4"></div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    step >= 3 ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    3
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${step === 3 ? 'text-primary' : 'text-on-surface'}`}>
                      Step 3: Verification & Consent
                    </span>
                    <span className="text-[11px] text-on-surface-variant">Security verification, consent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-8 pt-6 border-t border-surface-container-high flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
              <div>
                <span className="text-xs font-bold text-on-surface block">HIPAA Compliant Platform</span>
                <span className="text-[10px] text-on-surface-variant leading-tight block">
                  All personal health information is protected by 256-bit encryption.
                </span>
              </div>
            </div>
          </div>

          {/* Right Form Area (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                    <div>
                      <h2 className="text-lg font-bold text-on-surface">Personal Information</h2>
                      <p className="text-xs text-on-surface-variant">Please provide your details as they appear on photo ID.</p>
                    </div>
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      Step 1 of 3
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Ananya"
                        className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Verma"
                        className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">Date of Birth (DD/MM/YYYY) *</label>
                      <input
                        type="text"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder="24 / 08 / 1994"
                        className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 349-8821"
                        className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ananya.verma@example.com"
                      className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Create Secure Password *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                    />

                    {/* Real-time rules */}
                    <div className="flex flex-wrap gap-3 mt-2 text-[11px]">
                      <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-outline'}`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        8+ characters
                      </span>
                      <span className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-600 font-semibold' : 'text-outline'}`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        1 uppercase letter
                      </span>
                      <span className={`flex items-center gap-1 ${hasSymbol ? 'text-emerald-600 font-semibold' : 'text-outline'}`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {hasSymbol ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        1 special symbol
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Dental History */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                    <div>
                      <h2 className="text-lg font-bold text-on-surface">Dental History & Coverage</h2>
                      <p className="text-xs text-on-surface-variant">Helps us coordinate insurance billing and safety precautions.</p>
                    </div>
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      Step 2 of 3
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">Primary Dental Insurance</label>
                      <select
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                      >
                        <option value="Delta Dental">Delta Dental Premier</option>
                        <option value="Cigna Dental">Cigna Dental Care</option>
                        <option value="MetLife">MetLife Dental PDP Plus</option>
                        <option value="Guardian">Guardian Direct Dental</option>
                        <option value="Self-Pay">Self-Pay / Smile Clinic Membership</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">Policy / Member ID</label>
                      <input
                        type="text"
                        value={policyNumber}
                        onChange={(e) => setPolicyNumber(e.target.value)}
                        placeholder="DD-8849-209"
                        className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Known Drug Allergies or Medical Alerts</label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g. Penicillin, Latex, None"
                      className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-xs text-primary leading-relaxed">
                    💡 <strong>Smile Clinic Care Guarantee:</strong> We coordinate directly with 30+ major dental insurers so you only pay your eligible copay.
                  </div>
                </div>
              )}

              {/* STEP 3: Verification & Consent */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                    <div>
                      <h2 className="text-lg font-bold text-on-surface">Security & Verification</h2>
                      <p className="text-xs text-on-surface-variant">Final step to activate your electronic patient record.</p>
                    </div>
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      Step 3 of 3
                    </span>
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-on-surface">Verification Phone:</span>
                      <span className="font-mono text-primary font-bold">{phone || '(555) 349-8821'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-on-surface">Registered Email:</span>
                      <span className="font-mono text-primary font-bold">{email || 'ananya.verma@example.com'}</span>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl cursor-pointer select-none border border-surface-container-high">
                    <input
                      type="checkbox"
                      required
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                    />
                    <span className="text-xs text-on-surface-variant leading-relaxed">
                      I agree to the <strong>Smile Clinic Terms of Service</strong>, HIPAA Electronic Health Records policy, and consent to receive digital treatment notes and appointment SMS reminders.
                    </span>
                  </label>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-surface-container-high">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>{step === 3 ? 'Activate Patient Account' : 'Continue'}</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-surface-container-high py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">shield_with_heart</span>
            <span>© 2026 Smile Clinic Health System. All health records encrypted.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Patient Rights</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
