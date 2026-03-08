// ============================================================
// BalanceSheetHeader.tsx — responsive
// ============================================================
import { Download }             from "lucide-react";
import { useBalanceSheet }      from "../../core/services/BalanceSheet.service";
import { exportPdf }            from "../../core/shared/components/exportPdf";
import { buildBalanceSheetPdf } from "./buildBalanceSheetPdf";
import { tBS }                  from "../../core/i18n/balanceSheet.i18n";
import { FULL_MONTHS }          from "../../core/i18n/util.i18n";
import type { Lang }            from "../../core/models/Settings.types";

interface Props { lang: Lang; }

function formatAsOf(v: string, lang: Lang): string {
  if (!v) return "";
  const [y, m, d] = v.split("-");
  return `${parseInt(d)} ${FULL_MONTHS[lang][parseInt(m) - 1]} ${y}`;
}

export default function BalanceSheetHeader({ lang }: Props) {
  const { data, loading, asOf } = useBalanceSheet();
  const isRtl = lang === "ar";

  function handleExport() {
    if (!data) return;
    exportPdf(buildBalanceSheetPdf(data, formatAsOf(asOf, lang), lang));
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
                     ${isRtl ? "sm:flex-row-reverse" : ""}`}>

      {/* Title block */}
      <div className={isRtl ? "text-right" : "text-left"}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          {tBS(lang, "pageTitle")}
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          {tBS(lang, "pageSubtitle")}
        </p>
      </div>

      {/* Export button — full width on mobile, auto on sm+ */}
      <button
        onClick={handleExport}
        disabled={!data || loading}
        className={`flex items-center justify-center gap-2
                    px-4 sm:px-6 py-2.5 sm:py-3
                    bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
                    hover:shadow-lg hover:shadow-orange-500/30 transition-all
                    text-sm sm:text-base font-medium
                    w-full sm:w-auto shrink-0
                    disabled:opacity-40 disabled:cursor-not-allowed
                    ${isRtl ? "flex-row-reverse" : ""}`}
      >
        {loading
          ? <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        }
        <span>{tBS(lang, "exportPdf")}</span>
      </button>
    </div>
  );
}
