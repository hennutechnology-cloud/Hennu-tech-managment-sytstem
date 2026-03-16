// ============================================================
// AddCertModal.tsx — Add a Payment Certificate to a contract
// Date values: "YYYY-MM-DDTHH:mm:ss"  (C# DateTime-compatible)
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
import DatePicker    from "../../core/shared/components/DatePicker";
import type { AddCertModalProps, PaymentStatus } from "../../core/models/contracts.types";

interface CertFormValues {
  periodFrom:  string; // "YYYY-MM-DDTHH:mm:ss"
  periodTo:    string; // "YYYY-MM-DDTHH:mm:ss"
  grossAmount: string;
  deductions:  string;
  status:      PaymentStatus;
}

interface CertFormErrors {
  periodFrom?:  string;
  periodTo?:    string;
  grossAmount?: string;
  deductions?:  string;
}

// ── Helpers ───────────────────────────────────────────────────
function dtToCalendar(dt: string) {
  const [y, m, d] = dt.split("T")[0].split("-").map(Number);
  return { year: y, month: m, day: d };
}

function parseDate(dt: string): Date | null {
  if (!dt) return null;
  const [y, m, d] = dt.split("T")[0].split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

const pad    = (n: number) => String(n).padStart(2, "0");
const today  = new Date();
const todayDt      = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}T00:00:00`;
const firstOfMonthDt = `${today.getFullYear()}-${pad(today.getMonth()+1)}-01T00:00:00`;

const EMPTY: CertFormValues = {
  periodFrom: firstOfMonthDt, periodTo: todayDt,
  grossAmount: "", deductions: "", status: "pending",
};

function validate(v: CertFormValues, tFn: (k: any) => string): CertFormErrors {
  const e: CertFormErrors = {};
  const pf = parseDate(v.periodFrom);
  const pt = parseDate(v.periodTo);
  if (!pf) e.periodFrom = tFn("errInvalidDate");
  if (!pt) e.periodTo   = tFn("errInvalidDate");
  if (pf && pt && pt < pf) e.periodTo = tFn("errEndBeforeStart");
  if (!v.grossAmount || isNaN(+v.grossAmount) || +v.grossAmount <= 0) e.grossAmount = tFn("errPositiveNumber");
  if (v.deductions && (isNaN(+v.deductions) || +v.deductions < 0))   e.deductions  = tFn("errPositiveNumber");
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

export default function AddCertModal({ isOpen, contractId, lang, onClose, onSaved }: AddCertModalProps) {
  const [values, setValues] = useState<CertFormValues>(EMPTY);
  const [errors, setErrors] = useState<CertFormErrors>({});
  const [saving, setSaving] = useState(false);

  const t   = (k: any) => tContract(lang, k);
  const dir = dirAttr(lang);
  const set = (f: keyof CertFormValues, v: string) => setValues((p) => ({ ...p, [f]: v }));
  const clearErr = (...fs: (keyof CertFormErrors)[]) =>
    setErrors((e) => { const n = { ...e }; fs.forEach((f) => delete n[f]); return n; });

  const netPreview = useMemo(() => {
    const g = parseFloat(values.grossAmount) || 0;
    const d = parseFloat(values.deductions)  || 0;
    return Math.max(0, g - d);
  }, [values.grossAmount, values.deductions]);

  const handleSave = async () => {
    const errs = validate(values, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const pf = dtToCalendar(values.periodFrom);
    const pt = dtToCalendar(values.periodTo);
    try {
      const cert = await contractsService.createCertificate(contractId, {
        periodFromDay: String(pf.day), periodFromMonth: String(pf.month), periodFromYear: String(pf.year),
        periodToDay:   String(pt.day), periodToMonth:   String(pt.month), periodToYear:   String(pt.year),
        grossAmount: values.grossAmount, deductions: values.deductions, status: values.status,
      });
      onSaved(cert); setValues(EMPTY); setErrors({}); onClose();
    } finally { setSaving(false); }
  };

  const statuses: PaymentStatus[] = ["pending", "partial", "paid", "overdue"];

  const formBody = (
    <div dir={dir} className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePicker lang={lang} label={t("fieldPeriodFrom")} value={values.periodFrom}
          onChange={(v) => { set("periodFrom", v); clearErr("periodFrom", "periodTo"); }} error={errors.periodFrom} />
        <DatePicker lang={lang} label={t("fieldPeriodTo")}   value={values.periodTo}
          onChange={(v) => { set("periodTo",   v); clearErr("periodFrom", "periodTo"); }} error={errors.periodTo} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldGrossAmount")}</label>
          <input type="number" dir="ltr" min={0} value={values.grossAmount}
            onChange={(e) => { set("grossAmount", e.target.value); clearErr("grossAmount"); }} className={inputCls(errors.grossAmount)} />
          <AnimatePresence><FieldError msg={errors.grossAmount} /></AnimatePresence>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldDeductions")}</label>
          <input type="number" dir="ltr" min={0} value={values.deductions}
            onChange={(e) => { set("deductions", e.target.value); clearErr("deductions"); }} className={inputCls(errors.deductions)} />
          <AnimatePresence><FieldError msg={errors.deductions} /></AnimatePresence>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
        <span className="text-sm text-gray-300">{t("certNetCalc")}</span>
        <span className="text-base font-bold text-emerald-400">{formatNum(netPreview, lang)} {t("currency")}</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldPaymentStatus")}</label>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => {
            const b   = resolvePaymentStatusBadge(lang, s);
            const sel = values.status === s;
            return (
              <button key={s} onClick={() => set("status", s)}
                className={`flex-1 min-w-[70px] py-2 rounded-xl border text-xs font-medium transition-all ${sel ? b.className + " ring-1 ring-offset-1 ring-offset-[#0f1117] ring-current" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"}`}>{b.label}</button>
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
      <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
    </div>
  );

  const footer = (
    <div dir={dir} className={`flex items-center gap-3 ${flip(lang, "justify-end", "justify-start")}`}>
      <button onClick={onClose} className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm">{t("cancel")}</button>
      <button onClick={handleSave} disabled={saving}
        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-l from-emerald-600 to-emerald-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50">
        {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
        {saving ? t("saving") : t("addCertificate")}
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="cert-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]" />
          <motion.div key="cert-mobile" dir={dir} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-[56] bg-[#0f1117] border-t border-white/10 rounded-t-2xl shadow-2xl max-h-[96dvh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="h-1 w-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
            <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1 rounded-full bg-white/20" /></div>
            {header}
            <div className="overflow-y-auto flex-1 px-5 py-5">{formBody}</div>
            <div className="px-5 py-4 border-t border-white/10 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>
          </motion.div>
          <motion.div key="cert-dialog" dir={dir} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hidden sm:flex fixed inset-0 z-[56] items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
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
