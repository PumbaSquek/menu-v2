import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useFileStorage } from '@/hooks/useFileStorage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: User) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('[AuthProvider] Initializing...');
  
  const [users, setUsers, { loading: usersLoading, error: usersError }] = useFileStorage<User[]>('users', []);
  const [currentUser, setCurrentUser, { loading: currentUserLoading, error: currentUserError }] = useFileStorage<User | null>('current_user', null);
  
  // Check if we're in an iframe and provide demo mode
  const isInIframe = window !== window.parent;
  
  console.log('[AuthProvider] In iframe:', isInIframe);
  console.log('[AuthProvider] Users from file storage:', users);
  console.log('[AuthProvider] Current user from file storage:', currentUser);

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
      const loggedUser: User = {
        id: user.id,
        username: user.username,
        name: user.name,
        lastLogin: new Date().toISOString()
      };
      await setCurrentUser(loggedUser);
      return true;
    }
    return false;
  };

  const register = async (newUser: User): Promise<void> => {
    const updatedUsers = [...users, newUser];
    await setUsers(updatedUsers);
    
    // Auto-login after registration
    const loggedUser: User = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      lastLogin: new Date().toISOString()
    };
    await setCurrentUser(loggedUser);
  };

  const logout = async () => {
    await setCurrentUser(null);
  };

  // In iframe mode, provide a demo user to bypass file storage issues
  const demoUser: User = {
    id: 'demo',
    username: 'demo',
    name: 'Demo User',
    lastLogin: new Date().toISOString()
  };

  const loading = usersLoading || currentUserLoading;
  const error = usersError || currentUserError;

  const value = {
    user: isInIframe ? demoUser : currentUser,
    login,
    logout,
    register,
    isAuthenticated: isInIframe ? true : !!currentUser,
    loading,
    error
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