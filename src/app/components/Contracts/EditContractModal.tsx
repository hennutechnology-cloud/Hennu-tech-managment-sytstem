// ============================================================
// EditContractModal.tsx — Edit editable fields of a contract
// Editable: contractor name, scope, status, end date,
//           retention %, penalties
// Read-only: contract number, original value, start date
// ============================================================
import { useState, useEffect }     from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, AlertCircle }    from "lucide-react";
import { contractsService }        from "../../core/services/contracts.service";
import {
  tContract, dirAttr, flip,
  resolveContractStatusBadge,
} from "../../core/i18n/contracts.i18n";
import { formatNum } from "../../core/i18n/projects.i18n";
import type {
  EditContractModalProps,
  ContractEditValues,
  ContractEditErrors,
  ContractStatus,
} from "../../core/models/contracts.types";

function toEditValues(c: NonNullable<EditContractModalProps["contract"]>): ContractEditValues {
  return {
    contractorName:   c.contractorName,
    scopeDescription: c.scopeDescription,
    status:           c.status,
    endDay:           String(c.endDate.day),
    endMonth:         String(c.endDate.month),
    endYear:          String(c.endDate.year),
    retentionPercent: String(c.retentionPercent),
    penalties:        String(c.penalties),
  };
}

function validate(v: ContractEditValues, tFn: (k: any) => string): ContractEditErrors {
  const e: ContractEditErrors = {};
  if (!v.contractorName.trim())   e.contractorName   = tFn("errRequired");
  if (!v.scopeDescription.trim()) e.scopeDescription = tFn("errRequired");
  const ret = +v.retentionPercent;
  if (isNaN(ret) || ret < 0 || ret > 100) e.retentionPercent = tFn("errRetentionRange");
  const yr = parseInt(v.endYear,  10);
  const mo = parseInt(v.endMonth, 10);
  const da = parseInt(v.endDay,   10);
  if (isNaN(yr) || isNaN(mo) || isNaN(da) || mo < 1 || mo > 12 || da < 1 || da > 31)
    e.endDate = tFn("errInvalidDate");
  return e;
}

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

const readonlyCls =
  "w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed";

export default function EditContractModal({
  isOpen, contract, lang, onClose, onSaved,
}: EditContractModalProps) {
  const [values, setValues] = useState<ContractEditValues | null>(null);
  const [errors, setErrors] = useState<ContractEditErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !contract) return;
    setValues(toEditValues(contract));
    setErrors({});
  }, [isOpen, contract?.id]);

  const t   = (k: any) => tContract(lang, k);
  const dir = dirAttr(lang);
  const fmt = (n: number) => formatNum(n, lang);

  if (!contract || !values) return null;

  const set = (field: keyof ContractEditValues, val: string) => {
    setValues((v) => v ? { ...v, [field]: val } : v);
    setErrors((e) => ({ ...e, [field]: undefined, endDate: undefined }));
  };

  const handleSave = async () => {
    if (!values) return;
    const errs = validate(values, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const updated = await contractsService.updateContract(contract.id, values);
      onSaved(updated);
      onClose();
    } finally { setSaving(false); }
  };

  const statusOptions: ContractStatus[] = ["active", "suspended", "terminated", "completed"];

  const formBody = (
    <div dir={dir} className="space-y-4 sm:space-y-5">
      {/* Read-only info */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
          {lang === "ar" ? "بيانات ثابتة (غير قابلة للتعديل)" : "Fixed fields (read-only)"}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] text-gray-600 mb-1">{t("colContractNo")}</p>
            <p className="text-xs text-gray-400 font-mono">{contract.contractNumber}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 mb-1">{t("originalValue")}</p>
            <p className="text-xs text-gray-400">{fmt(contract.originalValue)} {t("currency")}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 mb-1">{t("colStartDate")}</p>
            <p className="text-xs text-gray-400">
              {contract.startDate.day}/{contract.startDate.month}/{contract.startDate.year}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 mb-1">{t("advancePayment")}</p>
            <p className="text-xs text-gray-400">{fmt(contract.advancePayment)} {t("currency")}</p>
          </div>
        </div>
      </div>

      {/* Contractor name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldContractorName")}</label>
        <input type="text" value={values.contractorName}
          onChange={(e) => set("contractorName", e.target.value)}
          placeholder={t("fieldContractorPlaceholder")}
          className={inputCls(errors.contractorName)} />
        <AnimatePresence><FieldError msg={errors.contractorName} /></AnimatePresence>
      </div>

      {/* Scope */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldScope")}</label>
        <textarea rows={2} value={values.scopeDescription}
          onChange={(e) => set("scopeDescription", e.target.value)}
          placeholder={t("fieldScopePlaceholder")}
          className={`${inputCls(errors.scopeDescription)} resize-none`} />
        <AnimatePresence><FieldError msg={errors.scopeDescription} /></AnimatePresence>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldContractStatus")}</label>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => {
            const b = resolveContractStatusBadge(lang, s);
            return (
              <button key={s} onClick={() => set("status", s)}
                className={`flex-1 min-w-[80px] py-2 rounded-xl border text-xs font-medium transition-all ${
                  values.status === s ? b.className + " ring-1 ring-offset-1 ring-offset-[#0f1117] ring-current"
                                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                }`}>{b.label}</button>
            );
          })}
        </div>
      </div>

      {/* End date */}
      <div>
        <p className="text-sm font-medium text-gray-300 mb-1.5">{t("fieldEndDate")}</p>
        <div className="grid grid-cols-3 gap-2">
          {([ ["fieldDay", "endDay", 1, 31], ["fieldMonth", "endMonth", 1, 12], ["fieldYear", "endYear", 2000, 2100] ] as const).map(([lk, field, mn, mx]) => (
            <div key={field}>
              <p className="text-[10px] text-gray-500 mb-1">{t(lk)}</p>
              <input type="number" dir="ltr" min={mn} max={mx}
                value={values[field as keyof ContractEditValues] as string}
                onChange={(e) => set(field as keyof ContractEditValues, e.target.value)}
                className={inputCls(errors.endDate)} />
            </div>
          ))}
        </div>
        <AnimatePresence><FieldError msg={errors.endDate} /></AnimatePresence>
      </div>

      {/* Retention & Penalties */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldRetentionPercent")}</label>
          <input type="number" dir="ltr" min={0} max={100} step={0.5}
            value={values.retentionPercent}
            onChange={(e) => set("retentionPercent", e.target.value)}
            className={inputCls(errors.retentionPercent)} />
          <AnimatePresence><FieldError msg={errors.retentionPercent} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldPenalties")}</label>
          <input type="number" dir="ltr" min={0}
            value={values.penalties}
            onChange={(e) => set("penalties", e.target.value)}
            className={inputCls()} />
        </div>
      </div>
    </div>
  );

  const header = (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-l from-blue-500/10 to-transparent shrink-0">
      <div dir={dir}>
        <h2 className="text-base sm:text-lg font-bold text-white">{t("editContractTitle")}</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          <span className="font-mono text-orange-400">{contract.contractNumber}</span>
          {" · "}{contract.contractorName}
        </p>
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
      <button onClick={handleSave} disabled={saving}
        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-l from-blue-600 to-blue-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50">
        {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? t("saving") : t("save")}
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="edit-contract-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]" />

          {/* Mobile */}
          <motion.div key="edit-contract-mobile" dir={dir}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-[56] bg-[#0f1117] border-t border-white/10 rounded-t-2xl shadow-2xl max-h-[96dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-400" />
            <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 rounded-full bg-white/20" /></div>
            {header}
            <div className="overflow-y-auto flex-1 px-5 py-5">{formBody}</div>
            <div className="px-5 py-4 border-t border-white/10 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>
          </motion.div>

          {/* Desktop */}
          <motion.div key="edit-contract-dialog" dir={dir}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hidden sm:flex fixed inset-0 z-[56] items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-400 shrink-0" />
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
