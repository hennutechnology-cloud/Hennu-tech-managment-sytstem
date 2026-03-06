// ============================================================
// IncomeStatement.service.ts
// Pure API-shaped data — no language strings in numeric data.
// period.label is a plain string the API returns in the user's
// language — rendered directly in PeriodSelector.
//
// NOTE: IncomeStatementData contains only numbers — there are
// no month fields here (income statement is period-level
// aggregated data, not a time series with month indices).
// ============================================================
import type { IncomeStatementData, Period, PeriodKey } from "../models/IncomeStatement.types";

const STORE: Record<PeriodKey, IncomeStatementData> = {
  annual_2026: {
    revenue:           { sales: 14_500_000, otherIncome: 1_250_000,  total: 15_750_000  },
    cogs:              { materials: 3_200_000, labor: 1_800_000, other: 500_000, total: 5_500_000 },
    grossProfit:       10_250_000,
    operatingExpenses: { salaries: 2_200_000, rent: 800_000, administrative: 750_000,
                         utilities: 300_000, marketing: 450_000, depreciation: 550_000, total: 5_050_000 },
    operatingIncome:   5_200_000,
    otherExpenses:     { interest: 350_000, taxes: 850_000, total: 1_200_000 },
    netIncome:         4_000_000,
  },
  q1_2026: {
    revenue:           { sales: 3_200_000, otherIncome: 280_000,  total: 3_480_000 },
    cogs:              { materials: 700_000, labor: 420_000, other: 100_000, total: 1_220_000 },
    grossProfit:       2_260_000,
    operatingExpenses: { salaries: 550_000, rent: 200_000, administrative: 180_000,
                         utilities: 70_000, marketing: 100_000, depreciation: 130_000, total: 1_230_000 },
    operatingIncome:   1_030_000,
    otherExpenses:     { interest: 85_000, taxes: 195_000, total: 280_000 },
    netIncome:         750_000,
  },
  q2_2026: {
    revenue:           { sales: 3_800_000, otherIncome: 310_000, total: 4_110_000 },
    cogs:              { materials: 820_000, labor: 460_000, other: 120_000, total: 1_400_000 },
    grossProfit:       2_710_000,
    operatingExpenses: { salaries: 550_000, rent: 200_000, administrative: 190_000,
                         utilities: 75_000, marketing: 115_000, depreciation: 140_000, total: 1_270_000 },
    operatingIncome:   1_440_000,
    otherExpenses:     { interest: 87_000, taxes: 230_000, total: 317_000 },
    netIncome:         1_123_000,
  },
  q3_2026: {
    revenue:           { sales: 3_600_000, otherIncome: 300_000, total: 3_900_000 },
    cogs:              { materials: 790_000, labor: 440_000, other: 115_000, total: 1_345_000 },
    grossProfit:       2_555_000,
    operatingExpenses: { salaries: 550_000, rent: 200_000, administrative: 185_000,
                         utilities: 72_000, marketing: 110_000, depreciation: 138_000, total: 1_255_000 },
    operatingIncome:   1_300_000,
    otherExpenses:     { interest: 88_000, taxes: 215_000, total: 303_000 },
    netIncome:         997_000,
  },
  q4_2026: {
    revenue:           { sales: 3_900_000, otherIncome: 360_000, total: 4_260_000 },
    cogs:              { materials: 890_000, labor: 480_000, other: 165_000, total: 1_535_000 },
    grossProfit:       2_725_000,
    operatingExpenses: { salaries: 550_000, rent: 200_000, administrative: 195_000,
                         utilities: 83_000, marketing: 125_000, depreciation: 142_000, total: 1_295_000 },
    operatingIncome:   1_430_000,
    otherExpenses:     { interest: 90_000, taxes: 210_000, total: 300_000 },
    netIncome:         1_130_000,
  },
};

// period.label is a plain string the API returns in user's language — rendered directly
export const PERIODS: Period[] = [
  { key: "annual_2026", label: "يناير — ديسمبر 2026" },
  { key: "q1_2026",     label: "الربع الأول 2026"    },
  { key: "q2_2026",     label: "الربع الثاني 2026"   },
  { key: "q3_2026",     label: "الربع الثالث 2026"   },
  { key: "q4_2026",     label: "الربع الرابع 2026"   },
];

function delay(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

// TODO (API): replace with → fetch(`/api/income-statement?period=${period}`)
export async function fetchIncomeStatement(period: PeriodKey): Promise<IncomeStatementData> {
  await delay(200);
  return JSON.parse(JSON.stringify(STORE[period])) as IncomeStatementData;
}
