import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Check if we're in an iframe or if localStorage is available
      const isInIframe = window !== window.parent;
      console.log(`[useLocalStorage] ${key} - In iframe:`, isInIframe);
      
      if (isInIframe) {
        console.log(`[useLocalStorage] ${key} - Using fallback in iframe`);
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      console.log(`[useLocalStorage] ${key} - Retrieved:`, item);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`[useLocalStorage] Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Check if we're in an iframe
      const isInIframe = window !== window.parent;
      if (!isInIframe) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        console.log(`[useLocalStorage] ${key} - Saved:`, valueToStore);
      } else {
        console.log(`[useLocalStorage] ${key} - Skipped save in iframe:`, valueToStore);
      }
    } catch (error) {
      console.error(`[useLocalStorage] Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue] as const;
}