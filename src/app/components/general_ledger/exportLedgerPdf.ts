// ============================================================
// exportLedgerPdf.ts  (lives in components/general_ledger/)
// Embedded in the feature folder — not a shared utility.
// All strings go through tGL(lang, key) / sar(n, lang).
// formatLedgerDate(lang, iso) converts "YYYY-MM-DD" using
// FULL_MONTHS from util.i18n — no hardcoded Arabic month names.
// ============================================================
import type { LedgerEntry, LedgerFilters, LedgerSummary } from "../../core/models/GeneralLedger.types";
import { exportPdf }  from "../../core/shared/components/exportPdf";
import { tGL, formatLedgerDate, formatNum, sar } from "../../core/i18n/generalLedger.i18n";
import type { Lang } from "../../core/models/Settings.types";

export async function exportLedgerPdf(
  entries:     LedgerEntry[],
  filters:     LedgerFilters,
  accountName: string,
  summary:     LedgerSummary,
  lang:        Lang,
): Promise<void> {

  const rowsHtml = entries
    .map(
      (e, i) => `
      <tr class="${i % 2 === 0 ? "row-even" : "row-odd"}">
        <td style="color:#475569;font-size:11px;width:18%;text-align:right">
          ${formatLedgerDate(lang, e.date)}
        </td>
        <td style="color:#1e293b;font-weight:500;width:34%;text-align:right">
          ${e.description}
        </td>
        <td style="text-align:center;font-weight:600;color:#059669;width:16%">
          ${e.debit  > 0 ? formatNum(e.debit,  lang) : "—"}
        </td>
        <td style="text-align:center;font-weight:600;color:#dc2626;width:16%">
          ${e.credit > 0 ? formatNum(e.credit, lang) : "—"}
        </td>
        <td style="text-align:center;font-weight:700;color:#1e293b;width:16%">
          ${formatNum(e.balance, lang)}
        </td>
      </tr>`,
    )
    .join("");

  const contentHtml = `
    <div class="section-title">${tGL(lang, "pdfSectionTitle")}</div>
    <table>
      <thead>
        <tr>
          <th style="width:18%;text-align:right">${tGL(lang, "pdfColDate")}</th>
          <th style="width:34%;text-align:right">${tGL(lang, "pdfColDesc")}</th>
          <th style="width:16%;text-align:center">${tGL(lang, "pdfColDebit")}</th>
          <th style="width:16%;text-align:center">${tGL(lang, "pdfColCredit")}</th>
          <th style="width:16%;text-align:center">${tGL(lang, "pdfColBalance")}</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
        <tr class="totals-row">
          <td colspan="2">${tGL(lang, "pdfTotals")}</td>
          <td style="text-align:center;color:#34d399">${formatNum(summary.totalDebit,    lang)}</td>
          <td style="text-align:center;color:#f87171">${formatNum(summary.totalCredit,   lang)}</td>
          <td style="text-align:center;color:#F97316">${formatNum(summary.closingBalance, lang)}</td>
        </tr>
      </tbody>
    </table>
  `;

  exportPdf({
    lang,
    title:    tGL(lang, "pdfTitle"),
    subtitle: tGL(lang, "pdfSubtitle"),
    metaItems: [
      { label: tGL(lang, "pdfMetaAccount"), value: `${filters.accountCode} — ${accountName}` },
      {
        label: tGL(lang, "pdfMetaPeriod"),
        value: `${formatLedgerDate(lang, filters.dateFrom)} — ${formatLedgerDate(lang, filters.dateTo)}`,
      },
    ],
    kpiCards: [
      { label: tGL(lang, "pdfKpiOpening"), value: sar(summary.openingBalance, lang), unit: tGL(lang, "currencyFull"), color: "slate"  },
      { label: tGL(lang, "pdfKpiDebit"),   value: sar(summary.totalDebit,    lang), unit: tGL(lang, "currencyFull"), color: "green"  },
      { label: tGL(lang, "pdfKpiCredit"),  value: sar(summary.totalCredit,   lang), unit: tGL(lang, "currencyFull"), color: "red"    },
      { label: tGL(lang, "pdfKpiClosing"), value: sar(summary.closingBalance, lang), unit: tGL(lang, "currencyFull"), color: "orange" },
    ],
    sections: [{ html: contentHtml }],
  });
}
