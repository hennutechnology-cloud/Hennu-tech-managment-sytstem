// ============================================================
// AnalyticalReportsExport.tsx — responsive
// ============================================================
import { useState }            from "react";
import GlassCard               from "../../core/shared/components/GlassCard";
import { exportPdf }           from "../../core/shared/components/exportPdf";
import { Download, Calendar }  from "lucide-react";
import { useAnalyticalReports }
                               from "../../core/services/AnalyticalReports.service";
import { tAR, formatDateDisplay, formatNum }
                               from "../../core/i18n/analyticalReports.i18n";
import { SHORT_MONTHS }        from "../../core/i18n/util.i18n";
import type { AnalyticalReportsData, DateRange }
                               from "../../core/models/AnalyticalReports.types";
import type { Lang }           from "../../core/models/Settings.types";

interface Props { lang: Lang; }

function calcAvg(arr: number[]): string {
  return (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1);
}

function buildProfitRows(data: AnalyticalReportsData, lang: Lang): string {
  return data.profitability
    .map((p, i) => `
      <tr class="${i % 2 === 0 ? "row-even" : "row-odd"}">
        <td style="text-align:right">${SHORT_MONTHS[lang][p.month - 1]}</td>
        <td style="text-align:center;color:#059669">${p.margin}%</td>
        <td style="text-align:center;color:#F97316">${p.roi}%</td>
      </tr>`)
    .join("");
}

function buildExpenseRows(data: AnalyticalReportsData, lang: Lang): string {
  return data.expenseBreakdown
    .map((e, i) => `
      <tr class="${i % 2 === 0 ? "row-even" : "row-odd"}">
        <td style="text-align:right">${e.category}</td>
        <td style="text-align:center;font-weight:600">
          ${formatNum(e.amount, lang)} ${tAR(lang, "currency")}
        </td>
      </tr>`)
    .join("");
}

function triggerPdfExport(data: AnalyticalReportsData, dateRange: DateRange, lang: Lang): void {
  const totalExpenses = data.expenseBreakdown.reduce((s, e) => s + e.amount, 0);
  const avgMargin     = calcAvg(data.profitability.map((p) => p.margin));
  const avgRoi        = calcAvg(data.profitability.map((p) => p.roi));

  exportPdf({
    title:    tAR(lang, "pageTitle"),
    subtitle: tAR(lang, "pdfSubtitle"),
    metaItems: [
      { label: tAR(lang, "fromDate"), value: formatDateDisplay(dateRange.from, lang) },
      { label: tAR(lang, "toDate"),   value: formatDateDisplay(dateRange.to,   lang) },
    ],
    kpiCards: [
      { label: tAR(lang, "avgProfitMargin"), value: `${avgMargin}%`,                                              color: "green"  },
      { label: tAR(lang, "avgRoi"),          value: `${avgRoi}%`,                                                 color: "orange" },
      { label: tAR(lang, "totalExpenses"),   value: `${formatNum(totalExpenses, lang)} ${tAR(lang, "currency")}`, color: "red"    },
    ],
    sections: [
      {
        html: `
          <div class="section-title">${tAR(lang, "profitAnalysis")}</div>
          <table>
            <thead>
              <tr>
                <th style="text-align:right;width:40%">${tAR(lang, "monthCol")}</th>
                <th style="text-align:center;width:30%">${tAR(lang, "profitMarginCol")}</th>
                <th style="text-align:center;width:30%">${tAR(lang, "roiCol")}</th>
              </tr>
            </thead>
            <tbody>${buildProfitRows(data, lang)}</tbody>
          </table>
        `,
      },
      {
        html: `
          <div class="section-title" style="margin-top:24px">${tAR(lang, "expenseAnalysis")}</div>
          <table>
            <thead>
              <tr>
                <th style="text-align:right;width:60%">${tAR(lang, "categoryCol")}</th>
                <th style="text-align:center;width:40%">${tAR(lang, "amountCol")}</th>
              </tr>
            </thead>
            <tbody>
              ${buildExpenseRows(data, lang)}
              <tr class="totals-row">
                <td>${tAR(lang, "totalRow")}</td>
                <td style="text-align:center;color:#F97316">
                  ${formatNum(totalExpenses, lang)} ${tAR(lang, "currency")}
                </td>
              </tr>
            </tbody>
          </table>
        `,
      },
    ],
  });
}

export default function AnalyticalReportsExport({ lang }: Props) {
  const { data, dateRange } = useAnalyticalReports();
  const [scheduling, setScheduling] = useState(false);
  const isRtl = lang === "ar";

  function handlePdfExport() {
    if (!data) return;
    triggerPdfExport(data, dateRange, lang);
  }

  function handleSchedule() {
    setScheduling(true);
    setTimeout(() => setScheduling(false), 1500);
  }

  const btnBase = `flex items-center justify-center gap-2
                   px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all
                   text-sm sm:text-base font-medium text-white
                   w-full sm:w-auto
                   disabled:opacity-40 disabled:cursor-not-allowed
                   ${isRtl ? "flex-row-reverse" : ""}`;

  return (
    <GlassCard className="p-4 sm:p-6">
      <h2 className={`text-lg sm:text-xl font-bold text-white mb-4
                       ${isRtl ? "text-right" : "text-left"}`}>
        {tAR(lang, "exportTitle")}
      </h2>

      {/* Buttons: stacked on mobile, row on sm+ */}
      <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4
                        ${isRtl ? "sm:flex-row-reverse" : ""}`}>

        {/* PDF Export */}
        <button
          onClick={handlePdfExport}
          disabled={!data}
          className={`${btnBase}
                      bg-gradient-to-l from-red-500 to-red-600
                      hover:shadow-lg hover:shadow-red-500/30`}
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>{tAR(lang, "exportPdf")}</span>
        </button>

        {/* Schedule */}
        <button
          onClick={handleSchedule}
          disabled={scheduling}
          className={`${btnBase}
                      bg-gradient-to-l from-blue-500 to-blue-600
                      hover:shadow-lg hover:shadow-blue-500/30`}
        >
          {scheduling
            ? <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
            : <Calendar className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          }
          <span>{scheduling ? tAR(lang, "scheduling") : tAR(lang, "scheduleReports")}</span>
        </button>

      </div>
    </GlassCard>
  );
}
