// ============================================================
// invoice.pdf.ts  — PDF export for a single invoice
// Uses the shared exportPdf engine.
// ============================================================
import { exportPdf }         from "../../core/shared/components/exportPdf";
import { tInv, formatCurrency, formatDate } from "../../core/i18n/invoice.i18n";
import type { Invoice, InvoiceStatus } from "../../core/models/invoice.types";
import type { Lang }         from "../../core/models/Settings.types";

// ── Status / type label maps (defined once, used everywhere) ──
const STATUS_LABELS: Record<InvoiceStatus, Record<Lang, string>> = {
  paid:    { ar: "مسددة",   en: "Paid"    },
  partial: { ar: "جزئية",  en: "Partial" },
  pending: { ar: "معلقة",  en: "Pending" },
  overdue: { ar: "متأخرة", en: "Overdue" },
};

const ACCOUNT_LABELS: Record<"revenue" | "expense", Record<Lang, string>> = {
  revenue: { ar: "إيرادات (واردة)",  en: "Revenue (Incoming)" },
  expense: { ar: "مصروفات (صادرة)", en: "Expense (Outgoing)"  },
};

const PARTY_TYPE_LABELS: Record<"subcontractor" | "client", Record<Lang, string>> = {
  subcontractor: { ar: "مقاول باطن", en: "Subcontractor" },
  client:        { ar: "عميل",      en: "Client"         },
};

const METHOD_LABELS: Record<string, Record<Lang, string>> = {
  bank_transfer: { ar: "تحويل بنكي", en: "Bank Transfer" },
  cash:          { ar: "نقداً",      en: "Cash"          },
  check:         { ar: "شيك",        en: "Check"         },
  card:          { ar: "بطاقة",      en: "Card"          },
};

export function exportInvoicePdf(invoice: Invoice, lang: Lang): void {
  const isRtl  = lang === "ar";
  const dir    = isRtl ? "rtl" : "ltr";

  const pct = invoice.totalAmount > 0
    ? Math.min((invoice.paidAmount / invoice.totalAmount) * 100, 100)
    : 0;

  const progressColor =
    pct >= 100 ? "#10b981" : pct >= 60 ? "#3b82f6" : pct > 0 ? "#f97316" : "#ef4444";

  // ── Payment rows ─────────────────────────────────────────
  const paymentRows = invoice.payments.length
    ? invoice.payments.map((p, i) => {
        const rowClass = i % 2 === 0 ? "row-even" : "row-odd";
        const method   = (METHOD_LABELS[p.method] ?? { ar: p.method, en: p.method })[lang];
        return `
          <tr class="${rowClass}">
            <td style="font-weight:600">${formatDate(p.date, lang)}</td>
            <td style="font-weight:700;color:#F97316">${formatCurrency(p.amount, lang)}</td>
            <td>${method}</td>
            <td style="color:#64748b">${p.note || "—"}</td>
          </tr>`;
      }).join("")
    : `<tr>
         <td colspan="4" style="text-align:center;color:#94a3b8;padding:18px">
           ${lang === "ar" ? "لا توجد مدفوعات" : "No payments"}
         </td>
       </tr>`;

  // ── Progress bar ─────────────────────────────────────────
  const progressBar = `
    <div style="margin-top:6px">
      <div style="display:flex;justify-content:space-between;font-size:11px;
                  color:#64748b;margin-bottom:6px;direction:${dir}">
        <span>${tInv(lang, "progressLabel")}</span>
        <span style="font-weight:700;color:${progressColor}">${pct.toFixed(1)}%</span>
      </div>
      <div style="height:10px;background:#e2e8f0;border-radius:999px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${progressColor};border-radius:999px"></div>
      </div>
    </div>`;

  // ── Section 1 — Invoice identity ─────────────────────────
  const sectionIdentity = `
    <div class="section-title">${tInv(lang, "colInvoice")} ${invoice.invoiceNumber}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">

      <!-- Party card -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.6px;color:#94a3b8;
                    margin-bottom:10px;font-weight:600">
          ${invoice.accountType === "revenue" ? tInv(lang, "pdfIssuedTo") : tInv(lang, "pdfIssuedBy")}
        </div>
        <div style="font-size:16px;font-weight:800;color:#1e293b;margin-bottom:4px">
          ${invoice.partyName}
        </div>
        <div style="font-size:12px;color:#64748b">${invoice.partyEntity}</div>
        <div style="margin-top:10px;display:inline-flex;align-items:center;gap:6px;
                    padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;
                    background:rgba(168,85,247,0.1);color:#7c3aed;border:1px solid rgba(168,85,247,0.25)">
          ${PARTY_TYPE_LABELS[invoice.partyType][lang]}
        </div>
      </div>

      <!-- Project + account type card -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.6px;color:#94a3b8;
                    margin-bottom:6px;font-weight:600">${tInv(lang, "pdfProject")}</div>
        <div style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:12px">
          ${invoice.projectName}
        </div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:.6px;color:#94a3b8;
                    margin-bottom:6px;font-weight:600">${tInv(lang, "pdfType")}</div>
        <div style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;
                    border-radius:20px;font-size:11px;font-weight:600;
                    background:${invoice.accountType === "revenue" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"};
                    color:${invoice.accountType === "revenue" ? "#059669" : "#dc2626"};
                    border:1px solid ${invoice.accountType === "revenue" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}">
          <span style="width:6px;height:6px;border-radius:50%;display:inline-block;
                       background:${invoice.accountType === "revenue" ? "#10b981" : "#ef4444"}"></span>
          ${ACCOUNT_LABELS[invoice.accountType][lang]}
        </div>
      </div>
    </div>

    <!-- Dates row -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:16px">
      ${[
        { label: tInv(lang, "invoiceDate"),      value: formatDate(invoice.date, lang)    },
        { label: tInv(lang, "dueDate"),           value: formatDate(invoice.dueDate, lang) },
        { label: tInv(lang, "pdfPaymentStatus"),  value: STATUS_LABELS[invoice.status][lang] },
      ].map(r => `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;
                    padding:12px;text-align:center">
          <div style="font-size:10px;color:#94a3b8;font-weight:600;text-transform:uppercase;
                      margin-bottom:5px">${r.label}</div>
          <div style="font-size:13px;font-weight:700;color:#1e293b">${r.value}</div>
        </div>`).join("")}
    </div>

    ${invoice.description ? `
    <div style="margin-top:16px;padding:14px 16px;background:#fffbf5;
                border:1px solid #fed7aa;border-radius:10px">
      <div style="font-size:10px;color:#ea580c;font-weight:600;margin-bottom:4px;
                  text-transform:uppercase">${tInv(lang, "description")}</div>
      <div style="font-size:12px;color:#92400e">${invoice.description}</div>
    </div>` : ""}`;

  // ── Section 2 — Financial summary ────────────────────────
  const sectionFinancial = `
    <div class="section-title" style="margin-top:24px">
      ${lang === "ar" ? "الملخص المالي" : "Financial Summary"}
    </div>
    <div style="margin-top:12px">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
        ${[
          {
            label: tInv(lang, "totalAmount"),
            value: formatCurrency(invoice.totalAmount, lang),
            color: "#1e293b",
            bg: "#f8fafc",
            border: "#e2e8f0",
          },
          {
            label: tInv(lang, "paidAmount"),
            value: formatCurrency(invoice.paidAmount, lang),
            color: "#059669",
            bg: "rgba(16,185,129,0.06)",
            border: "rgba(16,185,129,0.25)",
          },
          {
            label: tInv(lang, "remainingAmount"),
            value: formatCurrency(invoice.remainingAmount, lang),
            color: invoice.remainingAmount > 0 ? "#dc2626" : "#059669",
            bg:    invoice.remainingAmount > 0 ? "rgba(239,68,68,0.06)"    : "rgba(16,185,129,0.06)",
            border:invoice.remainingAmount > 0 ? "rgba(239,68,68,0.25)"    : "rgba(16,185,129,0.25)",
          },
        ].map(a => `
          <div style="border-radius:12px;padding:16px;text-align:center;
                      background:${a.bg};border:1px solid ${a.border}">
            <div style="font-size:10px;color:#94a3b8;font-weight:600;
                        text-transform:uppercase;margin-bottom:8px">${a.label}</div>
            <div style="font-size:16px;font-weight:800;color:${a.color}">${a.value}</div>
          </div>`).join("")}
      </div>
      ${progressBar}
    </div>`;

  // ── Section 3 — Payment history ──────────────────────────
  const sectionPayments = `
    <div class="section-title" style="margin-top:24px">${tInv(lang, "paymentHistory")}</div>
    <div style="margin-top:12px">
      <table>
        <thead>
          <tr>
            <th style="text-align:${isRtl ? "right" : "left"}">${tInv(lang, "paymentDate")}</th>
            <th style="text-align:${isRtl ? "right" : "left"}">${tInv(lang, "paymentAmount")}</th>
            <th style="text-align:${isRtl ? "right" : "left"}">${tInv(lang, "paymentMethod")}</th>
            <th style="text-align:${isRtl ? "right" : "left"}">${tInv(lang, "paymentNote")}</th>
          </tr>
        </thead>
        <tbody>${paymentRows}</tbody>
        ${invoice.payments.length ? `
        <tfoot>
          <tr class="totals-row">
            <td style="text-align:${isRtl ? "right" : "left"}">
              ${lang === "ar" ? "الإجمالي المدفوع" : "Total Paid"}
            </td>
            <td style="color:#F97316">${formatCurrency(invoice.paidAmount, lang)}</td>
            <td></td><td></td>
          </tr>
        </tfoot>` : ""}
      </table>
    </div>`;

  // ── Assemble and export ───────────────────────────────────
  exportPdf({
    lang,
    title:    `${tInv(lang, "pdfInvoiceTitle")} — ${invoice.invoiceNumber}`,
    subtitle: invoice.description || invoice.projectName,
    metaItems: [
      { label: tInv(lang, "colParty"),    value: invoice.partyName    },
      { label: tInv(lang, "pdfProject"),  value: invoice.projectName  },
      { label: tInv(lang, "invoiceDate"), value: formatDate(invoice.date, lang) },
    ],
    kpiCards: [
      {
        label: tInv(lang, "totalAmount"),
        value: formatCurrency(invoice.totalAmount, lang),
        color: "slate",
      },
      {
        label: tInv(lang, "paidAmount"),
        value: formatCurrency(invoice.paidAmount, lang),
        color: "green",
      },
      {
        label: tInv(lang, "remainingAmount"),
        value: formatCurrency(invoice.remainingAmount, lang),
        color: invoice.remainingAmount > 0 ? "red" : "green",
      },
      {
        label: tInv(lang, "colStatus"),
        value: STATUS_LABELS[invoice.status][lang],
        color: invoice.status === "paid"    ? "green"
             : invoice.status === "overdue" ? "red"
             : "orange",
      },
    ],
    sections: [
      { html: sectionIdentity  },
      { html: sectionFinancial },
      { html: sectionPayments  },
    ],
  });
}
