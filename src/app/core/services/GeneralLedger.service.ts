// ============================================================
// GeneralLedger.service.ts
// ============================================================
import type { LedgerEntry, LedgerAccount, LedgerFilters } from "../models/GeneralLedger.types";

// ---------------------------------------------------------------------------
// Static seed data per account code
// ---------------------------------------------------------------------------
const SEED: Record<string, LedgerEntry[]> = {
  "1101": [
    { id: 1, date: "2026-03-01", description: "رصيد افتتاحي",       debit: 850000, credit: 0,      balance: 850000  },
    { id: 2, date: "2026-02-05", description: "إيداع نقدي",          debit: 250000, credit: 0,      balance: 1100000 },
    { id: 3, date: "2026-02-08", description: "سحب لصرف رواتب",      debit: 0,      credit: 180000, balance: 920000  },
    { id: 4, date: "2026-02-12", description: "تحصيل من العملاء",    debit: 320000, credit: 0,      balance: 1240000 },
    { id: 5, date: "2026-02-15", description: "سداد للموردين",        debit: 0,      credit: 450000, balance: 790000  },
    { id: 6, date: "2026-02-18", description: "إيداع نقدي",          debit: 180000, credit: 0,      balance: 970000  },
    { id: 7, date: "2026-02-20", description: "صرف مصاريف إدارية",   debit: 0,      credit: 120000, balance: 850000  },
  ],
  "1102": [
    { id: 1, date: "2026-02-01", description: "رصيد افتتاحي",        debit: 4200000, credit: 0,       balance: 4200000 },
    { id: 2, date: "2026-02-03", description: "تحويل وارد",           debit: 500000,  credit: 0,       balance: 4700000 },
    { id: 3, date: "2026-02-10", description: "سداد قسط قرض",         debit: 0,       credit: 125000,  balance: 4575000 },
    { id: 4, date: "2026-02-14", description: "تحصيل فاتورة عميل",   debit: 450000,  credit: 0,       balance: 5025000 },
    { id: 5, date: "2026-02-19", description: "صرف رواتب فبراير",    debit: 0,       credit: 180000,  balance: 4845000 },
  ],
  "1103": [
    { id: 1, date: "2026-02-01", description: "رصيد افتتاحي",        debit: 3800000, credit: 0,      balance: 3800000 },
    { id: 2, date: "2026-02-07", description: "إيداع شيك",            debit: 200000,  credit: 0,      balance: 4000000 },
    { id: 3, date: "2026-02-17", description: "سداد للمورد",          debit: 0,       credit: 300000, balance: 3700000 },
  ],
  "1110": [
    { id: 1, date: "2026-02-01", description: "رصيد افتتاحي",        debit: 12500000, credit: 0,       balance: 12500000 },
    { id: 2, date: "2026-02-06", description: "فاتورة مبيعات جديدة", debit: 750000,   credit: 0,       balance: 13250000 },
    { id: 3, date: "2026-02-14", description: "تحصيل جزئي",           debit: 0,        credit: 450000,  balance: 12800000 },
    { id: 4, date: "2026-02-21", description: "فاتورة مبيعات",       debit: 1200000,  credit: 0,       balance: 14000000 },
  ],
  "2101": [
    { id: 1, date: "2026-02-01", description: "رصيد افتتاحي",        debit: 0,       credit: 8500000, balance: 8500000 },
    { id: 2, date: "2026-02-09", description: "فاتورة مورد جديدة",   debit: 0,       credit: 350000,  balance: 8850000 },
    { id: 3, date: "2026-02-15", description: "سداد جزئي",            debit: 450000,  credit: 0,       balance: 8400000 },
  ],
};

export const LEDGER_ACCOUNTS: LedgerAccount[] = [
  { code: "1101", name: "الصندوق"        },
  { code: "1102", name: "البنك - الراجحي"},
  { code: "1103", name: "البنك - الأهلي" },
  { code: "1110", name: "العملاء"        },
  { code: "2101", name: "الموردون"       },
];

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// TODO (API): replace with → fetch(`/api/ledger?account=${f.accountCode}&from=${f.dateFrom}&to=${f.dateTo}`).then(r => r.json())
export async function fetchLedgerEntries(filters: LedgerFilters): Promise<LedgerEntry[]> {
  await delay(200);
  const rows = SEED[filters.accountCode] ?? [];
  return rows.filter((r) => {
    const d = r.date;
    return (!filters.dateFrom || d >= filters.dateFrom) &&
           (!filters.dateTo   || d <= filters.dateTo);
  });
}

// TODO (API): replace with → fetch("/api/ledger/accounts").then(r => r.json())
export async function fetchLedgerAccounts(): Promise<LedgerAccount[]> {
  await delay(100);
  return [...LEDGER_ACCOUNTS];
}
