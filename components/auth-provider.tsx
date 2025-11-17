'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, UserRole } from '@/lib/types';
import { AuthService } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = AuthService.getUser();
    setUser(currentUser);

    // Log for debugging
    if (currentUser) {
      console.log('AuthProvider: User loaded', {
        email: currentUser.email,
        role: currentUser.role,
        isAdmin: currentUser.role === UserRole.ADMIN
      });
    }
  }, []);

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  // Derive auth state from user object
  const contextValue = useMemo(() => ({
    user,
    isAdmin: user?.role === UserRole.ADMIN,
    isAuthenticated: !!user,
    logout,
  }), [user]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
