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
    
    // Calculate dynamic sizing based on number of dishes
    const totalDishes = selectedDishes.length;
    const baseSize = Math.max(10, Math.min(16, 20 - Math.floor(totalDishes / 8)));
    const headerSize = Math.max(18, Math.min(28, 32 - Math.floor(totalDishes / 6)));
    const categorySize = Math.max(11, Math.min(14, 16 - Math.floor(totalDishes / 10)));
    
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Menu del Giorno - Da Zia Lina</title>
          <style>
            @page { margin: 15mm; size: A4; }
            body { 
              font-family: 'Georgia', serif; 
              margin: 0; 
              padding: 15px;
              background: #faf9f7; 
              color: #5d4e37; 
              font-size: ${baseSize}px;
              width: 100%;
              max-width: none;
              text-align: center;
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }
            .menu-content {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              max-width: 90%;
              margin: 0 auto;
            }
            .menu-header { 
              text-align: center; 
              margin-bottom: ${Math.max(15, 25 - Math.floor(totalDishes / 5))}px; 
              border: 2px solid #b8860b; 
              padding: ${Math.max(15, 25 - Math.floor(totalDishes / 8))}px; 
              background: linear-gradient(135deg, #fdf9f3, #f9f1e6); 
              border-radius: 8px; 
            }
            .menu-title { 
              font-size: ${headerSize}px; 
              font-weight: bold; 
              color: #5d4e37; 
              margin-bottom: 8px; 
              letter-spacing: 1px; 
            }
            .restaurant-name { 
              font-size: ${Math.max(14, headerSize - 6)}px; 
              font-weight: bold; 
              color: #b8860b; 
              margin-bottom: 6px; 
              font-style: italic; 
            }
            .restaurant-address { 
              font-size: ${Math.max(11, baseSize - 1)}px; 
              color: #8b7355; 
              margin-bottom: 6px; 
            }
            .menu-date { 
              font-size: ${Math.max(10, baseSize - 2)}px; 
              color: #8b7355; 
            }
            .menu-categories {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
            }
            .category { 
              margin-bottom: ${Math.max(12, 20 - Math.floor(totalDishes / 6))}px; 
              width: 100%;
              max-width: 800px;
            }
            .category-header {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: ${Math.max(8, 12 - Math.floor(totalDishes / 10))}px;
            }
            .category-line {
              flex: 1;
              height: 1px;
              background: #b8860b;
              opacity: 0.4;
              max-width: 100px;
            }
            .category-title { 
              font-size: ${categorySize}px; 
              font-weight: bold; 
              color: #5d4e37; 
              text-transform: uppercase; 
              letter-spacing: 1.5px; 
              margin: 0 20px;
              white-space: nowrap;
            }
            .dishes-container {
              display: grid;
              grid-template-columns: 1fr;
              gap: ${Math.max(3, 6 - Math.floor(totalDishes / 15))}px;
              width: 100%;
            }
            .dish { 
              display: flex;
              align-items: center;
              justify-content: center;
              padding: ${Math.max(2, 4 - Math.floor(totalDishes / 20))}px 0;
              width: 100%;
            }
            .dish-content {
              display: flex;
              align-items: baseline;
              width: 100%;
              max-width: 600px;
              gap: 8px;
            }
            .dish-name { 
              font-weight: 600; 
              font-size: ${baseSize}px; 
              color: #5d4e37; 
              flex-shrink: 0;
            }
            .dish-price { 
              font-weight: bold; 
              color: #b8860b; 
              font-size: ${baseSize}px; 
              flex-shrink: 0;
            }
            .dotted-line { 
              flex: 1; 
              border-bottom: 1px dotted #b8860b; 
              margin-bottom: 3px; 
              min-width: 20px;
            }
            .menu-footer { 
              margin-top: auto; 
              padding-top: 20px;
              text-align: center; 
              font-size: ${Math.max(9, baseSize - 3)}px; 
              color: #8b7355; 
              border-top: 1px solid #b8860b; 
            }
            .no-print { display: none !important; }
            .decorative-line { 
              height: 1px; 
              background: linear-gradient(to right, transparent, #b8860b, transparent); 
              margin: 8px auto; 
              width: 200px;
            }
          </style>
        </head>
        <body>
          <div class="menu-content">
            ${clonedContent.innerHTML}
          </div>
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
            <div id="menu-preview" className="bg-card max-w-2xl mx-auto">
              <div className="menu-header mb-2 text-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/3 p-2 rounded border border-primary/10">
                <h1 className="menu-title text-lg font-bold text-primary mb-0.5 font-serif tracking-wide">
                  Menu del Giorno
                </h1>
                <h2 className="restaurant-name text-sm font-bold text-accent mb-0.5 italic">Da Zia Lina</h2>
                <p className="restaurant-address text-xs text-muted-foreground mb-1">
                  Via Spogliatore, 89900 Vibo Valentia VV
                </p>
                <div className="menu-date text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('it-IT', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>

              <div className="menu-categories bg-card/30 p-2 rounded border border-primary/5">
                {DISH_CATEGORIES.map(category => {
                  const categoryDishes = getDishesForCategory(category.key);
                  if (categoryDishes.length === 0) return null;
                  
                  return (
                    <div key={category.key} className="category mb-1.5">
                      <div className="category-header flex items-center mb-0.5">
                        <div className="category-line w-3 h-px bg-accent/30"></div>
                        <h3 className="category-title text-xs font-bold text-primary mx-1.5 uppercase tracking-wider">
                          {category.label}
                        </h3>
                        <div className="category-line flex-1 h-px bg-accent/30"></div>
                      </div>
                      
                      <div className="dishes-container space-y-0 ml-0.5">
                        {categoryDishes.map(dish => (
                          <div key={dish.id} className="dish flex justify-between items-center group hover:bg-muted/5 transition-colors rounded px-0.5 py-0">
                            <div className="dish-content flex items-center flex-1 min-w-0">
                              <span className="dish-name text-xs font-medium text-primary mr-1 flex-shrink-0">
                                {dish.name}
                              </span>
                              <div className="dotted-line flex-1 border-b border-dotted border-accent/25 mx-0.5 min-w-2"></div>
                              <span className="dish-price text-xs font-semibold text-accent flex-shrink-0">
                                €{dish.price.toFixed(2)}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => onRemoveDish(dish.id)} 
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-3 w-3 p-0 text-destructive hover:text-destructive no-print ml-0.5"
                              >
                                <Trash2 className="h-2 w-2" />
                              </Button>
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