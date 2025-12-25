import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for localStorage with React state sync
 * Fixed: Uses ref to avoid stale closure issues with rapid state updates
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    const readValue = (): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Use ref to always have access to the latest value
    const storedValueRef = useRef<T>(storedValue);

    // Keep ref in sync with state
    useEffect(() => {
        storedValueRef.current = storedValue;
    }, [storedValue]);

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            // Use ref to get the latest value, avoiding stale closure
            const valueToStore =
                value instanceof Function ? value(storedValueRef.current) : value;

            // Update the ref immediately
            storedValueRef.current = valueToStore;

            // Update React state
            setStoredValue(valueToStore);

            // Persist to localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key]);

    return [storedValue, setValue] as const;
}
