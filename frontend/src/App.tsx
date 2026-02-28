import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/user/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import InventoryPage from './pages/user/InventoryPage';
import CustomersPage from './pages/user/CustomersPage';
import SalesPage from './pages/user/SalesPage';
import ReportsPage from './pages/user/ReportsPage';
import NotificationsPage from './pages/user/NotificationsPage';


function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
