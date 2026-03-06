// ============================================================
// AnalyticalReportsQuickReports.tsx
// report.name comes as a plain API string — render directly.
// Only section titles and PDF labels go through tAR().
// ============================================================
import { motion }    from "motion/react";
import { FileText, Download } from "lucide-react";
import GlassCard     from "../../core/shared/components/GlassCard";
import { exportPdf } from "../../core/shared/components/exportPdf";
import { exportQuickReport, useAnalyticalReports }
                     from "../../core/services/AnalyticalReports.service";
import { tAR, formatDateDisplay, formatNum }
                     from "../../core/i18n/analyticalReports.i18n";
import type { Lang } from "../../core/models/Settings.types";

interface Props { lang: Lang; }

function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

export default function AnalyticalReportsQuickReports({ lang }: Props) {
  const { data, loading, dateRange } = useAnalyticalReports();

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
      <h2 className="text-2xl font-bold text-white mb-4">{tAR(lang, "quickReportsTitle")}</h2>

      {loading && <Skeleton />}

      {!loading && data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.quickReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover className="cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gradient-to-br ${report.color} rounded-xl shrink-0`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    {/* report.name is a plain API string — render directly */}
                    <h3 className="font-medium text-white">{report.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDownload(report.id, report.name)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                  >
                    <Download className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
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
