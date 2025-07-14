import { Dish } from '@/types';

export const SAMPLE_DISHES: Dish[] = [
  // Antipasti
  {
    id: 'antipasti-1',
    name: 'Bruschette alla Trattoria',
    description: 'Pane tostato con pomodoro fresco, basilico e olio extravergine',
    price: 8.50,
    category: 'antipasti',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'antipasti-2',
    name: 'Antipasto della Casa',
    description: 'Selezione di salumi, formaggi, olive e verdure sott\'olio',
    price: 14.00,
    category: 'antipasti',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'antipasti-3',
    name: 'Carpaccio di Manzo',
    description: 'Sottili fette di manzo crudo con rucola, grana e limone',
    price: 16.00,
    category: 'antipasti',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'antipasti-4',
    name: 'Tagliere di Affettati',
    description: 'Prosciutto crudo, salame, coppa e pancetta stagionata',
    price: 12.00,
    category: 'antipasti',
    available: true,
    createdAt: new Date().toISOString()
  },

  // Primi Piatti
  {
    id: 'primi-1',
    name: 'Spaghetti alla Carbonara',
    description: 'Spaghetti con uova, pecorino romano, pancetta e pepe nero',
    price: 13.00,
    category: 'primi',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'primi-2',
    name: 'Risotto ai Funghi Porcini',
    description: 'Cremoso risotto mantecato con funghi porcini freschi',
    price: 15.00,
    category: 'primi',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'primi-3',
    name: 'Lasagne della Nonna',
    description: 'Lasagne tradizionali con ragù di carne, besciamella e parmigiano',
    price: 14.50,
    category: 'primi',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'primi-4',
    name: 'Gnocchi al Pomodoro e Basilico',
    description: 'Gnocchi di patate freschi con sugo di pomodoro e basilico',
    price: 12.50,
    category: 'primi',
    available: true,
    createdAt: new Date().toISOString()
  },

  // Secondi Piatti
  {
    id: 'secondi-1',
    name: 'Bistecca alla Fiorentina',
    description: 'Bistecca di manzo alla griglia con olio, limone e rosmarino',
    price: 35.00,
    category: 'secondi',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'secondi-2',
    name: 'Branzino al Sale',
    description: 'Branzino fresco cotto in crosta di sale marino',
    price: 22.00,
    category: 'secondi',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'secondi-3',
    name: 'Pollo Arrosto alle Erbe',
    description: 'Pollo ruspante arrosto con patate e rosmarino',
    price: 18.00,
    category: 'secondi',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'secondi-4',
    name: 'Scaloppine al Limone',
    description: 'Tenere scaloppine di vitello al limone con contorno',
    price: 19.50,
    category: 'secondi',
    available: true,
    createdAt: new Date().toISOString()
  },

  // Contorni
  {
    id: 'contorni-1',
    name: 'Verdure Grigliate',
    description: 'Mix di verdure di stagione grigliate con olio e basilico',
    price: 7.00,
    category: 'contorni',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'contorni-2',
    name: 'Patate Arrosto',
    description: 'Patate dorate al forno con rosmarino e aglio',
    price: 6.00,
    category: 'contorni',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'contorni-3',
    name: 'Insalata Mista',
    description: 'Insalata fresca con pomodori, cetrioli e carote',
    price: 5.50,
    category: 'contorni',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'contorni-4',
    name: 'Spinaci Saltati',
    description: 'Spinaci freschi saltati in padella con aglio e olio',
    price: 6.50,
    category: 'contorni',
    available: true,
    createdAt: new Date().toISOString()
  },

  // Dolci
  {
    id: 'dolci-1',
    name: 'Tiramisù della Casa',
    description: 'Il classico tiramisù con mascarpone, caffè e cacao',
    price: 7.50,
    category: 'dolci',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'dolci-2',
    name: 'Panna Cotta ai Frutti di Bosco',
    description: 'Delicata panna cotta con coulis di frutti di bosco',
    price: 6.50,
    category: 'dolci',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'dolci-3',
    name: 'Gelato Artigianale',
    description: 'Selezione di gelati artigianali - 3 gusti a scelta',
    price: 5.00,
    category: 'dolci',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'dolci-4',
    name: 'Cannoli Siciliani',
    description: 'Cannoli freschi con ricotta dolce e pistacchi',
    price: 8.00,
    category: 'dolci',
    available: true,
    createdAt: new Date().toISOString()
  },

  // Caffetteria
  {
    id: 'caffetteria-1',
    name: 'Caffè Espresso',
    description: 'Espresso italiano preparato a regola d\'arte',
    price: 1.50,
    category: 'caffetteria',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'caffetteria-2',
    name: 'Cappuccino',
    description: 'Cappuccino cremoso con latte montato',
    price: 2.50,
    category: 'caffetteria',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'caffetteria-3',
    name: 'Amaro del Capo',
    description: 'Digestivo alle erbe calabresi',
    price: 4.00,
    category: 'caffetteria',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'caffetteria-4',
    name: 'Grappa di Nebbiolo',
    description: 'Pregiata grappa distillata da vinacce di Nebbiolo',
    price: 6.00,
    category: 'caffetteria',
    available: true,
    createdAt: new Date().toISOString()
  },

  // Bevande
  {
    id: 'bevande-1',
    name: 'Vino Rosso della Casa',
    description: 'Vino rosso locale selezionato - bottiglia',
    price: 18.00,
    category: 'bevande',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bevande-2',
    name: 'Birra Artigianale',
    description: 'Birra artigianale locale da 33cl',
    price: 4.50,
    category: 'bevande',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bevande-3',
    name: 'Acqua Naturale',
    description: 'Acqua naturale da 75cl',
    price: 2.50,
    category: 'bevande',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bevande-4',
    name: 'Coca Cola',
    description: 'Coca Cola classica da 33cl',
    price: 3.00,
    category: 'bevande',
    available: true,
    createdAt: new Date().toISOString()
  }
];