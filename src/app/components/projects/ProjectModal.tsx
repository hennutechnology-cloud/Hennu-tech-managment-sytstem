// ============================================================
// ProjectModal.tsx — Responsive
// ============================================================
import { useEffect, useState }     from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Plus, Pencil, AlertCircle } from "lucide-react";
import { tProj, resolveRiskBadge, formatNum, dirAttr } from "../../core/i18n/projects.i18n";
import type {
  ProjectModalProps, ProjectFormValues, ProjectFormErrors, RiskLevel,
} from "../../core/models/projects.types";

const EMPTY_FORM: ProjectFormValues = {
  name: "", budget: "", actualCost: "", progress: "", profitMargin: "", riskLevel: "low",
};

function toForm(p: NonNullable<ProjectModalProps["project"]>): ProjectFormValues {
  return {
    name:         p.name,
    budget:       String(p.budget),
    actualCost:   String(p.actualCost),
    progress:     String(p.progress),
    profitMargin: String(p.profitMargin),
    riskLevel:    p.riskLevel,
  };
}

function validate(values: ProjectFormValues, lang: Parameters<typeof tProj>[0]): ProjectFormErrors {
  const errors: ProjectFormErrors = {};
  if (!values.name.trim())                              errors.name         = tProj(lang, "errNameRequired");
  if (!values.budget)                                   errors.budget       = tProj(lang, "errBudgetRequired");
  else if (isNaN(+values.budget) || +values.budget < 0) errors.budget       = tProj(lang, "errBudgetInvalid");
  const prog = +values.progress;
  if (isNaN(prog) || prog < 0 || prog > 100)            errors.progress     = tProj(lang, "errProgressRange");
  if (isNaN(+values.profitMargin))                      errors.profitMargin = tProj(lang, "errMarginInvalid");
  return errors;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = (hasError: boolean, extra = "") =>
  `w-full bg-white/5 border ${hasError ? "border-red-500/60" : "border-white/10"} rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all duration-200 ${extra}`;

export default function ProjectModal({
  isOpen, mode: initialMode, project, lang, onClose, onSave, onEdit,
}: ProjectModalProps) {
  const [mode,   setMode]   = useState(initialMode);
  const [values, setValues] = useState<ProjectFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { setMode(initialMode); }, [initialMode]);
  useEffect(() => {
    if (project && (initialMode === "edit" || initialMode === "view")) setValues(toForm(project));
    else setValues(EMPTY_FORM);
    setErrors({});
  }, [project, initialMode, isOpen]);

  if (!isOpen) return null;

  const isView     = mode === "view";
  const isAdd      = mode === "add";
  const isReadOnly = isView;

  const set = (field: keyof ProjectFormValues, val: string) => {
    setValues((v) => ({ ...v, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSave = async () => {
    const errs = validate(values, lang);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try { await onSave(values); onClose(); }
    finally { setSaving(false); }
  };

  const handleSwitchToEdit = () => {
    if (project) onEdit(project);
    setMode("edit");
  };

  const riskOptions: RiskLevel[] = ["low", "medium", "high"];

  const title = isAdd ? tProj(lang, "modalAddTitle") : isView ? tProj(lang, "modalViewTitle") : tProj(lang, "modalEditTitle");
  const subtitle = isAdd ? tProj(lang, "modalAddSubtitle") : project?.name ?? "";

  // ── Shared body fields ─────────────────────────────────────
  const formBody = (
    <div dir={dirAttr(lang)} className="space-y-4 sm:space-y-5">
      {/* View-mode risk + progress summary */}
      {isView && project && (
        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex-1">
            <p className="text-gray-400 text-xs mb-1.5">{tProj(lang, "colRisk")}</p>
            <span className={`px-3 py-1 rounded-lg border text-xs ${resolveRiskBadge(lang, project.riskLevel).className}`}>
              {resolveRiskBadge(lang, project.riskLevel).label}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-xs mb-1.5">{tProj(lang, "colProgress")}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                <div className="bg-gradient-to-l from-[#F97316] to-[#EA580C] h-full rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
              <span className="text-white text-xs font-medium">{project.progress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Name */}
      <Field label={tProj(lang, "fieldName")} error={errors.name}>
        {isReadOnly
          ? <p className={inputCls(false, "opacity-60 cursor-default")}>{values.name}</p>
          : <input type="text" value={values.name} onChange={(e) => set("name", e.target.value)}
              placeholder={tProj(lang, "fieldNamePlaceholder")} className={inputCls(!!errors.name)} />}
      </Field>

      {/* Budget + Actual Cost */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {(["budget", "actualCost"] as const).map((field) => (
          <Field key={field} label={tProj(lang, field === "budget" ? "fieldBudget" : "fieldActualCost")} error={errors[field]}>
            {isReadOnly
              ? <p className={inputCls(false, "opacity-60 cursor-default")}>{formatNum(+values[field] || 0, lang)}</p>
              : <input type="number" dir="ltr" min={0} value={values[field]}
                  onChange={(e) => set(field, e.target.value)} className={inputCls(!!errors[field])} />}
          </Field>
        ))}
      </div>

      {/* Progress + Profit Margin */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {(["progress", "profitMargin"] as const).map((field) => (
          <Field key={field} label={tProj(lang, field === "progress" ? "fieldProgress" : "fieldProfitMargin")} error={errors[field]}>
            {isReadOnly
              ? <p className={inputCls(false, "opacity-60 cursor-default")}>{values[field]}%</p>
              : <input type="number" dir="ltr" step="0.1" min={0}
                  max={field === "progress" ? 100 : undefined}
                  value={values[field]} onChange={(e) => set(field, e.target.value)}
                  className={inputCls(!!errors[field])} />}
          </Field>
        ))}
      </div>

      {/* Risk Level */}
      <Field label={tProj(lang, "fieldRisk")}>
        {isReadOnly
          ? <span className={`inline-block px-3 py-1.5 rounded-lg border text-sm ${resolveRiskBadge(lang, values.riskLevel).className}`}>
              {resolveRiskBadge(lang, values.riskLevel).label}
            </span>
          : <div className="flex gap-2">
              {riskOptions.map((r) => {
                const b = resolveRiskBadge(lang, r);
                const selected = values.riskLevel === r;
                return (
                  <button key={r} onClick={() => set("riskLevel", r)}
                    className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                      selected
                        ? b.className + " ring-1 ring-offset-1 ring-offset-[#0f1117] ring-current"
                        : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                    }`}>
                    {b.label}
                  </button>
                );
              })}
            </div>}
      </Field>
    </div>
  );

  // ── Shared footer ──────────────────────────────────────────
  const footerActions = (
    <div className="flex items-center justify-end gap-3">
      <button onClick={onClose}
        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm">
        {isView ? tProj(lang, "close") : tProj(lang, "cancel")}
      </button>
      {!isView && (
        <button onClick={handleSave} disabled={saving}
          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {saving
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : isAdd ? <Plus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? tProj(lang, "saving") : isAdd ? tProj(lang, "addBtn") : tProj(lang, "save")}
        </button>
      )}
    </div>
  );

  // ── Shared header content ──────────────────────────────────
  const headerContent = (
    <>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-white">{title}</h2>
          {isView && (
            <button onClick={handleSwitchToEdit}
              className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors text-xs">
              <Pencil className="w-3 h-3" />{tProj(lang, "edit")}
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
        <X className="w-5 h-5" />
      </button>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="proj-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

          {/* Mobile: bottom sheet */}
          <motion.div key="proj-mobile"
            dir={dirAttr(lang)}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-[#0f1117] border-t border-white/10 rounded-t-2xl shadow-2xl max-h-[96dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent shrink-0">
              {headerContent}
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-5">{formBody}</div>
            <div className="px-5 py-4 border-t border-white/10 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {footerActions}
            </div>
          </motion.div>

          {/* sm+: centered dialog */}
          <motion.div key="proj-modal"
            dir={dirAttr(lang)}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: 20  }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hidden sm:flex fixed inset-0 z-50 items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent">
                {headerContent}
              </div>
              <div className="px-6 py-6 space-y-5 max-h-[65vh] overflow-y-auto">{formBody}</div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
                {footerActions}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
