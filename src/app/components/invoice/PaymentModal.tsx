// ============================================================
// PaymentModal.tsx  — Add OR Edit a payment record
// ============================================================
import { useState, useEffect }     from "react";
import { motion, AnimatePresence }  from "motion/react";
import {
  X, CreditCard, Save, Plus, AlertCircle,
  Banknote, Building2, FileText, CreditCard as CardIcon,
} from "lucide-react";
import DatePicker from "../../core/shared/components/DatePicker";
import { tInv, formatCurrency } from "../../core/i18n/invoice.i18n";
import type { PaymentModalProps, PaymentFormValues, PaymentFormErrors } from "../../core/models/invoice.types";

const TODAY = new Date().toISOString().slice(0, 10) + "T00:00:00";
const emptyForm = (): PaymentFormValues => ({ amount: "", date: TODAY, note: "", method: "" });

const inp = (err: boolean) =>
  `w-full bg-white/5 border ${err ? "border-red-500/50" : "border-white/10"}
   rounded-xl px-3 py-2.5 text-white placeholder-gray-500 text-sm
   focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-all`;

function Field({ label, error, children }: { label?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-gray-400">{label}</label>}
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="w-3 h-3 shrink-0" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaymentModal({ isOpen, invoice, editPayment, lang, onClose, onSave }: PaymentModalProps) {
  const isRtl  = lang === "ar";
  const isEdit = !!editPayment;

  const [form,   setForm]   = useState<PaymentFormValues>(emptyForm());
  const [errors, setErrors] = useState<PaymentFormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(editPayment
        ? { amount: String(editPayment.amount), date: editPayment.date, note: editPayment.note, method: editPayment.method }
        : emptyForm(),
      );
      setErrors({});
    }
  }, [isOpen, editPayment]);

  if (!invoice) return null;

  // When editing, the "budget" is remaining + the old payment amount
  const budget = isEdit
    ? invoice.remainingAmount + (editPayment?.amount ?? 0)
    : invoice.remainingAmount;

  const sf = (k: keyof PaymentFormValues, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: PaymentFormErrors = {};
    const amt = parseFloat(form.amount);
    if (!form.amount.trim())         e.amount = tInv(lang, "errAmountReq");
    else if (isNaN(amt) || amt <= 0) e.amount = tInv(lang, "errAmountInvalid");
    else if (amt > budget)           e.amount = tInv(lang, "errAmountExceeds");
    if (!form.method) e.method = tInv(lang, "errMethodReq");
    if (!form.date)   e.date   = tInv(lang, "errPayDateReq");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(invoice.id, form, editPayment?.id);
      onClose();
    } finally { setSaving(false); }
  };

  const methods = [
    { value: "bank_transfer", label: tInv(lang, "methodBankTransfer"), icon: <Building2   className="w-4 h-4" /> },
    { value: "cash",          label: tInv(lang, "methodCash"),         icon: <Banknote    className="w-4 h-4" /> },
    { value: "check",         label: tInv(lang, "methodCheck"),        icon: <FileText    className="w-4 h-4" /> },
    { value: "card",          label: tInv(lang, "methodCard"),         icon: <CardIcon    className="w-4 h-4" /> },
  ];

  // Live progress preview
  const newPaid = (invoice.paidAmount - (editPayment?.amount ?? 0)) + (parseFloat(form.amount) || 0);
  const pct     = invoice.totalAmount > 0 ? Math.min((newPaid / invoice.totalAmount) * 100, 100) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="pay-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />

          <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4 pointer-events-none">
            <motion.div
              key="pay-modal"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              dir={isRtl ? "rtl" : "ltr"}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full sm:max-w-md flex flex-col bg-[#0d0f18]
                         border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/70
                         max-h-[94dvh] sm:max-h-[85dvh]"
              style={{ borderTopColor: isEdit ? "rgba(59,130,246,0.5)" : "rgba(249,115,22,0.35)" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-4 sm:px-6
                               border-b border-white/10 shrink-0
                               ${isEdit ? "bg-gradient-to-r from-blue-500/8 to-transparent" : "bg-gradient-to-r from-orange-500/8 to-transparent"}
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                                   ${isEdit ? "bg-blue-500/15 border border-blue-500/25" : "bg-orange-500/15 border border-orange-500/25"}`}>
                    {isEdit ? <Save className="w-4 h-4 text-blue-400" /> : <CreditCard className="w-4 h-4 text-orange-400" />}
                  </div>
                  <div className={isRtl ? "text-right" : ""}>
                    <h2 className="text-base font-bold text-white">
                      {isEdit ? tInv(lang, "editPaymentTitle") : tInv(lang, "paymentTitle")}
                    </h2>
                    <p className="text-xs font-mono text-gray-500 mt-0.5">{invoice.invoiceNumber}</p>
                  </div>
                </div>
                <button onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white shrink-0">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 sm:px-6 space-y-5">

                {/* Budget hint */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl
                                 bg-orange-500/8 border border-orange-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <span className="text-xs text-orange-300">{tInv(lang, "remainingAmount")}</span>
                  <span className="text-sm font-bold text-orange-400">{formatCurrency(budget, lang)}</span>
                </div>

                {/* Amount */}
                <Field label={tInv(lang, "paymentAmount")} error={errors.amount}>
                  <input type="number" dir="ltr" min="0" step="any"
                    value={form.amount} onChange={(e) => sf("amount", e.target.value)}
                    placeholder="0" className={inp(!!errors.amount)} />
                </Field>

                {/* Live progress */}
                <AnimatePresence>
                  {parseFloat(form.amount) > 0 && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="space-y-1.5">
                      <div className={`flex items-center justify-between text-xs ${isRtl ? "flex-row-reverse" : ""}`}>
                        <span className="text-gray-400">{tInv(lang, "progressLabel")}</span>
                        <span className="font-bold text-white">{pct.toFixed(1)}%</span>
                      </div>
                      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${pct >= 100 ? "bg-emerald-500" : "bg-orange-500"}`}
                          initial={{ width: `${Math.min(((invoice.paidAmount - (editPayment?.amount ?? 0)) / invoice.totalAmount) * 100, 100)}%` }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.35 }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Method */}
                <Field label={tInv(lang, "paymentMethod")} error={errors.method}>
                  <div className="grid grid-cols-2 gap-2">
                    {methods.map((m) => (
                      <button key={m.value} type="button" onClick={() => sf("method", m.value)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all
                                     ${form.method === m.value
                                       ? "bg-orange-500/15 border-orange-500/40 text-orange-300"
                                       : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                     } ${isRtl ? "flex-row-reverse" : ""}`}>
                        {m.icon}{m.label}
                      </button>
                    ))}
                  </div>
                  {errors.method && (
                    <p className="flex items-center gap-1 text-xs text-red-400 mt-1">
                      <AlertCircle className="w-3 h-3" />{errors.method}
                    </p>
                  )}
                </Field>

                {/* Date */}
                <Field label={tInv(lang, "paymentDate")} error={errors.date}>
                  <DatePicker value={form.date} onChange={v => sf("date", v)} lang={lang} error={errors.date} />
                </Field>

                {/* Note */}
                <Field label={tInv(lang, "paymentNote")}>
                  <input type="text" value={form.note}
                    onChange={(e) => sf("note", e.target.value)}
                    placeholder={tInv(lang, "paymentNotePH")}
                    className={inp(false)} />
                </Field>

                <div className="h-1" />
              </div>

              {/* Footer */}
              <div className={`shrink-0 px-5 py-4 sm:px-6 border-t border-white/10 bg-[#0d0f18]
                               flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                <button onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-white/10
                             text-gray-300 hover:bg-white/5 transition-all text-sm">
                  {tInv(lang, "cancel")}
                </button>
                <button onClick={handleSave} disabled={saving}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                               text-white text-sm font-medium transition-all
                               hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                               ${isEdit
                                 ? "bg-gradient-to-l from-blue-500 to-blue-600 hover:shadow-blue-500/25"
                                 : "bg-gradient-to-l from-orange-500 to-orange-600 hover:shadow-orange-500/25"
                               } ${isRtl ? "flex-row-reverse" : ""}`}>
                  {saving
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : isEdit ? <Save className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />
                  }
                  <span>{saving ? tInv(lang, "saving") : isEdit ? tInv(lang, "save") : tInv(lang, "confirm")}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
