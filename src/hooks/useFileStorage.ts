import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001/api';

export function useFileStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE}/data/${key}`);
        
        if (response.ok) {
          const data = await response.json();
          setStoredValue(data);
        } else if (response.status === 404) {
          // File doesn't exist yet, use initial value
          setStoredValue(initialValue);
        } else {
          throw new Error(`Failed to load data: ${response.status}`);
        }
      } catch (err) {
        console.error(`Error loading ${key}:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStoredValue(initialValue);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, initialValue]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setError(null);

      const response = await fetch(`${API_BASE}/data/${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: valueToStore }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.status}`);
      }
    } catch (err) {
      console.error(`Error saving ${key}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Revert to previous value on error
      setStoredValue(storedValue);
    }
  };

  return [storedValue, setValue, { loading, error }] as const;
}