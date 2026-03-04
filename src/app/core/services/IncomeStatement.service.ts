// ============================================================
// IncomeStatement.service.ts
// ============================================================
import type { IncomeStatementData, Period, PeriodKey } from "../models/IncomeStatement.types";

const STORE: Record<PeriodKey, IncomeStatementData> = {
  annual_2026: {
    revenue:           { sales: 14500000, otherIncome: 1250000,  total: 15750000  },
    cogs:              { materials: 3200000, labor: 1800000, other: 500000, total: 5500000 },
    grossProfit:       10250000,
    operatingExpenses: { salaries: 2200000, rent: 800000, administrative: 750000,
                         utilities: 300000, marketing: 450000, depreciation: 550000, total: 5050000 },
    operatingIncome:   5200000,
    otherExpenses:     { interest: 350000, taxes: 850000, total: 1200000 },
    netIncome:         4000000,
  },
  q1_2026: {
    revenue:           { sales: 3200000, otherIncome: 280000, total: 3480000 },
    cogs:              { materials: 700000, labor: 420000, other: 100000, total: 1220000 },
    grossProfit:       2260000,
    operatingExpenses: { salaries: 550000, rent: 200000, administrative: 180000,
                         utilities: 70000, marketing: 100000, depreciation: 130000, total: 1230000 },
    operatingIncome:   1030000,
    otherExpenses:     { interest: 85000, taxes: 195000, total: 280000 },
    netIncome:         750000,
  },
  q2_2026: {
    revenue:           { sales: 3800000, otherIncome: 310000, total: 4110000 },
    cogs:              { materials: 820000, labor: 460000, other: 120000, total: 1400000 },
    grossProfit:       2710000,
    operatingExpenses: { salaries: 550000, rent: 200000, administrative: 190000,
                         utilities: 75000, marketing: 115000, depreciation: 140000, total: 1270000 },
    operatingIncome:   1440000,
    otherExpenses:     { interest: 87000, taxes: 230000, total: 317000 },
    netIncome:         1123000,
  },
  q3_2026: {
    revenue:           { sales: 3600000, otherIncome: 300000, total: 3900000 },
    cogs:              { materials: 790000, labor: 440000, other: 115000, total: 1345000 },
    grossProfit:       2555000,
    operatingExpenses: { salaries: 550000, rent: 200000, administrative: 185000,
                         utilities: 72000, marketing: 110000, depreciation: 138000, total: 1255000 },
    operatingIncome:   1300000,
    otherExpenses:     { interest: 88000, taxes: 215000, total: 303000 },
    netIncome:         997000,
  },
  q4_2026: {
    revenue:           { sales: 3900000, otherIncome: 360000, total: 4260000 },
    cogs:              { materials: 890000, labor: 480000, other: 165000, total: 1535000 },
    grossProfit:       2725000,
    operatingExpenses: { salaries: 550000, rent: 200000, administrative: 195000,
                         utilities: 83000, marketing: 125000, depreciation: 142000, total: 1295000 },
    operatingIncome:   1430000,
    otherExpenses:     { interest: 90000, taxes: 210000, total: 300000 },
    netIncome:         1130000,
  },
};

export const PERIODS: Period[] = [
  { key: "annual_2026", label: "يناير — ديسمبر 2026"  },
  { key: "q1_2026",     label: "الربع الأول 2026"     },
  { key: "q2_2026",     label: "الربع الثاني 2026"    },
  { key: "q3_2026",     label: "الربع الثالث 2026"    },
  { key: "q4_2026",     label: "الربع الرابع 2026"    },
];

function delay(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

export async function fetchIncomeStatement(
  period: PeriodKey,
): Promise<IncomeStatementData> {
  await delay(200);
  return JSON.parse(JSON.stringify(STORE[period])) as IncomeStatementData;
}
