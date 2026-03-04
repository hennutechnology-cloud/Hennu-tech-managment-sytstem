// ============================================================
// TrialBalance.service.ts
// Static in-memory data store.
// Replace each function body with a fetch() call when the API is ready.
// ============================================================
import type { TrialBalanceItem, TrialBalanceFilters } from "../models/TrialBalance.types";

const STATIC_DATA: TrialBalanceItem[] = [
  { code: "1101", account: "الصندوق",                  debit: 850000,   credit: 0        },
  { code: "1102", account: "البنك - الراجحي",           debit: 4200000,  credit: 0        },
  { code: "1103", account: "البنك - الأهلي",            debit: 3800000,  credit: 0        },
  { code: "1110", account: "العملاء",                   debit: 12500000, credit: 0        },
  { code: "1120", account: "المخزون",                   debit: 23650000, credit: 0        },
  { code: "1201", account: "الأراضي",                   debit: 15000000, credit: 0        },
  { code: "1202", account: "المباني",                   debit: 18000000, credit: 0        },
  { code: "1203", account: "المعدات",                   debit: 5500000,  credit: 0        },
  { code: "1204", account: "السيارات",                  debit: 1500000,  credit: 0        },
  { code: "2101", account: "الموردون",                  debit: 0,        credit: 8500000  },
  { code: "2102", account: "قروض قصيرة الأجل",          debit: 0,        credit: 6000000  },
  { code: "2103", account: "مستحقات ضريبية",             debit: 0,        credit: 3500000  },
  { code: "2201", account: "قروض طويلة الأجل",          debit: 0,        credit: 15000000 },
  { code: "2202", account: "سندات",                     debit: 0,        credit: 2000000  },
  { code: "3001", account: "رأس المال",                 debit: 0,        credit: 40000000 },
  { code: "3002", account: "الأرباح المحتجزة",          debit: 0,        credit: 10000000 },
  { code: "4001", account: "إيرادات المبيعات",          debit: 0,        credit: 14500000 },
  { code: "4002", account: "إيرادات أخرى",              debit: 0,        credit: 1250000  },
  { code: "5001", account: "تكلفة البضاعة المباعة",     debit: 5500000,  credit: 0        },
  { code: "5002", account: "الرواتب والأجور",           debit: 2200000,  credit: 0        },
  { code: "5003", account: "إيجارات",                   debit: 800000,   credit: 0        },
  { code: "5004", account: "مصاريف إدارية",             debit: 750000,   credit: 0        },
];

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}


export async function fetchTrialBalance(
  _filters: TrialBalanceFilters,
): Promise<TrialBalanceItem[]> {
  await delay(200);
  return JSON.parse(JSON.stringify(STATIC_DATA)) as TrialBalanceItem[];
}
