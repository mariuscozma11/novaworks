import { User, UserRole } from './types';

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'auth_user';

  static setAuth(token: string, user: User) {
    if (typeof window === 'undefined') return;
    console.log('AuthService.setAuth: Storing user', {
      user,
      role: user.role,
      stringified: JSON.stringify(user)
    });
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      console.log('AuthService.getUser: Retrieved user', {
        user,
        role: user?.role,
        rawString: userStr
      });
      return user;
    } catch {
      return null;
    }
  }

  static clearAuth() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === UserRole.ADMIN;
  }

  static logout() {
    this.clearAuth();
    window.location.href = '/';
  }
}
