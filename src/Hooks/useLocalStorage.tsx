import { useEffect, useState } from 'react';


export default function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error parsing JSON from local storage:', error);
      return defaultValue;
    }
  });

  useEffect(() => {
    function handler(e: StorageEvent) {
      if (e.key !== key) return;

      try {
        const lsi = localStorage.getItem(key);
        setValue(lsi ? JSON.parse(lsi) : defaultValue);
      } catch (error) {
        console.error('Error parsing JSON from local storage:', error);
        setValue(defaultValue);
      }
    }

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [defaultValue, key]);

  const setValueWrap = (newValue: T | ((prev: T) => T)) => {
    try {
      setValue((prev) => {
        const nextValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
        localStorage.setItem(key, JSON.stringify(nextValue));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new StorageEvent('storage', { key }));
        }
        return nextValue;
      });
    } catch (error) {
      console.error('Error stringifying JSON for local storage:', error);
    }
  };

  return [value, setValueWrap];
}