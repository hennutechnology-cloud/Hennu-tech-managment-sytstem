// ============================================================
// BalanceSheet.types.ts
// ============================================================

export interface CurrentAssets {
  cash: number;
  bank1: number;
  bank2: number;
  receivables: number;
  inventory: number;
  total: number;
}

export interface FixedAssets {
  land: number;
  buildings: number;
  equipment: number;
  vehicles: number;
  total: number;
}

export interface Assets {
  currentAssets: CurrentAssets;
  fixedAssets: FixedAssets;
  totalAssets: number;
}

export interface CurrentLiabilities {
  payables: number;
  shortTermLoans: number;
  taxes: number;
  total: number;
}

export interface LongTermLiabilities {
  longTermLoans: number;
  bonds: number;
  total: number;
}

export interface Liabilities {
  currentLiabilities: CurrentLiabilities;
  longTermLiabilities: LongTermLiabilities;
  totalLiabilities: number;
}

export interface Equity {
  capital: number;
  retainedEarnings: number;
  totalEquity: number;
}

export interface BalanceSheetData {
  asOf: string; // "YYYY-MM-DD"
  assets: Assets;
  liabilities: Liabilities;
  equity: Equity;
  totalLiabilitiesAndEquity: number;
}
