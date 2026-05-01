
export type Zone = 'Abis' | 'A' | 'B1' | 'B2' | 'C';

export interface PtzResult {
  amount: number;
  tranche: number;
  quotite: number;
}

const ELIGIBILITY_CEILINGS: Record<Zone, number[]> = {
  'Abis': [49000, 73500, 88200, 102900, 117600, 132300, 147000, 161700],
  'A': [49000, 73500, 88200, 102900, 117600, 132300, 147000, 161700],
  'B1': [34500, 51750, 62100, 72540, 82800, 93150, 103500, 113850],
  'B2': [31500, 47250, 56700, 66150, 75600, 85050, 94500, 103950],
  'C': [28500, 42750, 51300, 59850, 68400, 76950, 85500, 94050]
};

const PROJECT_CEILINGS: Record<Zone, number[]> = {
  'Abis': [150000, 225000, 270000, 315000, 360000],
  'A': [150000, 225000, 270000, 315000, 360000],
  'B1': [135000, 202500, 243000, 283500, 324000],
  'B2': [110000, 165000, 198000, 231000, 264000],
  'C': [100000, 150000, 180000, 210000, 240000]
};

const TRANCHE_CEILINGS: Record<number, Record<Zone, number[]>> = {
  1: {
    'Abis': [25000, 37500, 45000, 52500, 60000, 67500, 75000, 82500],
    'A': [25000, 37500, 45000, 52500, 60000, 67500, 75000, 82500],
    'B1': [21500, 32250, 38700, 45150, 51600, 58050, 64500, 70950],
    'B2': [18000, 27000, 32400, 37800, 43200, 48600, 54000, 59400],
    'C': [15000, 22500, 27000, 31500, 36000, 40500, 45000, 49500]
  },
  2: {
    'Abis': [31000, 46500, 55800, 65100, 74400, 83700, 93000, 102300],
    'A': [31000, 46500, 55800, 65100, 74400, 83700, 93000, 102300],
    'B1': [26000, 39000, 46800, 54600, 62400, 70200, 78000, 85800],
    'B2': [22000, 33000, 39600, 46200, 52800, 59400, 66000, 72600],
    'C': [19500, 29250, 35100, 40950, 46800, 52650, 58500, 64350]
  },
  3: {
    'Abis': [37000, 55500, 66600, 77700, 88800, 99900, 111000, 122100],
    'A': [37000, 55500, 66600, 77700, 88800, 99900, 111000, 122100],
    'B1': [30000, 45000, 54000, 63000, 72000, 81000, 90000, 99000],
    'B2': [27000, 40500, 48600, 56700, 64800, 72900, 81000, 89100],
    'C': [24000, 36000, 43200, 50400, 57600, 64800, 72000, 79200]
  }
};

export function calculatePTZ(
  rfr: number,
  nbOccupants: number,
  zone: Zone,
  projectCost: number,
  isHouse: boolean
): PtzResult {
  // Règle du revenu plancher : Max(RFR N-2, Coût Total / 9)
  const adjustedRfr = Math.max(rfr, projectCost / 9);
  
  const occIdx = Math.min(nbOccupants, 8) - 1;
  const projectCapIdx = Math.min(nbOccupants, 5) - 1;

  // 1. Check eligibility
  if (adjustedRfr > ELIGIBILITY_CEILINGS[zone][occIdx]) {
    return { amount: 0, tranche: 0, quotite: 0 };
  }

  // 2. Determine Tranche
  let tranche = 4;
  if (adjustedRfr <= TRANCHE_CEILINGS[1][zone][occIdx]) tranche = 1;
  else if (adjustedRfr <= TRANCHE_CEILINGS[2][zone][occIdx]) tranche = 2;
  else if (adjustedRfr <= TRANCHE_CEILINGS[3][zone][occIdx]) tranche = 3;

  // 3. Determine Quotite (Percentage) - Updated for 2025 reforms
  let quotite = 0;
  // According to 2025 reforms, Houses and Apartments for new builds follow the same logic
  if (tranche === 1) quotite = 0.50;
  else if (tranche === 2 || tranche === 3) quotite = 0.40;
  else if (tranche === 4) quotite = 0.20;

  // 4. Calculate amount
  const cappedCost = Math.min(projectCost, PROJECT_CEILINGS[zone][projectCapIdx]);
  const amount = cappedCost * quotite;

  return { amount, tranche, quotite };
}
