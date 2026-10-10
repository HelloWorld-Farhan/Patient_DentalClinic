import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialPatientProfile } from '../data/mockData';
import { PatientProfile } from '../types';

export default function Settings() {
  const [profile, setProfile] = useState<PatientProfile>(initialPatientProfile);
  const [activeTab, setActiveTab] = useState<'profile' | 'insurance' | 'notifications' | 'security'>('profile');
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-teal-400">check_circle</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="font-headline font-bold text-2xl text-on-surface">Settings & Patient Profile</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Manage your personal identity, dental insurance policy, notifications, and security credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-container-high gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'Personal Information', icon: 'person' },
          { id: 'insurance', label: 'Dental Insurance', icon: 'health_and_safety' },
          { id: 'notifications', label: 'Notifications & Alerts', icon: 'notifications' },
          { id: 'security', label: 'Security & Passkeys', icon: 'lock' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-xs border border-surface-container-high">
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-surface-container-high">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-xs">
                AV
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">{profile.name}</h3>
                <span className="text-outline font-mono">Patient #{profile.id}</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                  Verified Patient
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-on-surface mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Date of Birth</label>
                <input
                  type="text"
                  value={profile.dob}
                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-medium focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">Residential Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-medium focus:outline-none focus:border-primary"
              />
            </div>

            <div className="pt-2">
              <label className="block font-bold text-on-surface mb-2">Emergency Contact</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
                <div>
                  <span className="text-outline text-[10px] block uppercase font-bold">Name</span>
                  <span className="font-bold text-on-surface">{profile.emergencyContact.name}</span>
                </div>
                <div>
                  <span className="text-outline text-[10px] block uppercase font-bold">Relationship</span>
                  <span className="font-bold text-on-surface">{profile.emergencyContact.relationship}</span>
                </div>
                <div>
                  <span className="text-outline text-[10px] block uppercase font-bold">Phone</span>
                  <span className="font-bold text-primary font-mono">{profile.emergencyContact.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Insurance */}
        {activeTab === 'insurance' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-headline font-bold text-base text-on-surface">Dental Insurance Provider</h3>
            <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-secondary text-sm">{profile.insurance.provider}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed">
                  {profile.insurance.status}
                </span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Your benefits cover 100% of biannual preventative cleanings, 80% of basic composite restorations, and 50% of major orthodontic procedures.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-on-surface mb-1">Subscriber ID / Policy Number</label>
                <input
                  type="text"
                  defaultValue={profile.insurance.policyNumber}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-mono font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-on-surface mb-1">Group Number</label>
                <input
                  type="text"
                  defaultValue={profile.insurance.groupId}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high font-mono font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast("Insurance card upload simulated! Front desk notified.")}
                className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span>Upload New Insurance Card Front/Back</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-headline font-bold text-base text-on-surface">Notification Preferences</h3>
            <p className="text-on-surface-variant">Control how and when Smile Clinic communicates clinical updates with you.</p>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl cursor-pointer">
                <div>
                  <span className="font-bold text-on-surface block">SMS Appointment Reminders</span>
                  <span className="text-[11px] text-on-surface-variant">Receive automated text messages 48h and 2h before visits.</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsReminders}
                  onChange={(e) => {
                    setSmsReminders(e.target.checked);
                    showToast("SMS preferences updated.");
                  }}
                  className="w-5 h-5 rounded text-primary accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl cursor-pointer">
                <div>
                  <span className="font-bold text-on-surface block">Email Radiograph & Treatment Notes</span>
                  <span className="text-[11px] text-on-surface-variant">Send high-resolution DICOM x-rays directly to your inbox.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailSummaries}
                  onChange={(e) => {
                    setEmailSummaries(e.target.checked);
                    showToast("Email preferences updated.");
                  }}
                  className="w-5 h-5 rounded text-primary accent-primary cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-headline font-bold text-base text-on-surface">Security & Electronic Health Records</h3>
            <div className="p-4 bg-surface-container-low rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[11px] text-on-surface-variant">Requires SMS verification code when logging in from new devices.</span>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={(e) => {
                    setTwoFactorAuth(e.target.checked);
                    showToast("Two-factor security toggled.");
                  }}
                  className="w-5 h-5 rounded text-primary accent-primary cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-on-surface block">Passkey / Biometric Login</span>
                <span className="text-[11px] text-on-surface-variant">Windows Hello / Apple Face ID credentials linked.</span>
              </div>
              <button
                onClick={() => showToast("Biometric passkey verified on this device!")}
                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 cursor-pointer"
              >
                Configure Passkey
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
