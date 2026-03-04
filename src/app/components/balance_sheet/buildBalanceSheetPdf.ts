// ============================================================
// buildBalanceSheetPdf.ts
// Converts BalanceSheetData into ExportPdfOptions for the
// shared exportPdf() engine.
//
// Usage:
//   import { buildBalanceSheetPdf } from "./buildBalanceSheetPdf";
//   import { exportPdf }            from "../shared/exportPdf";
//   exportPdf(buildBalanceSheetPdf(data, asOfLabel));
// ============================================================
import type { ExportPdfOptions } from "../../core/shared/components/exportPdf";
import type { BalanceSheetData } from "../../core/models/BalanceSheet.types";

function fmt(n: number): string { return n.toLocaleString("ar-SA"); }
function sar(n: number): string { return `${fmt(n)} ر.س`; }

function row(label: string, amount: number): string {
  return `<div class="stmt-row">
    <span class="lbl">${label}</span>
    <span class="amt">${fmt(amount)} ر.س</span>
  </div>`;
}

function subtotal(label: string, amount: number, color: string): string {
  return `<div class="stmt-subtotal">
    <span class="lbl">${label}</span>
    <span class="amt" style="color:${color}">${fmt(amount)} ر.س</span>
  </div>`;
}

function highlight(label: string, amount: number, bg: string, border: string, valueColor: string): string {
  return `<div class="stmt-highlight" style="background:${bg};border-color:${border}">
    <span class="lbl" style="color:#1e293b">${label}</span>
    <span class="amt" style="color:${valueColor}">${fmt(amount)} ر.س</span>
  </div>`;
}

export function buildBalanceSheetPdf(
  data: BalanceSheetData,
  asOfLabel: string,
): ExportPdfOptions {
  const assetsHtml = `
    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#10b981"></span>
        الأصول المتداولة
      </div>
      ${row("الصندوق",        data.assets.currentAssets.cash)}
      ${row("البنك - الراجحي", data.assets.currentAssets.bank1)}
      ${row("البنك - الأهلي",  data.assets.currentAssets.bank2)}
      ${row("العملاء",         data.assets.currentAssets.receivables)}
      ${row("المخزون",         data.assets.currentAssets.inventory)}
      ${subtotal("إجمالي الأصول المتداولة", data.assets.currentAssets.total, "#059669")}
    </div>

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#3b82f6"></span>
        الأصول الثابتة
      </div>
      ${row("الأراضي",  data.assets.fixedAssets.land)}
      ${row("المباني",  data.assets.fixedAssets.buildings)}
      ${row("المعدات",  data.assets.fixedAssets.equipment)}
      ${row("السيارات", data.assets.fixedAssets.vehicles)}
      ${subtotal("إجمالي الأصول الثابتة", data.assets.fixedAssets.total, "#2563eb")}
    </div>

    <div class="net-income">
      <span class="lbl">إجمالي الأصول</span>
      <span class="amt">${fmt(data.assets.totalAssets)} ر.س</span>
    </div>
  `;

  const liabilitiesEquityHtml = `
    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#ef4444"></span>
        الخصوم المتداولة
      </div>
      ${row("الموردون",          data.liabilities.currentLiabilities.payables)}
      ${row("قروض قصيرة الأجل", data.liabilities.currentLiabilities.shortTermLoans)}
      ${row("مستحقات ضريبية",   data.liabilities.currentLiabilities.taxes)}
      ${subtotal("إجمالي الخصوم المتداولة", data.liabilities.currentLiabilities.total, "#dc2626")}
    </div>

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#f59e0b"></span>
        الخصوم طويلة الأجل
      </div>
      ${row("قروض طويلة الأجل", data.liabilities.longTermLiabilities.longTermLoans)}
      ${row("سندات",             data.liabilities.longTermLiabilities.bonds)}
      ${subtotal("إجمالي الخصوم طويلة الأجل", data.liabilities.longTermLiabilities.total, "#dc2626")}
    </div>

    ${highlight(
      "إجمالي الخصوم",
      data.liabilities.totalLiabilities,
      "rgba(239,68,68,.08)", "#ef4444", "#dc2626",
    )}

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#3b82f6"></span>
        حقوق الملكية
      </div>
      ${row("رأس المال",       data.equity.capital)}
      ${row("الأرباح المحتجزة", data.equity.retainedEarnings)}
      ${subtotal("إجمالي حقوق الملكية", data.equity.totalEquity, "#2563eb")}
    </div>

    <div class="net-income">
      <span class="lbl">إجمالي الخصوم وحقوق الملكية</span>
      <span class="amt">${fmt(data.totalLiabilitiesAndEquity)} ر.س</span>
    </div>
  `;

  return {
    title:    "الميزانية العمومية",
    subtitle: "المركز المالي للشركة",
    metaItems: [
      { label: "كما في", value: asOfLabel },
    ],
    kpiCards: [
      { label: "إجمالي الأصول",              value: sar(data.assets.totalAssets),             unit: "ريال سعودي", color: "green"  },
      { label: "إجمالي الخصوم",              value: sar(data.liabilities.totalLiabilities),   unit: "ريال سعودي", color: "red"    },
      { label: "حقوق الملكية",               value: sar(data.equity.totalEquity),              unit: "ريال سعودي", color: "blue"   },
      { label: "الخصوم + حقوق الملكية",      value: sar(data.totalLiabilitiesAndEquity),       unit: "ريال سعودي", color: "orange" },
    ],
    sections: [
      { html: `<div class="section-title">الأصول</div>${assetsHtml}` },
      { html: `<div class="section-title">الخصوم وحقوق الملكية</div>${liabilitiesEquityHtml}` },
    ],
  };
}
