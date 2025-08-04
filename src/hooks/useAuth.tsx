import { createContext, useContext, ReactNode } from 'react';
import { useFileStorage } from '@/hooks/useFileStorage';
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
  const isInIframe = window !== window.parent;

  // Persistenza utenti e utente corrente su disco
  const [users, setUsers, usersMeta] = useFileStorage<User[]>('users', []);
  const [currentUser, setCurrentUser, currentMeta] =
    useFileStorage<User | null>('current_user', null);
  const loading = usersMeta.loading || currentMeta.loading;
  const error = usersMeta.error || currentMeta.error;

  const login = async (username: string, password: string): Promise<boolean> => {
    const found = users.find((u) => u.username === username);
    if (found && found.password === password) {
      const loggedUser: User = {
        id: found.id,
        username: found.username,
        name: found.name,
        lastLogin: new Date().toISOString(),
      };
      setCurrentUser(loggedUser);
      return true;
    }
    return false;
  };

  const register = async (newUser: User): Promise<void> => {
    // aggiunge l’utente e salva su disco
    setUsers([...users, newUser]);

    // auto-login
    const loggedUser: User = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(loggedUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Demo user se in iframe
  const demoUser: User = {
    id: 'demo',
    username: 'demo',
    name: 'Demo User',
    lastLogin: new Date().toISOString(),
  };

  const value: AuthContextType = {
    user: isInIframe ? demoUser : currentUser,
    login,
    logout,
    register,
    isAuthenticated: isInIframe ? true : !!currentUser,
    loading,
    error,
  };

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

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
