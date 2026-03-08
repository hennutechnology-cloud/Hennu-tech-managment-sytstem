// ============================================================
// BOQItemModal.tsx — responsive
// ============================================================
import { useEffect, useState }      from "react";
import { motion, AnimatePresence }  from "motion/react";
import { X, Save, AlertCircle }     from "lucide-react";
import {
  tBOQMgt,
  getMonthOptions,
  getUnitOptions,
} from "../../core/i18n/boqManagement.i18n";
import type {
  BOQItemModalProps,
  BOQItemFormValues,
  BOQItemFormErrors,
  BOQUnit,
} from "../../core/models/BOQManagement.types";
import type { Lang } from "../../core/models/Settings.types";

// ── Validation (unchanged) ────────────────────────────────────
function validate(values: BOQItemFormValues, lang: Lang): BOQItemFormErrors {
  const e: BOQItemFormErrors = {};
  if (!values.code.trim())
    e.code = tBOQMgt(lang, "errCodeRequired");
  else if (!/^\d{2}\.\d{3}$/.test(values.code.trim()))
    e.code = tBOQMgt(lang, "errCodeFormat");
  if (!values.sectionCode)
    e.sectionCode = tBOQMgt(lang, "errSectionReq");
  if (!values.description.trim())
    e.description = tBOQMgt(lang, "errDescRequired");
  else if (values.description.trim().length < 3)
    e.description = tBOQMgt(lang, "errDescShort");
  const qty = parseFloat(values.quantity);
  if (!values.quantity.trim())
    e.quantity = tBOQMgt(lang, "errQtyRequired");
  else if (isNaN(qty) || qty <= 0)
    e.quantity = tBOQMgt(lang, "errQtyInvalid");
  const price = parseFloat(values.unitPrice);
  if (!values.unitPrice.trim())
    e.unitPrice = tBOQMgt(lang, "errPriceRequired");
  else if (isNaN(price) || price <= 0)
    e.unitPrice = tBOQMgt(lang, "errPriceInvalid");
  const actual = parseFloat(values.actualCost);
  if (!values.actualCost.trim())
    e.actualCost = tBOQMgt(lang, "errActualReq");
  else if (isNaN(actual) || actual < 0)
    e.actualCost = tBOQMgt(lang, "errActualInvalid");
  if (!values.month)
    e.month = tBOQMgt(lang, "errMonthRequired");
  return e;
}

// ── Field wrapper ─────────────────────────────────────────────
function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs sm:text-sm font-medium text-gray-300">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
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
  `w-full bg-white/5 border ${hasError ? "border-red-500/60" : "border-white/10"}
   rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 text-sm
   focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30
   transition-all duration-200`;

const EMPTY: BOQItemFormValues = {
  code: "", sectionCode: "", description: "",
  unit: "m3", quantity: "", unitPrice: "", actualCost: "", month: "",
};

// ── Modal ─────────────────────────────────────────────────────
export default function BOQItemModal({
  isOpen, editItem, sections, onClose, onSave, lang,
}: BOQItemModalProps) {
  const [values, setValues] = useState<BOQItemFormValues>(EMPTY);
  const [errors, setErrors] = useState<BOQItemFormErrors>({});
  const [saving, setSaving] = useState(false);

  const isEdit       = !!editItem;
  const monthOptions = getMonthOptions(lang);
  const unitOptions  = getUnitOptions(lang);
  const isRtl        = lang === "ar";

  useEffect(() => {
    if (isOpen) {
      setValues(editItem ? {
        code:        editItem.code,
        sectionCode: editItem.sectionCode,
        description: editItem.description,
        unit:        editItem.unit,
        quantity:    String(editItem.quantity),
        unitPrice:   String(editItem.unitPrice),
        actualCost:  String(editItem.actualCost),
        month:       String(editItem.month),
      } : EMPTY);
      setErrors({});
    }
  }, [isOpen, editItem]);

  const set = (field: keyof BOQItemFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof BOQItemFormErrors])
      setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(values, lang);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try { await onSave(values); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Mobile: slide up from bottom; Tablet+: scale from center */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[95vh]
                       sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4 sm:max-h-none"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              dir={isRtl ? "rtl" : "ltr"}
              className="w-full sm:max-w-xl
                         bg-[#0f1117] border border-white/10
                         rounded-t-2xl sm:rounded-2xl
                         shadow-2xl shadow-black/50
                         overflow-hidden
                         max-h-[95vh] sm:max-h-[90vh]
                         flex flex-col"
            >
              {/* Drag handle (mobile only) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className={`flex items-center justify-between
                               px-5 py-3.5 sm:px-6 sm:py-5
                               border-b border-white/10
                               bg-gradient-to-l from-orange-500/10 to-transparent shrink-0`}>
                <div className={isRtl ? "text-right" : "text-left"}>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {isEdit ? tBOQMgt(lang, "modalEditTitle") : tBOQMgt(lang, "modalAddTitle")}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isEdit ? tBOQMgt(lang, "modalEditSubtitle") : tBOQMgt(lang, "modalAddSubtitle")}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors
                             text-gray-400 hover:text-white shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Form — scrollable */}
              <div className="px-5 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">

                {/* Row 1: code + section — stacked on xs, 2-col on sm+ */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Field label={tBOQMgt(lang, "fieldCode")} error={errors.code}>
                    <input
                      type="text" dir="ltr"
                      placeholder={tBOQMgt(lang, "fieldCodePH")}
                      value={values.code}
                      onChange={(e) => set("code", e.target.value)}
                      disabled={isEdit}
                      className={inputCls(!!errors.code) + (isEdit ? " opacity-50 cursor-not-allowed" : "")}
                    />
                  </Field>
                  <Field label={tBOQMgt(lang, "fieldSection")} error={errors.sectionCode}>
                    <select
                      value={values.sectionCode}
                      onChange={(e) => set("sectionCode", e.target.value)}
                      className={inputCls(!!errors.sectionCode) + " cursor-pointer"}
                    >
                      <option value="" className="bg-[#0f1117]">
                        {tBOQMgt(lang, "fieldSectionPH")}
                      </option>
                      {sections.map((s) => (
                        <option key={s.code} value={s.code} className="bg-[#0f1117]">
                          {s.code} — {s.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Description */}
                <Field label={tBOQMgt(lang, "fieldDesc")} error={errors.description}>
                  <input
                    type="text"
                    placeholder={tBOQMgt(lang, "fieldDescPH")}
                    value={values.description}
                    onChange={(e) => set("description", e.target.value)}
                    className={inputCls(!!errors.description)}
                  />
                </Field>

                {/* Row 2: unit + month */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Field label={tBOQMgt(lang, "fieldUnit")}>
                    <select
                      value={values.unit}
                      onChange={(e) => set("unit", e.target.value as BOQUnit)}
                      className={inputCls(false) + " cursor-pointer"}
                    >
                      {unitOptions.map((u) => (
                        <option key={u.value} value={u.value} className="bg-[#0f1117]">
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={tBOQMgt(lang, "fieldMonth")} error={errors.month}>
                    <select
                      value={values.month}
                      onChange={(e) => set("month", e.target.value)}
                      className={inputCls(!!errors.month) + " cursor-pointer"}
                    >
                      <option value="" className="bg-[#0f1117]">—</option>
                      {monthOptions.map((m) => (
                        <option key={m.value} value={String(m.value)} className="bg-[#0f1117]">
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Row 3: qty + unit price */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Field label={tBOQMgt(lang, "fieldQty")} error={errors.quantity}>
                    <input
                      type="number" dir="ltr" min="0"
                      placeholder="0"
                      value={values.quantity}
                      onChange={(e) => set("quantity", e.target.value)}
                      className={inputCls(!!errors.quantity)}
                    />
                  </Field>
                  <Field label={tBOQMgt(lang, "fieldUnitPrice")} error={errors.unitPrice}>
                    <input
                      type="number" dir="ltr" min="0"
                      placeholder="0"
                      value={values.unitPrice}
                      onChange={(e) => set("unitPrice", e.target.value)}
                      className={inputCls(!!errors.unitPrice)}
                    />
                  </Field>
                </div>

                {/* Actual cost */}
                <Field label={tBOQMgt(lang, "fieldActualCost")} error={errors.actualCost}>
                  <input
                    type="number" dir="ltr" min="0"
                    placeholder="0"
                    value={values.actualCost}
                    onChange={(e) => set("actualCost", e.target.value)}
                    className={inputCls(!!errors.actualCost)}
                  />
                </Field>
              </div>

              {/* Footer — stacked on mobile, row on sm+ */}
              <div className={`flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end
                               gap-2 sm:gap-3
                               px-5 py-4 sm:px-6
                               border-t border-white/10 shrink-0
                               ${isRtl ? "sm:flex-row-reverse" : ""}`}>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/10
                             text-gray-300 hover:bg-white/5 transition-all text-sm"
                >
                  {tBOQMgt(lang, "cancel")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl
                               bg-gradient-to-l from-[#F97316] to-[#EA580C]
                               text-white text-sm font-medium
                               flex items-center justify-center gap-2
                               hover:shadow-lg hover:shadow-orange-500/30 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed
                               ${isRtl ? "flex-row-reverse" : ""}`}
                >
                  {saving
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Save className="w-4 h-4" />
                  }
                  <span>{isEdit ? tBOQMgt(lang, "save") : tBOQMgt(lang, "addItemBtn")}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
