export interface MarketRate {
  years: number;
  avgRate: number;
  midRate: number;
  topRate: number;
}

export const DEFAULT_MARKET_RATES: MarketRate[] = [
  { years: 7, avgRate: 3.20, midRate: 2.98, topRate: 2.70 },
  { years: 10, avgRate: 3.30, midRate: 3.05, topRate: 2.70 },
  { years: 15, avgRate: 3.47, midRate: 3.22, topRate: 2.90 },
  { years: 20, avgRate: 3.56, midRate: 3.34, topRate: 3.05 },
  { years: 25, avgRate: 3.65, midRate: 3.42, topRate: 3.15 },
];

export function getRateForDuration(years: number, rates?: MarketRate[]): number {
  const activeRates = rates && rates.length > 0 ? rates : DEFAULT_MARKET_RATES;
  
  // Find the closest duration >= years
  const found = [...activeRates]
    .sort((a, b) => a.years - b.years)
    .find(r => r.years >= years);
    
  if (found) return found.midRate;
  
  // Fallback if years > max duration in table
  const max = activeRates[activeRates.length - 1];
  return max ? max.midRate : 3.80;
}

export function getMaxDuration(age: number): number {
  const max = 75 - age;
  if (max <= 0) return 0;
  // Usually banks don't go over 25 or 27 years
  return Math.min(25, max);
}
