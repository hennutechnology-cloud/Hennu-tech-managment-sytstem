// ============================================================
// PeriodSelector.tsx — Responsive
// ============================================================
import { Calendar } from "lucide-react";
import GlassCard    from "../../core/shared/components/GlassCard";
import { tIS }      from "../../core/i18n/incomeStatement.i18n";
import type { PeriodSelectorProps, PeriodKey } from "../../core/models/IncomeStatement.types";

export default function PeriodSelector({ selected, periods, onChange, lang }: PeriodSelectorProps) {
  return (
    <GlassCard>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316] shrink-0" />
        <div className="flex-1">
          <label className="block text-gray-400 text-sm mb-2">{tIS(lang, "periodLabel")}</label>
          <select
            value={selected}
            onChange={(e) => onChange(e.target.value as PeriodKey)}
            className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white
                       focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer
                       sm:min-w-[240px]"
          >
            {periods.map((p) => (
              <option key={p.key} value={p.key} className="bg-[#0f1117]">
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </GlassCard>
  );
}
