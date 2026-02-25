import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import VerifyPage from './pages/auth/VerifyPage';
import Dashboard from './pages/user/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyPage />} />


        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<div>Inventory Page (Coming Soon)</div>} />
          <Route path="/customers" element={<div>Customers Page (Coming Soon)</div>} />
          <Route path="/sales" element={<div>Sales Page (Coming Soon)</div>} />
          <Route path="/reports" element={<div>Reports Page (Coming Soon)</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
