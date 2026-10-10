import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { initialNotifications, initialPatientProfile } from '../data/mockData';
import { NotificationItem } from '../types';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');

  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard', end: true },
    { name: 'Appointments', path: '/dashboard/appointments', icon: 'calendar_month' },
    { name: 'Records', path: '/dashboard/records', icon: 'medical_services' },
    { name: 'Billing', path: '/dashboard/billing', icon: 'receipt_long' },
    { name: 'Support', path: '/dashboard/support', icon: 'support_agent' }
  ];

  return (
    <div className="bg-[#f7fafc] font-sans text-on-surface min-h-screen flex flex-col">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
        />
      )}

      {/* Sidebar (Desktop Fixed / Mobile Drawer) */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-surface-container-high z-50 flex flex-col justify-between pt-6 pb-6 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand Header */}
          <div className="px-6 mb-8 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">dentistry</span>
              </div>
              <div>
                <span className="font-headline font-bold text-lg text-primary block leading-tight">Smile Clinic</span>
                <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">Patient Portal</span>
              </div>
            </Link>
            
            {/* Mobile Close Button */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links with Framer Motion Sliding Tab Highlight */}
          <nav className="px-3 space-y-1 relative">
            {navLinks.map((link) => {
              const isActive = link.end 
                ? location.pathname === link.path 
                : location.pathname.startsWith(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 z-10 ${
                    isActive
                      ? 'text-on-primary'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavHighlight"
                      className="absolute inset-0 bg-primary rounded-xl shadow-md shadow-primary/25 z-0"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 32
                      }}
                    />
                  )}
                  <span className={`material-symbols-outlined mr-3 text-[20px] relative z-10 transition-colors duration-200 ${
                    isActive ? 'text-on-primary' : 'text-primary'
                  }`}>
                    {link.icon}
                  </span>
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - Patient Profile Card, Settings, & Sign Out */}
        <div className="px-3 mt-auto pt-4 border-t border-surface-container-high/60 space-y-2">
          {/* Patient Profile Card */}
          <Link
            to="/dashboard/settings"
            onClick={() => setSidebarOpen(false)}
            className="p-2.5 bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xs flex items-center gap-2.5 hover:border-primary/40 hover:shadow-sm transition-all group"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary/10 text-primary ring-2 ring-primary/20 shrink-0 flex items-center justify-center font-bold text-xs">
              <span className="material-symbols-outlined text-[20px] text-primary">account_circle</span>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                {initialPatientProfile.name}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Patient #{initialPatientProfile.id} • Active
              </div>
            </div>
          </Link>

          {/* Settings Button */}
          <Link
            to="/dashboard/settings"
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold ${
              location.pathname === '/dashboard/settings'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined mr-2.5 text-[18px] ${
              location.pathname === '/dashboard/settings' ? 'text-on-primary' : 'text-primary'
            }`}>settings</span>
            Settings
          </Link>

          {/* Logout Button */}
          <button 
            onClick={() => {
              setSidebarOpen(false);
              navigate('/login');
            }} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all font-semibold text-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Lock / Log Out
          </button>
        </div>
      </aside>

      {/* Top Header Bar */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-surface-container-high h-16 flex items-center justify-between px-4 sm:px-6">
          {/* Left: Mobile Toggle & Page Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Open sidebar"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-on-surface-variant">
              <span>Patient Portal</span>
              <span className="text-outline">/</span>
              <span className="text-primary font-semibold capitalize">
                {location.pathname.replace('/dashboard', '').replace('/', '') || 'Overview'}
              </span>
            </div>
          </div>

          {/* Right: Emergency Triage Hotline, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 24/7 Dental Emergency Hotline */}
            <a
              href="tel:5552345678"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Emergency 24/7:</span>
              <span className="font-bold">(555) 234-5678</span>
            </a>

            {/* Support Desk Direct Link */}
            <Link
              to="/dashboard/support"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors text-xs font-semibold"
              title="Patient Support & Clinical Helpdesk"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">help_outline</span>
              <span className="hidden sm:inline">Support</span>
            </Link>

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

              {/* Notification Popover */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-96 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high z-50 overflow-hidden"
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
                )}
              </AnimatePresence>
            </div>

            {/* Profile Trigger & Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <div className="flex items-center gap-1 bg-surface-container-low/60 hover:bg-surface-container rounded-xl p-1 transition-colors">
                <button
                  onClick={() => navigate('/dashboard/settings')}
                  className="flex items-center gap-2 px-1.5 py-0.5 rounded-lg text-left cursor-pointer group"
                  title="Open Settings & Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-xs font-bold text-on-surface block leading-tight group-hover:text-primary transition-colors">
                      {initialPatientProfile.name}
                    </span>
                    <span className="text-[10px] text-outline font-medium block">
                      Patient #{initialPatientProfile.id}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-1 text-outline hover:text-on-surface rounded-lg transition-colors cursor-pointer"
                  title="Profile menu options"
                  aria-label="Profile menu options"
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
              </div>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-[calc(100vw-32px)] max-w-xs sm:w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high z-50 p-2"
                  >
                    <div className="p-3 bg-surface-container-low rounded-xl mb-2">
                      <span className="text-xs font-bold text-on-surface block">{initialPatientProfile.name}</span>
                      <span className="text-[11px] text-on-surface-variant block">{initialPatientProfile.email}</span>
                      <span className="mt-1.5 inline-block text-[10px] font-bold text-secondary bg-secondary-fixed/60 px-2 py-0.5 rounded-full">
                        Delta Dental Premier Active
                      </span>
                    </div>

                    <Link
                      to="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">manage_accounts</span>
                      <span>Profile & Settings</span>
                    </Link>

                    <Link
                      to="/dashboard/billing"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">receipt_long</span>
                      <span>Billing & Payments</span>
                    </Link>

                    <Link
                      to="/dashboard/support"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">support_agent</span>
                      <span>Support & Helpdesk</span>
                    </Link>

                    <Link
                      to="/dashboard/patient-rights"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">assignment_turned_in</span>
                      <span>Patient Rights</span>
                    </Link>

                    <div className="h-[1px] bg-surface-container-high my-1"></div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-error hover:bg-error-container/20 transition-colors cursor-pointer text-left"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign Out of Portal</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Portal Bottom Legal & Support Footer */}
        <footer className="w-full bg-surface-container-low py-4 border-t border-surface-container-high px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant text-xs">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary">shield_with_heart</span>
              <span>© 2026 Smile Clinic Health System. All health records encrypted.</span>
            </div>
            <div className="flex items-center gap-6 text-[11px] font-medium">
              <Link to="/dashboard/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/dashboard/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/dashboard/patient-rights" className="hover:text-primary transition-colors">Patient Rights</Link>
              <Link to="/dashboard/support" className="hover:text-primary transition-colors">Support Desk</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
