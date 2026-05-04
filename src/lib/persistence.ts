
export const SIMULATION_STORAGE_KEY = 'simulimmoneuf_latest_simulation';

export function saveSimulation(data: any) {
  try {
    sessionStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving simulation to sessionStorage:', e);
  }
}

export function loadSimulation() {
  try {
    const saved = sessionStorage.getItem(SIMULATION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Error loading simulation from sessionStorage:', e);
    return null;
  }
}

export function clearSimulation() {
  try {
    sessionStorage.removeItem(SIMULATION_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing simulation from sessionStorage:', e);
  }
}
