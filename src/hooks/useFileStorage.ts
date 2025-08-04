import { useState, useEffect, useRef } from 'react';

const API_BASE = '/api';

export function useFileStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Evita doppi caricamenti e loop (StrictMode/dev e re-render)
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return; // esegui solo una volta per "key"
    loadedRef.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // in iframe → usa localStorage
        const isInIframe = window !== window.parent;
        if (isInIframe) {
          setUseLocalStorage(true);
          loadFromLocalStorage();
          return;
        }

        // tenta backend con timeout più alto
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          const response = await fetch(`${API_BASE}/data/${key}`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            setStoredValue(data);
          } else if (response.status === 404) {
            // file mancante: usa initialValue
            setStoredValue(initialValue);
          } else {
            throw new Error(`Backend error: ${response.status}`);
          }
        } catch (fetchErr) {
          clearTimeout(timeoutId);
          throw fetchErr;
        }
      } catch (err) {
        // fallback a localStorage
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
      } catch {
        setStoredValue(initialValue);
      }
    };

    loadData();
  // ⚠️ Dipende solo da "key": NON mettere initialValue qui
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;

    try {
      setStoredValue(valueToStore);
      setError(null);

      if (useLocalStorage) {
        window.localStorage.setItem(`trattoria_${key}`, JSON.stringify(valueToStore));
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(`${API_BASE}/data/${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: valueToStore }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to save data: ${response.status}`);
        }
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err) {
      // fallback locale in caso di errore salvataggio
      try {
        window.localStorage.setItem(`trattoria_${key}`, JSON.stringify(valueToStore));
        setUseLocalStorage(true);
      } catch {
        // ripristina il precedente se proprio fallisce
        setStoredValue(storedValue);
      }
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return [storedValue, setValue, { loading, error, useLocalStorage }] as const;
}
