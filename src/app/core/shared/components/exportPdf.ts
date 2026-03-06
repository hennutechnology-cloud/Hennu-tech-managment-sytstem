// ============================================================
// exportPdf.ts  — SHARED reusable PDF export engine
//
// Opens a styled A4 HTML report in a new browser window
// and triggers the browser's native Save-as-PDF dialog.
// No external libraries needed — full RTL/LTR switching.
//
// ── HOW TO USE IN ANY REPORT ─────────────────────────────────
//
//   import { exportPdf } from "../shared/exportPdf";
//   import type { ExportPdfOptions } from "../shared/exportPdf";
//
//   exportPdf({
//     lang:      lang,           // "ar" | "en"  ← NEW, required
//     title:     "Income Statement",
//     subtitle:  "Profit & Loss",
//     metaItems: [{ label: "Period", value: "Jan — Dec 2026" }],
//     kpiCards: [
//       { label: "Net Income", value: "4,000,000 SAR", color: "orange" },
//     ],
//     sections: [{ html: "<p>...</p>" }],
//   });
//
// ── AVAILABLE CSS CLASSES IN sections[].html ─────────────────
//
//   Layout:         .section-title
//   Statement rows: .stmt-section  .stmt-section-title  .dot
//                   .stmt-row (.lbl / .amt)
//                   .stmt-subtotal (.lbl / .amt)
//                   .stmt-highlight (.lbl / .amt)
//                   .net-income (.lbl / .amt)
//   Tables:         table  thead  .row-even  .row-odd
//                   .totals-row
// ============================================================

export type KpiColor = "orange" | "green" | "red" | "blue" | "slate";

export interface KpiCard {
  label: string;
  /** Pre-formatted value string, e.g. "4,000,000 SAR" */
  value: string;
  /** Optional small unit shown below value */
  unit?: string;
  color: KpiColor;
}

export interface MetaItem {
  label: string;
  value: string;
}

export interface PdfSection {
  html: string;
}

export interface ExportPdfOptions {
  /**
   * Language of the report. Controls:
   *   - document dir (rtl / ltr)
   *   - "Printed on" label
   *   - date locale for the print timestamp
   *   - font-family fallback order
   * Defaults to "ar" if omitted (backwards-compatible).
   */
  lang?: "ar" | "en";
  /** Main report title shown in the header badge */
  title: string;
  /** Optional subtitle below title */
  subtitle?: string;
  /**
   * Items shown in the meta info bar.
   * The print-date item is appended automatically.
   */
  metaItems: MetaItem[];
  /** KPI summary cards. Pass [] or omit to skip the card row entirely. */
  kpiCards?: KpiCard[];
  /** Content sections rendered in order inside the content area */
  sections: PdfSection[];
}

// ── Static strings ────────────────────────────────────────────
const PDF_STRINGS = {
  printedOn:  { ar: "تاريخ الطباعة",                                      en: "Printed On"                   },
  companySub: { ar: "نظام إدارة المشاريع الإنشائية",                      en: "Construction Project Management" },
  footerLeft: { ar: "جميع الحقوق محفوظة",                                  en: "All rights reserved"           },
  footerRight:{ ar: "هذا التقرير سري ومخصص للاستخدام الداخلي فقط",        en: "This report is confidential and for internal use only" },
} as const;

function t(lang: "ar" | "en", key: keyof typeof PDF_STRINGS): string {
  return PDF_STRINGS[key][lang];
}

// ── Internal helpers ──────────────────────────────────────────

const KPI_COLORS: Record<KpiColor, { border: string; value: string }> = {
  orange: { border: "#F97316", value: "#F97316" },
  green:  { border: "#10b981", value: "#059669" },
  red:    { border: "#ef4444", value: "#dc2626" },
  blue:   { border: "#3b82f6", value: "#2563eb" },
  slate:  { border: "#64748b", value: "#334155" },
};

function buildKpiCards(cards: KpiCard[]): string {
  if (!cards.length) return "";
  const cols = Math.min(cards.length, 4);
  const items = cards
    .map((c) => {
      const col = KPI_COLORS[c.color];
      return `
      <div class="kpi-card" style="border-top-color:${col.border}">
        <span class="kpi-label">${c.label}</span>
        <div class="kpi-value" style="color:${col.value}">${c.value}</div>
        ${c.unit ? `<div class="kpi-unit">${c.unit}</div>` : ""}
      </div>`;
    })
    .join("");
  return `<div class="kpi-row" style="grid-template-columns:repeat(${cols},1fr)">${items}</div>`;
}

function buildMetaBar(items: MetaItem[]): string {
  const cols = items
    .map(
      (m) =>
        `<div class="meta-item"><label>${m.label}</label><span>${m.value}</span></div>`
    )
    .join("");
  return `<div class="meta-bar" style="grid-template-columns:repeat(${items.length},1fr)">${cols}</div>`;
}

// ── Shared CSS ────────────────────────────────────────────────
function buildCss(dir: "rtl" | "ltr"): string {
  // stmt-row padding flips based on direction so indentation stays on the
  // "start" side regardless of RTL/LTR
  const stmtRowPadding = dir === "rtl" ? "padding:7px 0 7px 24px" : "padding:7px 24px 7px 0";
  const stmtSubPadding = dir === "rtl" ? "padding:9px 0 9px 24px" : "padding:9px 24px 9px 0";

  return `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Inter:wght@300;400;500;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:${dir === "rtl" ? "'Tajawal'" : "'Inter'"}, 'Segoe UI',Tahoma,Arial,sans-serif;
     background:#fff;color:#1a1a2e;direction:${dir};
     -webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;min-height:297mm;margin:0 auto;padding:0;background:#fff;position:relative}

/* ── Header ─────────────────────────────────────────────────── */
.header{background:#0f1117;padding:22px 32px;display:flex;align-items:center;
        justify-content:space-between;border-bottom:4px solid #F97316}
.header-right{display:flex;align-items:center;gap:16px}
.logo-circle{width:52px;height:52px;border-radius:50%;
             background:linear-gradient(135deg,#F97316,#EA580C);
             display:flex;flex-direction:column;align-items:center;justify-content:center;
             color:#fff;font-weight:800;font-size:11px;letter-spacing:1px;flex-shrink:0}
.company-name{color:#fff;font-size:20px;font-weight:800}
.company-sub{color:#9ca3af;font-size:11px;margin-top:2px}
.report-badge{text-align:${dir === "rtl" ? "left" : "right"}}
.report-title{color:#F97316;font-size:15px;font-weight:700;letter-spacing:.5px}
.report-subtitle{color:#9ca3af;font-size:10px;margin-top:3px}

/* ── Meta bar ───────────────────────────────────────────────── */
.meta-bar{background:#f8fafc;border-bottom:1px solid #e2e8f0;
          padding:14px 32px;display:grid;gap:16px}
.meta-item label{font-size:10px;color:#94a3b8;font-weight:500;display:block;
                 margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px}
.meta-item span{font-size:13px;font-weight:700;color:#1e293b}

/* ── KPI cards ──────────────────────────────────────────────── */
.kpi-row{display:grid;gap:12px;padding:18px 32px;
         background:#fff;border-bottom:1px solid #e2e8f0}
.kpi-card{border-radius:10px;padding:13px 16px;background:#f8fafc;
          border:1px solid #e2e8f0;border-top:3px solid;text-align:center}
.kpi-label{font-size:10px;color:#64748b;font-weight:600;display:block;margin-bottom:5px}
.kpi-value{font-size:14px;font-weight:800}
.kpi-unit{font-size:10px;color:#94a3b8;margin-top:2px}

/* ── Content area ───────────────────────────────────────────── */
.content-area{padding:0 32px 60px}

/* ── Section title ──────────────────────────────────────────── */
.section-title{font-size:13px;font-weight:700;color:#1e293b;padding:18px 0 10px;
               border-bottom:2px solid #F97316;margin-bottom:0;
               display:flex;align-items:center;gap:8px}
.section-title::before{content:'';display:block;width:4px;height:16px;
                       background:#F97316;border-radius:2px}

/* ── Generic table ──────────────────────────────────────────── */
table{width:100%;border-collapse:collapse;font-size:12px;table-layout:fixed}
thead tr{background:#0f1117;color:#fff}
thead th{padding:10px 14px;font-weight:700;font-size:11px}
td{padding:9px 14px;vertical-align:middle;word-break:break-word}
tr:not(thead tr){border-bottom:1px solid #e2e8f0}
.row-even{background:#fff}
.row-odd{background:#f8fafc}
.totals-row{background:#0f1117!important;border-top:2px solid #F97316!important}
.totals-row td{color:#fff;font-weight:800;font-size:12px;padding:11px 14px}

/* ── Income-statement helpers ───────────────────────────────── */
.stmt-section{margin-top:18px}
.stmt-section-title{font-size:13px;font-weight:700;color:#1e293b;margin-bottom:8px;
                    padding-bottom:6px;border-bottom:1px solid #e2e8f0;
                    display:flex;align-items:center;gap:8px}
.dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;display:inline-block}
.stmt-row{display:flex;justify-content:space-between;align-items:center;
          ${stmtRowPadding};border-bottom:1px solid #f1f5f9;font-size:12px}
.stmt-row .lbl{color:#475569}
.stmt-row .amt{font-weight:600;color:#1e293b}
.stmt-subtotal{display:flex;justify-content:space-between;align-items:center;
               ${stmtSubPadding};border-top:1px solid #cbd5e1;margin-top:2px}
.stmt-subtotal .lbl{font-weight:700;color:#1e293b;font-size:12px}
.stmt-subtotal .amt{font-weight:700;font-size:13px}
.stmt-highlight{display:flex;justify-content:space-between;align-items:center;
                padding:13px 20px;border-radius:10px;margin:14px 0;border:1px solid}
.stmt-highlight .lbl{font-weight:700;font-size:14px}
.stmt-highlight .amt{font-weight:800;font-size:18px}
.net-income{display:flex;justify-content:space-between;align-items:center;
            padding:18px 24px;border-radius:12px;margin-top:20px;
            background:linear-gradient(135deg,rgba(249,115,22,.12),rgba(234,88,12,.06));
            border:1.5px solid rgba(249,115,22,.4)}
.net-income .lbl{font-weight:800;font-size:18px;color:#1e293b}
.net-income .amt{font-weight:800;font-size:26px;color:#F97316}

/* ── Footer ─────────────────────────────────────────────────── */
.footer{background:#0f1117;border-top:2px solid #F97316;padding:13px 32px;
        display:flex;align-items:center;justify-content:space-between;
        position:absolute;bottom:0;left:0;right:0}
.footer span{color:#6b7280;font-size:10px}
.footer strong{color:#F97316}

/* ── Screen preview ─────────────────────────────────────────── */
@media screen{
  body{background:#e5e7eb;padding:24px 0}
  .page{box-shadow:0 4px 32px rgba(0,0,0,.18);border-radius:4px}
}
/* ── Print (true A4) ────────────────────────────────────────── */
@media print{
  html,body{margin:0;padding:0;background:#fff}
  .page{width:210mm;min-height:297mm;margin:0;padding:0;
        box-shadow:none;border-radius:0;page-break-after:always}
  @page{size:A4 portrait;margin:0}
}
`;
}

// ── Public API ────────────────────────────────────────────────

export function exportPdf(options: ExportPdfOptions): void {
  const { title, subtitle, metaItems, kpiCards = [], sections } = options;

  // Normalise lang — default to "ar" for backwards compatibility
  const lang: "ar" | "en" =
    typeof options.lang === "string" && options.lang.startsWith("en") ? "en" : "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";

  const printedOn = new Date().toLocaleDateString(
    lang === "ar" ? "ar-SA" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  const allMeta = [...metaItems, { label: t(lang, "printedOn"), value: printedOn }];

  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <style>${buildCss(dir)}</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="header-right">
      <div class="logo-circle">
        <span>HENNU</span>
        <span style="font-size:8px;font-weight:600">TECH</span>
      </div>
      <div>
        <div class="company-name">Hennu Tech</div>
        <div class="company-sub">${t(lang, "companySub")}</div>
      </div>
    </div>
    <div class="report-badge">
      <div class="report-title">${title}</div>
      ${subtitle ? `<div class="report-subtitle">${subtitle}</div>` : ""}
    </div>
  </div>

  ${buildMetaBar(allMeta)}
  ${buildKpiCards(kpiCards)}

  <div class="content-area">
    ${sections.map((s) => s.html).join("\n")}
  </div>

  <div class="footer">
    <span>&copy; ${new Date().getFullYear()} <strong>Hennu Tech</strong> &mdash; ${t(lang, "footerLeft")}</span>
    <span>${t(lang, "footerRight")}</span>
  </div>

</div>
<script>
  document.fonts.ready.then(() => setTimeout(() => window.print(), 350));
</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=920,height=720");
  if (!win) {
    alert(lang === "ar"
      ? "يرجى السماح بالنوافذ المنبثقة لتصدير التقرير"
      : "Please allow pop-ups to export the report");
    return;
  }
  win.document.write(html);
  win.document.close();
}
