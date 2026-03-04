// ============================================================
// BalanceSheetProvider.tsx
// ============================================================
import type { ReactNode } from "react";
import { BalanceSheetContext, useBalanceSheetState } from "../../core/services/BalanceSheet.service";

export function BalanceSheetProvider({ children }: { children: ReactNode }) {
  const state = useBalanceSheetState();

  return (
    <BalanceSheetContext.Provider value={state}>
      {children}
    </BalanceSheetContext.Provider>
  );
}
