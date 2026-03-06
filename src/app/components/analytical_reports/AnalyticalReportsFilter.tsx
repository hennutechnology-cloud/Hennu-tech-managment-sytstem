// ============================================================
// AnalyticalReportsFilter.tsx
// ============================================================
import GlassCard    from "../../core/shared/components/GlassCard";
import DatePicker   from "../../core/shared/components/DatePicker";
import { Filter }   from "lucide-react";
import { useAnalyticalReports } from "../../core/services/AnalyticalReports.service";
import { tAR, resolveReportType, REPORT_TYPE_VALUES }
                    from "../../core/i18n/analyticalReports.i18n";
import type { ReportType } from "../../core/models/AnalyticalReports.types";
import type { Lang }       from "../../core/models/Settings.types";

interface Props { lang: Lang; }

export default function AnalyticalReportsFilter({ lang }: Props) {
  const { dateRange, setDateRange, reportType, setReportType, applyFilter, loading } =
    useAnalyticalReports();

  return (
    <GlassCard>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Report type */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">
            {tAR(lang, "reportTypeLabel")}
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white
              focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer"
          >
            {REPORT_TYPE_VALUES.map((value) => (
              <option key={value} value={value} className="bg-[#0f1117]">
                {resolveReportType(lang, value)}
              </option>
            ))}
          </select>
        </div>

        {/* From date */}
        <DatePicker
          lang={lang}
          label={tAR(lang, "fromDate")}
          value={dateRange.from}
          onChange={(v) => setDateRange({ ...dateRange, from: v })}
        />

        {/* To date */}
        <DatePicker
          lang={lang}
          label={tAR(lang, "toDate")}
          value={dateRange.to}
          onChange={(v) => setDateRange({ ...dateRange, to: v })}
        />

        {/* Filter button */}
        <div className="flex items-end">
          <button
            onClick={applyFilter}
            disabled={loading}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl
              transition-all flex items-center justify-center gap-2
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Filter className="w-5 h-5" />
            }
            {tAR(lang, "filter")}
          </button>
        </div>

      </div>
    </GlassCard>
  );
}
