// ============================================================
// AddContractModal.tsx
// Slide-in modal to add a new contract.
// Now includes a project selector dropdown when used from
// the Contracts page (projects prop provided).
// ============================================================
import { useState }                from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, AlertCircle }    from "lucide-react";
import { contractsService }        from "../../core/services/contracts.service";
import {
  tContract, dirAttr, flip,
  resolveContractStatusBadge,
} from "../../core/i18n/contracts.i18n";
import type {
  AddContractModalProps,
  ContractFormValues,
  ContractFormErrors,
  ContractStatus,
} from "../../core/models/contracts.types";

// ── Defaults ──────────────────────────────────────────────────
const today = new Date();
const EMPTY: ContractFormValues = {
  contractorName:   "",
  scopeDescription: "",
  status:           "active",
  startDay:         String(today.getDate()),
  startMonth:       String(today.getMonth() + 1),
  startYear:        String(today.getFullYear()),
  endDay:           String(today.getDate()),
  endMonth:         String(today.getMonth() + 1),
  endYear:          String(today.getFullYear() + 1),
  originalValue:    "",
  advancePayment:   "",
  retentionPercent: "5",
  penalties:        "0",
};

// ── Validation ────────────────────────────────────────────────
function validate(v: ContractFormValues, tFn: (k: any) => string, projectId: number): ContractFormErrors {
  const e: ContractFormErrors = {};
  if (!v.contractorName.trim())   e.contractorName   = tFn("errRequired");
  if (!v.scopeDescription.trim()) e.scopeDescription = tFn("errRequired");
  if (!v.originalValue || isNaN(+v.originalValue) || +v.originalValue <= 0)
    e.originalValue = tFn("errPositiveNumber");
  if (v.advancePayment && (isNaN(+v.advancePayment) || +v.advancePayment < 0))
    e.advancePayment = tFn("errPositiveNumber");
  const ret = +v.retentionPercent;
  if (isNaN(ret) || ret < 0 || ret > 100) e.retentionPercent = tFn("errRetentionRange");
  const sd = toDate(v.startYear, v.startMonth, v.startDay);
  const ed = toDate(v.endYear,   v.endMonth,   v.endDay);
  if (!sd) e.startDate = tFn("errInvalidDate");
  if (!ed) e.endDate   = tFn("errInvalidDate");
  if (sd && ed && ed < sd) e.endDate = tFn("errEndBeforeStart");
  return e;
}

function toDate(y: string, m: string, d: string): Date | null {
  const yr = parseInt(y, 10), mo = parseInt(m, 10), da = parseInt(d, 10);
  if (isNaN(yr) || isNaN(mo) || isNaN(da)) return null;
  if (mo < 1 || mo > 12 || da < 1 || da > 31) return null;
  return new Date(yr, mo - 1, da);
}

// ── Sub-components ────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex items-center gap-1.5 text-xs text-red-400 mt-1"
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />{msg}
    </motion.p>
  );
}

const inputCls = (err?: string) =>
  `w-full bg-white/5 border ${err ? "border-red-500/60" : "border-white/10"} rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all`;

const selectCls = (err?: string) =>
  `w-full bg-[#0f1117] border ${err ? "border-red-500/60" : "border-white/10"} rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all appearance-none`;

// ── Date triplet ──────────────────────────────────────────────
function DateFields({
  label, day, month, year, error, onChange, lang,
}: {
  label: string;
  day: string; month: string; year: string;
  error?: string;
  onChange: (field: "day" | "month" | "year", val: string) => void;
  lang: "ar" | "en";
}) {
  const t = (k: any) => tContract(lang, k);
  return (
    <div>
      <p className="text-sm font-medium text-gray-300 mb-1.5">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-[10px] text-gray-500 mb-1">{t("fieldDay")}</p>
          <input
            type="number" dir="ltr" min={1} max={31}
            value={day} onChange={(e) => onChange("day", e.target.value)}
            className={inputCls(error)}
          />
        </div>
        <div>
          <p className="text-[10px] text-gray-500 mb-1">{t("fieldMonth")}</p>
          <input
            type="number" dir="ltr" min={1} max={12}
            value={month} onChange={(e) => onChange("month", e.target.value)}
            className={inputCls(error)}
          />
        </div>
        <div>
          <p className="text-[10px] text-gray-500 mb-1">{t("fieldYear")}</p>
          <input
            type="number" dir="ltr" min={2000} max={2100}
            value={year} onChange={(e) => onChange("year", e.target.value)}
            className={inputCls(error)}
          />
        </div>
      </div>
      <AnimatePresence><FieldError msg={error} /></AnimatePresence>
    </div>
  );
}

// ── Props extension — allow passing a projects list ───────────
interface Project {
  id:   number;
  name: string;
}

interface ExtendedAddContractModalProps extends AddContractModalProps {
  /** Optional list of projects to show in a dropdown.
   *  When provided, user can pick the target project.
   *  When omitted the component falls back to the `projectId` prop. */
  projects?: Project[];
}

// ── Main modal ────────────────────────────────────────────────
export default function AddContractModal({
  isOpen, projectId, lang, onClose, onSaved, projects,
}: ExtendedAddContractModalProps) {
  const [values,            setValues]           = useState<ContractFormValues>(EMPTY);
  const [errors,            setErrors]           = useState<ContractFormErrors>({});
  const [saving,            setSaving]           = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projectId);
  const [projectError,      setProjectError]      = useState<string | undefined>();

  // Reset when modal opens
  const handleOpen = () => {
    setValues(EMPTY);
    setErrors({});
    setSelectedProjectId(projectId);
    setProjectError(undefined);
  };

  const t   = (k: any) => tContract(lang, k);
  const dir = dirAttr(lang);

  const set = (field: keyof ContractFormValues, val: string) => {
    setValues((v) => ({ ...v, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined, startDate: undefined, endDate: undefined }));
  };

  const handleSave = async () => {
    // Validate project selection when dropdown is shown
    if (projects && projects.length > 0 && !selectedProjectId) {
      setProjectError(t("errRequired"));
      return;
    }
    setProjectError(undefined);

    const effectiveProjectId = (projects && projects.length > 0)
      ? selectedProjectId
      : projectId;

    const errs = validate(values, t, effectiveProjectId);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const contract = await contractsService.createContract(effectiveProjectId, values);
      onSaved(contract);
      setValues(EMPTY);
      setErrors({});
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const statusOptions: ContractStatus[] = ["active", "suspended", "terminated", "completed"];

  const formBody = (
    <div dir={dir} className="space-y-4 sm:space-y-5">

      {/* ── Project selector (only when projects list is provided) ── */}
      {projects && projects.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {lang === "ar" ? "المشروع" : "Project"}
          </label>
          <div className="relative">
            <select
              value={selectedProjectId || ""}
              onChange={(e) => {
                setSelectedProjectId(Number(e.target.value));
                setProjectError(undefined);
              }}
              className={selectCls(projectError)}
            >
              <option value="" disabled>
                {lang === "ar" ? "— اختر مشروعاً —" : "— Select a project —"}
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0f1117]">
                  {p.name}
                </option>
              ))}
            </select>
            {/* chevron icon */}
            <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-gray-400">
              ▾
            </span>
          </div>
          <AnimatePresence><FieldError msg={projectError} /></AnimatePresence>
        </div>
      )}

      {/* ── No projects warning ── */}
      {projects && projects.length === 0 && (
        <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <p className="text-xs text-orange-400">
            {lang === "ar"
              ? "لا توجد مشاريع. أنشئ مشروعاً أولاً من صفحة المشاريع."
              : "No projects found. Please create a project first from the Projects page."}
          </p>
        </div>
      )}

      {/* Contractor name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldContractorName")}</label>
        <input
          type="text" value={values.contractorName}
          onChange={(e) => set("contractorName", e.target.value)}
          placeholder={t("fieldContractorPlaceholder")}
          className={inputCls(errors.contractorName)}
        />
        <AnimatePresence><FieldError msg={errors.contractorName} /></AnimatePresence>
      </div>

      {/* Scope */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldScope")}</label>
        <textarea
          rows={2} value={values.scopeDescription}
          onChange={(e) => set("scopeDescription", e.target.value)}
          placeholder={t("fieldScopePlaceholder")}
          className={`${inputCls(errors.scopeDescription)} resize-none`}
        />
        <AnimatePresence><FieldError msg={errors.scopeDescription} /></AnimatePresence>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldContractStatus")}</label>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => {
            const b   = resolveContractStatusBadge(lang, s);
            const sel = values.status === s;
            return (
              <button
                key={s} onClick={() => set("status", s)}
                className={`flex-1 min-w-[80px] py-2 rounded-xl border text-xs font-medium transition-all ${
                  sel ? b.className + " ring-1 ring-offset-1 ring-offset-[#0f1117] ring-current"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                }`}
              >{b.label}</button>
            );
          })}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateFields
          label={t("fieldStartDate")}
          day={values.startDay} month={values.startMonth} year={values.startYear}
          error={errors.startDate}
          onChange={(f, v) => set(`start${f.charAt(0).toUpperCase() + f.slice(1)}` as any, v)}
          lang={lang}
        />
        <DateFields
          label={t("fieldEndDate")}
          day={values.endDay} month={values.endMonth} year={values.endYear}
          error={errors.endDate}
          onChange={(f, v) => set(`end${f.charAt(0).toUpperCase() + f.slice(1)}` as any, v)}
          lang={lang}
        />
      </div>

      {/* Financials grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldOriginalValue")}</label>
          <input type="number" dir="ltr" min={0} value={values.originalValue}
            onChange={(e) => set("originalValue", e.target.value)}
            className={inputCls(errors.originalValue)} />
          <AnimatePresence><FieldError msg={errors.originalValue} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldAdvancePayment")}</label>
          <input type="number" dir="ltr" min={0} value={values.advancePayment}
            onChange={(e) => set("advancePayment", e.target.value)}
            className={inputCls(errors.advancePayment)} />
          <AnimatePresence><FieldError msg={errors.advancePayment} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldRetentionPercent")}</label>
          <input type="number" dir="ltr" min={0} max={100} step={0.5} value={values.retentionPercent}
            onChange={(e) => set("retentionPercent", e.target.value)}
            className={inputCls(errors.retentionPercent)} />
          <AnimatePresence><FieldError msg={errors.retentionPercent} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldPenalties")}</label>
          <input type="number" dir="ltr" min={0} value={values.penalties}
            onChange={(e) => set("penalties", e.target.value)}
            className={inputCls()} />
        </div>
      </div>
    </div>
  );

  const header = (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent shrink-0">
      <div dir={dir}>
        <h2 className="text-base sm:text-lg font-bold text-white">{t("addContractTitle")}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{t("addContractSubtitle")}</p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  const footer = (
    <div dir={dir} className={`flex items-center gap-3 ${flip(lang, "justify-end", "justify-start")}`}>
      <button onClick={onClose}
        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm">
        {t("cancel")}
      </button>
      <button
        onClick={handleSave}
        disabled={saving || (projects !== undefined && projects.length === 0)}
        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50"
      >
        {saving
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Plus className="w-4 h-4" />}
        {saving ? t("saving") : t("addContract")}
      </button>
    </div>
  );

  return (
    <AnimatePresence onExitComplete={handleOpen}>
      {isOpen && (
        <>
          <motion.div key="add-contract-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

          {/* Mobile: bottom sheet */}
          <motion.div key="add-contract-mobile" dir={dir}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-[#0f1117] border-t border-white/10 rounded-t-2xl shadow-2xl max-h-[96dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <div className="h-1 w-full bg-gradient-to-r from-[#F97316] to-[#EA580C]" />
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            {header}
            <div className="overflow-y-auto flex-1 px-5 py-5">{formBody}</div>
            <div className="px-5 py-4 border-t border-white/10 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          </motion.div>

          {/* sm+: centered dialog */}
          <motion.div key="add-contract-dialog" dir={dir}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: 20  }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hidden sm:flex fixed inset-0 z-50 items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-xl bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
