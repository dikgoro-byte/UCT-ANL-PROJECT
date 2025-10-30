import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-12 h-12 text-white" />
      </div>
    );
  }

  if (!user) {
    // User is not logged in
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // User is logged in, but does not have the required role
    return <Navigate to="/" />;
  }

  // User is logged in and has the correct role (or no role was required)
  return children;
};

export default ProtectedRoute;