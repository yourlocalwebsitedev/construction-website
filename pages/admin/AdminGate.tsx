import React from 'react';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminShell } from './AdminShell';

const AdminGateInner: React.FC = () => {
  const { user, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <AdminShell />;
};

export const AdminGate: React.FC = () => (
  <AdminAuthProvider>
    <AdminGateInner />
  </AdminAuthProvider>
);
