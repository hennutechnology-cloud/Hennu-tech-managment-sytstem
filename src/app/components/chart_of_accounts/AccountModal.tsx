import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, AlertCircle } from "lucide-react";
import type {
  AccountModalProps,
  AccountFormValues,
  AccountFormErrors,
  AccountType,
} from "../../core/models/ChartOfAccounts.types";

function flattenAccounts(
  accounts: AccountModalProps["accounts"] | undefined,
  depth = 0
): { code: string; name: string; depth: number }[] {
  if (!accounts || !Array.isArray(accounts)) return [];
  const result: { code: string; name: string; depth: number }[] = [];
  for (const acc of accounts) {
    result.push({ code: acc.code, name: acc.name, depth });
    if (acc.children) result.push(...flattenAccounts(acc.children, depth + 1));
  }
  return result;
}

function validate(values: AccountFormValues): AccountFormErrors {
  const errors: AccountFormErrors = {};
  if (!values.code.trim())
    errors.code = "رمز الحساب مطلوب";
  else if (!/^\d{4,}$/.test(values.code.trim()))
    errors.code = "يجب أن يحتوي الرمز على 4 أرقام على الأقل";
  if (!values.name.trim())
    errors.name = "اسم الحساب مطلوب";
  else if (values.name.trim().length < 2)
    errors.name = "الاسم قصير جداً";
  if (!values.balance.trim())
    errors.balance = "الرصيد مطلوب";
  else if (isNaN(parseFloat(values.balance)) || parseFloat(values.balance) < 0)
    errors.balance = "يجب إدخال رقم صحيح موجب";
  return errors;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
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
  `w-full bg-white/5 border ${
    hasError ? "border-red-500/60" : "border-white/10"
  } rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm
   focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30
   transition-all duration-200`;

const EMPTY: AccountFormValues = {
  code: "",
  name: "",
  type: "main",
  balance: "",
  parentCode: "",
};

export default function AccountModal({
  isOpen,
  editAccount,
  accounts = [],
  onClose,
  onSave,
}: AccountModalProps) {
  const [values, setValues] = useState<AccountFormValues>(EMPTY);
  const [errors, setErrors] = useState<AccountFormErrors>({});
  const [saving, setSaving] = useState(false);

  const isEdit = !!editAccount;
  const flat = flattenAccounts(accounts);

  useEffect(() => {
    if (isOpen) {
      if (editAccount) {
        setValues({
          code: editAccount.code,
          name: editAccount.name,
          type: editAccount.type,
          balance: String(editAccount.balance),
          parentCode: "",
        });
      } else {
        setValues(EMPTY);
      }
      setErrors({});
    }
  }, [isOpen, editAccount]);

  const set = (field: keyof AccountFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof AccountFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const errs = validate(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try { await onSave(values); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isEdit ? "تعديل الحساب" : "إضافة حساب جديد"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isEdit ? `تعديل بيانات الحساب ${editAccount!.code}` : "أدخل بيانات الحساب الجديد"}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="رمز الحساب" error={errors.code}>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="مثال: 1101"
                      value={values.code}
                      onChange={(e) => set("code", e.target.value)}
                      disabled={isEdit}
                      className={inputCls(!!errors.code) + (isEdit ? " opacity-50 cursor-not-allowed" : "")}
                    />
                  </Field>
                  <Field label="نوع الحساب">
                    <select
                      value={values.type}
                      onChange={(e) => set("type", e.target.value as AccountType)}
                      className={inputCls(false) + " cursor-pointer"}
                    >
                      <option value="main"   className="bg-[#0f1117]">رئيسي</option>
                      <option value="sub"    className="bg-[#0f1117]">فرعي</option>
                      <option value="detail" className="bg-[#0f1117]">تفصيلي</option>
                    </select>
                  </Field>
                </div>

                <Field label="اسم الحساب" error={errors.name}>
                  <input
                    type="text"
                    placeholder="مثال: الصندوق"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={inputCls(!!errors.name)}
                  />
                </Field>

                <Field label="الرصيد الافتتاحي (ر.س)" error={errors.balance}>
                  <input
                    type="number"
                    dir="ltr"
                    placeholder="0"
                    min="0"
                    value={values.balance}
                    onChange={(e) => set("balance", e.target.value)}
                    className={inputCls(!!errors.balance)}
                  />
                </Field>

                {!isEdit && values.type !== "main" && (
                  <Field label="الحساب الأب (اختياري)">
                    <select
                      value={values.parentCode}
                      onChange={(e) => set("parentCode", e.target.value)}
                      className={inputCls(false) + " cursor-pointer"}
                    >
                      <option value="" className="bg-[#0f1117]">— بدون حساب أب (مستوى رئيسي) —</option>
                      {flat.map((a) => (
                        <option key={a.code} value={a.code} className="bg-[#0f1117]">
                          {"　".repeat(a.depth)}{a.code} — {a.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm">
                  إلغاء
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Save className="w-4 h-4" />}
                  {isEdit ? "حفظ التعديلات" : "إضافة الحساب"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
