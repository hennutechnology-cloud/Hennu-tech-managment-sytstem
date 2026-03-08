// ============================================================
// AnalyticalReportsFilter.tsx — responsive
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

  const isRtl   = lang === "ar";
  const labelCls = `block text-gray-400 text-sm mb-2 ${isRtl ? "text-right" : "text-left"}`;
  const inputCls = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3
                    text-white focus:outline-none focus:border-[#F97316] transition-colors
                    cursor-pointer text-sm sm:text-base`;

  return (
    <GlassCard className="p-4 sm:p-6">
      {/* Grid: 1 col → 2 col → 4 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        {/* Report type */}
        <div>
          <label className={labelCls}>{tAR(lang, "reportTypeLabel")}</label>
          <select
            value={reportType}
            dir={isRtl ? "rtl" : "ltr"}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className={inputCls}
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

        {/* Filter button — aligns to bottom of cell on desktop */}
        <div className="flex items-end">
          <button
            onClick={applyFilter}
            disabled={loading}
            className={`w-full px-4 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white
                        rounded-xl transition-all flex items-center justify-center gap-2
                        text-sm sm:text-base
                        disabled:opacity-40 disabled:cursor-not-allowed
                        ${isRtl ? "flex-row-reverse" : ""}`}
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            }
            <span>{tAR(lang, "filter")}</span>
          </button>
        </div>

      </div>
    </GlassCard>
  );
}
