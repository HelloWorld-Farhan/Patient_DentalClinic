import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import DentalRecords from './pages/DentalRecords';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PatientRights from './pages/PatientRights';
import Support from './pages/Support';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      {/* Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Informational & Support Routes */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/patient-rights" element={<PatientRights />} />
      <Route path="/support" element={<Support />} />

      {/* Direct Clean Redirects for any legacy dashboard paths (does NOT mount Layout) */}
      <Route path="/dashboard/support" element={<Navigate to="/support" replace />} />
      <Route path="/dashboard/privacy-policy" element={<Navigate to="/privacy-policy" replace />} />
      <Route path="/dashboard/terms-of-service" element={<Navigate to="/terms-of-service" replace />} />
      <Route path="/dashboard/patient-rights" element={<Navigate to="/patient-rights" replace />} />

      {/* Protected Patient Portal Routes */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="records" element={<DentalRecords />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
}
