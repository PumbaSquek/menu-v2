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
  const isInIframe = window !== window.parent;
  
  // Use file storage hooks with error handling
  const [users, setUsers, { loading: usersLoading, error: usersError }] = useFileStorage<User[]>('users', []);
  const [currentUser, setCurrentUser, { loading: currentUserLoading, error: currentUserError }] = useFileStorage<User | null>('current_user', null);
  
  const loading = usersLoading || currentUserLoading;
  const error = usersError || currentUserError;
  
  console.log('[AuthProvider] State:', { users: users?.length, currentUser: currentUser?.username, loading, error });

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

  // In iframe mode, provide a demo user to bypass storage issues
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
    register,
    isAuthenticated: isInIframe ? true : !!currentUser,
    loading,
    error
  };

  // Don't render children until the provider is ready (except in iframe)
  if (!isInIframe && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}