// ============================================================
// ContractModal.tsx  — NEW
// Create / Edit a contract
// ============================================================
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence }       from "motion/react";
import {
  X, Layers, Save, Plus, AlertCircle,
  TrendingUp, TrendingDown, Building2, Users, FolderOpen,
} from "lucide-react";
import SearchableDropdown from "../../core/shared/components/SearchableDropdown";
import { tInv }           from "../../core/i18n/invoice.i18n";
import type {
  ContractModalProps, ContractFormValues, ContractFormErrors,
  InvoiceAccountType, InvoicePartyType,
} from "../../core/models/invoice.types";

const CLIENT_OPTIONS = [
  { id: "c1", label: "مجموعة الإعمار",         sub: "شركة الإعمار للتطوير العقاري"    },
  { id: "c2", label: "شركة النخيل العقارية",   sub: "النخيل للتطوير العقاري"          },
  { id: "c3", label: "الشركة الوطنية للإنشاء", sub: "الشركة الوطنية للإنشاء والتطوير" },
];

const emptyForm = (): ContractFormValues => ({
  name:        "",
  totalAmount: "",
  projectId:   "",
  partyId:     "",
  partyType:   "subcontractor",
  accountType: "expense",
  description: "",
});

const inp = (err: boolean) =>
  `w-full bg-white/5 border ${err ? "border-red-500/50" : "border-white/10"}
   rounded-xl px-3 py-2.5 text-white placeholder-gray-500 text-sm
   focus:outline-none focus:border-violet-500/60 focus:ring-1
   focus:ring-violet-500/20 transition-all`;

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

export default function ContractModal({
  isOpen, editContract, lang, subcontractors, projects, onClose, onSave,
}: ContractModalProps) {
  const isRtl  = lang === "ar";
  const isEdit = !!editContract;

  const [form,   setForm]   = useState<ContractFormValues>(emptyForm());
  const [errors, setErrors] = useState<ContractFormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(isEdit
        ? {
            name:        editContract!.name,
            totalAmount: String(editContract!.totalAmount),
            projectId:   editContract!.projectId,
            partyId:     editContract!.partyId,
            partyType:   editContract!.partyType,
            accountType: editContract!.accountType,
            description: editContract!.description,
          }
        : emptyForm(),
      );
      setErrors({});
    }
  }, [isOpen, editContract]);

  const sf = (k: keyof ContractFormValues, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const partyOptions = useMemo(() => {
    if (form.partyType === "subcontractor") {
      return subcontractors.map(s => ({ id: s.id, label: s.name, sub: s.specialty, icon: <Building2 className="w-3.5 h-3.5" /> }));
    }
    return CLIENT_OPTIONS.map(c => ({ ...c, icon: <Users className="w-3.5 h-3.5" /> }));
  }, [form.partyType, subcontractors]);

  const projectOptions = useMemo(() =>
    projects.map(p => ({ id: p.id, label: p.name, icon: <FolderOpen className="w-3.5 h-3.5" /> })),
    [projects],
  );

  const validate = (): boolean => {
    const e: ContractFormErrors = {};
    if (!form.name.trim())               e.name        = tInv(lang, "errContractName");
    if (!form.partyId)                   e.partyId     = tInv(lang, "errContractParty");
    if (!form.projectId)                 e.projectId   = tInv(lang, "errContractProject");
    const amt = parseFloat(form.totalAmount);
    if (!form.totalAmount.trim())        e.totalAmount = tInv(lang, "errAmountReq");
    else if (isNaN(amt) || amt <= 0)     e.totalAmount = tInv(lang, "errContractAmount");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form, editContract?.id);
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="con-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />

          <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4 pointer-events-none">
            <motion.div
              key="con-modal"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              dir={isRtl ? "rtl" : "ltr"}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full sm:max-w-xl flex flex-col bg-[#0d0f18]
                         border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl
                         shadow-black/70 max-h-[94dvh] sm:h-[82dvh]"
              style={{ borderTopColor: "rgba(139,92,246,0.5)" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-4 sm:px-6
                               border-b border-white/10 shrink-0
                               bg-gradient-to-r from-violet-500/8 to-transparent
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25
                                  flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className={isRtl ? "text-right" : ""}>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {isEdit ? tInv(lang, "editContract") : tInv(lang, "newContract")}
                    </h2>
                    {isEdit && (
                      <p className="text-xs text-violet-400/70 mt-0.5">{editContract!.name}</p>
                    )}
                  </div>
                </div>
                <button onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white shrink-0">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 sm:px-6 space-y-5">

                {/* Contract name */}
                <Field label={tInv(lang, "contractName")} error={errors.name}>
                  <input type="text" value={form.name}
                    onChange={e => sf("name", e.target.value)}
                    placeholder={tInv(lang, "contractNamePH")}
                    className={inp(!!errors.name)} />
                </Field>

                {/* Account type toggle */}
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

                {/* Party type toggle */}
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2">{tInv(lang, "partyTypeLabel")}</p>
                  <div className={`flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                    {(["subcontractor", "client"] as InvoicePartyType[]).map((type) => {
                      const active = form.partyType === type;
                      const Icon   = type === "subcontractor" ? Building2 : Users;
                      return (
                        <button key={type} type="button"
                          onClick={() => { sf("partyType", type); sf("partyId", ""); }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5
                                       rounded-xl text-sm font-medium transition-all border
                                       ${active
                                         ? "bg-violet-500/15 border-violet-500/40 text-violet-300"
                                         : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                       } ${isRtl ? "flex-row-reverse" : ""}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                          {tInv(lang, type === "subcontractor" ? "partySubcontractor" : "partyClient")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Party dropdown */}
                <Field label={tInv(lang, "partyLabel")} error={errors.partyId}>
                  <SearchableDropdown
                    options={partyOptions}
                    value={form.partyId}
                    onChange={(id) => sf("partyId", id)}
                    placeholder={tInv(lang, "partyPH")}
                    searchPlaceholder={tInv(lang, "partyPH")}
                    emptyText={lang === "ar" ? "لا توجد نتائج" : "No results"}
                    error={errors.partyId}
                    lang={lang}
                    accentColor="violet"
                  />
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
                    accentColor="violet"
                  />
                </Field>

                {/* Total contract amount */}
                <Field label={tInv(lang, "contractTotal")} error={errors.totalAmount}>
                  <input type="number" dir="ltr" min="0" step="any"
                    value={form.totalAmount}
                    onChange={e => sf("totalAmount", e.target.value)}
                    placeholder="0"
                    className={inp(!!errors.totalAmount)} />
                </Field>

                {/* Description */}
                <Field label={tInv(lang, "description")}>
                  <textarea rows={3} value={form.description}
                    onChange={e => sf("description", e.target.value)}
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
                               bg-gradient-to-l from-violet-500 to-violet-600
                               text-white text-sm font-medium transition-all
                               hover:shadow-lg hover:shadow-violet-500/25
                               disabled:opacity-50 disabled:cursor-not-allowed
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                  {saving
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />
                  }
                  <span>{saving ? tInv(lang, "saving") : isEdit ? tInv(lang, "save") : tInv(lang, "newContract")}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
