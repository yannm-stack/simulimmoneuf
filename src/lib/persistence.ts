
export const SIMULATION_STORAGE_KEY = 'simulimmoneuf_latest_simulation';

function getStorage() {
  try {
    return typeof window !== 'undefined' ? window.sessionStorage : null;
  } catch (e) {
    return null;
  }
}

export function saveSimulation(data: any) {
  try {
    const storage = getStorage();
    if (storage) {
      storage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.warn('Could not save simulation data:', e);
  }
}

export function loadSimulation() {
  try {
    const storage = getStorage();
    if (storage) {
      const saved = storage.getItem(SIMULATION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  } catch (e) {
    console.warn('Could not load simulation data:', e);
    return null;
  }
}

export function clearSimulation() {
  try {
    const storage = getStorage();
    if (storage) {
      storage.removeItem(SIMULATION_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Could not clear simulation data:', e);
  }
}
