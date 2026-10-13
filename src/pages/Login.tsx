import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Official Patient Credentials
export const OFFICIAL_PATIENT_CREDENTIALS = {
  email: 'patient@smileclinic.com',
  patientId: 'PT-84920',
  password: 'Patient@Smile2026#',
  name: 'Sarah Jenkins',
};

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fillOfficialCredentials = () => {
    setIdentifier(OFFICIAL_PATIENT_CREDENTIALS.email);
    setPassword(OFFICIAL_PATIENT_CREDENTIALS.password);
    setLoginError(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const inputId = identifier.trim().toLowerCase();
    const inputPass = password;

    const isOfficial =
      (inputId === OFFICIAL_PATIENT_CREDENTIALS.email.toLowerCase() ||
        inputId === OFFICIAL_PATIENT_CREDENTIALS.patientId.toLowerCase()) &&
      inputPass === OFFICIAL_PATIENT_CREDENTIALS.password;

    const registeredPatients = JSON.parse(localStorage.getItem('smileclinic_registered_patients') || '[]');
    const registered = registeredPatients.find(
      (p: any) =>
        (p.email.toLowerCase() === inputId || (p.phone && p.phone.replace(/\D/g, '') === inputId.replace(/\D/g, ''))) &&
        p.password === inputPass
    );

    if (isOfficial || registered) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('smileclinic_patient_auth', 'true');
        localStorage.setItem('patient_email', isOfficial ? OFFICIAL_PATIENT_CREDENTIALS.email : registered.email);
        localStorage.setItem('patient_name', isOfficial ? OFFICIAL_PATIENT_CREDENTIALS.name : registered.name);
        navigate('/dashboard');
      }, 400);
    } else {
      setLoginError(
        'Invalid credentials. Please enter the official Patient credentials (patient@smileclinic.com / Patient@Smile2026#) or your registered patient account.'
      );
    }
  };

  const handleSocialLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('smileclinic_patient_auth', 'true');
      navigate('/dashboard');
    }, 350);
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

      {/* Main Login Viewport */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col w-full max-w-6xl mx-auto py-2 sm:py-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative w-full rounded-2xl overflow-hidden bg-surface-container-lowest shadow-xl border border-surface-container-high/60 flex flex-col lg:flex-row min-h-[640px]"
          >
            {/* Left: Form Area (7 cols on desktop) */}
            <div className="w-full lg:w-7/12 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative z-10">
              <div className="w-full max-w-md mx-auto">
                {/* Brand Pill */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[28px] text-primary">dentistry</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-lg text-primary">Smile Clinic</span>
                      <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Patient Portal
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">Confidential Electronic Health Records</p>
                  </div>
                </div>

                {/* Hero Title */}
                <div className="mb-4">
                  <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface mb-1">
                    Welcome to your Patient Portal
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Access your treatment timeline, dental radiographs, and upcoming appointments.
                  </p>
                </div>

                {/* Official Patient Credentials Helper Card */}
                <div className="mb-4 p-3.5 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-bold text-primary block">Official Patient Credentials</span>
                    <div className="text-on-surface-variant font-mono text-[11px] mt-0.5">
                      <span className="font-semibold text-on-surface">{OFFICIAL_PATIENT_CREDENTIALS.email}</span> &bull; Pass:{' '}
                      <span className="bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface font-bold">
                        {OFFICIAL_PATIENT_CREDENTIALS.password}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={fillOfficialCredentials}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                    <span>Quick Fill</span>
                  </button>
                </div>

                {loginError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] shrink-0 text-red-600">error</span>
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="patient-id">
                      Email Address or Patient ID *
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                        badge
                      </span>
                      <input
                        id="patient-id"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          setLoginError(null);
                        }}
                        placeholder="patient@smileclinic.com or PT-84920"
                        className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low rounded-xl text-xs sm:text-sm font-medium text-on-surface placeholder:text-outline border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-on-surface" htmlFor="portal-password">
                        Password *
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-xs font-semibold text-primary hover:text-primary-container transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                        lock
                      </span>
                      <input
                        id="portal-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setLoginError(null);
                        }}
                        placeholder="Patient@Smile2026#"
                        className="w-full pl-11 pr-11 py-2.5 bg-surface-container-low rounded-xl text-xs sm:text-sm font-medium text-on-surface placeholder:text-outline border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-outline hover:text-on-surface transition-colors p-1 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                      />
                      <span className="text-xs text-on-surface-variant font-medium">Remember this device</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSocialLogin}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-container transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                      <span>Use Passkey</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-container text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:shadow-lg transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">lock_open</span>
                        <span>Sign In to Portal</span>
                      </>
                    )}
                  </button>

                  <div className="relative flex items-center justify-center my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full bg-surface-container-high h-[1px]"></div>
                    </div>
                    <span className="relative px-3 bg-surface-container-lowest text-[11px] font-bold text-outline uppercase tracking-wider">
                      or sign in with
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleSocialLogin}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold transition-colors border border-surface-container-high shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-teal-600">health_and_safety</span>
                      <span>Verified Health ID</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSocialLogin}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold transition-colors border border-surface-container-high shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">security</span>
                      <span>NHS / SmartID</span>
                    </button>
                  </div>
                </form>

                {/* Sign up prompt */}
                <div className="mt-6 pt-5 border-t border-surface-container-high text-center">
                  <p className="text-xs text-on-surface-variant">
                    New patient to Smile Clinic?{' '}
                    <Link to="/signup" className="font-bold text-primary hover:underline">
                      Create Patient Account &rarr;
                    </Link>
                  </p>
                </div>
              </div>

              {/* Security info footer */}
              <div className="pt-6 border-t border-surface-container-high/60 flex items-center justify-between text-[11px] text-outline">
                <span>Smile Clinic EHR Network &bull; v2026.4</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Server Online
                </span>
              </div>
            </div>

            {/* Right: Pitch Visual (5 cols on desktop) */}
            <div className="hidden lg:flex w-full lg:w-5/12 bg-gradient-to-br from-primary to-[#004f58] p-10 text-white flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-6 border border-white/20">
                  <span className="material-symbols-outlined text-[16px] text-teal-300">verified</span>
                  <span>Patient-Centered Dentistry</span>
                </div>

                <h2 className="font-headline font-bold text-3xl mb-4 leading-tight">
                  Your complete dental health in one secure place.
                </h2>
                <p className="text-white/80 text-sm leading-relaxed mb-6 font-light">
                  View high-resolution 3D radiographic scans, treatment schedules, transparent billing breakdown, and message your dental care team directly.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px] text-teal-200">calendar_month</span>
                    </div>
                    <span>Instant Real-Time Appointment Booking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px] text-teal-200">receipt_long</span>
                    </div>
                    <span>Transparent Treatment Estimates &amp; Insurance</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px] text-teal-200">sms</span>
                    </div>
                    <span>Dual Email &amp; Mobile Phone OTP Verification</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    4.9
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">Top-Rated Dental Network</div>
                    <div className="text-white/70">Over 18,000 verified 5-star patient reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high py-4 text-center text-xs text-outline">
        <p>&copy; 2026 Smile Clinic Healthcare Systems Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
