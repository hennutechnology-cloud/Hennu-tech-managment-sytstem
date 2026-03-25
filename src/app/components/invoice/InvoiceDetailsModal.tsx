// ============================================================
// InvoiceDetailsModal.tsx
// ============================================================
import { useState }                from "react";
import { motion, AnimatePresence }  from "motion/react";
import {
  X, CreditCard, FileDown, TrendingUp, TrendingDown,
  Building2, Users, Calendar, CheckCircle2, Edit2, Trash2, Layers,
} from "lucide-react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  tInv, formatCurrency, formatDate,
  STATUS_STYLES, ACCOUNT_STYLES, KIND_STYLES,
} from "../../core/i18n/invoice.i18n";
import type { InvoiceDetailsModalProps, Invoice, PaymentRecord } from "../../core/models/invoice.types";
import type { Lang } from "../../core/models/Settings.types";

const STATUS_LABELS: Record<Invoice["status"], Record<Lang, string>> = {
  paid:    { ar: "مسددة",   en: "Paid"    },
  partial: { ar: "جزئية",  en: "Partial" },
  pending: { ar: "معلقة",  en: "Pending" },
  overdue: { ar: "متأخرة", en: "Overdue" },
};

const METHOD_LABELS: Record<string, Record<Lang, string>> = {
  bank_transfer: { ar: "تحويل بنكي", en: "Bank Transfer" },
  cash:          { ar: "نقداً",      en: "Cash"          },
  check:         { ar: "شيك",        en: "Check"         },
  card:          { ar: "بطاقة",      en: "Card"          },
};

function Row({ label, children, isRtl }: { label: string; children: React.ReactNode; isRtl: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2.5 border-b border-white/6 last:border-0 ${isRtl ? "flex-row-reverse" : ""}`}>
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-white text-right">{children}</span>
    </div>
  );
}

export default function InvoiceDetailsModal({
  isOpen, invoice, contract, lang,
  onClose, onEdit, onDelete,
  onAddPayment, onEditPayment, onDeletePayment,
  onExportPdf,
}: InvoiceDetailsModalProps) {
  const isRtl = lang === "ar";
  const [confirmInvoice,   setConfirmInvoice]   = useState(false);
  const [confirmPaymentId, setConfirmPaymentId] = useState<string | null>(null);

  if (!invoice) return null;

  const ss   = STATUS_STYLES[invoice.status];
  const as   = ACCOUNT_STYLES[invoice.accountType];
  const ks   = KIND_STYLES[invoice.invoiceKind];
  const pct  = invoice.totalAmount > 0
    ? Math.min((invoice.paidAmount / invoice.totalAmount) * 100, 100) : 0;
  const pColor = pct >= 100 ? "bg-emerald-500" : pct >= 60 ? "bg-blue-500" : pct > 0 ? "bg-orange-500" : "bg-red-500/50";

  // Contract progress (when invoice is a progress invoice)
  const contractPct = contract
    ? Math.min((contract.totalAmount > 0
        ? (contract.totalAmount - Math.max(contract.totalAmount - invoice.totalAmount, 0)) / contract.totalAmount * 100
        : 0), 100)
    : 0;

  const confirmPayment = invoice.payments.find(p => p.id === confirmPaymentId);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div key="det-bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />

            <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4 pointer-events-none">
              <motion.div
                key="det-modal"
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                dir={isRtl ? "rtl" : "ltr"}
                onClick={e => e.stopPropagation()}
                className="pointer-events-auto w-full sm:max-w-xl flex flex-col bg-[#0d0f18]
                           border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/70
                           max-h-[94dvh] sm:h-[88dvh]"
                style={{ borderTopColor: invoice.invoiceKind === "progress" ? "rgba(139,92,246,0.5)" : "rgba(249,115,22,0.35)" }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                  <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* Header */}
                <div className={`flex items-start justify-between px-5 py-4 sm:px-6
                                 border-b border-white/10 shrink-0
                                 ${invoice.invoiceKind === "progress"
                                   ? "bg-gradient-to-r from-violet-500/8 to-transparent"
                                   : "bg-gradient-to-r from-orange-500/8 to-transparent"}
                                 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className={`min-w-0 ${isRtl ? "text-right" : ""}`}>
                    <h2 className="text-base sm:text-lg font-bold text-white">{tInv(lang, "detailsTitle")}</h2>
                    <p className="font-mono text-xs mt-0.5"
                      style={{ color: invoice.invoiceKind === "progress" ? "rgba(167,139,250,0.8)" : "rgba(251,146,60,0.8)" }}>
                      {invoice.invoiceNumber}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 shrink-0 ${isRtl ? "flex-row-reverse" : ""}`}>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${ss.bg} ${ss.border} ${ss.text}`}>
                      {STATUS_LABELS[invoice.status][lang]}
                    </span>
                    <button onClick={() => { onEdit(invoice); onClose(); }}
                      className="p-2 rounded-lg hover:bg-blue-500/15 text-gray-400 hover:text-blue-400 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmInvoice(true)}
                      className="p-2 rounded-lg hover:bg-red-500/15 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={onClose}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 sm:px-6 space-y-5">

                  {/* Kind badge row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Invoice kind */}
                    <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${ks.bg} ${ks.border} ${isRtl ? "flex-row-reverse" : ""}`}>
                      {invoice.invoiceKind === "progress"
                        ? <Layers className={`w-4 h-4 shrink-0 ${ks.text}`} />
                        : <TrendingUp className={`w-4 h-4 shrink-0 ${ks.text}`} />}
                      <div className={`min-w-0 ${isRtl ? "text-right" : ""}`}>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">{tInv(lang, "kindLabel")}</p>
                        <p className={`text-xs font-semibold ${ks.text}`}>
                          {tInv(lang, invoice.invoiceKind === "progress" ? "kindProgress" : "kindNormal")}
                        </p>
                      </div>
                    </div>
                    {/* Account type */}
                    <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${as.bg} ${as.border} ${isRtl ? "flex-row-reverse" : ""}`}>
                      {invoice.accountType === "revenue"
                        ? <TrendingUp className={`w-4 h-4 shrink-0 ${as.text}`} />
                        : <TrendingDown className={`w-4 h-4 shrink-0 ${as.text}`} />}
                      <div className={`min-w-0 ${isRtl ? "text-right" : ""}`}>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">{tInv(lang, "accountTypeLabel")}</p>
                        <p className={`text-xs font-semibold ${as.text}`}>
                          {tInv(lang, invoice.accountType === "revenue" ? "accountRevenue" : "accountExpense")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contract context (only for progress invoices) */}
                  {invoice.invoiceKind === "progress" && contract && (
                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
                      <div className={`flex items-center gap-2 px-4 py-2.5 border-b border-violet-500/15 ${isRtl ? "flex-row-reverse" : ""}`}>
                        <Layers className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span className="text-xs font-semibold text-violet-300">{contract.name}</span>
                      </div>
                      <div className="px-4 py-3 grid grid-cols-3 gap-2">
                        {[
                          { label: tInv(lang, "contractTotal"),    value: formatCurrency(contract.totalAmount, lang),  color: "text-white"      },
                          { label: tInv(lang, "contractProgress"), value: formatCurrency(invoice.totalAmount, lang),   color: "text-violet-400" },
                          { label: lang === "ar" ? "من إجمالي العقد" : "of contract", value: `${((invoice.totalAmount / contract.totalAmount) * 100).toFixed(1)}%`, color: "text-violet-300" },
                        ].map(s => (
                          <div key={s.label} className="text-center">
                            <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                            <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Party + project */}
                  <div className={`flex items-center gap-2.5 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
                    {invoice.partyType === "subcontractor"
                      ? <Building2 className="w-4 h-4 shrink-0 text-violet-400" />
                      : <Users     className="w-4 h-4 shrink-0 text-violet-400" />}
                    <div className={`min-w-0 ${isRtl ? "text-right" : ""}`}>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">{tInv(lang, "partyTypeLabel")}</p>
                      <p className="text-xs font-semibold text-violet-300">
                        {tInv(lang, invoice.partyType === "subcontractor" ? "partySubcontractor" : "partyClient")}
                      </p>
                    </div>
                  </div>

                  {/* Detail rows */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden px-4">
                    <Row label={tInv(lang, "colParty")} isRtl={isRtl}>{invoice.partyName}</Row>
                    <Row label={tInv(lang, "partyEntityLabel")} isRtl={isRtl}>
                      <span className="text-gray-300 text-xs">{invoice.partyEntity}</span>
                    </Row>
                    <Row label={tInv(lang, "colProject")} isRtl={isRtl}>{invoice.projectName}</Row>
                    <Row label={tInv(lang, "invoiceDate")} isRtl={isRtl}>
                      <span className="text-gray-300">{formatDate(invoice.date, lang)}</span>
                    </Row>
                    <Row label={tInv(lang, "dueDate")} isRtl={isRtl}>
                      <span className="text-gray-300">{formatDate(invoice.dueDate, lang)}</span>
                    </Row>
                    {invoice.description && (
                      <div className={`py-2.5 ${isRtl ? "text-right" : ""}`}>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{tInv(lang, "description")}</p>
                        <p className="text-xs text-gray-300">{invoice.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Financial summary */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { label: tInv(lang, "totalAmount"),     value: formatCurrency(invoice.totalAmount, lang),     color: "text-white"       },
                      { label: tInv(lang, "paidAmount"),      value: formatCurrency(invoice.paidAmount, lang),      color: "text-emerald-400" },
                      { label: tInv(lang, "remainingAmount"), value: formatCurrency(invoice.remainingAmount, lang), color: "text-orange-400"  },
                    ].map(s => (
                      <div key={s.label} className="bg-white/[0.04] rounded-xl px-3 py-3 border border-white/8 text-center">
                        <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                        <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Payment progress bar */}
                  <div>
                    <div className={`flex items-center justify-between text-xs mb-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                      <span className="text-gray-400">{tInv(lang, "progressLabel")}</span>
                      <span className="font-bold text-white">{pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className={`h-full rounded-full ${pColor}`}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }} />
                    </div>
                  </div>

                  {/* Payment history */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      {tInv(lang, "paymentHistory")} ({invoice.payments.length})
                    </p>
                    {invoice.payments.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8 rounded-xl border border-dashed border-white/10">
                        <CheckCircle2 className="w-6 h-6 text-gray-600" />
                        <p className="text-xs text-gray-500">{tInv(lang, "noPayments")}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {invoice.payments.map(pay => (
                          <div key={pay.id}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl
                                         bg-white/[0.04] border border-white/10 group
                                         ${isRtl ? "flex-row-reverse" : ""}`}>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20
                                            flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : ""}`}>
                              <p className="text-sm font-bold text-emerald-400">{formatCurrency(pay.amount, lang)}</p>
                              <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 shrink-0" />
                                {formatDate(pay.date, lang)}
                                <span className="mx-1 text-white/20">·</span>
                                {(METHOD_LABELS[pay.method] ?? { ar: pay.method, en: pay.method })[lang]}
                              </p>
                              {pay.note && <p className="text-[10px] text-gray-600 mt-0.5 italic">{pay.note}</p>}
                            </div>
                            <div className={`flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isRtl ? "flex-row-reverse" : ""}`}>
                              <button onClick={() => onEditPayment(invoice, pay)}
                                className="p-1.5 rounded-lg hover:bg-blue-500/15 text-gray-500 hover:text-blue-400 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setConfirmPaymentId(pay.id)}
                                className="p-1.5 rounded-lg hover:bg-red-500/15 text-gray-500 hover:text-red-400 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="h-2" />
                </div>

                {/* Footer */}
                <div className={`shrink-0 px-5 py-4 sm:px-6 border-t border-white/10 bg-[#0d0f18]
                                 flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <button onClick={() => onExportPdf(invoice)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10
                                 text-gray-300 hover:bg-white/5 transition-all text-sm shrink-0
                                 ${isRtl ? "flex-row-reverse" : ""}`}>
                    <FileDown className="w-4 h-4" />
                    {tInv(lang, "exportPdf")}
                  </button>
                  {invoice.status !== "paid" ? (
                    <button onClick={() => onAddPayment(invoice)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                                   bg-gradient-to-l from-orange-500 to-orange-600 text-white text-sm font-medium
                                   hover:shadow-lg hover:shadow-orange-500/25 transition-all
                                   ${isRtl ? "flex-row-reverse" : ""}`}>
                      <CreditCard className="w-4 h-4" />
                      {tInv(lang, "addPayment")}
                    </button>
                  ) : (
                    <button onClick={onClose}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm">
                      {tInv(lang, "close")}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        isOpen={confirmInvoice}
        title={tInv(lang, "deleteInvoice")}
        description={tInv(lang, "deleteInvoiceMsg")}
        lang={lang}
        onClose={() => setConfirmInvoice(false)}
        onConfirm={() => { onDelete(invoice); onClose(); }}
      />
      <DeleteConfirmModal
        isOpen={!!confirmPaymentId}
        title={tInv(lang, "deletePayment")}
        description={confirmPayment
          ? `${tInv(lang, "deletePaymentMsg")} (${formatCurrency(confirmPayment.amount, lang)})`
          : tInv(lang, "deletePaymentMsg")}
        lang={lang}
        onClose={() => setConfirmPaymentId(null)}
        onConfirm={() => {
          if (confirmPaymentId) onDeletePayment(invoice, confirmPaymentId);
          setConfirmPaymentId(null);
        }}
      />
    </>
  );
}
