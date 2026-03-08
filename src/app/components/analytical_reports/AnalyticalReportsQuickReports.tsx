// ============================================================
// AnalyticalReportsQuickReports.tsx — responsive
// Mobile:  single column
// Tablet:  2-column grid
// Desktop: 3-column grid
// Skeleton matches the same breakpoints.
// RTL:     icon + download button flip sides
// report.name = plain API string — rendered directly.
// ============================================================
import { motion }              from "motion/react";
import { FileText, Download }  from "lucide-react";
import GlassCard               from "../../core/shared/components/GlassCard";
import { exportPdf }           from "../../core/shared/components/exportPdf";
import { exportQuickReport, useAnalyticalReports }
                               from "../../core/services/AnalyticalReports.service";
import { tAR, formatDateDisplay, formatNum }
                               from "../../core/i18n/analyticalReports.i18n";
import type { Lang }           from "../../core/models/Settings.types";

interface Props { lang: Lang; }

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 sm:h-20 rounded-2xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

export default function AnalyticalReportsQuickReports({ lang }: Props) {
  const { data, loading, dateRange } = useAnalyticalReports();
  const isRtl = lang === "ar";

  async function handleDownload(reportId: string, reportName: string) {
    await exportQuickReport(reportId, dateRange);
    exportPdf({
      title:    reportName,
      subtitle: tAR(lang, "analyticalReport"),
      metaItems: [
        { label: tAR(lang, "fromDate"), value: formatDateDisplay(dateRange.from, lang) },
        { label: tAR(lang, "toDate"),   value: formatDateDisplay(dateRange.to,   lang) },
      ],
      sections: [{
        html: `
          <div class="stmt-section">
            <div class="stmt-section-title">
              <span class="dot" style="background:#F97316"></span>
              ${reportName}
            </div>
            <div class="stmt-row">
              <span class="lbl">${tAR(lang, "period")}</span>
              <span class="amt">
                ${formatDateDisplay(dateRange.from, lang)} — ${formatDateDisplay(dateRange.to, lang)}
              </span>
            </div>
          </div>
        `,
      }],
    });
  }

  return (
    <div>
      {/* Section title */}
      <h2 className={`text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4
                       ${isRtl ? "text-right" : "text-left"}`}>
        {tAR(lang, "quickReportsTitle")}
      </h2>

      {loading && <Skeleton />}

      {!loading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {data.quickReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.07 }}
            >
              <GlassCard hover className="cursor-pointer p-3 sm:p-4">
                <div className={`flex items-center gap-3 sm:gap-4
                                 ${isRtl ? "flex-row-reverse" : ""}`}>

                  {/* Coloured icon */}
                  <div className={`p-2.5 sm:p-3 bg-gradient-to-br ${report.color}
                                   rounded-xl shrink-0`}>
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>

                  {/* Report name — plain API string */}
                  <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : "text-left"}`}>
                    <h3 className="font-medium text-white text-sm sm:text-base leading-snug truncate">
                      {report.name}
                    </h3>
                  </div>

                  {/* Download button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(report.id, report.name);
                    }}
                    className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                    aria-label={tAR(lang, "exportPdf")}
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white transition-colors" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
