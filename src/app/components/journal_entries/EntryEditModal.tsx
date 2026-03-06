// ============================================================
// EntryEditModal.tsx
// Full edit modal — pre-filled from the existing entry
// ============================================================
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import type {
  EntryEditModalProps,
  EntryLineForm,
  JournalEntryFormValues,
  JournalEntryFormErrors,
} from "../../core/models/JournalEntries.types";
import { ACCOUNT_OPTIONS } from "../../core/models/JournalEntries.types";
import DatePicker from "../../core/shared/components/DatePicker";
import { tJE, tJEInterp } from "../../core/i18n/journalEntries.i18n";

function validate(
  values: JournalEntryFormValues,
  lang: import("../../core/models/Settings.types").Lang,
): JournalEntryFormErrors {
  const errors: JournalEntryFormErrors = {};
  if (!values.date)               errors.date        = tJE(lang, "errDateRequired");
  if (!values.description.trim()) errors.description = tJE(lang, "errDescRequired");

  const lineErrors = values.lines.map((l) => {
    const e: { accountCode?: string; amounts?: string } = {};
    if (!l.accountCode) e.accountCode = tJE(lang, "errAccountRequired");
    const d = parseFloat(l.debit)  || 0;
    const c = parseFloat(l.credit) || 0;
    if (d === 0 && c === 0) e.amounts = tJE(lang, "errAmountRequired");
    if (d > 0   && c > 0)   e.amounts = tJE(lang, "errDebitOrCredit");
    return e;
  });
  if (lineErrors.some((e) => Object.keys(e).length)) errors.lines = lineErrors;

  const td = values.lines.reduce((s, l) => s + (parseFloat(l.debit)  || 0), 0);
  const tc = values.lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
  if (td !== tc || td === 0)
    errors.balance = tJEInterp(lang, "errNotBalanced", { n: Math.abs(td - tc).toLocaleString() });

  return errors;
}

export default function EntryEditModal({ lang, isOpen, entry, onClose, onSave }: EntryEditModalProps) {
  const [values,  setValues]  = useState<JournalEntryFormValues>({ date: "", description: "", lines: [] });
  const [errors,  setErrors]  = useState<JournalEntryFormErrors>({});
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (isOpen && entry) {
      setValues({
        date:        entry.date,
        description: entry.description,
        lines: entry.lines.map((l) => ({
          id:          l.id,
          accountCode: l.accountCode,
          description: l.description,
          debit:       l.debit  > 0 ? String(l.debit)  : "",
          credit:      l.credit > 0 ? String(l.credit) : "",
        })),
      });
      setErrors({});
    }
  }, [isOpen, entry]);

  const totalDebit  = values.lines.reduce((s, l) => s + (parseFloat(l.debit)  || 0), 0);
  const totalCredit = values.lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
  const isBalanced  = totalDebit === totalCredit && totalDebit > 0;

  const setField = (field: keyof Omit<JournalEntryFormValues, "lines">, value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const setLine = (id: number, field: keyof EntryLineForm, value: string) =>
    setValues((v) => ({ ...v, lines: v.lines.map((l) => (l.id === id ? { ...l, [field]: value } : l)) }));

  const addLine = () =>
    setValues((v) => ({ ...v, lines: [...v.lines, { id: Date.now(), accountCode: "", description: "", debit: "", credit: "" }] }));

  const removeLine = (id: number) => {
    if (values.lines.length > 2)
      setValues((v) => ({ ...v, lines: v.lines.filter((l) => l.id !== id) }));
  };

  const handleSave = async () => {
    const errs = validate(values, lang);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try { await onSave(entry!.id, values); onClose(); }
    finally { setSaving(false); }
  };

  const inputCls = (err?: string) =>
    `w-full bg-white/5 border ${err ? "border-red-500/60" : "border-white/10"} rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F97316] transition-colors`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="edit-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[51] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-white">{tJE(lang, "editTitle")}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {tJEInterp(lang, "entryNo", { id: entry?.id ?? "" })}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    label={tJE(lang, "fieldDate")}
                    value={values.date}
                    onChange={(v) => setField("date", v)}
                    error={errors.date}
                  />
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">{tJE(lang, "fieldDescription")}</label>
                    <input
                      type="text" value={values.description} placeholder={tJE(lang, "fieldDescPlaceholder")}
                      onChange={(e) => setField("description", e.target.value)}
                      className={inputCls(errors.description)}
                    />
                    {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-right py-2 px-3 text-gray-400 text-xs">{tJE(lang, "colAccount")}</th>
                        <th className="text-right py-2 px-3 text-gray-400 text-xs">{tJE(lang, "colLineDesc")}</th>
                        <th className="text-center py-2 px-3 text-gray-400 text-xs">{tJE(lang, "colDebit")}</th>
                        <th className="text-center py-2 px-3 text-gray-400 text-xs">{tJE(lang, "colCredit")}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {values.lines.map((line, idx) => {
                        const le = errors.lines?.[idx];
                        return (
                          <tr key={line.id} className="border-b border-white/5">
                            <td className="py-2 px-3">
                              <select value={line.accountCode} onChange={(e) => setLine(line.id, "accountCode", e.target.value)} className={inputCls(le?.accountCode)}>
                                <option value="">{tJE(lang, "selectAccount")}</option>
                                {ACCOUNT_OPTIONS.map((a) => (
                                  <option key={a.code} value={a.code} className="bg-[#0f1117]">{a.code} - {a.name}</option>
                                ))}
                              </select>
                              {le?.accountCode && <p className="text-xs text-red-400 mt-0.5">{le.accountCode}</p>}
                            </td>
                            <td className="py-2 px-3">
                              <input type="text" placeholder={tJE(lang, "lineDescPlaceholder")} value={line.description} onChange={(e) => setLine(line.id, "description", e.target.value)} className={inputCls()} />
                            </td>
                            <td className="py-2 px-3">
                              <input type="number" placeholder="0.00" value={line.debit} onChange={(e) => setLine(line.id, "debit", e.target.value)} className={inputCls(le?.amounts) + " text-center"} />
                            </td>
                            <td className="py-2 px-3">
                              <input type="number" placeholder="0.00" value={line.credit} onChange={(e) => setLine(line.id, "credit", e.target.value)} className={inputCls(le?.amounts) + " text-center"} />
                              {le?.amounts && <p className="text-xs text-red-400 mt-0.5 text-center">{le.amounts}</p>}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {values.lines.length > 2 && (
                                <button onClick={() => removeLine(line.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors">
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-white/20">
                        <td colSpan={2} className="py-2 px-3">
                          <button onClick={addLine} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white text-xs transition-colors">
                            <Plus className="w-3.5 h-3.5" /> {tJE(lang, "addLine")}
                          </button>
                        </td>
                        <td className="py-2 px-3 text-center text-sm font-bold text-white">{totalDebit.toLocaleString()}</td>
                        <td className="py-2 px-3 text-center text-sm font-bold text-white">{totalCredit.toLocaleString()}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Balance */}
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${isBalanced ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                  {isBalanced
                    ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm text-emerald-400">{tJE(lang, "balanced")}</span></>
                    : <><AlertCircle  className="w-4 h-4 text-red-400"     /><span className="text-sm text-red-400">{tJEInterp(lang, "balanceDiff", { n: Math.abs(totalDebit - totalCredit).toLocaleString() })}</span></>}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 shrink-0">
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm">
                  {tJE(lang, "cancel")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !isBalanced}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Save className="w-4 h-4" />}
                  {saving ? tJE(lang, "saving") : tJE(lang, "saveChanges")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
