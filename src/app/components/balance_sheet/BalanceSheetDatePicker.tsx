// ============================================================
// BalanceSheetDatePicker.tsx
// ============================================================
import GlassCard          from "../../core/shared/components/GlassCard";
import DatePicker         from "../../core/shared/components/DatePicker";
import { useBalanceSheet } from "../../core/services/BalanceSheet.service";
import { tBS }            from "../../core/i18n/balanceSheet.i18n";
import type { Lang }      from "../../core/models/Settings.types";

interface Props { lang: Lang; }

export default function BalanceSheetDatePicker({ lang }: Props) {
  const { asOf, setAsOf } = useBalanceSheet();

  return (
    <GlassCard>
      <DatePicker
        lang={lang}
        label={tBS(lang, "asOf")}
        value={asOf}
        onChange={setAsOf}
      />
    </GlassCard>
  );
}
