// ============================================================
// InvoiceModal.tsx  (updated — adds invoiceKind + contractId)
// ============================================================
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence }       from "motion/react";
import {
  X, Plus, Save, AlertCircle,
  TrendingUp, TrendingDown, Building2, Users, FolderOpen,
  FileText, Layers,
} from "lucide-react";
import DatePicker         from "../../core/shared/components/DatePicker";
import SearchableDropdown from "../../core/shared/components/SearchableDropdown";
import { tInv, formatCurrency } from "../../core/i18n/invoice.i18n";
import { invoiceService }       from "../../core/services/invoice.service";
import type {
  InvoiceModalProps, InvoiceFormValues, InvoiceFormErrors,
  InvoiceAccountType, InvoicePartyType, InvoiceKind,
  Contract,
} from "../../core/models/invoice.types";

const TODAY = new Date().toISOString().slice(0, 10) + "T00:00:00";
const DUE30 = (() => {
  const d = new Date(); d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10) + "T00:00:00";
})();

const emptyForm = (): InvoiceFormValues => ({
  invoiceKind: "normal", contractId: "",
  accountType: "revenue", partyType: "client",
  partyId: "", partyEntity: "", projectId: "",
  date: TODAY, dueDate: DUE30, totalAmount: "", description: "",
});

const invoiceToForm = (
  inv: import("../../core/models/invoice.types").Invoice,
): InvoiceFormValues => ({
  invoiceKind:  inv.invoiceKind,
  contractId:   inv.contractId ?? "",
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
   focus:outline-none focus:border-orange-500/60 focus:ring-1
   focus:ring-orange-500/20 transition-all`;

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

const CLIENT_OPTIONS = [
  { id: "c1", label: "مجموعة الإعمار",         sub: "شركة الإعمار للتطوير العقاري"    },
  { id: "c2", label: "شركة النخيل العقارية",   sub: "النخيل للتطوير العقاري"          },
  { id: "c3", label: "الشركة الوطنية للإنشاء", sub: "الشركة الوطنية للإنشاء والتطوير" },
];

export default function InvoiceModal({
  isOpen, editInvoice, lang, subcontractors, projects, contracts, onClose, onSave,
}: InvoiceModalProps) {
  const isRtl  = lang === "ar";
  const isEdit = !!editInvoice;

  const [form,   setForm]   = useState<InvoiceFormValues>(emptyForm());
  const [errors, setErrors] = useState<InvoiceFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const initial = isEdit ? invoiceToForm(editInvoice!) : emptyForm();
      // If opened from "Add Progress Invoice" with a preselected contract,
      // that is passed in editInvoice being null but we check contracts context in the page.
      setForm(initial);
      setErrors({});
      setServerError(null);
    }
  }, [isOpen, editInvoice]);

  const sf = (k: keyof InvoiceFormValues, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
    setServerError(null);
  };

  // ── When a contract is selected → auto-fill party / project / account ──
  const selectedContract: Contract | null = useMemo(
    () => (form.contractId ? contracts.find(c => c.id === form.contractId) ?? null : null),
    [form.contractId, contracts],
  );

  // Budget remaining in selected contract
  const contractBudget = useMemo(() => {
    if (!selectedContract) return null;
    return invoiceService.getRemainingBudget(selectedContract.id, editInvoice?.id);
  }, [selectedContract, editInvoice]);

  useEffect(() => {
    if (selectedContract) {
      sf("accountType", selectedContract.accountType);
      sf("partyType",   selectedContract.partyType);
      sf("partyId",     selectedContract.partyId);
      sf("projectId",   selectedContract.projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.contractId]);

  // ── Party options ─────────────────────────────────────────
  const partyOptions = useMemo(() => {
    if (form.partyType === "subcontractor") {
      return subcontractors.map(s => ({
        id: s.id, label: s.name, sub: s.specialty,
        icon: <Building2 className="w-3.5 h-3.5" />,
      }));
    }
    return CLIENT_OPTIONS.map(c => ({ ...c, icon: <Users className="w-3.5 h-3.5" /> }));
  }, [form.partyType, subcontractors]);

  const projectOptions = useMemo(
    () => projects.map(p => ({ id: p.id, label: p.name, icon: <FolderOpen className="w-3.5 h-3.5" /> })),
    [projects],
  );

  // ── Contract options for the dropdown ────────────────────
  const contractOptions = useMemo(
    () => contracts.map(c => ({
      id:    c.id,
      label: c.name,
      sub:   formatCurrency(c.totalAmount, lang),
      icon:  <Layers className="w-3.5 h-3.5" />,
    })),
    [contracts, lang],
  );

  // ── Validation ────────────────────────────────────────────
  const validate = (): boolean => {
    const e: InvoiceFormErrors = {};
    if (form.invoiceKind === "progress" && !form.contractId) e.contractId = tInv(lang, "errContractReq");
    if (!form.partyId)            e.partyId     = tInv(lang, "errPartyReq");
    if (!form.partyEntity.trim()) e.partyEntity = tInv(lang, "errEntityReq");
    if (!form.projectId)          e.projectId   = tInv(lang, "errProjectReq");
    if (!form.date)               e.date        = tInv(lang, "errDateReq");
    if (!form.dueDate)            e.dueDate     = tInv(lang, "errDueDateReq");
    const amt = parseFloat(form.totalAmount);
    if (!form.totalAmount.trim())      e.totalAmount = tInv(lang, "errAmountReq");
    else if (isNaN(amt) || amt <= 0)   e.totalAmount = tInv(lang, "errAmountInvalid");
    else if (form.invoiceKind === "progress" && contractBudget !== null && amt > contractBudget) {
      e.totalAmount = tInv(lang, "contractExceedsErr") +
        ` (${formatCurrency(contractBudget, lang)})`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setServerError(null);
    try {
      await onSave(form, editInvoice?.id);
      onClose();
    } catch (err: unknown) {
      const msg = (err as Error).message;
      if (msg === "EXCEEDS_CONTRACT") {
        setServerError(tInv(lang, "contractExceedsErr"));
      }
    } finally { setSaving(false); }
  };

  const headerAccent = isEdit
    ? "from-blue-500/8 to-transparent"
    : form.invoiceKind === "progress"
    ? "from-violet-500/8 to-transparent"
    : "from-orange-500/8 to-transparent";

  const borderTopColor = isEdit
    ? "rgba(59,130,246,0.5)"
    : form.invoiceKind === "progress"
    ? "rgba(139,92,246,0.5)"
    : "rgba(249,115,22,0.35)";

  const btnClass = isEdit
    ? "bg-gradient-to-l from-blue-500 to-blue-600 hover:shadow-blue-500/25"
    : form.invoiceKind === "progress"
    ? "bg-gradient-to-l from-violet-500 to-violet-600 hover:shadow-violet-500/25"
    : "bg-gradient-to-l from-orange-500 to-orange-600 hover:shadow-orange-500/25";

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
              onClick={e => e.stopPropagation()}
              className="pointer-events-auto w-full sm:max-w-2xl flex flex-col bg-[#0d0f18]
                         border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl
                         shadow-black/70 max-h-[94dvh] sm:h-[90dvh]"
              style={{ borderTopColor }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-4 sm:px-6
                               border-b border-white/10 shrink-0
                               bg-gradient-to-r ${headerAccent}
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

                {/* ── Invoice Kind toggle ── */}
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2">{tInv(lang, "kindLabel")}</p>
                  <div className={`flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                    {(["normal", "progress"] as InvoiceKind[]).map((kind) => {
                      const active = form.invoiceKind === kind;
                      const Icon   = kind === "normal" ? FileText : Layers;
                      return (
                        <button key={kind} type="button"
                          onClick={() => {
                            sf("invoiceKind", kind);
                            if (kind === "normal") sf("contractId", "");
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-3
                                       rounded-xl text-sm font-medium transition-all border
                                       ${active
                                         ? kind === "progress"
                                           ? "bg-violet-500/15 border-violet-500/40 text-violet-300"
                                           : "bg-slate-500/15 border-slate-500/40 text-slate-200"
                                         : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                       } ${isRtl ? "flex-row-reverse" : ""}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                          {tInv(lang, kind === "normal" ? "kindNormal" : "kindProgress")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Contract selector (only for progress) ── */}
                <AnimatePresence>
                  {form.invoiceKind === "progress" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Field label={tInv(lang, "contractLabel")} error={errors.contractId}>
                        <SearchableDropdown
                          options={contractOptions}
                          value={form.contractId}
                          onChange={(id) => sf("contractId", id)}
                          placeholder={tInv(lang, "contractPH")}
                          searchPlaceholder={tInv(lang, "contractPH")}
                          emptyText={lang === "ar" ? "لا توجد عقود" : "No contracts"}
                          error={errors.contractId}
                          lang={lang}
                          accentColor="violet"
                        />
                      </Field>

                      {/* Budget hint */}
                      {contractBudget !== null && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className={`mt-3 flex items-center justify-between px-4 py-2.5 rounded-xl
                                       bg-violet-500/8 border border-violet-500/20 ${isRtl ? "flex-row-reverse" : ""}`}
                        >
                          <span className="text-xs text-violet-300">{tInv(lang, "contractRemaining")}</span>
                          <span className="text-sm font-bold text-violet-400">
                            {formatCurrency(contractBudget, lang)}
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Account type toggle — hidden when a contract is selected (auto-filled) */}
                {!selectedContract && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-2">{tInv(lang, "accountTypeLabel")}</p>
                    <div className={`flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                      {(["revenue", "expense"] as InvoiceAccountType[]).map((type) => {
                        const active = form.accountType === type;
                        const Icon   = type === "revenue" ? TrendingUp : TrendingDown;
                        return (
                          <button key={type} type="button"
                            onClick={() => { sf("accountType", type); sf("partyId", ""); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3
                                         rounded-xl text-sm font-medium transition-all border
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
                )}

                {/* Party type toggle — hidden when contract is selected */}
                {!selectedContract && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-2">{tInv(lang, "partyTypeLabel")}</p>
                    <div className={`flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                      {(["subcontractor", "client"] as InvoicePartyType[]).map((type) => {
                        const active = form.partyType === type;
                        const Icon   = type === "subcontractor" ? Building2 : Users;
                        return (
                          <button key={type} type="button"
                            onClick={() => { sf("partyType", type); sf("partyId", ""); sf("partyEntity", ""); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5
                                         rounded-xl text-sm font-medium transition-all border
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
                )}

                {/* Party dropdown */}
                <Field label={tInv(lang, "partyLabel")} error={errors.partyId}>
                  <SearchableDropdown
                    options={partyOptions}
                    value={form.partyId}
                    onChange={(id, _label) => {
                      sf("partyId", id);
                      const found = partyOptions.find(p => p.id === id);
                      if (found?.sub) sf("partyEntity", found.sub);
                    }}
                    placeholder={tInv(lang, "partyPH")}
                    searchPlaceholder={tInv(lang, "partyPH")}
                    emptyText={lang === "ar" ? "لا توجد نتائج" : "No results"}
                    error={errors.partyId}
                    lang={lang}
                    accentColor="orange"
                    disabled={!!selectedContract}
                  />
                </Field>

                {/* Entity */}
                <Field label={tInv(lang, "partyEntityLabel")} error={errors.partyEntity}>
                  <input type="text" value={form.partyEntity}
                    onChange={e => sf("partyEntity", e.target.value)}
                    placeholder={tInv(lang, "partyEntityPH")}
                    className={inp(!!errors.partyEntity)} />
                </Field>

                {/* Project dropdown */}
                <Field label={tInv(lang, "projectLabel")} error={errors.projectId}>
                  <SearchableDropdown
                    options={projectOptions}
                    value={form.projectId}
                    onChange={(id) => sf("projectId", id)}
                    placeholder={tInv(lang, "projectPH")}
                    searchPlaceholder={tInv(lang, "projectPH")}
                    emptyText={lang === "ar" ? "لا توجد مشاريع" : "No projects"}
                    error={errors.projectId}
                    lang={lang}
                    accentColor="orange"
                    disabled={!!selectedContract}
                  />
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
                    value={form.totalAmount} onChange={e => sf("totalAmount", e.target.value)}
                    placeholder="0" className={inp(!!errors.totalAmount)} />
                </Field>

                {/* Description */}
                <Field label={tInv(lang, "description")}>
                  <textarea rows={3} value={form.description}
                    onChange={e => sf("description", e.target.value)}
                    placeholder={tInv(lang, "descriptionPH")}
                    className={inp(false) + " resize-none"} />
                </Field>

                {/* Server error */}
                {serverError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {serverError}
                  </div>
                )}

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
                               ${btnClass} ${isRtl ? "flex-row-reverse" : ""}`}>
                  {saving
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />
                  }
                  <span>
                    {saving ? tInv(lang, "saving") : isEdit ? tInv(lang, "save") : tInv(lang, "newInvoice")}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
