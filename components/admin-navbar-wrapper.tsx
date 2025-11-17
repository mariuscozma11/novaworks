'use client';

import { useAuth } from './auth-provider';
import { AdminNavbar } from './admin-navbar';

export function AdminNavbarWrapper() {
  const { isAdmin, user } = useAuth();

  // Debug logging
  console.log('AdminNavbarWrapper: isAdmin =', isAdmin, 'user =', user);

  if (!isAdmin) return null;

  return <AdminNavbar />;
}
