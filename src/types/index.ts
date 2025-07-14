export interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: DishCategory;
  available: boolean;
  createdAt: string;
}

export interface MenuDay {
  id: string;
  date: string;
  dishes: Dish[];
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  lastLogin: string;
}

export type DishCategory = 
  | 'antipasti'
  | 'primi'
  | 'secondi'
  | 'contorni'
  | 'dolci'
  | 'caffetteria'
  | 'bevande';

export const DISH_CATEGORIES: { key: DishCategory; label: string }[] = [
  { key: 'antipasti', label: 'Antipasti' },
  { key: 'primi', label: 'Primi Piatti' },
  { key: 'secondi', label: 'Secondi Piatti' },
  { key: 'contorni', label: 'Contorni' },
  { key: 'dolci', label: 'Dolci' },
  { key: 'caffetteria', label: 'Amari e Caffetteria' },
  { key: 'bevande', label: 'Bevande' },
];