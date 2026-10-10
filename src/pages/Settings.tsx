import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { initialPatientProfile } from '../data/mockData';
import { PatientProfile } from '../types';
import ToastNotification from '../components/ToastNotification';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export default function Settings() {
  const [profile, setProfile] = useState<PatientProfile>(initialPatientProfile);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [smsReminders, setSmsReminders] = useState(true);
  const [emailSummaries, setEmailSummaries] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Avatar Management
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('smileclinic_patient_avatar') ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
  });

  // Listen to external avatar changes
  useEffect(() => {
    const handleAvatarUpdate = () => {
      const stored = localStorage.getItem('smileclinic_patient_avatar');
      if (stored) setAvatarUrl(stored);
    };
    window.addEventListener('patient-avatar-updated', handleAvatarUpdate);
    window.addEventListener('storage', handleAvatarUpdate);
    return () => {
      window.removeEventListener('patient-avatar-updated', handleAvatarUpdate);
      window.removeEventListener('storage', handleAvatarUpdate);
    };
  }, []);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
        localStorage.setItem('smileclinic_patient_avatar', result);
        window.dispatchEvent(new Event('patient-avatar-updated'));
        showToast("Profile photo updated successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetAvatar = () => {
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
    setAvatarUrl(defaultAvatar);
    localStorage.removeItem('smileclinic_patient_avatar');
    window.dispatchEvent(new Event('patient-avatar-updated'));
    showToast("Profile photo reset to default.");
  };

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pwStep, setPwStep] = useState<'choose_method' | 'verify_password' | 'verify_otp' | 'new_password' | 'success'>('choose_method');
  const [verifyMethod, setVerifyMethod] = useState<'password' | 'email' | 'phone'>('email');

  // Verify by Current Password
  const [currentPwInput, setCurrentPwInput] = useState('');
  const [currentPwError, setCurrentPwError] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);

  // Verify by OTP
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '9', '1', '0']);
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // New Password Creation
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [newPwError, setNewPwError] = useState('');

  // Lock body scroll when modal is open
  useBodyScrollLock(isPasswordModalOpen);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPasswordModalOpen && pwStep === 'verify_otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPasswordModalOpen, pwStep, otpTimer]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Patient profile details updated successfully!");
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setPwStep('choose_method');
    setVerifyMethod('email');
    setCurrentPwInput('');
    setCurrentPwError('');
    setOtpDigits(['4', '8', '2', '9', '1', '0']);
    setOtpError('');
    setOtpTimer(60);
    setCanResendOtp(false);
    setNewPassword('');
    setConfirmPassword('');
    setNewPwError('');
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleMethodContinue = () => {
    if (verifyMethod === 'password') {
      setPwStep('verify_password');
      setCurrentPwError('');
    } else {
      setPwStep('verify_otp');
      setOtpTimer(60);
      setCanResendOtp(false);
      setOtpDigits(['4', '8', '2', '9', '1', '0']);
      setOtpError('');
    }
  };

  const handleVerifyCurrentPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwInput.trim()) {
      setCurrentPwError('Please enter your current account password.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Seamlessly advance to new password
      setPwStep('new_password');
    }, 450);
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpDigits];
    next[index] = val.slice(-1);
    setOtpDigits(next);
    setOtpError('');

    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    setOtpDigits(next);
    setOtpError('');
    if (pasted.length === 6) {
      otpInputsRef.current[5]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPwStep('new_password');
    }, 450);
  };

  const handleResendOtp = () => {
    if (!canResendOtp) return;
    setOtpDigits(['', '', '', '', '', '']);
    setOtpTimer(60);
    setCanResendOtp(false);
    setOtpError('');
    otpInputsRef.current[0]?.focus();
    showToast(`New verification code dispatched via ${verifyMethod === 'email' ? 'Email' : 'SMS'}!`);
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setNewPwError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setNewPwError('New passwords do not match.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPwStep('success');
      showToast("Account password updated successfully!");
    }, 550);
  };

  // Password validation indicators
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const tabs = [
    { id: 'profile', label: 'Personal Information', icon: 'person' },
    { id: 'notifications', label: 'Notifications & Alerts', icon: 'notifications' },
    { id: 'security', label: 'Security & Passkeys', icon: 'lock' }
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[26px]">manage_accounts</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs uppercase tracking-wider text-primary font-bold">Account Preferences</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold">Active Session</span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">Patient Profile & Settings</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Manage your personal identity, contact channels, notification triggers, and biometric credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-surface-container-high gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeSettingsTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60">
        <AnimatePresence mode="wait">
          {/* Tab 1: Personal Information */}
          {activeTab === 'profile' && (
            <motion.form
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSaveProfile}
              className="space-y-6 text-xs sm:text-sm"
            >
              {/* Avatar & Patient Header with Photo Upload */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-surface-container-high">
                <div className="flex items-center gap-4">
                  {/* Interactive Avatar Container */}
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary/10 border-2 border-primary/20 shadow-md ring-2 ring-white flex items-center justify-center">
                      <img
                        src={avatarUrl}
                        alt={profile.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Dark Overlay on Hover with Camera Icon */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer rounded-2xl"
                        title="Upload new patient photo"
                      >
                        <span className="material-symbols-outlined text-[24px]">photo_camera</span>
                        <span className="text-[10px] font-bold mt-0.5">Change</span>
                      </button>
                    </div>

                    {/* Camera / Upload Badge at bottom-right */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary hover:bg-primary-container text-white flex items-center justify-center shadow-md ring-2 ring-white cursor-pointer transition-transform hover:scale-110"
                      title="Upload photo"
                      aria-label="Upload photo"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline font-bold text-lg text-on-surface">{profile.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        Verified Patient
                      </span>
                    </div>
                    <span className="text-outline text-xs block font-mono mt-0.5">Patient Record #{profile.id}</span>
                    <p className="text-[11px] text-on-surface-variant mt-1">JPG, PNG or WebP (max 5MB)</p>
                  </div>
                </div>

                {/* Photo Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                    <span>Upload New Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAvatar}
                    className="px-3 py-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container font-semibold text-xs transition-colors cursor-pointer"
                    title="Reset to default picture"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block font-bold text-on-surface mb-1.5 text-xs uppercase tracking-wider text-outline">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-medium text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1.5 text-xs uppercase tracking-wider text-outline">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-medium text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1.5 text-xs uppercase tracking-wider text-outline">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-medium text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1.5 text-xs uppercase tracking-wider text-outline">Date of Birth</label>
                  <input
                    type="text"
                    required
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-medium text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1.5 text-xs uppercase tracking-wider text-outline">Residential Address</label>
                <input
                  type="text"
                  required
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-medium text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface"
                />
              </div>

              {/* Emergency Contact */}
              <div className="pt-2">
                <label className="block font-bold text-on-surface mb-2 text-xs uppercase tracking-wider text-outline">Emergency Contact Information</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
                  <div>
                    <span className="text-outline text-[10px] block uppercase font-bold">Contact Name</span>
                    <span className="font-bold text-on-surface text-sm">{profile.emergencyContact.name}</span>
                  </div>
                  <div>
                    <span className="text-outline text-[10px] block uppercase font-bold">Relationship</span>
                    <span className="font-bold text-on-surface text-sm">{profile.emergencyContact.relationship}</span>
                  </div>
                  <div>
                    <span className="text-outline text-[10px] block uppercase font-bold">Phone Number</span>
                    <span className="font-bold text-primary font-mono text-sm">{profile.emergencyContact.phone}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs sm:text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </motion.form>
          )}

          {/* Tab 2: Notifications & Alerts */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">Notification Preferences</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Control how and when Smile Clinic communicates clinical and billing updates with you.</p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-surface-container-high cursor-pointer hover:bg-surface-container transition-colors">
                  <div className="pr-4">
                    <span className="font-bold text-on-surface block text-sm">SMS Appointment Reminders</span>
                    <span className="text-xs text-on-surface-variant">Receive automated text messages 48h and 2h before scheduled appointments.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsReminders}
                    onChange={(e) => {
                      setSmsReminders(e.target.checked);
                      showToast("SMS preferences updated.");
                    }}
                    className="w-5 h-5 rounded text-primary accent-primary cursor-pointer shrink-0"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-surface-container-high cursor-pointer hover:bg-surface-container transition-colors">
                  <div className="pr-4">
                    <span className="font-bold text-on-surface block text-sm">Email Radiographs & Treatment Summaries</span>
                    <span className="text-xs text-on-surface-variant">Send high-resolution DICOM x-rays and doctor notes directly to your registered inbox.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailSummaries}
                    onChange={(e) => {
                      setEmailSummaries(e.target.checked);
                      showToast("Email preferences updated.");
                    }}
                    className="w-5 h-5 rounded text-primary accent-primary cursor-pointer shrink-0"
                  />
                </label>
              </div>
            </motion.div>
          )}

          {/* Tab 3: Security & Passkeys */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">Security & Access Controls</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Configure authentication safeguards, verify passwords, and cryptographic passkeys for your electronic health records.</p>
              </div>

              {/* Change Password Card */}
              <div className="p-4 sm:p-5 bg-surface-container-low rounded-xl border border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">lock_reset</span>
                  </div>
                  <div>
                    <span className="font-bold text-on-surface block text-sm">Account Password</span>
                    <span className="text-xs text-on-surface-variant">
                      Last modified 30 days ago. Update your password with current password or email/SMS OTP verification.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openPasswordModal}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-container transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-xs shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  <span>Change Password</span>
                </button>
              </div>

              {/* 2FA Card */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high space-y-3">
                <div className="flex items-center justify-between">
                  <div className="pr-4">
                    <span className="font-bold text-on-surface block text-sm">Two-Factor Authentication (2FA)</span>
                    <span className="text-xs text-on-surface-variant">Requires a one-time verification code when accessing the portal from unfamiliar devices.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorAuth}
                    onChange={(e) => {
                      setTwoFactorAuth(e.target.checked);
                      showToast("Two-factor security toggled.");
                    }}
                    className="w-5 h-5 rounded text-primary accent-primary cursor-pointer shrink-0"
                  />
                </div>
              </div>

              {/* Passkeys Card */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface block text-sm">Passkey / Biometric Authentication</span>
                  <span className="text-xs text-on-surface-variant">Windows Hello / Apple Touch ID & Face ID credentials enrolled.</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast("Biometric passkey verified on this device!")}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors cursor-pointer text-xs shrink-0"
                >
                  Configure Passkey
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Change Password Modal Popup */}
      {isPasswordModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePasswordModal}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden z-10 my-auto"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-surface-container-high flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    {pwStep === 'success' ? 'verified' : 'security'}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface">
                    {pwStep === 'choose_method' && 'Choose Verification Method'}
                    {pwStep === 'verify_password' && 'Verify Current Password'}
                    {pwStep === 'verify_otp' && 'Verify Security Code (OTP)'}
                    {pwStep === 'new_password' && 'Create New Password'}
                    {pwStep === 'success' && 'Password Changed!'}
                  </h3>
                  <p className="text-[11px] text-outline">
                    Smile Clinic Electronic Health Records Protection
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closePasswordModal}
                className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
                title="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6">
              <AnimatePresence mode="wait">
                {/* STEP 1: Choose Verification Method */}
                {pwStep === 'choose_method' && (
                  <motion.div
                    key="step_method"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      To safeguard your confidential health records and billing profile, please select how you would like to verify your identity:
                    </p>

                    <div className="space-y-3">
                      {/* Option 1: Current Password */}
                      <label
                        onClick={() => setVerifyMethod('password')}
                        className={`p-3.5 sm:p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                          verifyMethod === 'password'
                            ? 'border-primary bg-primary-tint/40 shadow-xs'
                            : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <input
                          type="radio"
                          name="auth_method"
                          checked={verifyMethod === 'password'}
                          onChange={() => setVerifyMethod('password')}
                          className="mt-1 text-primary accent-primary"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px] text-primary">key</span>
                            <span className="text-xs sm:text-sm font-bold text-on-surface">Current Account Password</span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">
                            Authenticate directly with your current password.
                          </p>
                        </div>
                      </label>

                      {/* Option 2: Email OTP */}
                      <label
                        onClick={() => setVerifyMethod('email')}
                        className={`p-3.5 sm:p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                          verifyMethod === 'email'
                            ? 'border-primary bg-primary-tint/40 shadow-xs'
                            : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <input
                          type="radio"
                          name="auth_method"
                          checked={verifyMethod === 'email'}
                          onChange={() => setVerifyMethod('email')}
                          className="mt-1 text-primary accent-primary"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                              <span className="text-xs sm:text-sm font-bold text-on-surface">One-Time Passcode (OTP) via Email</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                              Instant
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">
                            Code sent to registered email: <strong className="text-on-surface">{profile.email}</strong>
                          </p>
                        </div>
                      </label>

                      {/* Option 3: Phone OTP */}
                      <label
                        onClick={() => setVerifyMethod('phone')}
                        className={`p-3.5 sm:p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                          verifyMethod === 'phone'
                            ? 'border-primary bg-primary-tint/40 shadow-xs'
                            : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <input
                          type="radio"
                          name="auth_method"
                          checked={verifyMethod === 'phone'}
                          onChange={() => setVerifyMethod('phone')}
                          className="mt-1 text-primary accent-primary"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[18px] text-primary">sms</span>
                              <span className="text-xs sm:text-sm font-bold text-on-surface">One-Time Passcode (OTP) via SMS</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                              SMS
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">
                            Code sent to mobile: <strong className="text-on-surface font-mono">{profile.phone}</strong>
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={closePasswordModal}
                        className="px-4 py-2.5 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleMethodContinue}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Continue</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2A: Verify Current Password */}
                {pwStep === 'verify_password' && (
                  <motion.form
                    key="step_current_pw"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleVerifyCurrentPassword}
                    className="space-y-5"
                  >
                    <div>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                        Please enter your current account password to authorize creating a new password.
                      </p>

                      <label className="block text-xs font-bold text-on-surface uppercase tracking-wider text-outline mb-1.5">
                        Current Account Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPw ? 'text' : 'password'}
                          required
                          value={currentPwInput}
                          onChange={(e) => {
                            setCurrentPwInput(e.target.value);
                            setCurrentPwError('');
                          }}
                          placeholder="Enter your current password"
                          className={`w-full pl-4 pr-11 py-2.5 bg-surface-container-low rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface ${
                            currentPwError ? 'border-red-400 bg-red-50/50' : 'border-surface-container-high'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showCurrentPw ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>

                      {currentPwError && (
                        <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">error</span>
                          <span>{currentPwError}</span>
                        </p>
                      )}

                      {/* Demo Password Auto-Fill */}
                      <div className="mt-3 p-3 bg-primary-tint/30 rounded-xl border border-primary/20 flex items-center justify-between text-xs">
                        <span className="text-primary font-medium">Demo Password: <strong>DentalCare2026!</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPwInput('DentalCare2026!');
                            setCurrentPwError('');
                          }}
                          className="px-2.5 py-1 rounded bg-primary text-white font-bold text-[11px] hover:bg-primary-container cursor-pointer transition-colors"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPwStep('choose_method')}
                        className="text-xs font-bold text-outline hover:text-on-surface flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        <span>Change Method</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isVerifying ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <span>Verify Password</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 2B: Verify OTP Code */}
                {pwStep === 'verify_otp' && (
                  <motion.form
                    key="step_otp"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleVerifyOtp}
                    className="space-y-5"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-primary flex items-center justify-center mx-auto mb-2 shadow-xs">
                        <span className="material-symbols-outlined text-[24px]">
                          {verifyMethod === 'email' ? 'mark_email_read' : 'phonelink_ring'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        Enter the 6-digit code sent to{' '}
                        <strong className="text-on-surface">
                          {verifyMethod === 'email' ? profile.email : profile.phone}
                        </strong>
                      </p>
                    </div>

                    {/* Demo Code Helper */}
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                        <span>Sample Code: <strong>482910</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpDigits(['4', '8', '2', '9', '1', '0']);
                          setOtpError('');
                        }}
                        className="text-[11px] font-bold text-emerald-800 bg-emerald-200 hover:bg-emerald-300 px-2.5 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Auto-Fill
                      </button>
                    </div>

                    {/* 6 Digit Inputs */}
                    <div>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5" onPaste={handleOtpPaste}>
                        {otpDigits.map((digit, idx) => (
                          <motion.input
                            key={idx}
                            ref={(el) => { otpInputsRef.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            whileFocus={{ scale: 1.05 }}
                            animate={otpError ? { x: [-3, 3, -3, 3, 0] } : {}}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className={`w-10 h-12 sm:w-12 sm:h-14 text-center font-bold text-base sm:text-xl rounded-xl border bg-surface-container-low text-on-surface transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary ${
                              otpError ? 'border-red-400 bg-red-50' : 'border-surface-container-high focus:border-primary'
                            }`}
                          />
                        ))}
                      </div>

                      {otpError && (
                        <p className="text-center text-xs text-red-600 font-semibold mt-2 flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">error</span>
                          <span>{otpError}</span>
                        </p>
                      )}
                    </div>

                    {/* Resend and Switch Method */}
                    <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-container-high">
                      <button
                        type="button"
                        onClick={() => setPwStep('choose_method')}
                        className="text-outline hover:text-on-surface flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        <span>Change Method</span>
                      </button>

                      <div>
                        {canResendOtp ? (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            className="font-bold text-primary hover:underline cursor-pointer"
                          >
                            Resend Code
                          </button>
                        ) : (
                          <span className="text-outline font-mono">
                            Resend in {otpTimer}s
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isVerifying ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Verifying Code...</span>
                          </>
                        ) : (
                          <>
                            <span>Verify Code</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 3: Create New Password */}
                {pwStep === 'new_password' && (
                  <motion.form
                    key="step_new_pw"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSaveNewPassword}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-on-surface uppercase tracking-wider text-outline mb-1.5">
                        New Account Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setNewPwError('');
                          }}
                          placeholder="At least 8 characters"
                          className="w-full pl-4 pr-11 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showNewPw ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface uppercase tracking-wider text-outline mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPw ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setNewPwError('');
                          }}
                          placeholder="Re-enter your new password"
                          className="w-full pl-4 pr-11 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw(!showConfirmPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showConfirmPw ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {newPwError && (
                      <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        <span>{newPwError}</span>
                      </p>
                    )}

                    {/* Password Strength Checklist */}
                    <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high text-xs space-y-1.5">
                      <span className="text-[11px] font-bold text-outline uppercase block">Security Requirements:</span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-bold' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-[15px]">
                            {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>8+ characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-700 font-bold' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-[15px]">
                            {hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>Uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-bold' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-[15px]">
                            {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>Number (0-9)</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-700 font-bold' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-[15px]">
                            {passwordsMatch ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>Passwords match</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={closePasswordModal}
                        className="px-4 py-2.5 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isVerifying || !hasMinLength || !passwordsMatch}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isVerifying ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Updating Password...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                            <span>Save New Password</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 4: Success Animation & Confirmation */}
                {pwStep === 'success' && (
                  <motion.div
                    key="step_success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="text-center py-4 space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                      className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50"
                    >
                      <span className="material-symbols-outlined text-[36px]">check_circle</span>
                    </motion.div>

                    <div>
                      <h4 className="font-headline font-bold text-xl text-on-surface">Password Updated Successfully!</h4>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-sm mx-auto leading-relaxed">
                        Your patient portal password has been changed. Your electronic health records and access credentials are secure.
                      </p>
                    </div>

                    <div className="pt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={closePasswordModal}
                        className="px-8 py-3 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">done</span>
                        <span>Done & Return to Settings</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
