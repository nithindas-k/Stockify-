import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import VerifyPage from './pages/auth/VerifyPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import Dashboard from './pages/user/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import InventoryPage from './pages/user/InventoryPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* ── Auth ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ── User Protected Routes ── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/customers" element={<div>Customers Page (Coming Soon)</div>} />
          <Route path="/sales" element={<div>Sales Page (Coming Soon)</div>} />
          <Route path="/reports" element={<div>Reports Page (Coming Soon)</div>} />
        </Route>

        {/* ── Admin Protected Routes ── */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/inventory" element={<AdminInventoryPage />} />
          <Route path="/admin/users" element={<div className="p-8 text-white">Users (Coming Soon)</div>} />
          <Route path="/admin/orders" element={<div className="p-8 text-white">Orders (Coming Soon)</div>} />
          <Route path="/admin/reports" element={<div className="p-8 text-white">Reports (Coming Soon)</div>} />
          <Route path="/admin/notifications" element={<div className="p-8 text-white">Notifications (Coming Soon)</div>} />
          <Route path="/admin/settings" element={<div className="p-8 text-white">Settings (Coming Soon)</div>} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
