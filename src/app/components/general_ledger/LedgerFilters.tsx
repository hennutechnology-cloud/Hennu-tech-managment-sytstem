// ============================================================
// LedgerFilters.tsx
// ============================================================
import { Filter } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import DatePicker from "../../core/shared/components/DatePicker";
import type { LedgerFiltersProps } from "../../core/models/GeneralLedger.types";

export default function LedgerFilters({
  filters, accounts, onChange, onApply,
}: LedgerFiltersProps) {
  const set = (field: keyof typeof filters, value: string) =>
    onChange({ ...filters, [field]: value });

  return (
    <GlassCard>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Account selector */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">الحساب</label>
          <select
            value={filters.accountCode}
            onChange={(e) => set("accountCode", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
                       focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer"
          >
            {accounts.map((a) => (
              <option key={a.code} value={a.code} className="bg-[#0f1117]">
                {a.code} - {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <DatePicker
          label="من تاريخ"
          value={filters.dateFrom}
          onChange={(v) => set("dateFrom", v)}
        />

        {/* Date to */}
        <DatePicker
          label="إلى تاريخ"
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
            تصفية
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
