import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

interface RegistrationFormProps {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
  existingUsers: User[];
}

export function RegistrationForm({ onRegister, onSwitchToLogin, existingUsers }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username è obbligatorio';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username deve essere almeno 3 caratteri';
    } else if (existingUsers.some(user => user.username === formData.username)) {
      newErrors.username = 'Username già esistente';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nome è obbligatorio';
    }

    if (!formData.password) {
      newErrors.password = 'Password è obbligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password deve essere almeno 6 caratteri';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non corrispondono';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username,
        name: formData.name,
        password: formData.password, // Store plain text for now (local use only)
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      onRegister(newUser);
      
      toast({
        title: "Registrazione completata",
        description: "Account creato con successo!"
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante la registrazione",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Registrazione
          </CardTitle>
          <CardDescription>
            Crea il tuo account per la gestione del menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="Inserisci username"
                disabled={isLoading}
              />
              {errors.username && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.username}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Inserisci nome completo"
                disabled={isLoading}
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Inserisci password"
                disabled={isLoading}
              />
              {errors.password && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.password}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Conferma password"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.confirmPassword}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registrazione...' : 'Registrati'}
            </Button>

            <div className="text-center pt-4">
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToLogin}
                disabled={isLoading}
              >
                Hai già un account? Accedi qui
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}