import { Zone } from "./ptzUtils";
import zonesData from "./zones.json";

export interface CityZoneMapping {
  city: string;
  dept: string;
  zone: Zone;
}

// Exhaustive mapping separated into zones.json for maintainability
const SPECIAL_ZONES: Record<string, Record<string, Zone>> = zonesData as any;

export function detectZone(dept: string, city: string): Zone {
  const normalize = (s: string) => s.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/'/g, "") // Remove apostrophes (l'union -> lunion)
    .replace(/[^a-z0-9]/g, " ") // Replace other non-alphanumeric with spaces (dashes etc)
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();

  const cleanCity = normalize(city);
  const cleanDeptNum = dept.trim().padStart(2, "0").split(' ')[0].toUpperCase();

  // Check exhaustive map
  if (SPECIAL_ZONES[cleanDeptNum]) {
    const cityMap = SPECIAL_ZONES[cleanDeptNum];
    // Exact match on normalized name
    if (cityMap[cleanCity]) return cityMap[cleanCity];
    
    // Try without spaces for cities with multiple names (saint germain -> saintgermain)
    const noSpaceCity = cleanCity.replace(/\s/g, "");
    for (const key in cityMap) {
      if (key.replace(/\s/g, "").replace(/\-/g, "") === noSpaceCity) return cityMap[key];
    }
  }

  // Region specific defaults (from IDF)
  const ABIS_DEPTS = ["75", "92", "93", "94"];
  const A_DEPTS = ["77", "78", "91", "95"];

  if (ABIS_DEPTS.includes(cleanDeptNum)) return "Abis";
  if (A_DEPTS.includes(cleanDeptNum)) return "A";

  // Default to C for everything else
  return "C";
}
