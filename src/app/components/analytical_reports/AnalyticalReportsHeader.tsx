// ============================================================
// AnalyticalReportsHeader.tsx — responsive
// Mobile:  stacked, centered-ish
// Tablet+: row layout
// RTL:     text + layout flips
// ============================================================
import { BarChart3 }  from "lucide-react";
import { tAR }        from "../../core/i18n/analyticalReports.i18n";
import type { Lang }  from "../../core/models/Settings.types";

interface Props { lang: Lang; }

export default function AnalyticalReportsHeader({ lang }: Props) {
  const isRtl = lang === "ar";

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
                     ${isRtl ? "sm:flex-row-reverse" : ""}`}>
      <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700
                        flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div className={isRtl ? "text-right" : "text-left"}>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {tAR(lang, "pageTitle")}
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-0.5">
            {tAR(lang, "pageSubtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
