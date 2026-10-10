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

  const handleSocialLogin = (type: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 300);
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

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-on-surface-variant text-xs bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-container-high">
              <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
              <span>HIPAA Compliant 256-Bit SSL</span>
            </div>
            <a
              href="tel:5552345678"
              className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">help_outline</span>
              <span>(555) 234-5678</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-5xl bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high overflow-hidden flex flex-col lg:flex-row min-h-[620px]"
        >
          {/* Left: Form Area */}
          <div className="w-full lg:w-7/12 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div className="w-full max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[28px]">dentistry</span>
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

              <div className="mb-6">
                <h1 className="font-headline font-bold text-2xl text-on-surface mb-1">
                  Welcome to your Patient Portal
                </h1>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Access your treatment timeline, digital 3D radiographs, and upcoming appointments.
                </p>
              </div>

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
                      className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                      className="text-[11px] font-semibold text-primary hover:underline transition-colors"
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
                      className="w-full pl-11 pr-11 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-outline hover:text-on-surface transition-colors p-1"
                      aria-label="Toggle password visibility"
                    >
                      <span className="material-symbols-outlined text-[18px]">
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
                      className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                    />
                    <span className="text-xs text-on-surface-variant font-medium">Remember this device</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('passkey')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                    <span>Use Passkey</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/25 transition-all cursor-pointer"
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
                    onClick={() => handleSocialLogin('health-id')}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold transition-colors border border-surface-container-high"
                  >
                    <span className="material-symbols-outlined text-[16px] text-teal-600">health_and_safety</span>
                    <span>Verified Health ID</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('smart-id')}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold transition-colors border border-surface-container-high"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">fingerprint</span>
                    <span>NHS / SmartID</span>
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-on-surface-variant">
                  New patient?{' '}
                  <Link
                    to="/signup"
                    className="font-bold text-primary hover:underline transition-colors ml-1"
                  >
                    Register your Smile Clinic account
                  </Link>
                </p>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto pt-6 border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-xs">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="material-symbols-outlined text-[15px] text-tertiary">lock</span>
                <span>256-Bit SSL Encrypted</span>
                <span className="text-outline">·</span>
                <span>HIPAA Verified</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <span className="material-symbols-outlined text-[15px] text-primary">support_agent</span>
                <span>Help: (555) 234-5678</span>
              </div>
            </div>
          </div>

          {/* Right: Hospital Visual & Ambient Panel */}
          <div className="w-full lg:w-5/12 bg-gradient-to-br from-surface-container-low via-white to-primary-fixed/20 relative flex flex-col justify-between p-6 sm:p-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-surface-container-high">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs border border-surface-container-high mb-6">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                <span className="text-[11px] font-bold text-on-surface">Integrated Dental Cloud System</span>
              </div>
              <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">
                Gentle, data-backed oral healthcare.
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Log in safely to check scheduled deep cleanings, review high-definition panoramic scans, and receive real-time direct notes from your attending clinician.
              </p>
            </div>

            <div className="relative z-10 my-6">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-surface-container-high h-56 w-full group">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                  alt="Modern Smile Clinic Examination Room"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center gap-1 text-teal-300 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">stars</span>
                    <span>Patient Community</span>
                  </div>
                  <p className="font-headline font-bold text-lg text-white">Over 15,000 smiles cared for</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Upcoming Check-in Ready
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-fixed text-on-primary-fixed">
                  Digital Pass
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
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
