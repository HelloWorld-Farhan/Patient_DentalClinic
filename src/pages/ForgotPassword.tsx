import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [emailOrId, setEmailOrId] = useState('ananya.verma@smileclinic.com');
  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '0']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Handle OTP digit change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next box
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);
    setOtpError('');
    if (pasted.length === 6) {
      otpInputsRef.current[5]?.focus();
    }
  };

  // Step 1: Submit email to request OTP
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setResendTimer(45);
      setCanResend(false);
    }, 450);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 450);
  };

  // Resend OTP trigger
  const handleResendOtp = () => {
    if (!canResend) return;
    setResendTimer(45);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    otpInputsRef.current[0]?.focus();
  };

  // Step 3: Save new password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    }, 500);
  };

  // Password strength checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Header */}
      <header className="w-full bg-surface-container-lowest/80 backdrop-blur-xl border-b border-surface-container-high shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">dentistry</span>
            </div>
            <span className="font-headline font-bold text-xl text-primary">Smile Clinic</span>
          </Link>
          <Link
            to="/login"
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-container flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high overflow-hidden p-6 sm:p-10 relative"
        >
          {/* Top Step Breadcrumb Tracker */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              step === 1 ? 'bg-primary text-white shadow-xs' : 'bg-surface-container-low text-on-surface-variant'
            }`}>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>Account ID</span>
            </div>
            <span className="text-outline text-xs">→</span>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              step === 2 ? 'bg-primary text-white shadow-xs' : step > 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-low text-on-surface-variant'
            }`}>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                {step > 2 ? '✓' : '2'}
              </span>
              <span>OTP Verification</span>
            </div>
            <span className="text-outline text-xs">→</span>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              step === 3 ? 'bg-primary text-white shadow-xs' : 'bg-surface-container-low text-on-surface-variant'
            }`}>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
              <span>New Password</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Enter Email / Patient ID */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <span className="material-symbols-outlined text-[28px]">lock_reset</span>
                  </div>
                  <h1 className="font-headline font-bold text-2xl text-on-surface">Reset Patient Password</h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed max-w-sm mx-auto">
                    Verify your registered email address or patient health ID to receive a secure one-time passcode.
                  </p>
                </div>

                <form onSubmit={handleSendCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider text-outline">
                      Email Address or Patient ID
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                        badge
                      </span>
                      <input
                        type="text"
                        required
                        value={emailOrId}
                        onChange={(e) => setEmailOrId(e.target.value)}
                        placeholder="name@example.com or PT-84920"
                        className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-xl text-xs sm:text-sm font-medium text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container-high flex items-start gap-2.5 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">info</span>
                    <span>A 6-digit authorization code will be dispatched to your registered SMS phone number and email address on file.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <Link
                      to="/login"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Return to Login
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Enter OTP Code */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-primary flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
                  </div>
                  <h1 className="font-headline font-bold text-2xl text-on-surface">Enter Verification Code (OTP)</h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed max-w-sm mx-auto">
                    We sent a 6-digit code to registered contact for <span className="font-bold text-on-surface">{emailOrId}</span>.
                  </p>
                </div>

                {/* Demo OTP Helper Badge */}
                <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span>Sample Test Code: <strong>482910</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtp(['4', '8', '2', '9', '1', '0']);
                      setOtpError('');
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-center text-xs font-bold text-on-surface mb-3 uppercase tracking-wider text-outline">
                      6-Digit Security Code
                    </label>
                    
                    {/* 6 OTP Boxes */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3" onPaste={handleOtpPaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { otpInputsRef.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`w-9 h-11 sm:w-11 sm:h-13 md:w-12 md:h-14 text-center font-bold text-base sm:text-lg md:text-xl rounded-xl border bg-surface-container-low text-on-surface transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary ${
                            otpError ? 'border-red-400 bg-red-50' : 'border-surface-container-high focus:border-primary'
                          }`}
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-center text-xs text-red-600 font-semibold mt-2.5 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        <span>{otpError}</span>
                      </p>
                    )}
                  </div>

                  {/* Resend Section */}
                  <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-surface-container-high">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-outline hover:text-on-surface flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Change ID</span>
                    </button>

                    <div>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="font-bold text-primary hover:underline cursor-pointer"
                        >
                          Resend Code Now
                        </button>
                      ) : (
                        <span>Resend code in <strong className="font-mono text-primary">{resendTimer}s</strong></span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Verify & Continue</span>
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: Create New Password */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
              >
                {resetSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                      <span className="material-symbols-outlined text-[36px]">check_circle</span>
                    </div>
                    <h2 className="font-headline font-bold text-2xl text-emerald-950">Password Changed Successfully!</h2>
                    <p className="text-xs sm:text-sm text-emerald-700 max-w-sm mx-auto">
                      Your patient portal credentials have been secured. You are being redirected to sign in...
                    </p>
                    <div className="pt-2">
                      <span className="inline-block w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-xs">
                        <span className="material-symbols-outlined text-[28px]">key</span>
                      </div>
                      <h1 className="font-headline font-bold text-2xl text-on-surface">Create New Password</h1>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed max-w-sm mx-auto">
                        Please enter and confirm a new, strong password to protect your medical records.
                      </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                      {/* New Password */}
                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider text-outline">
                          New Secure Password
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                            lock
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-11 pr-11 py-3 bg-surface-container-low rounded-xl text-xs sm:text-sm font-medium text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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

                      {/* Password Rules */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-surface-container-low rounded-xl border border-surface-container-high text-[11px]">
                        <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-bold' : 'text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined text-[16px]">
                            {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>Min. 8 chars</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-700 font-bold' : 'text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined text-[16px]">
                            {hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>1 Uppercase</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasSymbol ? 'text-emerald-700 font-bold' : 'text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined text-[16px]">
                            {hasSymbol ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>1 Symbol</span>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider text-outline">
                          Confirm New Password
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
                            lock_clock
                          </span>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-11 pr-11 py-3 bg-surface-container-low rounded-xl text-xs sm:text-sm font-medium text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 text-outline hover:text-on-surface transition-colors p-1"
                            aria-label="Toggle password visibility"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {showConfirmPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-red-500 text-xs font-medium mt-1">Passwords do not match yet.</p>
                        )}
                        {confirmPassword && newPassword === confirmPassword && (
                          <p className="text-emerald-600 text-xs font-medium mt-1">✓ Passwords match perfectly.</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                      >
                        {isLoading ? (
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">lock</span>
                            <span>Save Password & Sign In</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-surface-container-high py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">shield_with_heart</span>
            <span>© 2026 Smile Clinic Health System. All health records encrypted.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">HIPAA Standards</a>
            <a href="#" className="hover:text-primary transition-colors">Security Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
