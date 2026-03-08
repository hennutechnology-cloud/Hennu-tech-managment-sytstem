// ============================================================
// TrialDateFilter.tsx
// ============================================================
import { Calendar }  from "lucide-react";
import GlassCard     from "../../core/shared/components/GlassCard";
import DatePicker    from "../../core/shared/components/DatePicker";
import { tTB, dirAttr } from "../../core/i18n/trialBalance.i18n";
import type { TrialDateFilterProps } from "../../core/models/TrialBalance.types";

export default function TrialDateFilter({
  lang, filters, onChange, onApply,
}: TrialDateFilterProps) {
  return (
    <GlassCard>
      <div dir={dirAttr(lang)} className="flex items-start gap-3 sm:gap-4">
        {/* Icon — hide on very small screens to save space */}
        <div className="hidden xs:block mt-7 shrink-0">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#F97316]" />
        </div>

        <div className="flex-1 min-w-0">
          <label className="block text-gray-400 text-sm mb-3">
            {tTB(lang, "periodLabel")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-end">
            <DatePicker
          lang={lang}
              label={tTB(lang, "dateFrom")}
              value={filters.dateFrom}
              onChange={(v) => onChange({ ...filters, dateFrom: v })}
            />
            <DatePicker
          lang={lang}
              label={tTB(lang, "dateTo")}
              value={filters.dateTo}
              onChange={(v) => onChange({ ...filters, dateTo: v })}
            />
            <button
              onClick={onApply}
              className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white
                         rounded-xl transition-all font-medium text-sm sm:text-base"
            >
              {tTB(lang, "applyFilter")}
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
