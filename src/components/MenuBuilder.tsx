import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Printer, Trash2, Euro, Calendar } from 'lucide-react';
import { Dish, DISH_CATEGORIES } from '@/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface MenuBuilderProps {
  selectedDishes: Dish[];
  onRemoveDish: (dishId: string) => void;
  onClearMenu: () => void;
}

export function MenuBuilder({
  selectedDishes,
  onRemoveDish,
  onClearMenu
}: MenuBuilderProps) {
  const [isExporting, setIsExporting] = useState(false);

  const getDishesForCategory = (category: string) => selectedDishes.filter(dish => dish.category === category);
  
  const getTotalPrice = () => selectedDishes.reduce((sum, dish) => sum + dish.price, 0);

  const handlePrintMenu = () => {
    const printContent = document.getElementById('menu-preview');
    if (!printContent) return;
    
    // Clone the content and remove trash buttons
    const clonedContent = printContent.cloneNode(true) as HTMLElement;
    const trashButtons = clonedContent.querySelectorAll('.no-print');
    trashButtons.forEach(button => button.remove());
    
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Menu del Giorno - Da Zia Lina</title>
          <style>
            body { font-family: 'Georgia', serif; margin: 15px; background: #faf9f7; color: #5d4e37; font-size: 14px; max-width: 800px; margin: 0 auto; padding: 15px; }
            .menu-header { text-align: center; margin-bottom: 20px; border: 2px double #b8860b; padding: 20px; background: linear-gradient(135deg, #fdf9f3, #f9f1e6); border-radius: 8px; }
            .menu-title { font-size: 28px; font-weight: bold; color: #5d4e37; margin-bottom: 5px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); letter-spacing: 1px; }
            .restaurant-name { font-size: 20px; font-weight: bold; color: #b8860b; margin-bottom: 8px; font-style: italic; }
            .restaurant-address { font-size: 14px; color: #8b7355; margin-bottom: 10px; font-weight: 500; }
            .menu-date { font-size: 12px; color: #8b7355; background: #f5f5dc; padding: 6px 12px; border-radius: 15px; display: inline-block; border: 1px solid #b8860b; }
            .category { margin-bottom: 20px; }
            .category-title { font-size: 16px; font-weight: bold; color: #5d4e37; font-style: italic; margin-bottom: 8px; }
            .dish { margin-bottom: 8px; padding: 4px 0; margin-left: 15px; }
            .dish-info { display: flex; align-items: baseline; gap: 8px; }
            .dish-name { font-weight: 600; font-size: 14px; color: #5d4e37; }
            .dish-description { font-size: 11px; color: #8b7355; font-style: italic; line-height: 1.3; margin-top: 2px; margin-left: 15px; }
            .dish-price { font-weight: bold; color: #b8860b; font-size: 14px; }
            .dotted-line { flex: 1; border-bottom: 1px dotted #b8860b; margin-bottom: 2px; }
            .category-line { height: 1px; background: #b8860b; opacity: 0.4; margin: 8px 0; }
            .menu-footer { margin-top: 25px; text-align: center; font-size: 11px; color: #8b7355; border-top: 2px solid #b8860b; padding-top: 15px; background: #fdf9f3; border-radius: 6px; padding: 15px; }
            .no-print { display: none !important; }
            .decorative-line { height: 1px; background: linear-gradient(to right, transparent, #b8860b, transparent); margin: 8px 0; }
          </style>
        </head>
        <body>
          ${clonedContent.innerHTML}
          <div class="menu-footer">
            <div class="decorative-line"></div>
            <p><strong>Da Zia Lina</strong><br/>Via Spogliatore, 89900 Vibo Valentia VV</p>
            <p>Menu generato il ${new Date().toLocaleDateString('it-IT')}</p>
            <div class="decorative-line"></div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Menu del Giorno</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {selectedDishes.length} piatti
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Euro className="h-3 w-3 mr-1" />
              {getTotalPrice().toFixed(2)}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrintMenu} disabled={selectedDishes.length === 0} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Stampa
          </Button>
          
          <Button variant="destructive" onClick={onClearMenu} disabled={selectedDishes.length === 0} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Svuota Menu
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {selectedDishes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">Menu vuoto</h3>
              <p className="text-muted-foreground">
                Seleziona i piatti dalla sidebar per iniziare a creare il menu del giorno
              </p>
            </div>
          ) : (
            <div id="menu-preview" className="bg-card max-w-4xl mx-auto">
              <div className="menu-header mb-6 text-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-6 rounded-lg border border-primary/20 shadow-sm">
                <div className="text-3xl mb-3">🍝</div>
                <h1 className="menu-title text-3xl font-bold text-primary mb-2 font-serif tracking-wide">
                  Menu del Giorno
                </h1>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-12 h-px bg-accent/60"></div>
                  <div className="text-lg">🌿</div>
                  <div className="w-12 h-px bg-accent/60"></div>
                </div>
                <h2 className="restaurant-name text-xl font-bold text-accent mb-2 italic">Da Zia Lina</h2>
                <p className="restaurant-address text-sm text-muted-foreground mb-3 font-medium">
                  Via Spogliatore, 89900 Vibo Valentia VV
                </p>
                <div className="menu-date flex items-center justify-center gap-1 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-primary/20">
                  <Calendar className="h-4 w-4" />
                  {new Date().toLocaleDateString('it-IT', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div className="bg-card/50 p-6 rounded-lg border border-primary/10 shadow-sm">
                {DISH_CATEGORIES.map(category => {
                  const categoryDishes = getDishesForCategory(category.key);
                  if (categoryDishes.length === 0) return null;
                  
                  return (
                    <div key={category.key} className="category mb-6 last:mb-0">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-px bg-accent/40"></div>
                        <h3 className="category-title text-lg font-bold text-primary mx-4 italic">
                          {category.label}
                        </h3>
                        <div className="flex-1 h-px bg-accent/40"></div>
                      </div>
                      
                      <div className="space-y-3 ml-4">
                        {categoryDishes.map(dish => (
                          <div key={dish.id} className="dish flex justify-between items-start group hover:bg-muted/20 transition-colors rounded p-2">
                            <div className="dish-info flex-1 pr-4">
                              <div className="flex items-baseline gap-2">
                                <h4 className="dish-name font-semibold text-base text-primary font-serif">{dish.name}</h4>
                                <div className="flex-1 border-b border-dotted border-accent/30 mb-1"></div>
                                <span className="dish-price font-bold text-accent text-base">
                                  €{dish.price.toFixed(2)}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => onRemoveDish(dish.id)} 
                                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-destructive hover:text-destructive no-print ml-2"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              {dish.description && (
                                <p className="dish-description text-muted-foreground text-sm italic mt-1 leading-relaxed">
                                  {dish.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}