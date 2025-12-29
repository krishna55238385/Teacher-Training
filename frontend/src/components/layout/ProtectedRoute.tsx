import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import type { Role } from '../../types';

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role, or unauthorized page
        if (user.role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
