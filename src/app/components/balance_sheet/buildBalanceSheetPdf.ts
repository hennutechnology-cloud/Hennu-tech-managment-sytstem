// ============================================================
// buildBalanceSheetPdf.ts
// All hardcoded Arabic strings replaced with tBS(lang, key).
// Accepts lang so the PDF matches the user's selected language.
// ============================================================
import type { ExportPdfOptions } from "../../core/shared/components/exportPdf";
import type { BalanceSheetData } from "../../core/models/BalanceSheet.types";
import type { Lang }             from "../../core/models/Settings.types";
import { tBS, formatNum, sar }   from "../../core/i18n/balanceSheet.i18n";

function row(label: string, amount: number, lang: Lang): string {
  return `<div class="stmt-row">
    <span class="lbl">${label}</span>
    <span class="amt">${sar(amount, lang)}</span>
  </div>`;
}

function subtotal(label: string, amount: number, color: string, lang: Lang): string {
  return `<div class="stmt-subtotal">
    <span class="lbl">${label}</span>
    <span class="amt" style="color:${color}">${sar(amount, lang)}</span>
  </div>`;
}

function highlight(label: string, amount: number, bg: string, border: string, valueColor: string, lang: Lang): string {
  return `<div class="stmt-highlight" style="background:${bg};border-color:${border}">
    <span class="lbl" style="color:#1e293b">${label}</span>
    <span class="amt" style="color:${valueColor}">${sar(amount, lang)}</span>
  </div>`;
}

export function buildBalanceSheetPdf(
  data:       BalanceSheetData,
  asOfLabel:  string,
  lang:       Lang,
): ExportPdfOptions {

  const assetsHtml = `
    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#10b981"></span>
        ${tBS(lang, "currentAssetsTitle")}
      </div>
      ${row(tBS(lang, "cash"),        data.assets.currentAssets.cash,        lang)}
      ${row(tBS(lang, "bank1"),       data.assets.currentAssets.bank1,       lang)}
      ${row(tBS(lang, "bank2"),       data.assets.currentAssets.bank2,       lang)}
      ${row(tBS(lang, "receivables"), data.assets.currentAssets.receivables, lang)}
      ${row(tBS(lang, "inventory"),   data.assets.currentAssets.inventory,   lang)}
      ${subtotal(tBS(lang, "totalCurrentAssets"), data.assets.currentAssets.total, "#059669", lang)}
    </div>

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#3b82f6"></span>
        ${tBS(lang, "fixedAssetsTitle")}
      </div>
      ${row(tBS(lang, "land"),      data.assets.fixedAssets.land,      lang)}
      ${row(tBS(lang, "buildings"), data.assets.fixedAssets.buildings, lang)}
      ${row(tBS(lang, "equipment"), data.assets.fixedAssets.equipment, lang)}
      ${row(tBS(lang, "vehicles"),  data.assets.fixedAssets.vehicles,  lang)}
      ${subtotal(tBS(lang, "totalFixedAssets"), data.assets.fixedAssets.total, "#2563eb", lang)}
    </div>

    <div class="net-income">
      <span class="lbl">${tBS(lang, "totalAssets")}</span>
      <span class="amt">${sar(data.assets.totalAssets, lang)}</span>
    </div>
  `;

  const liabEquityHtml = `
    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#ef4444"></span>
        ${tBS(lang, "currentLiabTitle")}
      </div>
      ${row(tBS(lang, "payables"),       data.liabilities.currentLiabilities.payables,       lang)}
      ${row(tBS(lang, "shortTermLoans"), data.liabilities.currentLiabilities.shortTermLoans, lang)}
      ${row(tBS(lang, "taxes"),          data.liabilities.currentLiabilities.taxes,          lang)}
      ${subtotal(tBS(lang, "totalCurrentLiab"), data.liabilities.currentLiabilities.total, "#dc2626", lang)}
    </div>

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#f59e0b"></span>
        ${tBS(lang, "longTermLiabTitle")}
      </div>
      ${row(tBS(lang, "longTermLoans"), data.liabilities.longTermLiabilities.longTermLoans, lang)}
      ${row(tBS(lang, "bonds"),         data.liabilities.longTermLiabilities.bonds,         lang)}
      ${subtotal(tBS(lang, "totalLongTermLiab"), data.liabilities.longTermLiabilities.total, "#dc2626", lang)}
    </div>

    ${highlight(tBS(lang, "totalLiabilities"), data.liabilities.totalLiabilities,
      "rgba(239,68,68,.08)", "#ef4444", "#dc2626", lang)}

    <div class="stmt-section">
      <div class="stmt-section-title">
        <span class="dot" style="background:#3b82f6"></span>
        ${tBS(lang, "equityTitle")}
      </div>
      ${row(tBS(lang, "capital"),          data.equity.capital,          lang)}
      ${row(tBS(lang, "retainedEarnings"), data.equity.retainedEarnings, lang)}
      ${subtotal(tBS(lang, "totalEquity"), data.equity.totalEquity, "#2563eb", lang)}
    </div>

    <div class="net-income">
      <span class="lbl">${tBS(lang, "totalLiabilitiesEquity")}</span>
      <span class="amt">${sar(data.totalLiabilitiesAndEquity, lang)}</span>
    </div>
  `;

  return {
    lang,
    title:    tBS(lang, "pageTitle"),
    subtitle: tBS(lang, "pageSubtitle"),
    metaItems: [
      { label: tBS(lang, "pdfAsOf"), value: asOfLabel },
    ],
    kpiCards: [
      { label: tBS(lang, "kpiTotalAssets"),      value: sar(data.assets.totalAssets,             lang), unit: tBS(lang, "currencyUnit"), color: "green"  },
      { label: tBS(lang, "kpiTotalLiabilities"), value: sar(data.liabilities.totalLiabilities,   lang), unit: tBS(lang, "currencyUnit"), color: "red"    },
      { label: tBS(lang, "kpiEquity"),           value: sar(data.equity.totalEquity,              lang), unit: tBS(lang, "currencyUnit"), color: "blue"   },
      { label: tBS(lang, "kpiLiabAndEquity"),    value: sar(data.totalLiabilitiesAndEquity,       lang), unit: tBS(lang, "currencyUnit"), color: "orange" },
    ],
    sections: [
      { html: `<div class="section-title">${tBS(lang, "assetsTitle")}</div>${assetsHtml}` },
      { html: `<div class="section-title">${tBS(lang, "liabilitiesEquityTitle")}</div>${liabEquityHtml}` },
    ],
  };
}
