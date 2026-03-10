// ============================================================
// AddChangeOrderModal.tsx — Add a Change Order to a contract
// ============================================================
import { useState }                from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, AlertCircle }    from "lucide-react";
import { contractsService }        from "../../core/services/contracts.service";
import { tContract, dirAttr, flip } from "../../core/i18n/contracts.i18n";
import type {
  AddChangeOrderModalProps,
  ChangeOrderFormValues,
  ChangeOrderFormErrors,
} from "../../core/models/contracts.types";

const today = new Date();
const EMPTY: ChangeOrderFormValues = {
  description:   "",
  amount:        "",
  status:        "pending",
  approvedDay:   String(today.getDate()),
  approvedMonth: String(today.getMonth() + 1),
  approvedYear:  String(today.getFullYear()),
};

function toDate(y: string, m: string, d: string): Date | null {
  const yr = parseInt(y, 10), mo = parseInt(m, 10), da = parseInt(d, 10);
  if (isNaN(yr) || isNaN(mo) || isNaN(da) || mo < 1 || mo > 12 || da < 1) return null;
  return new Date(yr, mo - 1, da);
}

function validate(v: ChangeOrderFormValues, tFn: (k: any) => string): ChangeOrderFormErrors {
  const e: ChangeOrderFormErrors = {};
  if (!v.description.trim()) e.description = tFn("errRequired");
  if (!v.amount || isNaN(+v.amount) || +v.amount <= 0) e.amount = tFn("errPositiveNumber");
  if (!toDate(v.approvedYear, v.approvedMonth, v.approvedDay)) e.approvedOn = tFn("errInvalidDate");
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

const STATUS_OPTIONS = [
  { value: "pending",  labelKey: "coPending"  as const },
  { value: "approved", labelKey: "coApproved" as const },
  { value: "rejected", labelKey: "coRejected" as const },
] as const;

const STATUS_STYLE: Record<string, string> = {
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending:  "bg-orange-500/20  text-orange-400  border-orange-500/30",
  rejected: "bg-red-500/20     text-red-400     border-red-500/30",
};

export default function AddChangeOrderModal({
  isOpen, contractId, lang, onClose, onSaved,
}: AddChangeOrderModalProps) {
  const [values, setValues] = useState<ChangeOrderFormValues>(EMPTY);
  const [errors, setErrors] = useState<ChangeOrderFormErrors>({});
  const [saving, setSaving] = useState(false);

  const t   = (k: any) => tContract(lang, k);
  const dir = dirAttr(lang);

  const set = (field: keyof ChangeOrderFormValues, val: string) => {
    setValues((v) => ({ ...v, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined, approvedOn: undefined }));
  };

  const handleSave = async () => {
    const errs = validate(values, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const co = await contractsService.createChangeOrder(contractId, values);
      onSaved(co);
      setValues(EMPTY);
      setErrors({});
      onClose();
    } finally { setSaving(false); }
  };

  const formBody = (
    <div dir={dir} className="space-y-4 sm:space-y-5">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldCoDescription")}</label>
        <textarea
          rows={3} value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder={t("fieldCoDescPlaceholder")}
          className={`${inputCls(errors.description)} resize-none`}
        />
        <AnimatePresence><FieldError msg={errors.description} /></AnimatePresence>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldCoAmount")}</label>
        <input type="number" dir="ltr" min={0} value={values.amount}
          onChange={(e) => set("amount", e.target.value)}
          className={inputCls(errors.amount)} />
        <AnimatePresence><FieldError msg={errors.amount} /></AnimatePresence>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldCoStatus")}</label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map(({ value, labelKey }) => {
            const sel = values.status === value;
            return (
              <button key={value} onClick={() => set("status", value)}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                  sel ? STATUS_STYLE[value] + " ring-1 ring-offset-1 ring-offset-[#0f1117] ring-current"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                }`}>{t(labelKey)}</button>
            );
          })}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("fieldCoApprovedOn")}</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            ["fieldDay",   "approvedDay",   1,    31  ],
            ["fieldMonth", "approvedMonth", 1,    12  ],
            ["fieldYear",  "approvedYear",  2000, 2100],
          ] as const).map(([labelKey, field, mn, mx]) => (
            <div key={field}>
              <p className="text-[10px] text-gray-500 mb-1">{t(labelKey)}</p>
              <input type="number" dir="ltr" min={mn} max={mx}
                value={values[field]}
                onChange={(e) => set(field, e.target.value)}
                className={inputCls(errors.approvedOn)} />
            </div>
          ))}
        </div>
        <AnimatePresence><FieldError msg={errors.approvedOn} /></AnimatePresence>
      </div>
    </div>
  );

  const header = (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-l from-blue-500/10 to-transparent shrink-0">
      <div dir={dir}>
        <h2 className="text-base sm:text-lg font-bold text-white">{t("addCoTitle")}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{t("addCoSubtitle")}</p>
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
        {saving
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Plus className="w-4 h-4" />}
        {saving ? t("saving") : t("addChangeOrder")}
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="co-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]" />

          {/* Mobile */}
          <motion.div key="co-mobile" dir={dir}
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
          <motion.div key="co-dialog" dir={dir}
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
