import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { initialPatientProfile } from '../data/mockData';
import { PatientProfile } from '../types';

export default function Settings() {
  const [profile, setProfile] = useState<PatientProfile>(initialPatientProfile);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [smsReminders, setSmsReminders] = useState(true);
  const [emailSummaries, setEmailSummaries] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Patient profile details updated successfully!");
  };

  const tabs = [
    { id: 'profile', label: 'Personal Information', icon: 'person' },
    { id: 'notifications', label: 'Notifications & Alerts', icon: 'notifications' },
    { id: 'security', label: 'Security & Passkeys', icon: 'lock' }
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && typeof document !== 'undefined' && createPortal(
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[10000] bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-teal-400">check_circle</span>
            <span>{toastMessage}</span>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

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
              {/* Avatar & Patient Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-surface-container-high">
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  AV
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-lg text-on-surface">{profile.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      Verified Patient
                    </span>
                  </div>
                  <span className="text-outline text-xs block font-mono mt-0.5">Patient Record #{profile.id}</span>
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
                <p className="text-xs text-on-surface-variant mt-0.5">Configure two-factor verification and cryptographic passkeys for your electronic health records.</p>
              </div>

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
    </div>
  );
}
