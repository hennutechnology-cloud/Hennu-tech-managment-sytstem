// ============================================================
// TrialDateFilter.tsx
// All static text goes through tTB(). Date values are plain
// strings from state — rendered directly in the DatePicker.
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
      <div dir={dirAttr(lang)} className="flex items-start gap-4">
        <div className="mt-7">
          <Calendar className="w-6 h-6 text-[#F97316]" />
        </div>
        <div className="flex-1">
          <label className="block text-gray-400 text-sm mb-3">
            {tTB(lang, "periodLabel")}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <DatePicker
              label={tTB(lang, "dateFrom")}
              value={filters.dateFrom}
              onChange={(v) => onChange({ ...filters, dateFrom: v })}
            />
            <DatePicker
              label={tTB(lang, "dateTo")}
              value={filters.dateTo}
              onChange={(v) => onChange({ ...filters, dateTo: v })}
            />
            <button
              onClick={onApply}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl
                         transition-all font-medium"
            >
              {tTB(lang, "applyFilter")}
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
