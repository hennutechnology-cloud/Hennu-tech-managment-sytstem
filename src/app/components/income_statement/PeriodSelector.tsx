// ============================================================
// PeriodSelector.tsx
// ============================================================
import { Calendar } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import type { PeriodSelectorProps, PeriodKey } from "../../core/models/IncomeStatement.types";

export default function PeriodSelector({ selected, periods, onChange }: PeriodSelectorProps) {
  return (
    <GlassCard>
      <div className="flex items-center gap-4">
        <Calendar className="w-6 h-6 text-[#F97316] shrink-0" />
        <div className="flex-1">
          <label className="block text-gray-400 text-sm mb-2">الفترة المالية</label>
          <select
            value={selected}
            onChange={(e) => onChange(e.target.value as PeriodKey)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white
                       focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer
                       min-w-[240px]"
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
