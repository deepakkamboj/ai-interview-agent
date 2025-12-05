const isBrowser = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function readJsonStorage<T>(
  key: string,
  fallback: T | null = null
): T | null {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return fallback;
    }

    return JSON.parse(stored) as T;
  } catch (error) {
    console.warn(`Failed to read localStorage key "${key}".`, error);
    return fallback;
  }
}

export function writeJsonStorage<T>(key: string, value: T): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to write localStorage key "${key}".`, error);
    return false;
  }
}

export function removeStorageKey(key: string): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove localStorage key "${key}".`, error);
  }
}
