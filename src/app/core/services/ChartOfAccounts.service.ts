import type { Account, AccountFormValues, AccountSummary } from "../models/ChartOfAccounts.types";

// ---------------------------------------------------------------------------
// Mutable in-memory store
// ---------------------------------------------------------------------------
let store: Account[] = [
  {
    code: "1000", name: "الأصول", type: "main", balance: 85_000_000,
    children: [
      {
        code: "1100", name: "الأصول المتداولة", type: "sub", balance: 45_000_000,
        children: [
          { code: "1101", name: "الصندوق",         type: "detail", balance: 850_000    },
          { code: "1102", name: "البنك - الراجحي", type: "detail", balance: 4_200_000  },
          { code: "1103", name: "البنك - الأهلي",  type: "detail", balance: 3_800_000  },
          { code: "1110", name: "العملاء",          type: "detail", balance: 12_500_000 },
          { code: "1120", name: "المخزون",          type: "detail", balance: 23_650_000 },
        ],
      },
      {
        code: "1200", name: "الأصول الثابتة", type: "sub", balance: 40_000_000,
        children: [
          { code: "1201", name: "الأراضي",  type: "detail", balance: 15_000_000 },
          { code: "1202", name: "المباني",  type: "detail", balance: 18_000_000 },
          { code: "1203", name: "المعدات",  type: "detail", balance: 5_500_000  },
          { code: "1204", name: "السيارات", type: "detail", balance: 1_500_000  },
        ],
      },
    ],
  },
  {
    code: "2000", name: "الخصوم", type: "main", balance: 35_000_000,
    children: [
      {
        code: "2100", name: "الخصوم المتداولة", type: "sub", balance: 18_000_000,
        children: [
          { code: "2101", name: "الموردون",          type: "detail", balance: 8_500_000 },
          { code: "2102", name: "قروض قصيرة الأجل", type: "detail", balance: 6_000_000 },
          { code: "2103", name: "مستحقات ضريبية",    type: "detail", balance: 3_500_000 },
        ],
      },
      {
        code: "2200", name: "الخصوم طويلة الأجل", type: "sub", balance: 17_000_000,
        children: [
          { code: "2201", name: "قروض طويلة الأجل", type: "detail", balance: 15_000_000 },
          { code: "2202", name: "سندات",             type: "detail", balance: 2_000_000  },
        ],
      },
    ],
  },
  {
    code: "3000", name: "حقوق الملكية", type: "main", balance: 50_000_000,
    children: [
      { code: "3001", name: "رأس المال",        type: "detail", balance: 40_000_000 },
      { code: "3002", name: "الأرباح المحتجزة", type: "detail", balance: 10_000_000 },
    ],
  },
  {
    code: "4000", name: "الإيرادات", type: "main", balance: 15_750_000,
    children: [
      { code: "4001", name: "إيرادات المبيعات", type: "detail", balance: 14_500_000 },
      { code: "4002", name: "إيرادات أخرى",     type: "detail", balance: 1_250_000  },
    ],
  },
  {
    code: "5000", name: "المصروفات", type: "main", balance: 9_250_000,
    children: [
      { code: "5001", name: "تكلفة البضاعة المباعة", type: "detail", balance: 5_500_000 },
      { code: "5002", name: "الرواتب والأجور",        type: "detail", balance: 2_200_000 },
      { code: "5003", name: "إيجارات",                type: "detail", balance: 800_000   },
      { code: "5004", name: "مصاريف إدارية",          type: "detail", balance: 750_000   },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function cloneStore(): Account[] {
  return JSON.parse(JSON.stringify(store)) as Account[];
}

function buildMap(accounts: Account[], map: Map<string, Account> = new Map()): Map<string, Account> {
  for (const acc of accounts) {
    map.set(acc.code, acc);
    if (acc.children?.length) buildMap(acc.children, map);
  }
  return map;
}

function removeFromTree(accounts: Account[], code: string): boolean {
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].code === code) { accounts.splice(i, 1); return true; }
    if (accounts[i].children?.length && removeFromTree(accounts[i].children!, code)) return true;
  }
  return false;
}

function updateInTree(accounts: Account[], updated: Account): boolean {
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].code === updated.code) {
      const children = accounts[i].children;
      accounts[i] = { ...updated, children };
      return true;
    }
    if (accounts[i].children?.length && updateInTree(accounts[i].children!, updated)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Public API — every mutating function returns a fresh Account[] clone
// ---------------------------------------------------------------------------

// TODO (API): replace with → fetch("/api/accounts").then(r => r.json())
export async function fetchAccounts(): Promise<Account[]> {
  await delay(150);
  return cloneStore();
}

// TODO (API): replace with → fetch("/api/accounts/summary").then(r => r.json())
export async function fetchAccountSummary(): Promise<AccountSummary> {
  await delay(150);
  return {
    totalAssets:      85_000_000,
    totalLiabilities: 35_000_000,
    equity:           50_000_000,
    revenues:         15_750_000,
    expenses:          9_250_000,
  };
}

// TODO (API): replace body with → fetch("/api/accounts", { method: "POST", body: JSON.stringify(values) })
export async function createAccount(values: AccountFormValues): Promise<Account[]> {
  await delay(200);
  const newAccount: Account = {
    code:    values.code.trim(),
    name:    values.name.trim(),
    type:    values.type,
    balance: parseFloat(values.balance) || 0,
  };

  if (values.parentCode) {
    const map = buildMap(store);
    const parent = map.get(values.parentCode);
    if (parent) {
      if (!parent.children) parent.children = [];
      parent.children.push(newAccount);
    } else {
      store.push(newAccount);
    }
  } else {
    store.push(newAccount);
  }

  return cloneStore();
}

// TODO (API): replace body with → fetch(`/api/accounts/${values.code}`, { method: "PUT", body: JSON.stringify(values) })
export async function updateAccount(values: AccountFormValues): Promise<Account[]> {
  await delay(200);
  const updated: Account = {
    code:    values.code.trim(),
    name:    values.name.trim(),
    type:    values.type,
    balance: parseFloat(values.balance) || 0,
  };
  updateInTree(store, updated);
  return cloneStore();
}

// TODO (API): replace body with → fetch(`/api/accounts/${code}`, { method: "DELETE" })
export async function deleteAccount(code: string): Promise<Account[]> {
  await delay(200);
  removeFromTree(store, code);
  return cloneStore();
}
