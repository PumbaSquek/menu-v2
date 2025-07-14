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

export function MenuBuilder({ selectedDishes, onRemoveDish, onClearMenu }: MenuBuilderProps) {
  const [isExporting, setIsExporting] = useState(false);

  const getDishesForCategory = (category: string) => 
    selectedDishes.filter(dish => dish.category === category);

  const getTotalPrice = () => 
    selectedDishes.reduce((sum, dish) => sum + dish.price, 0);

  const handlePrintMenu = () => {
    const printContent = document.getElementById('menu-preview');
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Menu del Giorno - Da Zia Lina</title>
          <style>
            body { font-family: 'Georgia', serif; margin: 20px; background: #fefefe; }
            .menu-header { text-align: center; margin-bottom: 30px; border: 3px double #d4a574; padding: 20px; background: linear-gradient(135deg, #fdf9f3, #f9f1e6); border-radius: 8px; }
            .menu-title { font-size: 32px; font-weight: bold; color: #8b4513; margin-bottom: 5px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); letter-spacing: 1px; }
            .restaurant-name { font-size: 24px; font-weight: bold; color: #d4a574; margin-bottom: 10px; font-style: italic; }
            .restaurant-address { font-size: 14px; color: #666; margin-bottom: 10px; }
            .menu-date { font-size: 16px; color: #666; }
            .category { margin-bottom: 30px; }
            .category-title { font-size: 22px; font-weight: bold; color: #8b4513; text-align: center; margin-bottom: 20px; position: relative; padding: 10px 0; }
            .category-title:before, .category-title:after { content: '🌿'; font-size: 16px; position: absolute; top: 50%; transform: translateY(-50%); }
            .category-title:before { left: 20%; }
            .category-title:after { right: 20%; }
            .dish { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; padding: 12px 0; border-bottom: 1px dotted #d4a574; }
            .dish:last-child { border-bottom: none; }
            .dish-info { flex: 1; }
            .dish-name { font-weight: bold; font-size: 18px; color: #8b4513; margin-bottom: 5px; }
            .dish-description { font-size: 15px; color: #666; margin-top: 3px; font-style: italic; line-height: 1.4; }
            .dish-price { font-weight: bold; color: #d4a574; font-size: 18px; background: #fdf9f3; padding: 5px 10px; border-radius: 15px; border: 1px solid #d4a574; }
            .menu-footer { margin-top: 40px; text-align: center; font-size: 14px; color: #666; border-top: 2px solid #d4a574; padding-top: 20px; background: #fdf9f3; border-radius: 8px; padding: 20px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <div class="menu-footer">
            <p><strong>Da Zia Lina</strong><br/>Via Spogliatore, 89900 Vibo Valentia VV</p>
            <p>Menu generato il ${new Date().toLocaleDateString('it-IT')}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('menu-preview');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `menu_${new Date().toLocaleDateString('it-IT').replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Errore durante l\'esportazione PDF:', error);
    } finally {
      setIsExporting(false);
    }
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
          <Button
            variant="outline"
            onClick={handlePrintMenu}
            disabled={selectedDishes.length === 0}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Stampa
          </Button>
          
          <Button
            variant="destructive"
            onClick={onClearMenu}
            disabled={selectedDishes.length === 0}
            className="flex items-center gap-2"
          >
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
            <div id="menu-preview" className="bg-background">
              <div className="menu-header mb-8 text-center bg-gradient-to-br from-accent/5 to-primary/5 p-8 rounded-xl border-2 border-dashed border-primary/30">
                <div className="text-4xl mb-4">🍝</div>
                <h1 className="menu-title text-4xl font-bold text-primary mb-3 font-serif tracking-wide drop-shadow-sm">
                  Menu del Giorno
                </h1>
                <h2 className="restaurant-name text-2xl font-bold text-accent mb-3 italic">Da Zia Lina</h2>
                <p className="restaurant-address text-sm text-muted-foreground mb-4">
                  Via Spogliatore, 89900 Vibo Valentia VV
                </p>
                <div className="menu-date flex items-center justify-center gap-2 text-muted-foreground bg-card px-4 py-2 rounded-full border">
                  <Calendar className="h-4 w-4" />
                  {new Date().toLocaleDateString('it-IT', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              <div className="space-y-8">
                {DISH_CATEGORIES.map(category => {
                  const categoryDishes = getDishesForCategory(category.key);
                  
                  if (categoryDishes.length === 0) return null;
                  
                  return (
                    <div key={category.key} className="category">
                      <div className="relative mb-6">
                        <h3 className="category-title text-2xl font-bold text-primary text-center py-3 relative">
                          <span className="absolute left-1/4 top-1/2 transform -translate-y-1/2 text-accent">🌿</span>
                          {category.label}
                          <span className="absolute right-1/4 top-1/2 transform -translate-y-1/2 text-accent">🌿</span>
                        </h3>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                      </div>
                      <div className="space-y-3">
                        {categoryDishes.map(dish => (
                           <div key={dish.id} className="dish flex justify-between items-start group py-4 border-b border-dotted border-accent/30 last:border-b-0">
                            <div className="dish-info flex-1 pr-4">
                              <h4 className="dish-name font-bold text-lg text-primary mb-2 font-serif">{dish.name}</h4>
                              {dish.description && (
                                <p className="dish-description text-muted-foreground mt-1 italic leading-relaxed">
                                  {dish.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="dish-price font-bold text-accent text-lg bg-accent/10 px-3 py-1 rounded-full border border-accent/30">
                                €{dish.price.toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveDish(dish.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-destructive hover:text-destructive print:hidden"
                              >
                                <Trash2 className="h-4 w-4" />
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