// ============================================================
// AnalyticalReportsProvider.tsx
// ============================================================
import type { ReactNode } from "react";
import {
  AnalyticalReportsContext,
  useAnalyticalReportsState,
} from "../../core/services/AnalyticalReports.service";

export function AnalyticalReportsProvider({ children }: { children: ReactNode }) {
  const state = useAnalyticalReportsState();
  return (
    <AnalyticalReportsContext.Provider value={state}>
      {children}
    </AnalyticalReportsContext.Provider>
  );
}
