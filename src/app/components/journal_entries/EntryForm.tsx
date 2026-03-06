// ============================================================
// EntryForm.tsx  — New journal entry form
// ============================================================
import { useState } from "react";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import type {
  EntryFormProps,
  EntryLineForm,
  JournalEntryFormValues,
  JournalEntryFormErrors,
} from "../../core/models/JournalEntries.types";
import { ACCOUNT_OPTIONS } from "../../core/models/JournalEntries.types";
import DatePicker from "../../core/shared/components/DatePicker";
import { tJE, tJEInterp } from "../../core/i18n/journalEntries.i18n";

const today = new Date().toISOString().slice(0, 10);

function emptyLine(id: number): EntryLineForm {
  return { id, accountCode: "", description: "", debit: "", credit: "" };
}

function validate(values: JournalEntryFormValues, lang: import("../../core/models/Settings.types").Lang): JournalEntryFormErrors {
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

  const totalDebit  = values.lines.reduce((s, l) => s + (parseFloat(l.debit)  || 0), 0);
  const totalCredit = values.lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
  if (totalDebit !== totalCredit || totalDebit === 0)
    errors.balance = tJEInterp(lang, "errNotBalanced", { n: Math.abs(totalDebit - totalCredit).toLocaleString() });

  return errors;
}

export default function EntryForm({ lang, onSave }: EntryFormProps) {
  const [values, setValues] = useState<JournalEntryFormValues>({
    date: today,
    description: "",
    lines: [emptyLine(1), emptyLine(2)],
  });
  const [errors,  setErrors]  = useState<JournalEntryFormErrors>({});
  const [saving,  setSaving]  = useState(false);
  const [touched, setTouched] = useState(false);

  const totalDebit  = values.lines.reduce((s, l) => s + (parseFloat(l.debit)  || 0), 0);
  const totalCredit = values.lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
  const isBalanced  = totalDebit === totalCredit && totalDebit > 0;

  const setField = (field: keyof Omit<JournalEntryFormValues, "lines">, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (touched) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const setLine = (id: number, field: keyof EntryLineForm, value: string) => {
    setValues((v) => ({
      ...v,
      lines: v.lines.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    }));
  };

  const addLine = () => {
    setValues((v) => ({ ...v, lines: [...v.lines, emptyLine(Date.now())] }));
  };

  const removeLine = (id: number) => {
    if (values.lines.length > 2)
      setValues((v) => ({ ...v, lines: v.lines.filter((l) => l.id !== id) }));
  };

  const handleSave = async () => {
    setTouched(true);
    const errs = validate(values, lang);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(values);
      setValues({ date: today, description: "", lines: [emptyLine(1), emptyLine(2)] });
      setErrors({});
      setTouched(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard>
      <h2 className="text-xl font-bold text-white mb-6">{tJE(lang, "formTitle")}</h2>

      <div className="space-y-4 mb-6">
        {/* Date + Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label={tJE(lang, "fieldDate")}
            value={values.date}
            onChange={(v) => setField("date", v)}
            error={errors.date}
          />
          <div>
            <label className="block text-gray-400 text-sm mb-2">{tJE(lang, "fieldDescription")}</label>
            <input
              type="text"
              placeholder={tJE(lang, "fieldDescPlaceholder")}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              className={`w-full bg-white/5 border ${errors.description ? "border-red-500/60" : "border-white/10"} rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F97316] transition-colors`}
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Lines table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-3 text-gray-400 text-sm">{tJE(lang, "colAccount")}</th>
                <th className="text-right py-3 px-3 text-gray-400 text-sm">{tJE(lang, "colLineDesc")}</th>
                <th className="text-center py-3 px-3 text-gray-400 text-sm">{tJE(lang, "colDebit")}</th>
                <th className="text-center py-3 px-3 text-gray-400 text-sm">{tJE(lang, "colCredit")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {values.lines.map((line, idx) => {
                const lineErr = errors.lines?.[idx];
                return (
                  <motion.tr
                    key={line.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-white/5"
                  >
                    <td className="py-2 px-3">
                      <select
                        value={line.accountCode}
                        onChange={(e) => setLine(line.id, "accountCode", e.target.value)}
                        className={`w-full bg-white/5 border ${lineErr?.accountCode ? "border-red-500/60" : "border-white/10"} rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F97316]`}
                      >
                        <option value="">{tJE(lang, "selectAccount")}</option>
                        {ACCOUNT_OPTIONS.map((a) => (
                          <option key={a.code} value={a.code} className="bg-[#0f1117]">
                            {a.code} - {a.name}
                          </option>
                        ))}
                      </select>
                      {lineErr?.accountCode && <p className="text-xs text-red-400 mt-0.5">{lineErr.accountCode}</p>}
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        placeholder={tJE(lang, "lineDescPlaceholder")}
                        value={line.description}
                        onChange={(e) => setLine(line.id, "description", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#F97316]"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={line.debit}
                        onChange={(e) => setLine(line.id, "debit", e.target.value)}
                        className={`w-full bg-white/5 border ${lineErr?.amounts ? "border-red-500/60" : "border-white/10"} rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-[#F97316]`}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={line.credit}
                        onChange={(e) => setLine(line.id, "credit", e.target.value)}
                        className={`w-full bg-white/5 border ${lineErr?.amounts ? "border-red-500/60" : "border-white/10"} rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-[#F97316]`}
                      />
                      {lineErr?.amounts && <p className="text-xs text-red-400 mt-0.5 text-center">{lineErr.amounts}</p>}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {values.lines.length > 2 && (
                        <button onClick={() => removeLine(line.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-white/20">
                <td colSpan={2} className="py-3 px-3">
                  <button onClick={addLine} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors text-sm">
                    <Plus className="w-4 h-4" />
                    {tJE(lang, "addLine")}
                  </button>
                </td>
                <td className="py-3 px-3 text-center font-bold text-white">{totalDebit.toLocaleString()}</td>
                <td className="py-3 px-3 text-center font-bold text-white">{totalCredit.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Balance indicator + save */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-3">
            {isBalanced ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-emerald-400 font-medium">{tJE(lang, "balanced")}</p>
                  <p className="text-sm text-gray-400">{tJE(lang, "balancedSub")}</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <p className="text-red-400 font-medium">{tJE(lang, "notBalanced")}</p>
                  <p className="text-sm text-gray-400">
                    {tJEInterp(lang, "balanceDiff", { n: Math.abs(totalDebit - totalCredit).toLocaleString() })}
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={!isBalanced || saving}
            className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              isBalanced && !saving
                ? "bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white hover:shadow-lg hover:shadow-orange-500/30"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {saving ? tJE(lang, "saving") : tJE(lang, "saveEntry")}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
