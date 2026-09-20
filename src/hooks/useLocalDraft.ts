import { useEffect, useState } from "react";

// Keeps state in sync with localStorage so a health worker doesn't lose
// an in-progress assessment if the tab reloads. This is purely a frontend
// convenience — nothing is sent anywhere.
export function useLocalDraft<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage can fail (private browsing, quota) — draft-saving
      // is a nice-to-have, so we just skip it silently.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
