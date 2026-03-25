// ============================================================
// InvoiceTable.tsx  (updated — adds invoiceKind badge)
// ============================================================
import { motion, AnimatePresence } from "motion/react";
import { Eye, CreditCard, FileDown, TrendingUp, TrendingDown, FileText, Layers } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import {
  tInv, formatCurrency, formatDate,
  STATUS_STYLES, ACCOUNT_STYLES, KIND_STYLES,
} from "../../core/i18n/invoice.i18n";
import type { InvoiceTableProps, Invoice } from "../../core/models/invoice.types";
import type { Lang } from "../../core/models/Settings.types";

function StatusBadge({ status, lang }: { status: Invoice["status"]; lang: Lang }) {
  const s = STATUS_STYLES[status];
  const labels: Record<Invoice["status"], Record<Lang, string>> = {
    paid:    { ar: "مسددة",   en: "Paid"    },
    partial: { ar: "جزئية",  en: "Partial" },
    pending: { ar: "معلقة",  en: "Pending" },
    overdue: { ar: "متأخرة", en: "Overdue" },
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.border} ${s.text}`}>
      {labels[status][lang]}
    </span>
  );
}

function AccountBadge({ type, lang }: { type: Invoice["accountType"]; lang: Lang }) {
  const s    = ACCOUNT_STYLES[type];
  const Icon = type === "revenue" ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.bg} ${s.border} ${s.text}`}>
      <Icon className="w-2.5 h-2.5" />
      {type === "revenue" ? (lang === "ar" ? "إيراد" : "Revenue") : (lang === "ar" ? "مصروف" : "Expense")}
    </span>
  );
}

function KindBadge({ kind, lang }: { kind: Invoice["invoiceKind"]; lang: Lang }) {
  const s    = KIND_STYLES[kind];
  const Icon = kind === "progress" ? Layers : FileText;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.bg} ${s.border} ${s.text}`}>
      <Icon className="w-2.5 h-2.5" />
      {kind === "progress" ? (lang === "ar" ? "مستخلص" : "Progress") : (lang === "ar" ? "عادية" : "Normal")}
    </span>
  );
}

function ProgressBar({ paid, total }: { paid: number; total: number }) {
  const pct   = total > 0 ? Math.min((paid / total) * 100, 100) : 0;
  const color = pct >= 100 ? "bg-emerald-500" : pct >= 60 ? "bg-blue-500" : pct > 0 ? "bg-orange-500" : "bg-red-500/50";
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }} />
    </div>
  );
}

// ── Mobile card ───────────────────────────────────────────────
function InvoiceCard({ invoice, lang, onDetails, onAddPayment, onExportPdf }: {
  invoice: Invoice; lang: Lang;
  onDetails: (i: Invoice) => void;
  onAddPayment: (i: Invoice) => void;
  onExportPdf: (i: Invoice) => void;
}) {
  const isRtl    = lang === "ar";
  const isProgress = invoice.invoiceKind === "progress";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
      className={`rounded-xl border p-4 space-y-3 ${
        isProgress
          ? "bg-violet-500/[0.04] border-violet-500/20"
          : "bg-white/[0.04] border-white/10"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className={`flex items-start justify-between gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
        <div>
          <div className={`flex items-center gap-1.5 mb-0.5 ${isRtl ? "flex-row-reverse" : ""}`}>
            {isProgress && <Layers className="w-3 h-3 text-violet-400" />}
            <p className="text-sm font-bold text-white font-mono">{invoice.invoiceNumber}</p>
          </div>
          <p className="text-xs text-gray-400">{invoice.partyName}</p>
        </div>
        <div className={`flex flex-col items-end gap-1 ${isRtl ? "items-start" : ""}`}>
          <StatusBadge status={invoice.status} lang={lang} />
          <div className={`flex gap-1 ${isRtl ? "flex-row-reverse" : ""}`}>
            <AccountBadge type={invoice.accountType} lang={lang} />
            <KindBadge kind={invoice.invoiceKind} lang={lang} />
          </div>
        </div>
      </div>

      <p className={`text-xs text-gray-500 ${isRtl ? "text-right" : ""}`}>{invoice.projectName}</p>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: tInv(lang, "colTotal"),     value: formatCurrency(invoice.totalAmount, lang),     color: "text-white"       },
          { label: tInv(lang, "colPaid"),       value: formatCurrency(invoice.paidAmount, lang),      color: "text-emerald-400" },
          { label: tInv(lang, "colRemaining"),  value: formatCurrency(invoice.remainingAmount, lang), color: "text-orange-400"  },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.04] rounded-lg px-2 py-2 text-center">
            <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <ProgressBar paid={invoice.paidAmount} total={invoice.totalAmount} />

      <div className={`flex gap-2 pt-1 ${isRtl ? "flex-row-reverse" : ""}`}>
        <button onClick={() => onDetails(invoice)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/15 bg-white/5 text-xs text-gray-300 hover:bg-white/10 transition-colors">
          <Eye className="w-3.5 h-3.5" />
          {tInv(lang, "viewDetails")}
        </button>
        {invoice.status !== "paid" && (
          <button onClick={() => onAddPayment(invoice)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-l from-orange-500 to-orange-600 text-xs text-white font-medium hover:shadow-lg hover:shadow-orange-500/20 transition-all">
            <CreditCard className="w-3.5 h-3.5" />
            {tInv(lang, "addPayment")}
          </button>
        )}
        <button onClick={() => onExportPdf(invoice)}
          className="px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
          <FileDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function InvoiceTable({ invoices, lang, onDetails, onAddPayment, onExportPdf }: InvoiceTableProps) {
  const isRtl   = lang === "ar";
  const thAlign = isRtl ? "text-right" : "text-left";

  if (invoices.length === 0) {
    return (
      <GlassCard className="flex flex-col items-center justify-center gap-3 py-20">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-gray-500" />
        </div>
        <p className="text-sm text-gray-500">{tInv(lang, "noInvoices")}</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="overflow-hidden">
      {/* Mobile */}
      <div className="md:hidden p-3 space-y-3" dir={isRtl ? "rtl" : "ltr"}>
        <AnimatePresence mode="popLayout">
          {invoices.map(inv => (
            <InvoiceCard key={inv.id} invoice={inv} lang={lang}
              onDetails={onDetails} onAddPayment={onAddPayment} onExportPdf={onExportPdf} />
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" dir={isRtl ? "rtl" : "ltr"}>
          <thead>
            <tr className="border-b border-white/10">
              {[
                tInv(lang, "colInvoice"), tInv(lang, "colParty"),
                tInv(lang, "colProject"), tInv(lang, "colDate"),
                tInv(lang, "colTotal"),   tInv(lang, "colPaid"),
                tInv(lang, "colRemaining"), tInv(lang, "colStatus"),
                tInv(lang, "colActions"),
              ].map(h => (
                <th key={h} className={`py-4 px-4 text-xs font-semibold text-gray-400 whitespace-nowrap ${thAlign}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {invoices.map(inv => {
                const isProgress = inv.invoiceKind === "progress";
                return (
                  <motion.tr key={inv.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`border-b border-white/5 transition-colors group ${
                      isProgress ? "hover:bg-violet-500/5" : "hover:bg-white/5"
                    }`}>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className={`flex items-center gap-1.5 ${isRtl ? "flex-row-reverse" : ""}`}>
                          {isProgress && <Layers className="w-3 h-3 text-violet-400 shrink-0" />}
                          <p className="font-mono text-sm text-white font-semibold">{inv.invoiceNumber}</p>
                        </div>
                        <div className={`flex gap-1 ${isRtl ? "flex-row-reverse" : ""}`}>
                          <AccountBadge type={inv.accountType} lang={lang} />
                          <KindBadge kind={inv.invoiceKind} lang={lang} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-white font-medium">{inv.partyName}</p>
                      <p className="text-xs text-gray-500">{inv.partyEntity}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-300 max-w-[140px] truncate">{inv.projectName}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="text-xs text-gray-400">{formatDate(inv.date, lang)}</p>
                      <p className="text-[10px] text-gray-600">{tInv(lang, "dueDate")}: {formatDate(inv.dueDate, lang)}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-white">{formatCurrency(inv.totalAmount, lang)}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-emerald-400">{formatCurrency(inv.paidAmount, lang)}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-orange-400">{formatCurrency(inv.remainingAmount, lang)}</p>
                        <ProgressBar paid={inv.paidAmount} total={inv.totalAmount} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inv.status} lang={lang} />
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isRtl ? "flex-row-reverse" : ""}`}>
                        <button onClick={() => onDetails(inv)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                          title={tInv(lang, "viewDetails")}>
                          <Eye className="w-4 h-4" />
                        </button>
                        {inv.status !== "paid" && (
                          <button onClick={() => onAddPayment(inv)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-orange-400"
                            title={tInv(lang, "addPayment")}>
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => onExportPdf(inv)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-blue-400"
                          title={tInv(lang, "exportPdf")}>
                          <FileDown className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
