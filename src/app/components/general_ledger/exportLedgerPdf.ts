// ============================================================
// exportLedgerPdf.ts
// Converts ledger data into ExportPdfOptions and calls the
// shared exportPdf() engine — same pattern as buildIncomePdf.ts
// ============================================================
import type { LedgerEntry, LedgerFilters, LedgerSummary } from "../../core/models/GeneralLedger.types";
import { exportPdf } from "../../core/shared/components/exportPdf";

const MONTHS_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

function formatDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${parseInt(day)} ${MONTHS_AR[parseInt(m) - 1]} ${y}`;
}

function num(n: number): string {
  return n.toLocaleString("ar-SA");
}

function sar(n: number): string {
  return `${num(n)} ر.س`;
}

export async function exportLedgerPdf(
  entries: LedgerEntry[],
  filters: LedgerFilters,
  accountName: string,
  summary: LedgerSummary,
): Promise<void> {
  const rowsHtml = entries
    .map(
      (e, i) => `
      <tr class="${i % 2 === 0 ? "row-even" : "row-odd"}">
        <td style="color:#475569;font-size:11px;width:18%;text-align:right">${formatDate(e.date)}</td>
        <td style="color:#1e293b;font-weight:500;width:34%;text-align:right">${e.description}</td>
        <td style="text-align:center;font-weight:600;color:#059669;width:16%">${e.debit  > 0 ? num(e.debit)  : "—"}</td>
        <td style="text-align:center;font-weight:600;color:#dc2626;width:16%">${e.credit > 0 ? num(e.credit) : "—"}</td>
        <td style="text-align:center;font-weight:700;color:#1e293b;width:16%">${num(e.balance)}</td>
      </tr>`,
    )
    .join("");

  const contentHtml = `
    <div class="section-title">تفاصيل الحركات المالية</div>
    <table>
      <thead>
        <tr>
          <th style="width:18%;text-align:right">التاريخ</th>
          <th style="width:34%;text-align:right">البيان</th>
          <th style="width:16%;text-align:center">مدين</th>
          <th style="width:16%;text-align:center">دائن</th>
          <th style="width:16%;text-align:center">الرصيد</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
        <tr class="totals-row">
          <td colspan="2">الإجماليات</td>
          <td style="text-align:center;color:#34d399">${num(summary.totalDebit)}</td>
          <td style="text-align:center;color:#f87171">${num(summary.totalCredit)}</td>
          <td style="text-align:center;color:#F97316">${num(summary.closingBalance)}</td>
        </tr>
      </tbody>
    </table>
  `;

  exportPdf({
    title: "تقرير الأستاذ العام",
    subtitle: "بيان حركات الحساب",
    metaItems: [
      { label: "الحساب",        value: `${filters.accountCode} — ${accountName}` },
      { label: "الفترة الزمنية", value: `${formatDate(filters.dateFrom)} — ${formatDate(filters.dateTo)}` },
    ],
    kpiCards: [
      { label: "الرصيد الافتتاحي", value: sar(summary.openingBalance), unit: "ريال سعودي", color: "slate"  },
      { label: "إجمالي المدين",     value: sar(summary.totalDebit),     unit: "ريال سعودي", color: "green"  },
      { label: "إجمالي الدائن",     value: sar(summary.totalCredit),    unit: "ريال سعودي", color: "red"    },
      { label: "الرصيد الختامي",    value: sar(summary.closingBalance), unit: "ريال سعودي", color: "orange" },
    ],
    sections: [{ html: contentHtml }],
  });
}
