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
            body { font-family: 'Georgia', serif; margin: 15px; background: #faf9f7; color: #5d4e37; font-size: 14px; }
            .menu-header { text-align: center; margin-bottom: 15px; border: 2px double #b8860b; padding: 15px; background: linear-gradient(135deg, #fdf9f3, #f9f1e6); border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .menu-title { font-size: 24px; font-weight: bold; color: #5d4e37; margin-bottom: 5px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); letter-spacing: 1px; }
            .restaurant-name { font-size: 18px; font-weight: bold; color: #b8860b; margin-bottom: 8px; font-style: italic; }
            .restaurant-address { font-size: 12px; color: #8b7355; margin-bottom: 8px; font-weight: 500; }
            .menu-date { font-size: 11px; color: #8b7355; background: #f5f5dc; padding: 4px 8px; border-radius: 12px; display: inline-block; border: 1px solid #b8860b; }
            .category { margin-bottom: 15px; background: #fdfcfa; padding: 12px; border-radius: 6px; border: 1px solid #e8dcc0; }
            .category-title { font-size: 16px; font-weight: bold; color: #5d4e37; text-align: center; margin-bottom: 8px; position: relative; padding: 8px 0; background: linear-gradient(135deg, #f9f6f0, #f5f2ea); border-radius: 4px; border: 1px solid #b8860b; }
            .category-title:before, .category-title:after { content: '🌿'; font-size: 12px; position: absolute; top: 50%; transform: translateY(-50%); }
            .category-title:before { left: 15%; }
            .category-title:after { right: 15%; }
            .dish { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px dotted #b8860b; }
            .dish:last-child { border-bottom: none; }
            .dish-info { flex: 1; }
            .dish-name { font-weight: bold; font-size: 14px; color: #5d4e37; margin-bottom: 3px; line-height: 1.2; }
            .dish-description { font-size: 11px; color: #8b7355; margin-top: 2px; font-style: italic; line-height: 1.3; }
            .dish-price { font-weight: bold; color: #b8860b; font-size: 14px; background: #fdf9f3; padding: 4px 8px; border-radius: 12px; border: 1px solid #b8860b; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .menu-footer { margin-top: 20px; text-align: center; font-size: 11px; color: #8b7355; border-top: 2px solid #b8860b; padding-top: 15px; background: #fdf9f3; border-radius: 6px; padding: 15px; }
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
            <div id="menu-preview" className="bg-card">
              <div className="menu-header mb-4 text-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-4 rounded-lg border border-primary/20 shadow-sm">
                <div className="text-2xl mb-2">🍝</div>
                <div className="border-2 border-double border-accent/40 p-3 rounded-lg bg-card/50">
                  <h1 className="menu-title text-2xl font-bold text-primary mb-2 font-serif tracking-wide">
                    Menu del Giorno
                  </h1>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-px bg-accent/60"></div>
                    <div className="text-sm">🌿</div>
                    <div className="w-8 h-px bg-accent/60"></div>
                  </div>
                  <h2 className="restaurant-name text-lg font-bold text-accent mb-2 italic">Da Zia Lina</h2>
                  <p className="restaurant-address text-xs text-muted-foreground mb-2 font-medium">
                    Via Spogliatore, 89900 Vibo Valentia VV
                  </p>
                  <div className="menu-date flex items-center justify-center gap-1 text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-primary/20">
                    <Calendar className="h-3 w-3" />
                    {new Date().toLocaleDateString('it-IT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {DISH_CATEGORIES.map(category => {
                  const categoryDishes = getDishesForCategory(category.key);
                  if (categoryDishes.length === 0) return null;
                  
                  return (
                    <div key={category.key} className="category">
                      <div className="relative mb-2">
                        <div className="flex items-center justify-center mb-1">
                          <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>
                          <div className="mx-2 text-sm">🌿</div>
                          <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>
                        </div>
                        <h3 className="category-title text-lg font-bold text-primary text-center py-2 relative bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg border border-primary/20">
                          {category.label}
                        </h3>
                      </div>
                      <div className="bg-card/50 p-3 rounded-lg border border-primary/10 shadow-sm">
                        <div className="space-y-2">
                          {categoryDishes.map(dish => (
                            <div key={dish.id} className="dish flex justify-between items-start group py-2 border-b border-dotted border-accent/40 last:border-b-0 hover:bg-muted/30 transition-colors rounded px-1">
                              <div className="dish-info flex-1 pr-3">
                                <h4 className="dish-name font-bold text-sm text-primary mb-1 font-serif leading-tight">{dish.name}</h4>
                                {dish.description && (
                                  <p className="dish-description text-muted-foreground text-xs italic leading-relaxed">
                                    {dish.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="dish-price font-bold text-accent text-sm bg-accent/15 px-2 py-1 rounded-full border border-accent/30 shadow-sm">
                                  €{dish.price.toFixed(2)}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => onRemoveDish(dish.id)} 
                                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-destructive hover:text-destructive no-print"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
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