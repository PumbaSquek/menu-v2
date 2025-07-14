import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { Header } from '@/components/Header';
import { AppSidebar } from '@/components/AppSidebar';
import { MenuBuilder } from '@/components/MenuBuilder';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Dish } from '@/types';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([]);

  const handleDishSelect = (dish: Dish) => {
    setSelectedDishes(prev => {
      const isAlreadySelected = prev.some(d => d.id === dish.id);
      if (isAlreadySelected) {
        return prev.filter(d => d.id !== dish.id);
      } else {
        return [...prev, dish];
      }
    });
  };

  const handleRemoveDish = (dishId: string) => {
    setSelectedDishes(prev => prev.filter(d => d.id !== dishId));
  };

  const handleClearMenu = () => {
    setSelectedDishes([]);
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar 
          onDishSelect={handleDishSelect}
          selectedDishes={selectedDishes}
        />
        <MenuBuilder
          selectedDishes={selectedDishes}
          onRemoveDish={handleRemoveDish}
          onClearMenu={handleClearMenu}
        />
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default Index;