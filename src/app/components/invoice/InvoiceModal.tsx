// ============================================================
// InvoiceModal.tsx  — Create OR Edit an invoice
// ============================================================
import { useState, useEffect }    from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Plus, Save, AlertCircle,
  TrendingUp, TrendingDown, Building2, Users,
} from "lucide-react";
import DatePicker from "../../core/shared/components/DatePicker";
import { tInv }   from "../../core/i18n/invoice.i18n";
import type {
  InvoiceModalProps, InvoiceFormValues, InvoiceFormErrors,
  InvoiceAccountType, InvoicePartyType,
} from "../../core/models/invoice.types";

const TODAY = new Date().toISOString().slice(0, 10) + "T00:00:00";
const DUE30 = (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10) + "T00:00:00"; })();

const emptyForm = (): InvoiceFormValues => ({
  accountType: "revenue", partyType: "client",
  partyId: "", partyEntity: "", projectId: "",
  date: TODAY, dueDate: DUE30, totalAmount: "", description: "",
});

const invoiceToForm = (inv: import("../../core/models/invoice.types").Invoice): InvoiceFormValues => ({
  accountType:  inv.accountType,
  partyType:    inv.partyType,
  partyId:      inv.partyId,
  partyEntity:  inv.partyEntity,
  projectId:    inv.projectId,
  date:         inv.date,
  dueDate:      inv.dueDate,
  totalAmount:  String(inv.totalAmount),
  description:  inv.description,
});

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

export default function InvoiceModal({
  isOpen, editInvoice, lang, subcontractors, projects, onClose, onSave,
}: InvoiceModalProps) {
  const isRtl  = lang === "ar";
  const isEdit = !!editInvoice;

  const [form,   setForm]   = useState<InvoiceFormValues>(emptyForm());
  const [errors, setErrors] = useState<InvoiceFormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(isEdit ? invoiceToForm(editInvoice!) : emptyForm());
      setErrors({});
    }
  }, [isOpen, editInvoice]);

  const sf = (k: keyof InvoiceFormValues, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const partyOptions = form.partyType === "subcontractor"
    ? subcontractors.map(s => ({ id: s.id, label: s.name, sub: s.specialty }))
    : [
        { id: "c1", label: "مجموعة الإعمار",         sub: "شركة الإعمار للتطوير العقاري"    },
        { id: "c2", label: "شركة النخيل العقارية",   sub: "النخيل للتطوير العقاري"          },
        { id: "c3", label: "الشركة الوطنية للإنشاء", sub: "الشركة الوطنية للإنشاء والتطوير" },
      ];

  const validate = (): boolean => {
    const e: InvoiceFormErrors = {};
    if (!form.partyId)            e.partyId     = tInv(lang, "errPartyReq");
    if (!form.partyEntity.trim()) e.partyEntity = tInv(lang, "errEntityReq");
    if (!form.projectId)          e.projectId   = tInv(lang, "errProjectReq");
    if (!form.date)               e.date        = tInv(lang, "errDateReq");
    if (!form.dueDate)            e.dueDate     = tInv(lang, "errDueDateReq");
    const amt = parseFloat(form.totalAmount);
    if (!form.totalAmount.trim())      e.totalAmount = tInv(lang, "errAmountReq");
    else if (isNaN(amt) || amt <= 0)   e.totalAmount = tInv(lang, "errAmountInvalid");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form, editInvoice?.id);
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="inv-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />

          <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4 pointer-events-none">
            <motion.div
              key="inv-modal"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              dir={isRtl ? "rtl" : "ltr"}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full sm:max-w-2xl flex flex-col bg-[#0d0f18]
                         border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/70
                         max-h-[94dvh] sm:h-[86dvh]"
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
                <div className={isRtl ? "text-right" : "text-left"}>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {isEdit ? tInv(lang, "modalEditTitle") : tInv(lang, "modalCreateTitle")}
                  </h2>
                  {isEdit && (
                    <p className="text-xs font-mono text-blue-400/80 mt-0.5">{editInvoice!.invoiceNumber}</p>
                  )}
                </div>
                <button onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white shrink-0">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 sm:px-6 space-y-5">

                {/* Account type */}
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2">{tInv(lang, "accountTypeLabel")}</p>
                  <div className={`flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                    {(["revenue", "expense"] as InvoiceAccountType[]).map((type) => {
                      const active = form.accountType === type;
                      const Icon   = type === "revenue" ? TrendingUp : TrendingDown;
                      return (
                        <button key={type} type="button"
                          onClick={() => { sf("accountType", type); sf("partyId", ""); }}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm
                                       font-medium transition-all border
                                       ${active
                                         ? type === "revenue"
                                           ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                                           : "bg-red-500/15 border-red-500/40 text-red-300"
                                         : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                       } ${isRtl ? "flex-row-reverse" : ""}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                          {tInv(lang, type === "revenue" ? "accountRevenue" : "accountExpense")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Party type */}
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2">{tInv(lang, "partyTypeLabel")}</p>
                  <div className={`flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                    {(["subcontractor", "client"] as InvoicePartyType[]).map((type) => {
                      const active = form.partyType === type;
                      const Icon   = type === "subcontractor" ? Building2 : Users;
                      return (
                        <button key={type} type="button"
                          onClick={() => { sf("partyType", type); sf("partyId", ""); sf("partyEntity", ""); }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm
                                       font-medium transition-all border
                                       ${active
                                         ? "bg-orange-500/15 border-orange-500/40 text-orange-300"
                                         : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                       } ${isRtl ? "flex-row-reverse" : ""}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                          {tInv(lang, type === "subcontractor" ? "partySubcontractor" : "partyClient")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Party select */}
                <Field label={tInv(lang, "partyLabel")} error={errors.partyId}>
                  <select value={form.partyId} onChange={(e) => {
                    sf("partyId", e.target.value);
                    const found = partyOptions.find(p => p.id === e.target.value);
                    if (found) sf("partyEntity", found.sub);
                  }} className={inp(!!errors.partyId) + " cursor-pointer"}>
                    <option value="" className="bg-[#0d0f18]">{tInv(lang, "partyPH")}</option>
                    {partyOptions.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#0d0f18]">{p.label}</option>
                    ))}
                  </select>
                </Field>

                {/* Entity */}
                <Field label={tInv(lang, "partyEntityLabel")} error={errors.partyEntity}>
                  <input type="text" value={form.partyEntity}
                    onChange={(e) => sf("partyEntity", e.target.value)}
                    placeholder={tInv(lang, "partyEntityPH")}
                    className={inp(!!errors.partyEntity)} />
                </Field>

                {/* Project */}
                <Field label={tInv(lang, "projectLabel")} error={errors.projectId}>
                  <select value={form.projectId} onChange={(e) => sf("projectId", e.target.value)}
                    className={inp(!!errors.projectId) + " cursor-pointer"}>
                    <option value="" className="bg-[#0d0f18]">{tInv(lang, "projectPH")}</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#0d0f18]">{p.name}</option>
                    ))}
                  </select>
                </Field>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={tInv(lang, "invoiceDate")} error={errors.date}>
                    <DatePicker value={form.date} onChange={v => sf("date", v)} lang={lang} error={errors.date} />
                  </Field>
                  <Field label={tInv(lang, "dueDate")} error={errors.dueDate}>
                    <DatePicker value={form.dueDate} onChange={v => sf("dueDate", v)} lang={lang} error={errors.dueDate} />
                  </Field>
                </div>

                {/* Total amount */}
                <Field label={tInv(lang, "totalAmount")} error={errors.totalAmount}>
                  <input type="number" dir="ltr" min="0" step="any"
                    value={form.totalAmount} onChange={(e) => sf("totalAmount", e.target.value)}
                    placeholder="0" className={inp(!!errors.totalAmount)} />
                </Field>

                {/* Description */}
                <Field label={tInv(lang, "description")}>
                  <textarea rows={3} value={form.description}
                    onChange={(e) => sf("description", e.target.value)}
                    placeholder={tInv(lang, "descriptionPH")}
                    className={inp(false) + " resize-none"} />
                </Field>

                <div className="h-2" />
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
                    : isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />
                  }
                  <span>{saving ? tInv(lang, "saving") : isEdit ? tInv(lang, "save") : tInv(lang, "newInvoice")}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
