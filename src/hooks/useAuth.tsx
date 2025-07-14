import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

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
  
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if we're in an iframe and provide demo mode
  const isInIframe = window !== window.parent;
  
  console.log('[AuthProvider] In iframe:', isInIframe);

  // Load data after component mounts
  useEffect(() => {
    const loadData = async () => {
      if (isInIframe) {
        // In iframe, use demo mode
        setLoading(false);
        return;
      }

      try {
        // Try to load from localStorage first
        const savedUsers = localStorage.getItem('trattoria_users');
        const savedCurrentUser = localStorage.getItem('trattoria_current_user');
        
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        }
        
        if (savedCurrentUser) {
          setCurrentUser(JSON.parse(savedCurrentUser));
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isInIframe]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
      const loggedUser: User = {
        id: user.id,
        username: user.username,
        name: user.name,
        lastLogin: new Date().toISOString()
      };
      setCurrentUser(loggedUser);
      
      // Save to localStorage
      try {
        localStorage.setItem('trattoria_current_user', JSON.stringify(loggedUser));
      } catch (err) {
        console.error('Error saving current user:', err);
      }
      
      return true;
    }
    return false;
  };

  const register = async (newUser: User): Promise<void> => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Save to localStorage
    try {
      localStorage.setItem('trattoria_users', JSON.stringify(updatedUsers));
    } catch (err) {
      console.error('Error saving users:', err);
    }
    
    // Auto-login after registration
    const loggedUser: User = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      lastLogin: new Date().toISOString()
    };
    setCurrentUser(loggedUser);
    
    try {
      localStorage.setItem('trattoria_current_user', JSON.stringify(loggedUser));
    } catch (err) {
      console.error('Error saving current user:', err);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('trattoria_current_user');
    } catch (err) {
      console.error('Error removing current user:', err);
    }
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}