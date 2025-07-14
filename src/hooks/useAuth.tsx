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

  const value = {
    user: currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
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