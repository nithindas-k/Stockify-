import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const AdminProtectedRoute: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
