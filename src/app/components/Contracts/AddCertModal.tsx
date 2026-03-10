// ============================================================
// AddCertModal.tsx — Add a Payment Certificate to a contract
// ============================================================
import { useState, useMemo }       from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, AlertCircle }    from "lucide-react";
import { contractsService }        from "../../core/services/contracts.service";
import {
  tContract, dirAttr, flip,
  resolvePaymentStatusBadge,
} from "../../core/i18n/contracts.i18n";
import { formatNum } from "../../core/i18n/projects.i18n";
import type {
  AddCertModalProps,
  CertFormValues,
  CertFormErrors,
  PaymentStatus,
} from "../../core/models/contracts.types";

// ── Defaults ──────────────────────────────────────────────────
const today = new Date();
const EMPTY: CertFormValues = {
  periodFromDay:   "1",
  periodFromMonth: String(today.getMonth() + 1),
  periodFromYear:  String(today.getFullYear()),
  periodToDay:     String(today.getDate()),
  periodToMonth:   String(today.getMonth() + 1),
  periodToYear:    String(today.getFullYear()),
  grossAmount:     "",
  deductions:      "",
  status:          "pending",
};

function toDate(y: string, m: string, d: string): Date | null {
  const yr = parseInt(y, 10), mo = parseInt(m, 10), da = parseInt(d, 10);
  if (isNaN(yr) || isNaN(mo) || isNaN(da) || mo < 1 || mo > 12 || da < 1) return null;
  return new Date(yr, mo - 1, da);
}

function validate(v: CertFormValues, tFn: (k: any) => string): CertFormErrors {
  const e: CertFormErrors = {};
  const pf = toDate(v.periodFromYear, v.periodFromMonth, v.periodFromDay);
  const pt = toDate(v.periodToYear,   v.periodToMonth,   v.periodToDay);
  if (!pf) e.periodFrom = tFn("errInvalidDate");
  if (!pt) e.periodTo   = tFn("errInvalidDate");
  if (pf && pt && pt < pf) e.periodTo = tFn("errEndBeforeStart");
  if (!v.grossAmount || isNaN(+v.grossAmount) || +v.grossAmount <= 0)
    e.grossAmount = tFn("errPositiveNumber");
  if (v.deductions && (isNaN(+v.deductions) || +v.deductions < 0))
    e.deductions = tFn("errPositiveNumber");
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

function DateFields({ label, day, month, year, error, onChange, lang }: {
  label: string; day: string; month: string; year: string; error?: string;
  onChange: (f: "day" | "month" | "year", v: string) => void; lang: "ar" | "en";
}) {
  const t = (k: any) => tContract(lang, k);
  return (
    <div>
      <p className="text-sm font-medium text-gray-300 mb-1.5">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {([["day", day, 1, 31], ["month", month, 1, 12], ["year", year, 2020, 2100]] as const).map(([f, val, mn, mx]) => (
          <div key={f}>
            <p className="text-[10px] text-gray-500 mb-1">{t(`field${f.charAt(0).toUpperCase() + f.slice(1)}` as any)}</p>
            <input type="number" dir="ltr" min={mn} max={mx} value={val}
              onChange={(e) => onChange(f as any, e.target.value)}
              className={inputCls(error)} />
          </div>
        ))}
      </div>
      <AnimatePresence><FieldError msg={error} /></AnimatePresence>
    </div>
  );
}

export default function AddCertModal({ isOpen, contractId, lang, onClose, onSaved }: AddCertModalProps) {
  const [values, setValues] = useState<CertFormValues>(EMPTY);
  const [errors, setErrors] = useState<CertFormErrors>({});
  const [saving, setSaving] = useState(false);

  const t   = (k: any) => tContract(lang, k);
  const dir = dirAttr(lang);

  const set = (field: keyof CertFormValues, val: string) => {
    setValues((v) => ({ ...v, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined, periodFrom: undefined, periodTo: undefined }));
  };

  // Live net-amount preview
  const netPreview = useMemo(() => {
    const g = parseFloat(values.grossAmount) || 0;
    const d = parseFloat(values.deductions)  || 0;
    return Math.max(0, g - d);
  }, [values.grossAmount, values.deductions]);

  const handleSave = async () => {
    const errs = validate(values, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const cert = await contractsService.createCertificate(contractId, values);
      onSaved(cert);
      setValues(EMPTY);
      setErrors({});
      onClose();
    } finally { setSaving(false); }
  };

  const statuses: PaymentStatus[] = ["pending", "partial", "paid", "overdue"];

  const formBody = (
    <div dir={dir} className="space-y-4 sm:space-y-5">
      {/* Period dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateFields label={t("fieldPeriodFrom")}
          day={values.periodFromDay} month={values.periodFromMonth} year={values.periodFromYear}
          error={errors.periodFrom}
          onChange={(f, v) => set(`periodFrom${f.charAt(0).toUpperCase() + f.slice(1)}` as any, v)}
          lang={lang} />
        <DateFields label={t("fieldPeriodTo")}
          day={values.periodToDay} month={values.periodToMonth} year={values.periodToYear}
          error={errors.periodTo}
          onChange={(f, v) => set(`periodTo${f.charAt(0).toUpperCase() + f.slice(1)}` as any, v)}
          lang={lang} />
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldGrossAmount")}</label>
          <input type="number" dir="ltr" min={0} value={values.grossAmount}
            onChange={(e) => set("grossAmount", e.target.value)} className={inputCls(errors.grossAmount)} />
          <AnimatePresence><FieldError msg={errors.grossAmount} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldDeductions")}</label>
          <input type="number" dir="ltr" min={0} value={values.deductions}
            onChange={(e) => set("deductions", e.target.value)} className={inputCls(errors.deductions)} />
          <AnimatePresence><FieldError msg={errors.deductions} /></AnimatePresence>
        </div>
      </div>

      {/* Net preview */}
      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
        <span className="text-sm text-gray-300">{t("certNetCalc")}</span>
        <span className="text-base font-bold text-emerald-400">
          {formatNum(netPreview, lang)} {t("currency")}
        </span>
      </div>

      {/* Payment status */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldPaymentStatus")}</label>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => {
            const b   = resolvePaymentStatusBadge(lang, s);
            const sel = values.status === s;
            return (
              <button key={s} onClick={() => set("status", s)}
                className={`flex-1 min-w-[70px] py-2 rounded-xl border text-xs font-medium transition-all ${
                  sel ? b.className + " ring-1 ring-offset-1 ring-offset-[#0f1117] ring-current"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                }`}>{b.label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const header = (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-l from-emerald-500/10 to-transparent shrink-0">
      <div dir={dir}>
        <h2 className="text-base sm:text-lg font-bold text-white">{t("addCertTitle")}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{t("addCertSubtitle")}</p>
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
        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-l from-emerald-600 to-emerald-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50">
        {saving
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Plus className="w-4 h-4" />}
        {saving ? t("saving") : t("addCertificate")}
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="cert-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]" />

          {/* Mobile */}
          <motion.div key="cert-mobile" dir={dir}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-[56] bg-[#0f1117] border-t border-white/10 rounded-t-2xl shadow-2xl max-h-[96dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <div className="h-1 w-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
            <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 rounded-full bg-white/20" /></div>
            {header}
            <div className="overflow-y-auto flex-1 px-5 py-5">{formBody}</div>
            <div className="px-5 py-4 border-t border-white/10 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>
          </motion.div>

          {/* Desktop */}
          <motion.div key="cert-dialog" dir={dir}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hidden sm:flex fixed inset-0 z-[56] items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="h-1 w-full bg-gradient-to-r from-emerald-600 to-emerald-400 shrink-0" />
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
