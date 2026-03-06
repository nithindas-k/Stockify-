import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Spinner } from './components/ui/spinner';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const Dashboard = lazy(() => import('./pages/user/Dashboard'));
const InventoryPage = lazy(() => import('./pages/user/InventoryPage'));
const CustomersPage = lazy(() => import('./pages/user/CustomersPage'));
const SalesPage = lazy(() => import('./pages/user/SalesPage'));
const ReportsPage = lazy(() => import('./pages/user/ReportsPage'));
const NotificationsPage = lazy(() => import('./pages/user/NotificationsPage'));

import ProtectedRoute from './components/ProtectedRoute';



function RouteProgress() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <RouteProgress />
      <Suspense fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-background">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      }>
        <Routes>
          {/* ── Auth ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ── User Protected Routes ── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
