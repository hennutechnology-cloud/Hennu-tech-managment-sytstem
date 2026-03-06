// ============================================================
// buildIncomePdf.ts  (lives in components/income_statement/)
// Embedded in the feature folder — not a shared utility.
// All strings go through tIS(lang, key).
// Numbers use sar()/sarNeg()/formatNum() from the i18n file.
// ============================================================
import type { ExportPdfOptions }   from "../../core/shared/components/exportPdf";
import type { IncomeStatementData, PeriodKey } from "../../core/models/IncomeStatement.types";
import { PERIODS }                 from "../../core/services/IncomeStatement.service";
import { tIS, sar, sarNeg, formatNum } from "../../core/i18n/incomeStatement.i18n";
import type { Lang }               from "../../core/models/Settings.types";

function row(label: string, amount: number, lang: Lang): string {
  return `<div class="stmt-row">
    <span class="lbl">${label}</span>
    <span class="amt">${sar(amount, lang)}</span>
  </div>`;
}

function negRow(label: string, amount: number, lang: Lang): string {
  return `<div class="stmt-row">
    <span class="lbl">${label}</span>
    <span class="amt">${sarNeg(amount, lang)}</span>
  </div>`;
}

function subtotal(label: string, amount: number, color: string, negative = false, lang: Lang): string {
  const display = negative ? sarNeg(amount, lang) : sar(amount, lang);
  return `<div class="stmt-subtotal">
    <span class="lbl">${label}</span>
    <span class="amt" style="color:${color}">${display}</span>
  </div>`;
}

function highlight(
  label: string, amount: number,
  bg: string, border: string, valueColor: string,
  lang: Lang,
): string {
  return `<div class="stmt-highlight" style="background:${bg};border-color:${border}">
    <span class="lbl" style="color:#1e293b">${label}</span>
    <span class="amt" style="color:${valueColor}">${sar(amount, lang)}</span>
  </div>`;
}

export function buildIncomePdf(
  data:      IncomeStatementData,
  periodKey: PeriodKey,
  lang:      Lang,
): ExportPdfOptions {
  // period.label is a plain API string — rendered directly
  const periodLabel = PERIODS.find((p) => p.key === periodKey)?.label ?? periodKey;

  const contentHtml = `
    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#10b981"></span>
        ${tIS(lang, "sectionRevenue")}
      </div>
      ${row(tIS(lang, "revSales"),  data.revenue.sales,       lang)}
      ${row(tIS(lang, "revOther"),  data.revenue.otherIncome, lang)}
      ${subtotal(tIS(lang, "revTotal"), data.revenue.total, "#059669", false, lang)}
    </div>

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#ef4444"></span>
        ${tIS(lang, "sectionCogs")}
      </div>
      ${negRow(tIS(lang, "cogsMaterials"), data.cogs.materials, lang)}
      ${negRow(tIS(lang, "cogsLabor"),     data.cogs.labor,     lang)}
      ${negRow(tIS(lang, "cogsOther"),     data.cogs.other,     lang)}
      ${subtotal(tIS(lang, "cogsTotal"), data.cogs.total, "#dc2626", true, lang)}
    </div>

    ${highlight(tIS(lang, "grossProfit"), data.grossProfit,
      "rgba(16,185,129,.08)", "#10b981", "#059669", lang)}

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#f97316"></span>
        ${tIS(lang, "sectionOpEx")}
      </div>
      ${negRow(tIS(lang, "opExSalaries"),    data.operatingExpenses.salaries,       lang)}
      ${negRow(tIS(lang, "opExRent"),        data.operatingExpenses.rent,           lang)}
      ${negRow(tIS(lang, "opExAdmin"),       data.operatingExpenses.administrative, lang)}
      ${negRow(tIS(lang, "opExUtilities"),   data.operatingExpenses.utilities,      lang)}
      ${negRow(tIS(lang, "opExMarketing"),   data.operatingExpenses.marketing,      lang)}
      ${negRow(tIS(lang, "opExDepreciation"),data.operatingExpenses.depreciation,   lang)}
      ${subtotal(tIS(lang, "opExTotal"), data.operatingExpenses.total, "#dc2626", true, lang)}
    </div>

    ${highlight(tIS(lang, "operatingIncome"), data.operatingIncome,
      "rgba(59,130,246,.08)", "#3b82f6", "#2563eb", lang)}

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#f59e0b"></span>
        ${tIS(lang, "sectionOtherEx")}
      </div>
      ${negRow(tIS(lang, "otherExInterest"), data.otherExpenses.interest, lang)}
      ${negRow(tIS(lang, "otherExTaxes"),    data.otherExpenses.taxes,    lang)}
      ${subtotal(tIS(lang, "otherExTotal"), data.otherExpenses.total, "#dc2626", true, lang)}
    </div>

    <div class="net-income">
      <span class="lbl">${tIS(lang, "netIncome")}</span>
      <span class="amt">${sar(data.netIncome, lang)}</span>
    </div>
  `;

  return {
    lang,
    title:    tIS(lang, "pdfTitle"),
    subtitle: tIS(lang, "pdfSubtitle"),
    metaItems: [
      { label: tIS(lang, "pdfMetaPeriod"), value: periodLabel },
    ],
    kpiCards: [
      { label: tIS(lang, "pdfKpiRevenue"),    value: sar(data.revenue.total,    lang), color: "green"  },
      { label: tIS(lang, "pdfKpiGrossProfit"),value: sar(data.grossProfit,       lang), color: "green"  },
      { label: tIS(lang, "pdfKpiOpIncome"),   value: sar(data.operatingIncome,  lang), color: "blue"   },
      { label: tIS(lang, "pdfKpiNetIncome"),  value: sar(data.netIncome,        lang), color: "orange" },
    ],
    sections: [{ html: contentHtml }],
  };
}
