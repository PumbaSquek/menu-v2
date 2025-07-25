import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Euro } from 'lucide-react';
import { Dish, DishCategory, DISH_CATEGORIES } from '@/types';
import { SAMPLE_DISHES } from '@/data/sampleDishes';
import { useToast } from '@/hooks/use-toast';

interface AppSidebarProps {
  onDishSelect: (dish: Dish) => void;
  selectedDishes: Dish[];
}

export function AppSidebar({ onDishSelect, selectedDishes }: AppSidebarProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    category: 'antipasti' as DishCategory,
  });
  const { toast } = useToast();

  // Load dishes on mount
  useEffect(() => {
    const loadDishes = () => {
      try {
        const saved = localStorage.getItem('trattoria_dishes');
        if (saved) {
          setDishes(JSON.parse(saved));
        } else {
          setDishes(SAMPLE_DISHES);
          localStorage.setItem('trattoria_dishes', JSON.stringify(SAMPLE_DISHES));
        }
      } catch (err) {
        console.error('Error loading dishes:', err);
        setDishes(SAMPLE_DISHES);
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, []);

  const saveDishes = (updatedDishes: Dish[]) => {
    setDishes(updatedDishes);
    try {
      localStorage.setItem('trattoria_dishes', JSON.stringify(updatedDishes));
    } catch (err) {
      console.error('Error saving dishes:', err);
    }
  };

  const handleAddDish = () => {
    if (!newDish.name || !newDish.price) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Nome e prezzo sono obbligatori",
      });
      return;
    }

    const dish: Dish = {
      id: Date.now().toString(),
      name: newDish.name,
      description: newDish.description,
      price: parseFloat(newDish.price),
      category: newDish.category,
      available: true,
      createdAt: new Date().toISOString(),
    };

    const updatedDishes = [...dishes, dish];
    saveDishes(updatedDishes);
    setNewDish({ name: '', description: '', price: '', category: 'antipasti' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Piatto aggiunto",
      description: `${dish.name} è stato aggiunto al menu`,
    });
  };

  const handleRemoveDish = (dishId: string) => {
    const updatedDishes = dishes.filter(d => d.id !== dishId);
    saveDishes(updatedDishes);
    toast({
      title: "Piatto rimosso",
      description: "Il piatto è stato rimosso dal database",
    });
  };

  const getDishesForCategory = (category: DishCategory) => 
    dishes.filter(dish => dish.category === category);

  const isDishSelected = (dish: Dish) => 
    selectedDishes.some(selected => selected.id === dish.id);

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Database Piatti</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Aggiungi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aggiungi Nuovo Piatto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Piatto</Label>
                  <Input
                    id="name"
                    value={newDish.name}
                    onChange={(e) => setNewDish(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="es. Spaghetti alla Carbonara"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrizione (opzionale)</Label>
                  <Input
                    id="description"
                    value={newDish.description}
                    onChange={(e) => setNewDish(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Breve descrizione del piatto"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Prezzo (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.50"
                    value={newDish.price}
                    onChange={(e) => setNewDish(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="12.50"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    value={newDish.category}
                    onChange={(e) => setNewDish(prev => ({ ...prev, category: e.target.value as DishCategory }))}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    {DISH_CATEGORIES.map(cat => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleAddDish} className="w-full">
                  Aggiungi Piatto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-muted-foreground">
          {dishes.length} piatti totali
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {DISH_CATEGORIES.map(category => {
            const categoryDishes = getDishesForCategory(category.key);
            
            return (
              <div key={category.key}>
                <h3 className="category-header">{category.label}</h3>
                {categoryDishes.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Nessun piatto in questa categoria
                  </p>
                ) : (
                  <div className="space-y-2">
                    {categoryDishes.map(dish => (
                      <Card 
                        key={dish.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isDishSelected(dish) ? 'menu-item-selected' : ''
                        }`}
                        onClick={() => onDishSelect(dish)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{dish.name}</h4>
                              {dish.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {dish.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Euro className="h-3 w-3 mr-1" />
                                  {dish.price.toFixed(2)}
                                </Badge>
                                {isDishSelected(dish) && (
                                  <Badge variant="default" className="text-xs">
                                    Selezionato
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveDish(dish.id);
                              }}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}