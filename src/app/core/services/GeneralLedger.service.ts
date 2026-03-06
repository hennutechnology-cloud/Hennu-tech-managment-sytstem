// ============================================================
// GeneralLedger.service.ts
// Pure API-shaped data — no language strings in data layer.
// entry.date is a full "YYYY-MM-DD" string (not a month number,
// since ledger entries are dated to specific days).
// entry.description and account.name are plain strings the API
// returns in the user's language — rendered directly.
// ============================================================
import type { LedgerEntry, LedgerAccount, LedgerFilters } from "../models/GeneralLedger.types";

// ── Static seed data ──────────────────────────────────────────
const SEED: Record<string, LedgerEntry[]> = {
  "1101": [
    { id: 1, date: "2026-01-01", description: "رصيد افتتاحي",       debit: 850_000, credit: 0,       balance: 850_000   },
    { id: 2, date: "2026-02-05", description: "إيداع نقدي",          debit: 250_000, credit: 0,       balance: 1_100_000 },
    { id: 3, date: "2026-02-08", description: "سحب لصرف رواتب",      debit: 0,       credit: 180_000, balance: 920_000   },
    { id: 4, date: "2026-02-12", description: "تحصيل من العملاء",    debit: 320_000, credit: 0,       balance: 1_240_000 },
    { id: 5, date: "2026-02-15", description: "سداد للموردين",        debit: 0,       credit: 450_000, balance: 790_000   },
    { id: 6, date: "2026-02-18", description: "إيداع نقدي",          debit: 180_000, credit: 0,       balance: 970_000   },
    { id: 7, date: "2026-02-20", description: "صرف مصاريف إدارية",   debit: 0,       credit: 120_000, balance: 850_000   },
  ],
  "1102": [
    { id: 1, date: "2026-02-01", description: "رصيد افتتاحي",        debit: 4_200_000, credit: 0,       balance: 4_200_000 },
    { id: 2, date: "2026-02-03", description: "تحويل وارد",           debit: 500_000,   credit: 0,       balance: 4_700_000 },
    { id: 3, date: "2026-02-10", description: "سداد قسط قرض",         debit: 0,         credit: 125_000, balance: 4_575_000 },
    { id: 4, date: "2026-02-14", description: "تحصيل فاتورة عميل",   debit: 450_000,   credit: 0,       balance: 5_025_000 },
    { id: 5, date: "2026-02-19", description: "صرف رواتب فبراير",    debit: 0,         credit: 180_000, balance: 4_845_000 },
  ],
  "1103": [
    { id: 1, date: "2026-02-01", description: "رصيد افتتاحي",        debit: 3_800_000, credit: 0,       balance: 3_800_000 },
    { id: 2, date: "2026-02-07", description: "إيداع شيك",            debit: 200_000,   credit: 0,       balance: 4_000_000 },
    { id: 3, date: "2026-02-17", description: "سداد للمورد",          debit: 0,         credit: 300_000, balance: 3_700_000 },
  ],
  "1110": [
    { id: 1, date: "2026-02-01", description: "رصيد افتتاحي",        debit: 12_500_000, credit: 0,       balance: 12_500_000 },
    { id: 2, date: "2026-02-06", description: "فاتورة مبيعات جديدة", debit: 750_000,    credit: 0,       balance: 13_250_000 },
    { id: 3, date: "2026-02-14", description: "تحصيل جزئي",           debit: 0,          credit: 450_000, balance: 12_800_000 },
    { id: 4, date: "2026-02-21", description: "فاتورة مبيعات",       debit: 1_200_000,  credit: 0,       balance: 14_000_000 },
  ],
  "2101": [
    { id: 1, date: "2026-02-01", description: "رصيد افتتاحي",        debit: 0,       credit: 8_500_000, balance: 8_500_000 },
    { id: 2, date: "2026-02-09", description: "فاتورة مورد جديدة",   debit: 0,       credit: 350_000,   balance: 8_850_000 },
    { id: 3, date: "2026-02-15", description: "سداد جزئي",            debit: 450_000, credit: 0,         balance: 8_400_000 },
  ],
};

// Account list — name is a plain API string in the user's language
export const LEDGER_ACCOUNTS: LedgerAccount[] = [
  { code: "1101", name: "الصندوق"         },
  { code: "1102", name: "البنك - الراجحي" },
  { code: "1103", name: "البنك - الأهلي"  },
  { code: "1110", name: "العملاء"         },
  { code: "2101", name: "الموردون"        },
];

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// TODO (API): replace with → fetch(`/api/ledger?account=${f.accountCode}&from=${f.dateFrom}&to=${f.dateTo}`)
export async function fetchLedgerEntries(filters: LedgerFilters): Promise<LedgerEntry[]> {
  await delay(200);
  const rows = SEED[filters.accountCode] ?? [];
  return rows.filter((r) => {
    const d = r.date;
    return (!filters.dateFrom || d >= filters.dateFrom) &&
           (!filters.dateTo   || d <= filters.dateTo);
  });
}

// TODO (API): replace with → fetch("/api/ledger/accounts")
export async function fetchLedgerAccounts(): Promise<LedgerAccount[]> {
  await delay(100);
  return [...LEDGER_ACCOUNTS];
}
