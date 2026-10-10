import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { initialNotifications } from '../data/mockData';
import { NotificationItem } from '../types';

interface LegalPageHeaderProps {
  title: string;
  showPrintButton?: boolean;
  onPrint?: () => void;
}

export default function LegalPageHeader({
  title,
  showPrintButton = false,
  onPrint
}: LegalPageHeaderProps) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('smileclinic_patient_avatar') || 
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    setNotificationsOpen(false);
    navigate('/dashboard');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Check if user is currently authenticated in portal session
    const auth = typeof window !== 'undefined' && localStorage.getItem('smileclinic_patient_auth') === 'true';
    setIsLoggedIn(Boolean(auth));

    const syncAvatar = () => {
      const stored = localStorage.getItem('smileclinic_patient_avatar');
      if (stored) setAvatarUrl(stored);
    };

    window.addEventListener('patient-avatar-updated', syncAvatar);
    window.addEventListener('storage', syncAvatar);
    return () => {
      window.removeEventListener('patient-avatar-updated', syncAvatar);
      window.removeEventListener('storage', syncAvatar);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-container-high shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Context */}
        <div className="flex items-center gap-3">
          <Link
            to={isLoggedIn ? "/dashboard" : "/login"}
            className="flex items-center gap-2.5 group shrink-0"
            title={isLoggedIn ? "Return to Patient Dashboard" : "Return to Patient Login"}
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">dentistry</span>
            </div>
            <div>
              <span className="font-headline font-bold text-lg text-primary block leading-none">Smile Clinic</span>
              <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider">
                {isLoggedIn ? 'Patient Portal' : 'Patient System'}
              </span>
            </div>
          </Link>

          {/* Context Breadcrumb on wide screens */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-on-surface-variant font-medium pl-3 border-l border-surface-container-high">
            <span className="text-outline">{isLoggedIn ? 'Portal Dashboard' : 'Patient Access'}</span>
            <span className="text-outline">/</span>
            <span className="text-primary font-semibold">{title}</span>
          </div>
        </div>

        {/* Action Controls & Authentication Redirections */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 24/7 Dental Emergency Hotline */}
          <a
            href="tel:5552345678"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Emergency 24/7:</span>
            <span className="font-bold">(555) 234-5678</span>
          </a>

          {/* Print Document Button */}
          {showPrintButton && (
            <button
              type="button"
              onClick={onPrint || (() => window.print())}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold rounded-lg border border-surface-container-high transition-colors cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print</span>
            </button>
          )}

          {/* Context A: Logged In Patient (Dashboard Context) */}
          {isLoggedIn ? (
            <>
              {/* Notification Bell Dropdown */}
              <div className="relative" ref={notifDropdownRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <span className="material-symbols-outlined text-[22px]">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Popover (Fixed on mobile with backdrop, absolute on desktop) */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      {/* Mobile Backdrop */}
                      <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-2xs z-[9998] sm:hidden"
                        onClick={() => setNotificationsOpen(false)}
                      />

                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="fixed top-16 left-3 right-3 max-w-md mx-auto sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high z-[9999] overflow-hidden"
                      >
                        <div className="p-4 border-b border-surface-container-high flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-on-surface">Notifications</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {unreadCount} Unread
                            </span>
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-surface-container-low p-1">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-xs text-outline">
                              No notifications at this time.
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                onClick={() => handleNotificationClick(n.id)}
                                className={`p-3 rounded-xl transition-colors cursor-pointer flex items-start gap-3 ${
                                  n.unread ? 'bg-primary-tint/30 hover:bg-primary-tint/50' : 'hover:bg-surface-container-low'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.bgClass} ${n.textClass}`}>
                                  <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="text-xs font-bold text-on-surface truncate">{n.title}</span>
                                    <span className="text-[10px] text-outline shrink-0">{n.time}</span>
                                  </div>
                                  <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                                    {n.desc}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Patient Badge */}
              <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-surface-container-low border border-surface-container-high text-xs shrink-0">
                <div className="w-5 h-5 rounded-full overflow-hidden bg-primary/10 ring-1 ring-primary/30">
                  <img
                    src={avatarUrl}
                    alt="Ananya"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-on-surface text-[11px]">Ananya V.</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>

              {/* Single Back Button with History Redirection */}
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white hover:bg-primary-container text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                title="Back to previous page"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </button>
            </>
          ) : (
            /* Context B: Guest / Signing / Login Panel Context */
            <>
              {/* Sign In Button */}
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-primary hover:bg-primary-tint border border-primary/30 transition-all shadow-xs shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>Sign In</span>
              </Link>

              {/* Register / Sign Up Button */}
              <Link
                to="/signup"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white hover:bg-primary-container text-xs font-bold rounded-lg transition-all shadow-xs shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span className="hidden sm:inline">Register Account</span>
                <span className="sm:hidden">Register</span>
              </Link>

              {/* Back to Login Button */}
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate('/login');
                  }
                }}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
