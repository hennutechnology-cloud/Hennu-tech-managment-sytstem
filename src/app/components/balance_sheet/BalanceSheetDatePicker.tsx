// ============================================================
// BalanceSheetDatePicker.tsx
// ============================================================
import GlassCard from "../../core/shared/components/GlassCard";
import DatePicker from "../../core/shared/components/DatePicker";
import { useBalanceSheet } from "../../core/services/BalanceSheet.service";

export default function BalanceSheetDatePicker() {
  const { asOf, setAsOf } = useBalanceSheet();

  return (
    <GlassCard>
      <DatePicker
        label="كما في"
        value={asOf}
        onChange={setAsOf}
      />
    </GlassCard>
  );
}
