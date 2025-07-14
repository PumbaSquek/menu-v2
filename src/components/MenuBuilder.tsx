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
          <title>Menu del Giorno - Trattoria del Borgo</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .menu-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #d4a574; padding-bottom: 20px; }
            .menu-title { font-size: 28px; font-weight: bold; color: #8b4513; margin-bottom: 10px; }
            .menu-date { font-size: 16px; color: #666; }
            .category { margin-bottom: 25px; }
            .category-title { font-size: 20px; font-weight: bold; color: #d4a574; border-bottom: 1px solid #d4a574; padding-bottom: 5px; margin-bottom: 15px; }
            .dish { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; padding: 8px 0; }
            .dish-info { flex: 1; }
            .dish-name { font-weight: bold; font-size: 16px; color: #333; }
            .dish-description { font-size: 14px; color: #666; margin-top: 3px; font-style: italic; }
            .dish-price { font-weight: bold; color: #8b4513; font-size: 16px; }
            .menu-footer { margin-top: 30px; text-align: center; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <div class="menu-footer">
            <p>Trattoria del Borgo - Via Roma, 123 - Tel. 0123 456789</p>
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
            onClick={handleExportPDF}
            disabled={selectedDishes.length === 0 || isExporting}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {isExporting ? 'Esportazione...' : 'Esporta PDF'}
          </Button>
          
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
              <div className="menu-header mb-8 text-center">
                <h1 className="menu-title text-3xl font-bold text-primary mb-2">
                  Menu del Giorno
                </h1>
                <h2 className="text-xl text-muted-foreground mb-2">Trattoria del Borgo</h2>
                <div className="menu-date flex items-center justify-center gap-2 text-muted-foreground">
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
                      <h3 className="category-title text-xl font-semibold text-primary border-b border-primary/30 pb-2 mb-4">
                        {category.label}
                      </h3>
                      <div className="space-y-3">
                        {categoryDishes.map(dish => (
                          <div key={dish.id} className="dish flex justify-between items-start group">
                            <div className="dish-info flex-1 pr-4">
                              <h4 className="dish-name font-medium text-lg">{dish.name}</h4>
                              {dish.description && (
                                <p className="dish-description text-sm text-muted-foreground mt-1 italic">
                                  {dish.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="dish-price font-bold text-primary text-lg">
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