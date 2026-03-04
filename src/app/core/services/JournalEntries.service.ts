// ============================================================
// JournalEntries.service.ts
// ============================================================
import type { JournalEntry, JournalEntryFormValues } from "../models/JournalEntries.types";

let store: JournalEntry[] = [
  {
    id: 1,
    date: "2026-02-20",
    description: "شراء مواد بناء - مشروع برج المملكة",
    totalDebit: 250000,
    totalCredit: 250000,
    isBalanced: true,
    lines: [
      { id: 1, accountCode: "1120", description: "مواد بناء",       debit: 250000, credit: 0      },
      { id: 2, accountCode: "2101", description: "مستحق للمورد",    debit: 0,      credit: 250000 },
    ],
  },
  {
    id: 2,
    date: "2026-02-19",
    description: "صرف رواتب شهر فبراير",
    totalDebit: 180000,
    totalCredit: 180000,
    isBalanced: true,
    lines: [
      { id: 1, accountCode: "5002", description: "رواتب الموظفين",  debit: 180000, credit: 0      },
      { id: 2, accountCode: "1102", description: "تحويل بنكي",      debit: 0,      credit: 180000 },
    ],
  },
  {
    id: 3,
    date: "2026-02-18",
    description: "تحصيل من عميل - مشروع الواحة",
    totalDebit: 450000,
    totalCredit: 450000,
    isBalanced: true,
    lines: [
      { id: 1, accountCode: "1102", description: "إيداع بنكي",      debit: 450000, credit: 0      },
      { id: 2, accountCode: "1110", description: "تحصيل من العميل", debit: 0,      credit: 450000 },
    ],
  },
  {
    id: 4,
    date: "2026-02-17",
    description: "سداد قسط القرض البنكي",
    totalDebit: 125000,
    totalCredit: 125000,
    isBalanced: true,
    lines: [
      { id: 1, accountCode: "2101", description: "قسط القرض",       debit: 80000,  credit: 0      },
      { id: 2, accountCode: "5001", description: "فوائد القرض",     debit: 45000,  credit: 0      },
      { id: 3, accountCode: "1102", description: "تحويل بنكي",      debit: 0,      credit: 125000 },
    ],
  },
];

let nextId = 5;

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function cloneStore(): JournalEntry[] {
  return JSON.parse(JSON.stringify(store)) as JournalEntry[];
}

function buildEntry(id: number, values: JournalEntryFormValues): JournalEntry {
  const lines = values.lines
    .filter((l) => l.accountCode || parseFloat(l.debit) || parseFloat(l.credit))
    .map((l, i) => ({
      id: i + 1,
      accountCode: l.accountCode,
      description: l.description,
      debit:  parseFloat(l.debit)  || 0,
      credit: parseFloat(l.credit) || 0,
    }));
  const totalDebit  = lines.reduce((s, l) => s + l.debit,  0);
  const totalCredit = lines.reduce((s, l) => s + l.credit, 0);
  return {
    id,
    date:        values.date,
    description: values.description,
    lines,
    totalDebit,
    totalCredit,
    isBalanced: totalDebit === totalCredit && totalDebit > 0,
  };
}

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  await delay(150);
  return cloneStore();
}

export async function createJournalEntry(values: JournalEntryFormValues): Promise<JournalEntry[]> {
  await delay(200);
  store.unshift(buildEntry(nextId++, values));
  return cloneStore();
}

export async function updateJournalEntry(id: number, values: JournalEntryFormValues): Promise<JournalEntry[]> {
  await delay(200);
  const idx = store.findIndex((e) => e.id === id);
  if (idx !== -1) store[idx] = buildEntry(id, values);
  return cloneStore();
}

export async function deleteJournalEntry(id: number): Promise<JournalEntry[]> {
  await delay(200);
  store = store.filter((e) => e.id !== id);
  return cloneStore();
}
