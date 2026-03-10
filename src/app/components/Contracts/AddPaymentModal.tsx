// ============================================================
// AddPaymentModal.tsx — Record a direct payment (partial/full)
// ============================================================
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence }       from "motion/react";
import { X, DollarSign, AlertCircle }    from "lucide-react";
import { contractsService }              from "../../core/services/contracts.service";
import { tContract, dirAttr, flip }      from "../../core/i18n/contracts.i18n";
import { formatNum }                     from "../../core/i18n/projects.i18n";
import type {
  AddPaymentModalProps,
  DirectPaymentFormValues,
  DirectPaymentFormErrors,
} from "../../core/models/contracts.types";

const today = new Date();

function makeEmpty(remaining: number): DirectPaymentFormValues {
  return {
    amount:      String(remaining),
    type:        "partial",
    description: "",
    paidDay:     String(today.getDate()),
    paidMonth:   String(today.getMonth() + 1),
    paidYear:    String(today.getFullYear()),
    reference:   "",
  };
}

function validate(v: DirectPaymentFormValues, remaining: number, tFn: (k: any) => string): DirectPaymentFormErrors {
  const e: DirectPaymentFormErrors = {};
  if (!v.description.trim()) e.description = tFn("errRequired");
  if (!v.reference.trim())   e.reference   = tFn("errRequired");
  const amt = parseFloat(v.amount);
  if (isNaN(amt) || amt <= 0)    e.amount = tFn("errPositiveNumber");
  else if (v.type === "partial" && amt > remaining) e.amount = tFn("errExceedsRemaining");
  const yr = parseInt(v.paidYear,  10);
  const mo = parseInt(v.paidMonth, 10);
  const da = parseInt(v.paidDay,   10);
  if (isNaN(yr) || isNaN(mo) || isNaN(da) || mo < 1 || mo > 12 || da < 1 || da > 31)
    e.paidOn = tFn("errInvalidDate");
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

export default function AddPaymentModal({
  isOpen, contractId, remainingAmount, lang, onClose, onSaved,
}: AddPaymentModalProps) {
  const [values, setValues] = useState<DirectPaymentFormValues>(makeEmpty(remainingAmount));
  const [errors, setErrors] = useState<DirectPaymentFormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setValues(makeEmpty(remainingAmount));
    setErrors({});
  }, [isOpen, remainingAmount]);

  const t   = (k: any) => tContract(lang, k);
  const dir = dirAttr(lang);
  const fmt = (n: number) => formatNum(n, lang);

  const set = (field: keyof DirectPaymentFormValues, val: string) => {
    setValues((v) => ({ ...v, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined, paidOn: undefined }));
  };

  // When switching to "full", auto-fill the remaining amount
  const setType = (type: "partial" | "full") => {
    setValues((v) => ({
      ...v,
      type,
      amount: type === "full" ? String(remainingAmount) : v.amount,
    }));
    setErrors((e) => ({ ...e, amount: undefined }));
  };

  const effectiveAmount = useMemo(() => {
    if (values.type === "full") return remainingAmount;
    return Math.min(parseFloat(values.amount) || 0, remainingAmount);
  }, [values.amount, values.type, remainingAmount]);

  const handleSave = async () => {
    const errs = validate(values, remainingAmount, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const pmt = await contractsService.createDirectPayment(contractId, values);
      onSaved(pmt);
      onClose();
    } finally { setSaving(false); }
  };

  const formBody = (
    <div dir={dir} className="space-y-4 sm:space-y-5">
      {/* Remaining amount banner */}
      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
        <span className="text-sm text-gray-300">{t("remainingToPay")}</span>
        <span className="text-base font-bold text-blue-400">
          {fmt(remainingAmount)} {t("currency")}
        </span>
      </div>

      {/* Payment type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldPaymentType")}</label>
        <div className="grid grid-cols-2 gap-2">
          {(["partial", "full"] as const).map((type) => (
            <button key={type} onClick={() => setType(type)}
              className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                values.type === type
                  ? type === "full"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 ring-1 ring-offset-1 ring-offset-[#0f1117] ring-emerald-500"
                    : "bg-orange-500/20 text-orange-400 border-orange-500/30 ring-1 ring-offset-1 ring-offset-[#0f1117] ring-orange-500"
                  : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
              }`}>
              {type === "full" ? t("paymentTypeFull") : t("paymentTypePartial")}
            </button>
          ))}
        </div>
        {values.type === "full" && (
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            {t("fullPaymentNote")}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldPaymentAmount")}</label>
        <input type="number" dir="ltr" min={0} max={remainingAmount}
          value={values.type === "full" ? remainingAmount : values.amount}
          readOnly={values.type === "full"}
          onChange={(e) => set("amount", e.target.value)}
          className={`${inputCls(errors.amount)} ${values.type === "full" ? "opacity-60 cursor-not-allowed" : ""}`} />
        <AnimatePresence><FieldError msg={errors.amount} /></AnimatePresence>
      </div>

      {/* Effective amount preview */}
      {effectiveAmount > 0 && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <span className="text-sm text-gray-300">{t("paymentAmount")}</span>
          <span className="text-base font-bold text-emerald-400">
            {fmt(effectiveAmount)} {t("currency")}
          </span>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldPaymentDescription")}</label>
        <input type="text" value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder={t("fieldPaymentDescPH")}
          className={inputCls(errors.description)} />
        <AnimatePresence><FieldError msg={errors.description} /></AnimatePresence>
      </div>

      {/* Reference */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldPaymentReference")}</label>
        <input type="text" dir="ltr" value={values.reference}
          onChange={(e) => set("reference", e.target.value)}
          placeholder={t("fieldPaymentRefPH")}
          className={inputCls(errors.reference)} />
        <AnimatePresence><FieldError msg={errors.reference} /></AnimatePresence>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldPaymentDate")}</label>
        <div className="grid grid-cols-3 gap-2">
          {([ ["fieldDay", "paidDay", 1, 31], ["fieldMonth", "paidMonth", 1, 12], ["fieldYear", "paidYear", 2000, 2100] ] as const).map(([lk, field, mn, mx]) => (
            <div key={field}>
              <p className="text-[10px] text-gray-500 mb-1">{t(lk)}</p>
              <input type="number" dir="ltr" min={mn} max={mx}
                value={values[field as keyof DirectPaymentFormValues] as string}
                onChange={(e) => set(field as keyof DirectPaymentFormValues, e.target.value)}
                className={inputCls(errors.paidOn)} />
            </div>
          ))}
        </div>
        <AnimatePresence><FieldError msg={errors.paidOn} /></AnimatePresence>
      </div>
    </div>
  );

  const header = (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-l from-emerald-500/10 to-transparent shrink-0">
      <div dir={dir}>
        <h2 className="text-base sm:text-lg font-bold text-white">{t("addPaymentTitle")}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{t("addPaymentSubtitle")}</p>
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
        {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <DollarSign className="w-4 h-4" />}
        {saving ? t("saving") : t("addPayment")}
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="pay-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]" />

          {/* Mobile */}
          <motion.div key="pay-mobile" dir={dir}
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
          <motion.div key="pay-dialog" dir={dir}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hidden sm:flex fixed inset-0 z-[56] items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-md bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
