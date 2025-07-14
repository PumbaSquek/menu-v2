import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001/api';

export function useFileStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we're in iframe or if backend is not available
        const isInIframe = window !== window.parent;
        if (isInIframe) {
          console.log(`[useFileStorage] ${key} - Using localStorage fallback in iframe`);
          setUseLocalStorage(true);
          loadFromLocalStorage();
          return;
        }

        // Try to load from backend with short timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
        
        try {
          const response = await fetch(`${API_BASE}/data/${key}`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            setStoredValue(data);
            console.log(`[useFileStorage] ${key} - Loaded from backend:`, data);
          } else if (response.status === 404) {
            // File doesn't exist yet, use initial value
            setStoredValue(initialValue);
            console.log(`[useFileStorage] ${key} - File not found, using initial value`);
          } else {
            throw new Error(`Backend error: ${response.status}`);
          }
        } catch (fetchErr) {
          clearTimeout(timeoutId);
          throw fetchErr;
        }
      } catch (err) {
        console.warn(`[useFileStorage] ${key} - Backend not available, falling back to localStorage:`, err);
        setUseLocalStorage(true);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const item = window.localStorage.getItem(`trattoria_${key}`);
        const data = item ? JSON.parse(item) : initialValue;
        setStoredValue(data);
      } catch (err) {
        console.error(`[useFileStorage] ${key} - Error loading from localStorage:`, err);
        setStoredValue(initialValue);
      }
    };

    loadData();
  }, [key, initialValue]);

  const setValue = async (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    
    try {
      setStoredValue(valueToStore);
      setError(null);

      if (useLocalStorage) {
        // Save to localStorage
        window.localStorage.setItem(`trattoria_${key}`, JSON.stringify(valueToStore));
        console.log(`[useFileStorage] ${key} - Saved to localStorage:`, valueToStore);
        return;
      }

      // Try to save to backend with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
      
      try {
        const response = await fetch(`${API_BASE}/data/${key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: valueToStore }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to save data: ${response.status}`);
        }
        console.log(`[useFileStorage] ${key} - Saved to backend:`, valueToStore);
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      console.error(`[useFileStorage] ${key} - Error saving:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Fallback to localStorage
      try {
        window.localStorage.setItem(`trattoria_${key}`, JSON.stringify(valueToStore));
        setUseLocalStorage(true); // Switch to localStorage mode
        console.log(`[useFileStorage] ${key} - Saved to localStorage as fallback`);
      } catch (localErr) {
        console.error(`[useFileStorage] ${key} - Failed to save to localStorage:`, localErr);
        // Revert to previous value on complete failure
        setStoredValue(storedValue);
      }
    }
  };

  return [storedValue, setValue, { loading, error, useLocalStorage }] as const;
}