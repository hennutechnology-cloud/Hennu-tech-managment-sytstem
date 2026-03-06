// ============================================================
// LedgerFilters.tsx
// account.name and account.code are plain API strings — rendered directly.
// All labels and the apply button go through tGL().
// DatePicker gets lang prop for bilingual calendar.
// ============================================================
import { Filter }    from "lucide-react";
import GlassCard     from "../../core/shared/components/GlassCard";
import DatePicker    from "../../core/shared/components/DatePicker";
import { tGL }       from "../../core/i18n/generalLedger.i18n";
import type { LedgerFiltersProps } from "../../core/models/GeneralLedger.types";

export default function LedgerFilters({
  filters, accounts, onChange, onApply, lang,
}: LedgerFiltersProps) {
  const set = (field: keyof typeof filters, value: string) =>
    onChange({ ...filters, [field]: value });

  return (
    <GlassCard>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Account selector */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">{tGL(lang, "filterAccount")}</label>
          <select
            value={filters.accountCode}
            onChange={(e) => set("accountCode", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                       focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer"
          >
            {accounts.map((a) => (
              <option key={a.code} value={a.code} className="bg-[#0f1117]">
                {/* account.code and account.name are plain API strings */}
                {a.code} - {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <DatePicker
          lang={lang}
          label={tGL(lang, "filterFrom")}
          value={filters.dateFrom}
          onChange={(v) => set("dateFrom", v)}
        />

        {/* Date to */}
        <DatePicker
          lang={lang}
          label={tGL(lang, "filterTo")}
          value={filters.dateTo}
          onChange={(v) => set("dateTo", v)}
        />

        {/* Apply button */}
        <div className="flex items-end">
          <button
            onClick={onApply}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl
                       transition-all flex items-center justify-center gap-2"
          >
            <Filter className="w-5 h-5" />
            {tGL(lang, "filterApply")}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
