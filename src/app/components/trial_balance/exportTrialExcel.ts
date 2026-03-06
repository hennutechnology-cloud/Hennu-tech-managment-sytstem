// ============================================================
// exportTrialExcel.ts
// ============================================================
import type {
  TrialBalanceItem,
  TrialBalanceFilters,
  TrialBalanceSummary,
} from "../../core/models/TrialBalance.types";
import { tTB, tTBInterp, fmtDate } from "../../core/i18n/trialBalance.i18n";
import type { Lang } from "../../core/models/Settings.types";

// ── Cell helper ───────────────────────────────────────────────
type CellStyle = {
  font?: object; fill?: object; alignment?: object;
  border?: object; numFmt?: string;
};
function cell(value: string | number, style: CellStyle) {
  return { v: value, t: typeof value === "number" ? "n" : "s", s: style };
}
const empty = { v: "", t: "s" };

// ── Colour constants ──────────────────────────────────────────
const C = {
  orange:    "FFF97316", dark:      "FF0F1117", dark2:     "FF1A1D2B",
  white:     "FFFFFFFF", gray:      "FF9CA3AF", slate:     "FF475569",
  green:     "FF34D399", greenDark: "FF064E3B",
  red:       "FFF87171", redDark:   "FF450A0A",
};

const BORDER_ORANGE = {
  top:    { style: "medium", color: { rgb: "F97316" } },
  bottom: { style: "medium", color: { rgb: "F97316" } },
  left:   { style: "thin",   color: { rgb: "F97316" } },
  right:  { style: "thin",   color: { rgb: "F97316" } },
};
const BORDER_SUBTLE = { bottom: { style: "thin", color: { rgb: "2A2D3E" } } };
const rowBorder = (isLast = false) =>
  isLast ? { bottom: { style: "medium", color: { rgb: "F97316" } } } : BORDER_SUBTLE;

// Reading order: 2 = RTL, 1 = LTR
const ro = (lang: Lang) => lang === "ar" ? 2 : 1;

export async function exportTrialExcel(
  items: TrialBalanceItem[],
  filters: TrialBalanceFilters,
  summary: TrialBalanceSummary,
  lang: Lang,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const XLSX = (await import(/* @vite-ignore */ "xlsx")) as any;

  // Printed-on date — numeric format matches fmtDate() style
  const now = new Date();
  const printedOn = fmtDate(now.toISOString().slice(0, 10));

  const align = (h: string) => ({
    horizontal: h, vertical: "center", readingOrder: ro(lang),
  });

  const rows: (ReturnType<typeof cell> | typeof empty)[][] = [];

  // ── Row 1 — Company ──────────────────────────────────────
  rows.push([cell(tTB(lang, "excelCompany"), {
    font:      { bold: true, sz: 14, color: { rgb: "F97316" }, name: "Arial" },
    fill:      { fgColor: { rgb: C.dark } },
    alignment: align("center"),
  }), empty, empty, empty]);

  // ── Row 2 — Report title ─────────────────────────────────
  rows.push([cell(tTB(lang, "excelSheetTitle"), {
    font:      { bold: true, sz: 18, color: { rgb: C.white }, name: "Arial" },
    fill:      { fgColor: { rgb: C.dark } },
    alignment: align("center"),
  }), empty, empty, empty]);

  // ── Row 3 — Period (numeric dates, e.g. "01/03/2025 — 31/03/2025") ──
  rows.push([cell(
    `${tTB(lang, "excelPeriod")}: ${fmtDate(filters.dateFrom)} — ${fmtDate(filters.dateTo)}`,
    {
      font:      { sz: 10, color: { rgb: C.gray }, name: "Arial" },
      fill:      { fgColor: { rgb: C.dark } },
      alignment: align("center"),
    },
  ), empty, empty, empty]);

  // ── Row 4 — Printed on (numeric date) ───────────────────
  rows.push([cell(`${tTB(lang, "excelPrintedOn")}: ${printedOn}`, {
    font:      { sz: 10, color: { rgb: C.gray }, name: "Arial" },
    fill:      { fgColor: { rgb: C.dark } },
    alignment: align("center"),
  }), empty, empty, empty]);

  // ── Row 5 — spacer ───────────────────────────────────────
  rows.push([empty, empty, empty, empty]);

  // ── Row 6 — Balance status banner ────────────────────────
  const statusText = summary.isBalanced
    ? tTBInterp(lang, "excelBalanced",   { total: summary.totalDebit.toLocaleString() })
    : tTBInterp(lang, "excelUnbalanced", { diff:  summary.difference.toLocaleString() });

  rows.push([cell(statusText, {
    font:      { bold: true, sz: 11, color: { rgb: summary.isBalanced ? C.green : C.red }, name: "Arial" },
    fill:      { fgColor: { rgb: summary.isBalanced ? C.greenDark : C.redDark } },
    alignment: align("center"),
    border:    BORDER_ORANGE,
  }), empty, empty, empty]);

  // ── Row 7 — spacer ───────────────────────────────────────
  rows.push([empty, empty, empty, empty]);

  // ── Row 8 — Column headers ────────────────────────────────
  const codeAccountAlign = lang === "ar" ? "right" : "left";
  const hdr = (h: string) => ({
    font:      { bold: true, sz: 11, color: { rgb: C.white }, name: "Arial" },
    fill:      { fgColor: { rgb: "F97316" } },
    alignment: align(h),
    border:    { bottom: { style: "medium", color: { rgb: "EA580C" } } },
  });
  rows.push([
    cell(tTB(lang, "excelColCode"),    hdr(codeAccountAlign)),
    cell(tTB(lang, "excelColAccount"), hdr(codeAccountAlign)),
    cell(tTB(lang, "excelColDebit"),   hdr("center")),
    cell(tTB(lang, "excelColCredit"),  hdr("center")),
  ]);

  // ── Rows 9+ — Data rows ───────────────────────────────────
  items.forEach((item, i) => {
    const even   = i % 2 === 0;
    const fill   = even ? C.dark : C.dark2;
    const isLast = i === items.length - 1;
    const base   = (h: string, color = C.white) => ({
      font:      { sz: 10, color: { rgb: color }, name: "Arial" },
      fill:      { fgColor: { rgb: fill } },
      alignment: align(h),
      border:    rowBorder(isLast),
    });
    rows.push([
      // code: always LTR regardless of UI language (numeric codes don't reverse)
      cell(item.code,    { ...base(codeAccountAlign, C.slate), font: { sz: 10, color: { rgb: C.slate }, name: "Courier New" } }),
      cell(item.account, base(codeAccountAlign)),
      cell(item.debit  > 0 ? item.debit  : 0, { ...base("center", C.green), numFmt: '#,##0;"-"' }),
      cell(item.credit > 0 ? item.credit : 0, { ...base("center", C.red),   numFmt: '#,##0;"-"' }),
    ]);
  });

  // ── Spacer before totals ──────────────────────────────────
  rows.push([empty, empty, empty, empty]);

  // ── Totals row ────────────────────────────────────────────
  const tot = (h: string, color = C.white) => ({
    font:      { bold: true, sz: 12, color: { rgb: color }, name: "Arial" },
    fill:      { fgColor: { rgb: C.dark } },
    alignment: align(h),
    border:    { top: { style: "medium", color: { rgb: "F97316" } } },
    numFmt:    "#,##0",
  });
  rows.push([
    cell(tTB(lang, "excelTotal"), tot(codeAccountAlign)),
    empty,
    cell(summary.totalDebit,  tot("center", C.green)),
    cell(summary.totalCredit, tot("center", C.red)),
  ]);

  // ── Assemble worksheet ────────────────────────────────────
  const ws: Record<string, unknown> = {};
  const cols = ["A", "B", "C", "D"];
  rows.forEach((row, r) =>
    row.forEach((c, ci) => { ws[`${cols[ci]}${r + 1}`] = c; }),
  );

  ws["!ref"]  = `A1:D${rows.length}`;
  ws["!cols"] = [{ wch: 16 }, { wch: 38 }, { wch: 24 }, { wch: 24 }];
  ws["!rows"] = [
    { hpt: 36 }, { hpt: 44 }, { hpt: 24 }, { hpt: 24 },
    { hpt: 10 }, { hpt: 32 }, { hpt: 10 }, { hpt: 30 },
    ...items.map(() => ({ hpt: 26 })),
    { hpt: 10 }, { hpt: 32 },
  ];
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // company
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // title
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // period
    { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } }, // printed on
    { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } }, // status banner
    { s: { r: rows.length - 1, c: 0 }, e: { r: rows.length - 1, c: 1 } }, // totals label
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, tTB(lang, "excelSheetName"));
  XLSX.writeFile(wb, `trial_balance_${filters.dateFrom}_${filters.dateTo}.xlsx`);
}
