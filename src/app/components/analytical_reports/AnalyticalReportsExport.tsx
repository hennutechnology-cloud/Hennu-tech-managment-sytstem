// ============================================================
// AnalyticalReportsExport.tsx
// ============================================================
import { useState } from "react";
import GlassCard from "../../core/shared/components/GlassCard";
import { exportPdf } from "../../core/shared/components/exportPdf";
import { Download, Calendar } from "lucide-react";
import { useAnalyticalReports } from "../../core/services/AnalyticalReports.service";
import type { AnalyticalReportsData, DateRange } from "../../core/models/AnalyticalReports.types";

const MONTHS_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

function formatDate(v: string): string {
  if (!v) return "";
  const [y, m, d] = v.split("-");
  return `${parseInt(d)} ${MONTHS_AR[parseInt(m) - 1]} ${y}`;
}

function num(n: number): string {
  return n.toLocaleString("ar-SA");
}

function buildProfitRows(data: AnalyticalReportsData): string {
  return data.profitability
    .map((p, i) => `
      <tr class="${i % 2 === 0 ? "row-even" : "row-odd"}">
        <td style="text-align:right">${p.month}</td>
        <td style="text-align:center;color:#059669">${p.margin}%</td>
        <td style="text-align:center;color:#F97316">${p.roi}%</td>
      </tr>`)
    .join("");
}

function buildExpenseRows(data: AnalyticalReportsData): string {
  return data.expenseBreakdown
    .map((e, i) => `
      <tr class="${i % 2 === 0 ? "row-even" : "row-odd"}">
        <td style="text-align:right">${e.category}</td>
        <td style="text-align:center;font-weight:600">${num(e.amount)} ر.س</td>
      </tr>`)
    .join("");
}

function calcAvg(arr: number[]): string {
  return (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1);
}

function triggerPdfExport(data: AnalyticalReportsData, dateRange: DateRange): void {
  const totalExpenses = data.expenseBreakdown.reduce((s, e) => s + e.amount, 0);
  const avgMargin     = calcAvg(data.profitability.map((p) => p.margin));
  const avgRoi        = calcAvg(data.profitability.map((p) => p.roi));

  exportPdf({
    title:    "التقارير التحليلية",
    subtitle: "تقارير مفصلة وتحليلات متقدمة",
    metaItems: [
      { label: "من تاريخ",  value: formatDate(dateRange.from) },
      { label: "إلى تاريخ", value: formatDate(dateRange.to)   },
    ],
    kpiCards: [
      { label: "متوسط هامش الربح",           value: `${avgMargin}%`,          color: "green"  },
      { label: "متوسط العائد على الاستثمار", value: `${avgRoi}%`,             color: "orange" },
      { label: "إجمالي المصروفات",           value: `${num(totalExpenses)} ر.س`, color: "red" },
    ],
    sections: [
      {
        html: `
          <div class="section-title">تحليل الربحية</div>
          <table>
            <thead>
              <tr>
                <th style="text-align:right;width:40%">الشهر</th>
                <th style="text-align:center;width:30%">هامش الربح %</th>
                <th style="text-align:center;width:30%">العائد على الاستثمار %</th>
              </tr>
            </thead>
            <tbody>${buildProfitRows(data)}</tbody>
          </table>
        `,
      },
      {
        html: `
          <div class="section-title" style="margin-top:24px">تحليل المصروفات</div>
          <table>
            <thead>
              <tr>
                <th style="text-align:right;width:60%">الفئة</th>
                <th style="text-align:center;width:40%">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              ${buildExpenseRows(data)}
              <tr class="totals-row">
                <td>الإجمالي</td>
                <td style="text-align:center;color:#F97316">${num(totalExpenses)} ر.س</td>
              </tr>
            </tbody>
          </table>
        `,
      },
    ],
  });
}

export default function AnalyticalReportsExport() {
  const { data, dateRange } = useAnalyticalReports();
  const [scheduling, setScheduling] = useState(false);

  function handlePdfExport() {
    if (!data) return;
    triggerPdfExport(data, dateRange);
  }

  function handleSchedule() {
    setScheduling(true);
    setTimeout(() => setScheduling(false), 1500);
  }

  return (
    <GlassCard>
      <h2 className="text-xl font-bold text-white mb-4">تصدير التقارير</h2>
      <div className="flex items-center gap-4 flex-wrap">

        <button
          onClick={handlePdfExport}
          disabled={!data}
          className="px-6 py-3 bg-gradient-to-l from-red-500 to-red-600 text-white rounded-xl
            hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          تصدير إلى PDF
        </button>

        <button
          onClick={handleSchedule}
          disabled={scheduling}
          className="px-6 py-3 bg-gradient-to-l from-blue-500 to-blue-600 text-white rounded-xl
            hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {scheduling
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Calendar className="w-5 h-5" />
          }
          جدولة التقارير
        </button>

      </div>
    </GlassCard>
  );
}
