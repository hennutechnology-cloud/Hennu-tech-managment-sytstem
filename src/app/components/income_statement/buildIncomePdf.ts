// ============================================================
// buildIncomePdf.ts
// Converts IncomeStatementData into ExportPdfOptions for the
// shared exportPdf() engine.
//
// Usage:
//   import { buildIncomePdf } from "./buildIncomePdf";
//   import { exportPdf }      from "../shared/exportPdf";
//   exportPdf(buildIncomePdf(data, periodKey));
// ============================================================
import type { ExportPdfOptions } from "../../core/shared/components/exportPdf";
import type { IncomeStatementData, PeriodKey } from "../../core/models/IncomeStatement.types";
import { PERIODS } from "../../core/services/IncomeStatement.service";

function fmt(n: number): string { return n.toLocaleString("ar-SA"); }
function sar(n: number): string { return fmt(n) + " ر.س"; }

function row(label: string, amount: number): string {
  return `<div class="stmt-row">
    <span class="lbl">${label}</span>
    <span class="amt">${fmt(amount)} ر.س</span>
  </div>`;
}

function negRow(label: string, amount: number): string {
  return `<div class="stmt-row">
    <span class="lbl">${label}</span>
    <span class="amt">(${fmt(amount)}) ر.س</span>
  </div>`;
}

function subtotal(label: string, amount: number, color: string, negative = false): string {
  const display = negative ? `(${fmt(amount)}) ر.س` : `${fmt(amount)} ر.س`;
  return `<div class="stmt-subtotal">
    <span class="lbl">${label}</span>
    <span class="amt" style="color:${color}">${display}</span>
  </div>`;
}

function highlight(
  label: string, amount: number,
  bg: string, border: string, valueColor: string,
): string {
  return `<div class="stmt-highlight" style="background:${bg};border-color:${border}">
    <span class="lbl" style="color:#1e293b">${label}</span>
    <span class="amt" style="color:${valueColor}">${fmt(amount)} ر.س</span>
  </div>`;
}

export function buildIncomePdf(
  data: IncomeStatementData,
  periodKey: PeriodKey,
): ExportPdfOptions {
  const periodLabel = PERIODS.find((p) => p.key === periodKey)?.label ?? periodKey;

  const contentHtml = `
    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#10b981"></span>
        الإيرادات
      </div>
      ${row("إيرادات المبيعات", data.revenue.sales)}
      ${row("إيرادات أخرى",     data.revenue.otherIncome)}
      ${subtotal("إجمالي الإيرادات", data.revenue.total, "#059669")}
    </div>

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#ef4444"></span>
        تكلفة البضاعة المباعة
      </div>
      ${negRow("مواد خام",     data.cogs.materials)}
      ${negRow("عمالة مباشرة", data.cogs.labor)}
      ${negRow("تكاليف أخرى", data.cogs.other)}
      ${subtotal("إجمالي التكلفة", data.cogs.total, "#dc2626", true)}
    </div>

    ${highlight(
      "إجمالي الربح", data.grossProfit,
      "rgba(16,185,129,.08)", "#10b981", "#059669",
    )}

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#f97316"></span>
        المصروفات التشغيلية
      </div>
      ${negRow("الرواتب والأجور",    data.operatingExpenses.salaries)}
      ${negRow("الإيجارات",           data.operatingExpenses.rent)}
      ${negRow("المصاريف الإدارية",  data.operatingExpenses.administrative)}
      ${negRow("المرافق والخدمات",   data.operatingExpenses.utilities)}
      ${negRow("التسويق والإعلان",   data.operatingExpenses.marketing)}
      ${negRow("الإهلاك والاستهلاك", data.operatingExpenses.depreciation)}
      ${subtotal("إجمالي المصروفات التشغيلية",
        data.operatingExpenses.total, "#dc2626", true)}
    </div>

    ${highlight(
      "الدخل التشغيلي", data.operatingIncome,
      "rgba(59,130,246,.08)", "#3b82f6", "#2563eb",
    )}

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#f59e0b"></span>
        مصروفات أخرى
      </div>
      ${negRow("فوائد بنكية", data.otherExpenses.interest)}
      ${negRow("ضرائب",        data.otherExpenses.taxes)}
      ${subtotal("إجمالي المصروفات الأخرى",
        data.otherExpenses.total, "#dc2626", true)}
    </div>

    <div class="net-income">
      <span class="lbl">صافي الربح</span>
      <span class="amt">${fmt(data.netIncome)} ر.س</span>
    </div>
  `;

  return {
    title:    "قائمة الدخل",
    subtitle: "بيان الأرباح والخسائر",
    metaItems: [
      { label: "الفترة المالية", value: periodLabel },
    ],
    kpiCards: [
      { label: "إجمالي الإيرادات", value: sar(data.revenue.total),      color: "green"  },
      { label: "إجمالي الربح",      value: sar(data.grossProfit),         color: "green"  },
      { label: "الدخل التشغيلي",    value: sar(data.operatingIncome),     color: "blue"   },
      { label: "صافي الربح",        value: sar(data.netIncome),           color: "orange" },
    ],
    sections: [{ html: contentHtml }],
  };
}
