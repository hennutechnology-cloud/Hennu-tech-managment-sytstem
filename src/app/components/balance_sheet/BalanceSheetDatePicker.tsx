// ============================================================
// BalanceSheetDatePicker.tsx — responsive
// ============================================================
import GlassCard           from "../../core/shared/components/GlassCard";
import DatePicker          from "../../core/shared/components/DatePicker";
import { useBalanceSheet } from "../../core/services/BalanceSheet.service";
import { tBS }             from "../../core/i18n/balanceSheet.i18n";
import type { Lang }       from "../../core/models/Settings.types";

interface Props { lang: Lang; }

export default function BalanceSheetDatePicker({ lang }: Props) {
  const { asOf, setAsOf } = useBalanceSheet();
  const isRtl = lang === "ar";

  return (
    <GlassCard className={`p-4 sm:p-6 ${isRtl ? "text-right" : "text-left"}`}>
      <div className="w-full sm:max-w-xs">
        <DatePicker
          lang={lang}
          label={tBS(lang, "asOf")}
          value={asOf}
          onChange={setAsOf}
        />
      </div>
    </GlassCard>
  );
}
