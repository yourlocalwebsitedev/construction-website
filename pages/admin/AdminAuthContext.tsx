import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuthChanges } from '../../services/auth';

interface AdminAuthContextValue {
  user: User | null;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({ user: null, loading: true });

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
