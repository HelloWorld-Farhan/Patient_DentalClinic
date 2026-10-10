import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [emailOrId, setEmailOrId] = useState('ananya.verma@smileclinic.com');
  const [submitted, setSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 400);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    }, 400);
  };

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col justify-between">
      <header className="w-full bg-white/80 backdrop-blur-xl border-b border-surface-container-high shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">dentistry</span>
            </div>
            <span className="font-headline font-bold text-xl text-primary">Smile Clinic</span>
          </Link>
          <Link
            to="/login"
            className="text-xs font-bold text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high p-8 sm:p-10"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-xs">
              <span className="material-symbols-outlined text-[26px]">lock_reset</span>
            </div>
            <h1 className="font-headline font-bold text-2xl text-on-surface">Reset Patient Password</h1>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Verify your patient electronic ID to regain secure portal access.
            </p>
          </div>

          {resetSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
              <h3 className="font-bold text-sm text-emerald-900">Password Updated Successfully</h3>
              <p className="text-xs text-emerald-700">Redirecting you to the patient login screen...</p>
            </div>
          ) : !submitted ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5">
                  Email Address or Patient ID
                </label>
                <input
                  type="text"
                  required
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder="name@example.com or PT-84920"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">mark_email_read</span>
                <span>Verification code sent to your registered phone & email!</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">New Secure Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl text-xs font-medium border border-surface-container-high focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Save & Log In</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs font-semibold text-primary hover:underline">
              ← Return to Login
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="w-full bg-white border-t border-surface-container-high py-4 text-center text-xs text-on-surface-variant">
        © 2026 Smile Clinic Health System. All records encrypted.
      </footer>
    </div>
  );
}
