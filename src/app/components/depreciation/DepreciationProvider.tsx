// ============================================================
// DepreciationProvider.tsx
// ============================================================
import type { ReactNode } from "react";
import { DepreciationContext, useDepreciationState } from "../../core/services/Depreciation.service";

export function DepreciationProvider({ children }: { children: ReactNode }) {
  const state = useDepreciationState();
  return (
    <DepreciationContext.Provider value={state}>
      {children}
    </DepreciationContext.Provider>
  );
}
