import { useEffect, useState } from "react";

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}


export function useLocalStorage<T>(key: string, fallback: T) {
 const [value, setValue] = useState<T>(() => readStorage(key, fallback));
 useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
 return [value, setValue] as const;
}
