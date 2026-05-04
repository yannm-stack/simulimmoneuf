
/**
 * Utility to safely access localStorage and sessionStorage.
 * Prevents SecurityError or other storage-related crashes in restricted environments (Chrome Incognito, Iframes, etc.)
 */

export const safeStorage = {
  localStorage: {
    getItem(key: string): string | null {
      try {
        if (typeof window === 'undefined') return null;
        return window.localStorage.getItem(key);
      } catch (e) {
        console.warn(`SafeStorage: Error getting ${key} from localStorage`, e);
        return null;
      }
    },
    setItem(key: string, value: string): void {
      try {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.warn(`SafeStorage: Error setting ${key} in localStorage`, e);
      }
    },
    removeItem(key: string): void {
      try {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
      } catch (e) {
        console.warn(`SafeStorage: Error removing ${key} from localStorage`, e);
      }
    },
    clear(): void {
      try {
        if (typeof window === 'undefined') return;
        window.localStorage.clear();
      } catch (e) {
        console.warn("SafeStorage: Error clearing localStorage", e);
      }
    },
    get isAvailable(): boolean {
      try {
        if (typeof window === 'undefined') return false;
        const testKey = '__storage_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    }
  },
  sessionStorage: {
    getItem(key: string): string | null {
      try {
        if (typeof window === 'undefined') return null;
        return window.sessionStorage.getItem(key);
      } catch (e) {
        console.warn(`SafeStorage: Error getting ${key} from sessionStorage`, e);
        return null;
      }
    },
    setItem(key: string, value: string): void {
      try {
        if (typeof window === 'undefined') return;
        window.sessionStorage.setItem(key, value);
      } catch (e) {
        console.warn(`SafeStorage: Error setting ${key} in sessionStorage`, e);
      }
    },
    removeItem(key: string): void {
      try {
        if (typeof window === 'undefined') return;
        window.sessionStorage.removeItem(key);
      } catch (e) {
        console.warn(`SafeStorage: Error removing ${key} from sessionStorage`, e);
      }
    },
    clear(): void {
      try {
        if (typeof window === 'undefined') return;
        window.sessionStorage.clear();
      } catch (e) {
        console.warn("SafeStorage: Error clearing sessionStorage", e);
      }
    },
    get isAvailable(): boolean {
      try {
        if (typeof window === 'undefined') return false;
        const testKey = '__storage_test__';
        window.sessionStorage.setItem(testKey, testKey);
        window.sessionStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
};
