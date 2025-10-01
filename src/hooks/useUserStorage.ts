import { useAuth } from "@/hooks/useAuth";
import { useFileStorage } from "@/hooks/useFileStorage";

/**
 * Hook per salvare dati legati ad un utente specifico.
 * Se non c’è utente loggato usa la chiave base (fallback).
 */
export function useUserStorage<T>(baseKey: string, initialValue: T) {
  const { user } = useAuth();
  const key = user ? `${baseKey}_${user.id}` : baseKey;
  return useFileStorage<T>(key, initialValue);
}
