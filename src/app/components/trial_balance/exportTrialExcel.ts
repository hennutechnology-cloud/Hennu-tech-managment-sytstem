// ============================================================
// exportTrialExcel.ts
// ============================================================
import type {
  TrialBalanceItem,
  TrialBalanceFilters,
  TrialBalanceSummary,
} from "../../core/models/TrialBalance.types";

const MONTHS_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

function fmtDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${parseInt(day)} ${MONTHS_AR[parseInt(m) - 1]} ${y}`;
}

// ── Helpers to write a cell with full style ──────────────────────────────
type CellStyle = {
  font?: object;
  fill?: object;
  alignment?: object;
  border?: object;
  numFmt?: string;
};

function cell(value: string | number, style: CellStyle) {
  return { v: value, t: typeof value === "number" ? "n" : "s", s: style };
}

// ── Colour constants (ARGB hex, no #) ────────────────────────────────────
const C = {
  orange:    "FFF97316",
  dark:      "FF0F1117",
  dark2:     "FF1A1D2B",
  white:     "FFFFFFFF",
  gray:      "FF9CA3AF",
  slate:     "FF475569",
  green:     "FF34D399",
  greenDark: "FF064E3B",
  red:       "FFF87171",
  redDark:   "FF450A0A",
  amber:     "FFF59E0B",
  amberBg:   "FF451A03",
  headerBg:  "FF1E2436",
};

const BORDER_ORANGE = {
  top:    { style: "medium", color: { rgb: "F97316" } },
  bottom: { style: "medium", color: { rgb: "F97316" } },
  left:   { style: "thin",   color: { rgb: "F97316" } },
  right:  { style: "thin",   color: { rgb: "F97316" } },
};

const BORDER_SUBTLE = {
  bottom: { style: "thin", color: { rgb: "2A2D3E" } },
};

function rowBorder(isLast = false) {
  return isLast
    ? { bottom: { style: "medium", color: { rgb: "F97316" } } }
    : BORDER_SUBTLE;
}

export async function exportTrialExcel(
  items: TrialBalanceItem[],
  filters: TrialBalanceFilters,
  summary: TrialBalanceSummary,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const XLSX = (await import(/* @vite-ignore */ "xlsx")) as any;

  const printedOn = new Date().toLocaleDateString("ar-SA", {
    year: "numeric", month: "long", day: "numeric",
  });

  // ── Worksheet rows (each row is an array of cell objects) ──────────────
  const rows: (ReturnType<typeof cell> | { v: string; t: string })[][] = [];

  // Row 1 — Company name
  rows.push([cell("Hennu Tech — نظام إدارة المشاريع الإنشائية", {
    font:      { bold: true, sz: 14, color: { rgb: "F97316" }, name: "Arial" },
    fill:      { fgColor: { rgb: "0F1117" } },
    alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
  }), { v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }]);

  // Row 2 — Report title
  rows.push([cell("ميزان المراجعة", {
    font:      { bold: true, sz: 18, color: { rgb: C.white }, name: "Arial" },
    fill:      { fgColor: { rgb: C.dark } },
    alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
  }), { v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }]);

  // Row 3 — Period
  rows.push([cell(`الفترة: ${fmtDate(filters.dateFrom)} — ${fmtDate(filters.dateTo)}`, {
    font:      { sz: 10, color: { rgb: C.gray }, name: "Arial" },
    fill:      { fgColor: { rgb: C.dark } },
    alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
  }), { v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }]);

  // Row 4 — Printed on
  rows.push([cell(`تاريخ الطباعة: ${printedOn}`, {
    font:      { sz: 10, color: { rgb: C.gray }, name: "Arial" },
    fill:      { fgColor: { rgb: C.dark } },
    alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
  }), { v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }]);

  // Row 5 — blank spacer
  rows.push([cell("", {}), { v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }]);

  // Row 6 — Balance status banner
  const statusText = summary.isBalanced
    ? `✓  الميزان متوازن  —  الإجمالي: ${summary.totalDebit.toLocaleString()} ر.س`
    : `✗  الميزان غير متوازن  —  الفرق: ${summary.difference.toLocaleString()} ر.س`;
  rows.push([cell(statusText, {
    font:      { bold: true, sz: 11, color: { rgb: summary.isBalanced ? C.green : C.red }, name: "Arial" },
    fill:      { fgColor: { rgb: summary.isBalanced ? C.greenDark : C.redDark } },
    alignment: { horizontal: "center", vertical: "center", readingOrder: 2 },
    border:    BORDER_ORANGE,
  }), { v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }]);

  // Row 7 — blank spacer
  rows.push([cell("", {}), { v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }]);

  // Row 8 — Column headers
  const colHeaderStyle = (align: string) => ({
    font:      { bold: true, sz: 11, color: { rgb: C.white }, name: "Arial" },
    fill:      { fgColor: { rgb: "F97316" } },
    alignment: { horizontal: align, vertical: "center", readingOrder: 2 },
    border:    { bottom: { style: "medium", color: { rgb: "EA580C" } } },
  });
  rows.push([
    cell("رمز الحساب", colHeaderStyle("right")),
    cell("اسم الحساب",  colHeaderStyle("right")),
    cell("مدين (ر.س)",  colHeaderStyle("center")),
    cell("دائن (ر.س)",  colHeaderStyle("center")),
  ]);

  // Rows 9+ — Data rows
  const dataStart = rows.length; // 0-based index where data rows begin
  items.forEach((item, i) => {
    const even     = i % 2 === 0;
    const fillRgb  = even ? C.dark : C.dark2;
    const isLastData = i === items.length - 1;
    const base = (align: string, color = C.white) => ({
      font:      { sz: 10, color: { rgb: color }, name: "Arial" },
      fill:      { fgColor: { rgb: fillRgb } },
      alignment: { horizontal: align, vertical: "center", readingOrder: 2 },
      border:    rowBorder(isLastData),
    });
    rows.push([
      cell(item.code,    { ...base("right", C.slate), font: { sz: 10, color: { rgb: C.slate }, name: "Courier New" } }),
      cell(item.account, base("right")),
      cell(item.debit  > 0 ? item.debit  : 0, { ...base("center", C.green), numFmt: '#,##0;"-"' }),
      cell(item.credit > 0 ? item.credit : 0, { ...base("center", C.red),   numFmt: '#,##0;"-"' }),
    ]);
  });

  // Blank spacer before totals
  rows.push([cell("", {}), { v: "", t: "s" }, { v: "", t: "s" }, { v: "", t: "s" }]);

  // Totals row
  const totStyle = (align: string, color = C.white) => ({
    font:      { bold: true, sz: 12, color: { rgb: color }, name: "Arial" },
    fill:      { fgColor: { rgb: C.dark } },
    alignment: { horizontal: align, vertical: "center", readingOrder: 2 },
    border:    { top: { style: "medium", color: { rgb: "F97316" } } },
    numFmt:    "#,##0",
  });
  rows.push([
    cell("الإجمالي",          totStyle("right")),
    cell("",                   { ...totStyle("right"), fill: { fgColor: { rgb: C.dark } } }),
    cell(summary.totalDebit,   totStyle("center", C.green)),
    cell(summary.totalCredit,  totStyle("center", C.red)),
  ]);

  // ── Assemble sheet from rows array ────────────────────────────────────
  const ws: Record<string, unknown> = {};
  const colLetters = ["A", "B", "C", "D"];

  rows.forEach((row, rIdx) => {
    row.forEach((c, cIdx) => {
      const addr = `${colLetters[cIdx]}${rIdx + 1}`;
      ws[addr] = c;
    });
  });

  // Sheet range
  ws["!ref"] = `A1:D${rows.length}`;

  // Column widths
  ws["!cols"] = [
    { wch: 16 }, // code
    { wch: 36 }, // account name
    { wch: 24 }, // debit
    { wch: 24 }, // credit
  ];

  // Row heights
  ws["!rows"] = [
    { hpt: 36 }, // row 1 company
    { hpt: 44 }, // row 2 title
    { hpt: 24 }, // row 3 period
    { hpt: 24 }, // row 4 printed
    { hpt: 10 }, // row 5 spacer
    { hpt: 32 }, // row 6 status
    { hpt: 10 }, // row 7 spacer
    { hpt: 30 }, // row 8 headers
    ...items.map(() => ({ hpt: 26 })),     // data rows
    { hpt: 10 },                            // spacer before totals
    { hpt: 32 },                            // totals
  ];

  // Merges: header rows + status + totals label
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // company
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // title
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // period
    { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } }, // printed
    { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } }, // status
    // totals label spans col A+B
    { s: { r: rows.length - 1, c: 0 }, e: { r: rows.length - 1, c: 1 } },
  ];

  // ── Build workbook and save ───────────────────────────────────────────
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ميزان المراجعة");

  const filename = `trial_balance_${filters.dateFrom}_${filters.dateTo}.xlsx`;
  XLSX.writeFile(wb, filename);
}
