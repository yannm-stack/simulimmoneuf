import { safeStorage } from './storage';

export const SIMULATION_STORAGE_KEY = 'simulimmoneuf_latest_simulation';

export function saveSimulation(data: any) {
  safeStorage.sessionStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(data));
}

export function loadSimulation() {
  const saved = safeStorage.sessionStorage.getItem(SIMULATION_STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error parsing saved simulation:', e);
    return null;
  }
}

export function clearSimulation() {
  safeStorage.sessionStorage.removeItem(SIMULATION_STORAGE_KEY);
}
