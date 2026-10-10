import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [identifier, setIdentifier] = useState('ananya.verma@smileclinic.com');
  const [password, setPassword] = useState('DentalCare2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  const handleSocialLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
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
            <a
              href="tel:5552345678"
              className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">help_outline</span>
              <span>Support</span>
            </a>
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
                <div className="flex items-center gap-3 mb-6">
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
                <div className="mb-6">
                  <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface mb-1">
                    Welcome to your Patient Portal
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Access your treatment timeline, dental radiographs, and upcoming appointments.
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="patient-id">
                      Email Address or Patient ID
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
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="name@example.com or PT-84920"
                        className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low rounded-xl text-xs sm:text-sm font-medium text-on-surface placeholder:text-outline border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-on-surface" htmlFor="portal-password">
                        Password
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
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-11 pr-11 py-2.5 bg-surface-container-low rounded-xl text-xs sm:text-sm font-medium text-on-surface placeholder:text-outline border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-outline hover:text-on-surface transition-colors p-1 cursor-pointer"
                        aria-label="Toggle password visibility"
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

                <div className="mt-6 text-center pt-2">
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    New patient?{' '}
                    <Link
                      to="/signup"
                      className="font-bold text-primary hover:text-primary-container transition-colors underline decoration-secondary-container underline-offset-4 ml-1"
                    >
                      Register your Smile Clinic account
                    </Link>
                  </p>
                </div>
              </div>

              {/* Security Badges */}
              <div className="w-full max-w-md mx-auto pt-6 mt-4 border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-xs">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
                  <span>256-Bit SSL</span>
                  <span className="text-outline">·</span>
                  <span>HIPAA & GDPR</span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-[16px] text-primary">support_agent</span>
                  <a href="tel:5552345678" className="text-on-surface font-medium hover:text-primary transition-colors">
                    (555) 234-5678
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Hospital Visual & Ambient Panel (5 cols on desktop) */}
            <div className="w-full lg:w-5/12 bg-surface-container-low relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden border-t lg:border-t-0 lg:border-l border-surface-container-high">
              {/* Ambient Glow Orbs */}
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none"></div>
              <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs border border-surface-container-high mb-6">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">verified</span>
                  <span className="text-xs font-bold text-on-surface">Integrated Dental Cloud System</span>
                </div>
                <h2 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface mb-2">
                  Gentle, data-backed oral healthcare.
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Log in safely to check scheduled deep cleanings, review high-definition panoramic scans, and receive real-time direct notes from your attending clinician.
                </p>
              </div>

              {/* Photo Showcase */}
              <div className="relative z-10 my-6">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-surface-container-high h-60 w-full group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuCfiMxq-Ll2OLxhPZ43v6Lxu1PiIwMXgaT63zBXWivjSpYGDS8OogsI6pOXLkLMjwR4ptZXoGXMRzviKVaDj6vMxZcSNceBKA6ktsdqeQLgV4-Yx3B6MUu5TyPDS-Ll2shmhAM7_q2O7zNgmm60C7ecwMLbHRwb_qOn2uZXjUnfltlMJbkg76r4IckMwTwewFDGtzS28aU-_83RIOujPi5HZX0ZUd3281dQGOt2k01HnczUkSSeWU"
                    alt="A brightly lit, ultramodern smile clinic with a patient consulting an attentive dentist"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                    <div className="flex items-center gap-1.5 text-teal-300 text-xs font-bold">
                      <span className="material-symbols-outlined text-[16px]">stars</span>
                      <span>Patient Community</span>
                    </div>
                    <p className="font-headline font-bold text-lg text-white">Over 15,000 smiles cared for</p>
                  </div>
                </div>
              </div>

              {/* Check-in Pass Card */}
              <div className="relative z-10 bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Upcoming Check-in Ready
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-fixed text-on-primary-fixed">
                    Digital Pass
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    Dr
                  </div>
                  <div>
                    <div className="text-xs font-bold text-on-surface">Dr. Priya Patel, DDS</div>
                    <div className="text-[11px] text-on-surface-variant">Preventive Hygiene & 3D Scan</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-4 border-t border-surface-container-high shadow-[0_-1px_8px_rgba(0,119,130,0.03)] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-xs">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">shield_with_heart</span>
            <span>© 2026 Smile Clinic Health System. All health records encrypted.</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-medium">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Patient Rights</a>
          </div>
        </div>
      </footer>

      {/* Floating Home Button */}
      <Link
        to="/"
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary-container text-white px-5 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 transition-all font-semibold hover:scale-105"
      >
        <span className="material-symbols-outlined">home</span>
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
