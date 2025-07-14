import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users for local authentication
const DEFAULT_USERS = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Amministratore' },
  { id: '2', username: 'staff', password: 'staff123', name: 'Staff Trattoria' }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users] = useLocalStorage('trattoria_users', DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('trattoria_current_user', null);
  
  // Check if we're in an iframe and provide demo mode
  const isInIframe = window !== window.parent;
  
  console.log('[AuthProvider] In iframe:', isInIframe);
  console.log('[AuthProvider] Current user:', currentUser);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const loggedUser: User = {
        id: user.id,
        username: user.username,
        name: user.name,
        lastLogin: new Date().toISOString()
      };
      setCurrentUser(loggedUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // In iframe mode, provide a demo user to bypass localStorage issues
  const demoUser: User = {
    id: 'demo',
    username: 'demo',
    name: 'Demo User',
    lastLogin: new Date().toISOString()
  };

  const value = {
    user: isInIframe ? demoUser : currentUser,
    login,
    logout,
    isAuthenticated: isInIframe ? true : !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}