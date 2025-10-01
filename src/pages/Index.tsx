import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { Header } from '@/components/Header';
import { AppSidebar } from '@/components/AppSidebar';
import { MenuBuilder } from '@/components/MenuBuilder';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Dish } from '@/types';

function AppContent() {
  console.log('[AppContent] Component rendered');
  
  // Detect iframe environment
  const isInIframe = window !== window.parent;
  console.log('[AppContent] In iframe:', isInIframe);
  
  const { isAuthenticated, user } = useAuth();
  console.log('[AppContent] Auth state:', { isAuthenticated, user });
  
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

  // In iframe mode, skip authentication completely for debugging
  if (isInIframe) {
    console.log('[AppContent] Running in iframe mode - bypassing auth');
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

  if (!isAuthenticated) {
    console.log('[AppContent] Not authenticated - showing login form');
    return <LoginForm />;
  }

  console.log('[AppContent] Authenticated - showing main app');

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
       <AppContent />
       <Toaster />
     </ErrorBoundary>
   );
 };

export default Index;