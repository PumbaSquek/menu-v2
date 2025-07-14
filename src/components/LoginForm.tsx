import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { RegistrationForm } from './RegistrationForm';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        toast({
          variant: "destructive",
          title: "Errore di accesso",
          description: "Username o password non corretti",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante l'accesso",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (newUser: any) => {
    try {
      await register(newUser);
      toast({
        title: "Registrazione completata",
        description: "Benvenuto! Ora puoi iniziare a gestire il menu.",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante la registrazione",
        variant: "destructive"
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center trattoria-gradient">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!isLogin) {
    return (
      <RegistrationForm
        onRegister={handleRegister}
        onSwitchToLogin={() => setIsLogin(true)}
        existingUsers={[]} // Will be validated server-side
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center trattoria-gradient p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Trattoria Menu Manager</CardTitle>
          <CardDescription>
            Accedi per gestire i menu del giorno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </form>
          
          <div className="text-center pt-4">
            <Button
              type="button"
              variant="link"
              onClick={() => setIsLogin(false)}
              disabled={isLoading}
            >
              Non hai un account? Registrati qui
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}