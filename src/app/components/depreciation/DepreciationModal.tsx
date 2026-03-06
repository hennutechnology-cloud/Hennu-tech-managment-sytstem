// ============================================================
// DepreciationModal.tsx
// editAsset.name is a plain API string — used in subtitle directly.
// method is a neutral key — select options use tDep() for display.
// All labels and validation messages go through tDep().
// ============================================================
import { useEffect, useState }     from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Trash2, AlertCircle } from "lucide-react";
import DatePicker from "../../core/shared/components/DatePicker";
import { tDep, tDepInterp }        from "../../core/i18n/depreciation.i18n";
import type {
  DepreciationModalProps,
  DepreciationFormValues,
  DepreciationFormErrors,
  DepreciationMethod,
} from "../../core/models/Depreciation.types";
import type { Lang } from "../../core/models/Settings.types";

const EMPTY: DepreciationFormValues = {
  name: "", cost: "", salvageValue: "", usefulLife: "",
  method: "straight-line", purchaseDate: "",
};

function validate(values: DepreciationFormValues, lang: Lang): DepreciationFormErrors {
  const errors: DepreciationFormErrors = {};

  if (!values.name.trim())
    errors.name = tDep(lang, "errNameRequired");
  else if (values.name.trim().length < 2)
    errors.name = tDep(lang, "errNameShort");

  if (!values.cost.trim())
    errors.cost = tDep(lang, "errCostRequired");
  else if (isNaN(parseFloat(values.cost)) || parseFloat(values.cost) <= 0)
    errors.cost = tDep(lang, "errCostInvalid");

  if (!values.salvageValue.trim())
    errors.salvageValue = tDep(lang, "errSalvageRequired");
  else if (isNaN(parseFloat(values.salvageValue)) || parseFloat(values.salvageValue) < 0)
    errors.salvageValue = tDep(lang, "errSalvageInvalid");
  else if (parseFloat(values.salvageValue) >= parseFloat(values.cost))
    errors.salvageValue = tDep(lang, "errSalvageHigh");

  if (!values.usefulLife.trim())
    errors.usefulLife = tDep(lang, "errLifeRequired");
  else if (isNaN(parseInt(values.usefulLife)) || parseInt(values.usefulLife) < 1)
    errors.usefulLife = tDep(lang, "errLifeInvalid");

  if (!values.purchaseDate)
    errors.purchaseDate = tDep(lang, "errDateRequired");

  return errors;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-red-400"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = (hasError: boolean) =>
  `w-full bg-white/5 border ${hasError ? "border-red-500/60" : "border-white/10"} rounded-xl px-4 py-2.5
   text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500/60
   focus:ring-1 focus:ring-orange-500/30 transition-all duration-200`;

export default function DepreciationModal({
  isOpen, editAsset, onClose, onSave, onDelete, lang,
}: DepreciationModalProps) {
  const [values,        setValues]        = useState<DepreciationFormValues>(EMPTY);
  const [errors,        setErrors]        = useState<DepreciationFormErrors>({});
  const [saving,        setSaving]        = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isEdit = !!editAsset;

  useEffect(() => {
    if (isOpen) {
      setValues(editAsset
        ? {
            name: editAsset.name, cost: String(editAsset.cost),
            salvageValue: String(editAsset.salvageValue),
            usefulLife: String(editAsset.usefulLife),
            method: editAsset.method, purchaseDate: editAsset.purchaseDate,
          }
        : EMPTY
      );
      setErrors({});
      setConfirmDelete(false);
    }
  }, [isOpen, editAsset]);

  function set(field: keyof DepreciationFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof DepreciationFormErrors])
      setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit() {
    const errs = validate(values, lang);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try { await onSave(values); onClose(); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!editAsset || !onDelete) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try { await onDelete(editAsset.id); }
    finally { setDeleting(false); }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

          <motion.div key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/50">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent rounded-t-2xl">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isEdit ? tDep(lang, "modalEditTitle") : tDep(lang, "modalAddTitle")}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isEdit
                      ? tDepInterp(lang, "modalEditSubtitle", { name: editAsset!.name })
                      : tDep(lang, "modalAddSubtitle")}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-5">

                <Field label={tDep(lang, "fieldName")} error={errors.name}>
                  <input type="text" placeholder={tDep(lang, "fieldNamePlaceholder")}
                    value={values.name} onChange={(e) => set("name", e.target.value)}
                    className={inputCls(!!errors.name)} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label={tDep(lang, "fieldCost")} error={errors.cost}>
                    <input type="number" dir="ltr" placeholder="0" min="0"
                      value={values.cost} onChange={(e) => set("cost", e.target.value)}
                      className={inputCls(!!errors.cost)} />
                  </Field>
                  <Field label={tDep(lang, "fieldSalvageValue")} error={errors.salvageValue}>
                    <input type="number" dir="ltr" placeholder="0" min="0"
                      value={values.salvageValue} onChange={(e) => set("salvageValue", e.target.value)}
                      className={inputCls(!!errors.salvageValue)} />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label={tDep(lang, "fieldUsefulLife")} error={errors.usefulLife}>
                    <input type="number" dir="ltr" placeholder="10" min="1"
                      value={values.usefulLife} onChange={(e) => set("usefulLife", e.target.value)}
                      className={inputCls(!!errors.usefulLife)} />
                  </Field>
                  <Field label={tDep(lang, "fieldMethod")}>
                    <select value={values.method}
                      onChange={(e) => set("method", e.target.value as DepreciationMethod)}
                      className={inputCls(false) + " cursor-pointer"}>
                      <option value="straight-line"    className="bg-[#0f1117]">{tDep(lang, "methodStraightLine")}</option>
                      <option value="declining-balance" className="bg-[#0f1117]">{tDep(lang, "methodDeclining")}</option>
                    </select>
                  </Field>
                </div>

                <DatePicker
                  lang={lang}
                  label={tDep(lang, "fieldPurchaseDate")}
                  value={values.purchaseDate}
                  onChange={(v) => set("purchaseDate", v)}
                  error={errors.purchaseDate}
                />

                <AnimatePresence>
                  {confirmDelete && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300">
                      {tDep(lang, "deleteConfirmMsg")}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 rounded-b-2xl">
                <div>
                  {isEdit && onDelete && (
                    <button onClick={handleDelete} disabled={deleting}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all
                        ${confirmDelete
                          ? "border-red-500 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                          : "border-white/10 text-gray-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}>
                      {deleting
                        ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                      {confirmDelete ? tDep(lang, "confirmDelete") : tDep(lang, "delete")}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm">
                    {tDep(lang, "cancel")}
                  </button>
                  <button onClick={handleSubmit} disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {saving
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <Save className="w-4 h-4" />}
                    {isEdit ? tDep(lang, "save") : tDep(lang, "addBtn")}
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
