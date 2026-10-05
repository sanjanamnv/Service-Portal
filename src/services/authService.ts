import { User } from '../types';

const STORAGE_KEY_AUTH = 'isLoggedIn';
const STORAGE_KEY_USER = 'currentUser';

export class AuthService {
  private static instance: AuthService;
  private listeners: Array<() => void> = [];

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }

  /**
   * Checks whether the user is logged in via localStorage
   */
  public isLoggedIn(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Retrieves the current logged in user details
   */
  public getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (data) {
        return JSON.parse(data) as User;
      }
    } catch {
      // Fallback
    }
    if (this.isLoggedIn()) {
      return {
        username: 'admin',
        email: 'admin@example.com',
        role: 'User',
        status: 'Active',
        lastLogin: new Date().toLocaleTimeString(),
      };
    }
    return null;
  }

  /**
   * Logs in with username & password
   * Demo credentials: admin / admin123
   */
  public login(username: string, password: string): { success: boolean; message?: string } {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    if (trimmedUser === 'admin' && trimmedPass === 'admin123') {
      const user: User = {
        username: 'admin',
        email: 'admin@example.com',
        role: 'User',
        status: 'Active',
        lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      try {
        localStorage.setItem(STORAGE_KEY_AUTH, 'true');
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } catch (err) {
        console.error('LocalStorage write error', err);
      }

      this.notify();
      return { success: true };
    } else {
      return { success: false, message: 'Invalid username or password.' };
    }
  }

  /**
   * Logs out the user and clears localStorage
   */
  public logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (err) {
      console.error('LocalStorage error on logout', err);
    }
    this.notify();
  }
}

export const authService = AuthService.getInstance();
