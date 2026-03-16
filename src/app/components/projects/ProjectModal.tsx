// ============================================================
// ProjectModal.tsx — Add / View / Edit project
// mode="add"  → blank form + optional inline contract step
// mode="view" → read-only detail with Edit button
// mode="edit" → pre-filled form (no contract step)
// Date values: "YYYY-MM-DDTHH:mm:ss"  (C# DateTime-compatible)
// ============================================================
import { useState, useEffect }     from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Pencil, AlertCircle, ChevronRight, ChevronLeft, FileText } from "lucide-react";
import { tProj, dirAttr, flip, resolveRiskBadge, formatNum } from "../../core/i18n/projects.i18n";
import { tContract, resolveContractStatusBadge }              from "../../core/i18n/contracts.i18n";
import DatePicker from "../../core/shared/components/DatePicker";
import type {
  ProjectModalProps, ProjectFormValues, ProjectFormErrors, RiskLevel,
} from "../../core/models/projects.types";
import type { ContractStatus } from "../../core/models/contracts.types";

// ── Local contract form types (ISO DateTime strings) ──────────
interface ContractFormValues {
  contractorName:   string;
  scopeDescription: string;
  status:           ContractStatus;
  startDate:        string; // "YYYY-MM-DDTHH:mm:ss"
  endDate:          string; // "YYYY-MM-DDTHH:mm:ss"
  originalValue:    string;
  advancePayment:   string;
  retentionPercent: string;
  penalties:        string;
}

interface ContractFormErrors {
  contractorName?:   string;
  scopeDescription?: string;
  originalValue?:    string;
  advancePayment?:   string;
  retentionPercent?: string;
  startDate?:        string;
  endDate?:          string;
}

// ── Helpers ───────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, "0");

function parseDate(dt: string): Date | null {
  if (!dt) return null;
  const [y, m, d] = dt.split("T")[0].split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** Extract day/month/year from "YYYY-MM-DDTHH:mm:ss" for the service call. */
function dtToCalendar(dt: string) {
  const [y, m, d] = dt.split("T")[0].split("-").map(Number);
  return { year: y, month: m, day: d };
}

// ── Defaults ──────────────────────────────────────────────────
const today   = new Date();
const todayDt  = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}T00:00:00`;
const nextYrDt = `${today.getFullYear()+1}-${pad(today.getMonth()+1)}-${pad(today.getDate())}T00:00:00`;

const EMPTY_PROJECT: ProjectFormValues = {
  name: "", budget: "", actualCost: "", progress: "0", profitMargin: "0", riskLevel: "medium",
};

const EMPTY_CONTRACT: ContractFormValues = {
  contractorName: "", scopeDescription: "", status: "active",
  startDate: todayDt, endDate: nextYrDt,
  originalValue: "", advancePayment: "", retentionPercent: "5", penalties: "0",
};

// ── Validation ────────────────────────────────────────────────
function validateProject(v: ProjectFormValues, tFn: (k: any) => string): ProjectFormErrors {
  const e: ProjectFormErrors = {};
  if (!v.name.trim())                                   e.name         = tFn("errRequired");
  if (!v.budget || isNaN(+v.budget) || +v.budget <= 0) e.budget       = tFn("errPositiveNumber");
  if (!v.actualCost || isNaN(+v.actualCost))            e.actualCost   = tFn("errPositiveNumber");
  const prog = +v.progress;
  if (isNaN(prog) || prog < 0 || prog > 100)            e.progress     = tFn("errRange0100");
  const pm = +v.profitMargin;
  if (isNaN(pm) || pm < -100 || pm > 100)               e.profitMargin = tFn("errRange0100");
  return e;
}

function validateContract(v: ContractFormValues, tFn: (k: any) => string): ContractFormErrors {
  const e: ContractFormErrors = {};
  if (!v.contractorName.trim())   e.contractorName   = tFn("errRequired");
  if (!v.scopeDescription.trim()) e.scopeDescription = tFn("errRequired");
  if (!v.originalValue || isNaN(+v.originalValue) || +v.originalValue <= 0)
    e.originalValue = tFn("errPositiveNumber");
  if (v.advancePayment && (isNaN(+v.advancePayment) || +v.advancePayment < 0))
    e.advancePayment = tFn("errPositiveNumber");
  const ret = +v.retentionPercent;
  if (isNaN(ret) || ret < 0 || ret > 100) e.retentionPercent = tFn("errRetentionRange");
  const sd = parseDate(v.startDate);
  const ed = parseDate(v.endDate);
  if (!sd) e.startDate = tFn("errInvalidDate");
  if (!ed) e.endDate   = tFn("errInvalidDate");
  if (sd && ed && ed < sd) e.endDate = tFn("errEndBeforeStart");
  return e;
}

function toFormValues(project: import("../../core/models/projects.types").Project): ProjectFormValues {
  return {
    name:         project.name,
    budget:       String(project.budget),
    actualCost:   String(project.actualCost),
    progress:     String(project.progress),
    profitMargin: String(project.profitMargin),
    riskLevel:    project.riskLevel,
  };
}

// ── Sub-components ────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />{msg}
    </motion.p>
  );
}

const inputCls = (err?: string) =>
  `w-full bg-white/5 border ${err ? "border-red-500/60" : "border-white/10"} rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all`;

// ── View sub-panel ────────────────────────────────────────────
function ViewBody({ project, lang }: { project: NonNullable<ProjectModalProps["project"]>; lang: "ar" | "en" }) {
  const t    = (k: any) => tProj(lang, k);
  const fmt  = (n: number) => formatNum(n, lang);
  const cur  = t("currency");
  const risk = resolveRiskBadge(lang, project.riskLevel);
  const variance = project.budget - project.actualCost;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: t("labelBudget"),       value: `${fmt(project.budget)} ${cur}`,     cls: "text-orange-400"  },
          { label: t("labelActualCost"),   value: `${fmt(project.actualCost)} ${cur}`, cls: "text-blue-400"    },
          { label: t("labelProfitMargin"), value: `${project.profitMargin}%`,           cls: "text-emerald-400" },
          { label: t("labelVariance"),     value: `${fmt(Math.abs(variance))} ${cur}`, cls: variance >= 0 ? "text-emerald-400" : "text-red-400" },
        ].map(({ label, value, cls }) => (
          <div key={label} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-base font-bold ${cls}`}>{value}</p>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">{t("labelProgress")}</span>
          <span className="text-xs font-bold text-white">{project.progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#F97316] to-[#10B981] rounded-full"
            style={{ width: `${project.progress}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
        <span className="text-xs text-gray-400">{t("labelRisk")}</span>
        <span className={`px-2.5 py-1 rounded-lg border text-xs ${risk.className}`}>{risk.label}</span>
      </div>
    </div>
  );
}

// ── Project form step ─────────────────────────────────────────
function ProjectFormStep({ values, errors, lang, onChange }: {
  values:   ProjectFormValues;
  errors:   ProjectFormErrors;
  lang:     "ar" | "en";
  onChange: (field: keyof ProjectFormValues, val: string) => void;
}) {
  const t           = (k: any) => tProj(lang, k);
  const riskOptions: RiskLevel[] = ["low", "medium", "high"];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldName")}</label>
        <input type="text" value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder={t("fieldNamePH")} className={inputCls(errors.name)} />
        <AnimatePresence><FieldError msg={errors.name} /></AnimatePresence>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldBudget")}</label>
          <input type="number" dir="ltr" min={0} value={values.budget}
            onChange={(e) => onChange("budget", e.target.value)} className={inputCls(errors.budget)} />
          <AnimatePresence><FieldError msg={errors.budget} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldActualCost")}</label>
          <input type="number" dir="ltr" min={0} value={values.actualCost}
            onChange={(e) => onChange("actualCost", e.target.value)} className={inputCls(errors.actualCost)} />
          <AnimatePresence><FieldError msg={errors.actualCost} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldProgress")}</label>
          <input type="number" dir="ltr" min={0} max={100} value={values.progress}
            onChange={(e) => onChange("progress", e.target.value)} className={inputCls(errors.progress)} />
          <AnimatePresence><FieldError msg={errors.progress} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldProfitMargin")}</label>
          <input type="number" dir="ltr" min={-100} max={100} step={0.1} value={values.profitMargin}
            onChange={(e) => onChange("profitMargin", e.target.value)} className={inputCls(errors.profitMargin)} />
          <AnimatePresence><FieldError msg={errors.profitMargin} /></AnimatePresence>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldRisk")}</label>
        <div className="flex gap-2">
          {riskOptions.map((r) => {
            const b = resolveRiskBadge(lang, r);
            return (
              <button key={r} onClick={() => onChange("riskLevel", r)}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                  values.riskLevel === r
                    ? b.className + " ring-1 ring-offset-1 ring-offset-[#0f1117] ring-current"
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                }`}>{b.label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Contract form step ────────────────────────────────────────
function ContractFormStep({ values, errors, lang, onChange }: {
  values:   ContractFormValues;
  errors:   ContractFormErrors;
  lang:     "ar" | "en";
  onChange: (field: keyof ContractFormValues, val: string) => void;
}) {
  const tc = (k: any) => tContract(lang, k);
  const statusOptions: ContractStatus[] = ["active", "suspended", "terminated", "completed"];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{tc("fieldContractorName")}</label>
        <input type="text" value={values.contractorName}
          onChange={(e) => onChange("contractorName", e.target.value)}
          placeholder={tc("fieldContractorPlaceholder")} className={inputCls(errors.contractorName)} />
        <AnimatePresence><FieldError msg={errors.contractorName} /></AnimatePresence>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{tc("fieldScope")}</label>
        <textarea rows={2} value={values.scopeDescription}
          onChange={(e) => onChange("scopeDescription", e.target.value)}
          placeholder={tc("fieldScopePlaceholder")}
          className={`${inputCls(errors.scopeDescription)} resize-none`} />
        <AnimatePresence><FieldError msg={errors.scopeDescription} /></AnimatePresence>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{tc("fieldContractStatus")}</label>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => {
            const b = resolveContractStatusBadge(lang, s);
            return (
              <button key={s} onClick={() => onChange("status", s)}
                className={`flex-1 min-w-[80px] py-2 rounded-xl border text-xs font-medium transition-all ${
                  values.status === s
                    ? b.className + " ring-1 ring-offset-1 ring-offset-[#0f1117] ring-current"
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                }`}>{b.label}</button>
            );
          })}
        </div>
      </div>

      {/* Dates — DatePicker (C# DateTime-compatible) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePicker
          lang={lang}
          label={tc("fieldStartDate")}
          value={values.startDate}
          onChange={(v) => onChange("startDate", v)}
          error={errors.startDate}
        />
        <DatePicker
          lang={lang}
          label={tc("fieldEndDate")}
          value={values.endDate}
          onChange={(v) => onChange("endDate", v)}
          error={errors.endDate}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{tc("fieldOriginalValue")}</label>
          <input type="number" dir="ltr" min={0} value={values.originalValue}
            onChange={(e) => onChange("originalValue", e.target.value)} className={inputCls(errors.originalValue)} />
          <AnimatePresence><FieldError msg={errors.originalValue} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{tc("fieldAdvancePayment")}</label>
          <input type="number" dir="ltr" min={0} value={values.advancePayment}
            onChange={(e) => onChange("advancePayment", e.target.value)} className={inputCls(errors.advancePayment)} />
          <AnimatePresence><FieldError msg={errors.advancePayment} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{tc("fieldRetentionPercent")}</label>
          <input type="number" dir="ltr" min={0} max={100} step={0.5} value={values.retentionPercent}
            onChange={(e) => onChange("retentionPercent", e.target.value)} className={inputCls(errors.retentionPercent)} />
          <AnimatePresence><FieldError msg={errors.retentionPercent} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{tc("fieldPenalties")}</label>
          <input type="number" dir="ltr" min={0} value={values.penalties}
            onChange={(e) => onChange("penalties", e.target.value)} className={inputCls()} />
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function ProjectModal({ isOpen, mode, project, lang, onClose, onSave, onEdit }: ProjectModalProps) {
  const [projValues,   setProjValues]   = useState<ProjectFormValues>(EMPTY_PROJECT);
  const [projErrors,   setProjErrors]   = useState<ProjectFormErrors>({});
  const [contractVals, setContractVals] = useState<ContractFormValues>(EMPTY_CONTRACT);
  const [contractErrs, setContractErrs] = useState<ContractFormErrors>({});
  const [addContract,  setAddContract]  = useState(false);
  const [step,         setStep]         = useState<"project" | "contract">("project");
  const [saving,       setSaving]       = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && project) setProjValues(toFormValues(project));
    else if (mode === "add")        setProjValues(EMPTY_PROJECT);
    setContractVals(EMPTY_CONTRACT);
    setProjErrors({});
    setContractErrs({});
    setAddContract(false);
    setStep("project");
  }, [isOpen, mode, project]);

  const t   = (k: any) => tProj(lang, k);
  const tc  = (k: any) => tContract(lang, k);
  const dir = dirAttr(lang);

  const setProj = (field: keyof ProjectFormValues, val: string) => {
    setProjValues((v) => ({ ...v, [field]: val }));
    setProjErrors((e) => ({ ...e, [field]: undefined }));
  };

  const setCont = (field: keyof ContractFormValues, val: string) => {
    setContractVals((v) => ({ ...v, [field]: val }));
    setContractErrs((e) => { const n = { ...e }; delete (n as any)[field]; return n; });
  };

  const handleNext = () => {
    const errs = validateProject(projValues, t);
    if (Object.keys(errs).length) { setProjErrors(errs); return; }
    setStep("contract");
  };

  const handleSave = async () => {
    if (step === "project" && addContract && mode === "add") {
      handleNext(); return;
    }

    const pErrs = validateProject(projValues, t);
    if (Object.keys(pErrs).length) { setProjErrors(pErrs); setStep("project"); return; }

    if (addContract && mode === "add") {
      const cErrs = validateContract(contractVals, tc);
      if (Object.keys(cErrs).length) { setContractErrs(cErrs); return; }
    }

    // Convert ISO datetimes → day/month/year for the downstream service
    const contractServiceValues = addContract && mode === "add" ? (() => {
      const sd = dtToCalendar(contractVals.startDate);
      const ed = dtToCalendar(contractVals.endDate);
      return {
        contractorName:   contractVals.contractorName,
        scopeDescription: contractVals.scopeDescription,
        status:           contractVals.status,
        startDay:   String(sd.day),   startMonth: String(sd.month),   startYear: String(sd.year),
        endDay:     String(ed.day),   endMonth:   String(ed.month),   endYear:   String(ed.year),
        originalValue:    contractVals.originalValue,
        advancePayment:   contractVals.advancePayment,
        retentionPercent: contractVals.retentionPercent,
        penalties:        contractVals.penalties,
      };
    })() : undefined;

    setSaving(true);
    try {
      await onSave({
        ...projValues,
        addContract:     addContract && mode === "add",
        contractValues:  contractServiceValues,
      });
      onClose();
    } finally { setSaving(false); }
  };

  const isView         = mode === "view";
  const isContractStep = mode === "add" && step === "contract";

  const formBody = isView && project ? (
    <ViewBody project={project} lang={lang} />
  ) : isContractStep ? (
    <div dir={dir}>
      <div className="mb-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
        <p className="text-xs text-orange-400">{tc("addContractSubtitle")}</p>
      </div>
      <ContractFormStep values={contractVals} errors={contractErrs} lang={lang} onChange={setCont} />
    </div>
  ) : (
    <div dir={dir} className="space-y-4">
      <ProjectFormStep values={projValues} errors={projErrors} lang={lang} onChange={setProj} />
      {mode === "add" && (
        <div className="pt-3 border-t border-white/10">
          <button
            onClick={() => setAddContract((v) => !v)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
              addContract
                ? "border-orange-500/50 bg-orange-500/10"
                : "border-white/10 hover:border-white/20 bg-white/[0.03]"
            }`}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
              addContract ? "bg-orange-500 border-orange-500" : "border-white/30"
            }`}>
              {addContract && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            <FileText className={`w-4 h-4 ${addContract ? "text-orange-400" : "text-gray-400"}`} />
            <span className={`text-sm ${addContract ? "text-orange-300" : "text-gray-300"}`}>
              {tc("addContract")}
            </span>
          </button>
        </div>
      )}
    </div>
  );

  const header = (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent shrink-0">
      <div dir={dir}>
        <h2 className="text-base sm:text-lg font-bold text-white">
          {mode === "add"
            ? (isContractStep ? tc("addContractTitle") : t("addProject"))
            : mode === "edit" ? t("editProject") : t("viewProject")}
        </h2>
        {mode === "add" && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
              !isContractStep
                ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                : "bg-white/5 text-gray-500 border-white/10"
            }`}>1 • {t("addProject")}</span>
            {addContract && (
              <>
                <span className="text-gray-600 text-[10px]">→</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  isContractStep
                    ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    : "bg-white/5 text-gray-500 border-white/10"
                }`}>2 • {tc("addContract")}</span>
              </>
            )}
          </div>
        )}
        {project && mode !== "add" && (
          <p className="text-xs text-orange-400 mt-0.5 font-mono">{project.name}</p>
        )}
      </div>
      <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  const BackIcon = lang === "ar" ? ChevronRight : ChevronLeft;

  const footer = (
    <div dir={dir} className={`flex items-center gap-3 ${flip(lang, "justify-end", "justify-start")}`}>
      {isContractStep ? (
        <button onClick={() => setStep("project")}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm transition-all flex items-center justify-center gap-1.5">
          <BackIcon className="w-4 h-4" />{t("cancel")}
        </button>
      ) : (
        <button onClick={onClose}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm transition-all">
          {t("cancel")}
        </button>
      )}

      {isView ? (
        <button onClick={() => onEdit(project!)}
          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all">
          <Pencil className="w-4 h-4" />{t("edit")}
        </button>
      ) : mode === "add" && !isContractStep && addContract ? (
        <button onClick={handleNext}
          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all">
          {lang === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {tc("addContract")}
        </button>
      ) : (
        <button onClick={handleSave} disabled={saving}
          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50">
          {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {saving ? t("saving") : t("save")}
        </button>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="pm-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

          {/* Mobile */}
          <motion.div key="pm-mobile" dir={dir}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-[#0f1117] border-t border-white/10 rounded-t-2xl shadow-2xl max-h-[96dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <div className="h-1 w-full bg-gradient-to-r from-[#F97316] to-[#EA580C]" />
            <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 rounded-full bg-white/20" /></div>
            {header}
            <div className="overflow-y-auto flex-1 px-5 py-5">{formBody}</div>
            <div className="px-5 py-4 border-t border-white/10 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>
          </motion.div>

          {/* Desktop */}
          <motion.div key="pm-dialog" dir={dir}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hidden sm:flex fixed inset-0 z-50 items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="h-1 w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] shrink-0" />
              {header}
              <div className="overflow-y-auto flex-1 px-6 py-6">{formBody}</div>
              <div className="px-6 py-4 border-t border-white/10 shrink-0">{footer}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
