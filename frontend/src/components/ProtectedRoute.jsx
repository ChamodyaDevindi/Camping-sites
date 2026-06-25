import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is logged in but doesn't have the right role
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'ROLE_OWNER') return <Navigate to="/dashboard" replace />;
    if (user.role === 'ROLE_CUSTOMER') return <Navigate to="/my-bookings" replace />;
    
    // Fallback if role is undefined or invalid (e.g. old logged in user)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
