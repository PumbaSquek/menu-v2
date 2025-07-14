import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChefHat, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Menu Manager</h1>
            <p className="text-sm text-muted-foreground">Da Zia Lina</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">@{user?.username}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Esci</span>
          </Button>
        </div>
      </div>
    </header>
  );
}