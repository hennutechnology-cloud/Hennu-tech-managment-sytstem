// ============================================================
// BalanceSheet.service.ts — fetch layer + context definition
// ============================================================
import { createContext, useContext, useState, useEffect } from "react";
import type { BalanceSheetData } from "../models/BalanceSheet.types";

export async function fetchBalanceSheet(asOf: string): Promise<BalanceSheetData> {
  // TODO: replace with real API call
  // const res = await fetch(`/api/balance-sheet?asOf=${asOf}`);
  // if (!res.ok) throw new Error("Failed to fetch balance sheet");
  // return res.json();

  return {
    asOf,
    assets: {
      currentAssets: {
        cash:          850_000,
        bank1:       4_200_000,
        bank2:       3_800_000,
        receivables: 12_500_000,
        inventory:   23_650_000,
        total:       45_000_000,
      },
      fixedAssets: {
        land:      15_000_000,
        buildings: 18_000_000,
        equipment:  5_500_000,
        vehicles:   1_500_000,
        total:     40_000_000,
      },
      totalAssets: 85_000_000,
    },
    liabilities: {
      currentLiabilities: {
        payables:       8_500_000,
        shortTermLoans: 6_000_000,
        taxes:          3_500_000,
        total:         18_000_000,
      },
      longTermLiabilities: {
        longTermLoans: 15_000_000,
        bonds:          2_000_000,
        total:         17_000_000,
      },
      totalLiabilities: 35_000_000,
    },
    equity: {
      capital:          40_000_000,
      retainedEarnings: 10_000_000,
      totalEquity:      50_000_000,
    },
    totalLiabilitiesAndEquity: 85_000_000,
  };
}

export interface BalanceSheetContextValue {
  asOf:    string;
  setAsOf: (v: string) => void;
  data:    BalanceSheetData | null;
  loading: boolean;
  error:   boolean;   // boolean flag — component resolves the display string
}

export const BalanceSheetContext = createContext<BalanceSheetContextValue | null>(null);

export function useBalanceSheet(): BalanceSheetContextValue {
  const ctx = useContext(BalanceSheetContext);
  if (!ctx) throw new Error("useBalanceSheet must be used inside <BalanceSheetProvider>");
  return ctx;
}

export function useBalanceSheetState() {
  const [asOf,    setAsOf]    = useState("2026-02-21");
  const [data,    setData]    = useState<BalanceSheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchBalanceSheet(asOf)
      .then((res) => { if (!cancelled) setData(res); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [asOf]);

  return { asOf, setAsOf, data, loading, error };
}
