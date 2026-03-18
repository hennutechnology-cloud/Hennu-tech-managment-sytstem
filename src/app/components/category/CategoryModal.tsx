// ============================================================
// CategoryModal.tsx  —  Add / Edit
// ============================================================
import { useState, useEffect }               from "react";
import { motion, AnimatePresence }            from "motion/react";
import { X, Save, Plus, AlertCircle, Check }  from "lucide-react";
import {
  tCat, COLOR_OPTIONS, ICON_OPTIONS, getColorOption,
} from "../../core/i18n/category.i18n";
import type {
  CategoryModalProps,
  CategoryFormData,
  CategoryFormErrors,
} from "../../core/models/category.types";

const EMPTY: CategoryFormData = { name: "", nameEn: "", icon: "🔩", color: "orange" };

// ── Shared input style ────────────────────────────────────────
const inp = (err: boolean) =>
  `w-full bg-white/5 border ${err ? "border-red-500/50" : "border-white/10"}
   rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm
   focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-all`;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-400">{label}</label>
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

export default function CategoryModal({
  isOpen, mode, category, lang, onClose, onSave,
}: CategoryModalProps) {
  const isRtl = lang === "ar";
  const isEdit = mode === "edit";

  const [form,    setForm]    = useState<CategoryFormData>({ ...EMPTY });
  const [errors,  setErrors]  = useState<CategoryFormErrors>({});
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(category
        ? { name: category.name, nameEn: category.nameEn, icon: category.icon, color: category.color }
        : { ...EMPTY },
      );
      setErrors({});
    }
  }, [isOpen, category]);

  const validate = (): boolean => {
    const e: CategoryFormErrors = {};
    if (!form.name.trim())   e.name   = tCat(lang, "errNameArReq");
    if (!form.nameEn.trim()) e.nameEn = tCat(lang, "errNameEnReq");
    if (!form.icon.trim())   e.icon   = tCat(lang, "errIconReq");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    // simulate async — parent handles the actual service call
    setTimeout(() => {
      onSave(form, category?.id);
      setSaving(false);
      onClose();
    }, 400);
  };

  const colorOpt = getColorOption(form.color);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div key="cat-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />

          {/* Positioner */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4 pointer-events-none">
            <motion.div
              key="cat-modal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              dir={isRtl ? "rtl" : "ltr"}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full sm:max-w-lg
                         flex flex-col bg-[#0d0f18]
                         border border-white/10
                         rounded-t-2xl sm:rounded-2xl
                         shadow-2xl shadow-black/70
                         max-h-[92dvh] sm:max-h-[85dvh]"
              style={{ borderTopColor: "rgba(249,115,22,0.35)" }}
            >
              {/* Mobile drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-4 sm:px-6
                               border-b border-white/10 shrink-0
                               bg-gradient-to-r from-orange-500/8 to-transparent
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  {/* Live preview badge */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0
                                   ${colorOpt.bg} border ${colorOpt.border}`}>
                    {form.icon || "?"}
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {isEdit ? tCat(lang, "modalEditTitle") : tCat(lang, "modalAddTitle")}
                    </h2>
                    {form.name && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{form.name}</p>
                    )}
                  </div>
                </div>
                <button onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white shrink-0">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 sm:px-6 space-y-5">

                {/* Name AR + EN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={tCat(lang, "fieldNameAr")} error={errors.name}>
                    <input type="text" dir="rtl" value={form.name}
                      onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors(p => ({ ...p, name: undefined })); }}
                      placeholder={tCat(lang, "fieldNameArPH")}
                      className={inp(!!errors.name)} />
                  </Field>
                  <Field label={tCat(lang, "fieldNameEn")} error={errors.nameEn}>
                    <input type="text" dir="ltr" value={form.nameEn}
                      onChange={(e) => { setForm(f => ({ ...f, nameEn: e.target.value })); setErrors(p => ({ ...p, nameEn: undefined })); }}
                      placeholder={tCat(lang, "fieldNameEnPH")}
                      className={inp(!!errors.nameEn)} />
                  </Field>
                </div>

                {/* Icon picker */}
                <Field label={tCat(lang, "fieldIcon")} error={errors.icon}>
                  <div className="grid grid-cols-10 gap-1.5 p-3 bg-white/[0.03] rounded-xl border border-white/10">
                    {ICON_OPTIONS.map((icon) => (
                      <button key={icon} type="button"
                        onClick={() => { setForm(f => ({ ...f, icon })); setErrors(p => ({ ...p, icon: undefined })); }}
                        className={`w-full aspect-square rounded-lg text-lg flex items-center justify-center
                                     transition-all hover:scale-110
                                     ${form.icon === icon
                                       ? `${colorOpt.bg} border ${colorOpt.border} scale-110 shadow-lg`
                                       : "hover:bg-white/10 border border-transparent"
                                     }`}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Color picker */}
                <Field label={tCat(lang, "fieldColor")}>
                  <div className={`flex flex-wrap gap-2 p-3 bg-white/[0.03] rounded-xl border border-white/10`}>
                    {COLOR_OPTIONS.map((c) => (
                      <button key={c.value} type="button"
                        onClick={() => setForm(f => ({ ...f, color: c.value }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                                     transition-all border
                                     ${form.color === c.value
                                       ? `${c.bg} ${c.border} ${c.text}`
                                       : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                     }`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${c.dot} shrink-0`} />
                        {c.value}
                        {form.color === c.value && <Check className="w-3 h-3 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="h-1" />
              </div>

              {/* Footer */}
              <div className={`shrink-0 px-5 py-4 sm:px-6 border-t border-white/10 bg-[#0d0f18]
                               flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                <button onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm">
                  {tCat(lang, "cancel")}
                </button>
                <button onClick={handleSave} disabled={saving}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                               bg-gradient-to-l from-orange-500 to-orange-600
                               text-white text-sm font-medium
                               hover:shadow-lg hover:shadow-orange-500/25 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                  {saving
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />
                  }
                  <span>{saving ? tCat(lang, "saving") : isEdit ? tCat(lang, "save") : tCat(lang, "addCategory")}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
