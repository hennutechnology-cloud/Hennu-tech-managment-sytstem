// ============================================================
// BudgetActualManager.tsx
// Inline CRUD panel for budget vs actual items (by phase).
// Users add, edit, delete rows. Visual bar comparison preview.
// ============================================================
import { useState }               from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Check, X, BarChart3 } from "lucide-react";
import { projectsService }        from "../../core/services/project.service";
import GlassCard                  from "../../core/shared/components/GlassCard";
import type { BudgetActualItem }  from "../../core/models/projects.types";
import type { Lang }              from "../../core/models/Settings.types";

interface Props {
  projectId: number;
  items:     BudgetActualItem[];
  lang:      Lang;
  onSaved:   (items: BudgetActualItem[]) => void;
}

type Draft = { phase: string; budget: string; actual: string };
const BLANK: Draft = { phase: "", budget: "", actual: "" };

const inp = (err?: string) =>
  `w-full bg-white/5 border ${err ? "border-red-500/60" : "border-white/10"} rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500/50 transition-all`;

export default function BudgetActualManager({ projectId, items, lang, onSaved }: Props) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editDraft,  setEditDraft]  = useState<Draft>(BLANK);
  const [addDraft,   setAddDraft]   = useState<Draft>(BLANK);
  const [addOpen,    setAddOpen]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState<Partial<Draft>>({});

  const isAr  = lang === "ar";
  const maxVal = items.reduce((m, i) => Math.max(m, i.budget, i.actual), 0) || 1;

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-SA" : "en-US", { maximumFractionDigits: 0 });

  function validate(d: Draft) {
    const e: Partial<Draft> = {};
    if (!d.phase.trim()) e.phase = isAr ? "مطلوب" : "Required";
    if (!d.budget || isNaN(+d.budget) || +d.budget < 0) e.budget = isAr ? "رقم صالح مطلوب" : "Must be ≥ 0";
    if (!d.actual || isNaN(+d.actual) || +d.actual < 0) e.actual = isAr ? "رقم صالح مطلوب" : "Must be ≥ 0";
    return e;
  }

  // ── Edit ────────────────────────────────────────────────────
  const startEdit = (i: number) => {
    setEditingIdx(i);
    setEditDraft({ phase: items[i].phase, budget: String(items[i].budget), actual: String(items[i].actual) });
    setErrors({});
    setAddOpen(false);
  };
  const saveEdit = async () => {
    const errs = validate(editDraft);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const next = items.map((item, i) =>
        i === editingIdx
          ? { phase: editDraft.phase.trim(), budget: parseFloat(editDraft.budget), actual: parseFloat(editDraft.actual) }
          : item
      );
      onSaved(await projectsService.saveBudgetActual(projectId, next));
      setEditingIdx(null);
    } finally { setSaving(false); }
  };

  // ── Delete ──────────────────────────────────────────────────
  const deleteItem = async (i: number) => {
    onSaved(await projectsService.saveBudgetActual(projectId, items.filter((_, idx) => idx !== i)));
    if (editingIdx === i) setEditingIdx(null);
  };

  // ── Add ─────────────────────────────────────────────────────
  const saveAdd = async () => {
    const errs = validate(addDraft);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const next = [...items, { phase: addDraft.phase.trim(), budget: parseFloat(addDraft.budget), actual: parseFloat(addDraft.actual) }];
      onSaved(await projectsService.saveBudgetActual(projectId, next));
      setAddDraft(BLANK);
      setAddOpen(false);
      setErrors({});
    } finally { setSaving(false); }
  };

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">
            {isAr ? "الميزانية مقابل الفعلي" : "Budget vs Actual"}
          </h3>
          <span className="text-xs text-gray-500">({items.length})</span>
        </div>
        {!addOpen && (
          <button onClick={() => { setAddOpen(true); setEditingIdx(null); setErrors({}); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-medium transition-colors">
            <Plus className="w-3.5 h-3.5" />
            {isAr ? "إضافة مرحلة" : "Add Phase"}
          </button>
        )}
      </div>

      {/* Legend */}
      {items.length > 0 && (
        <div className="flex items-center gap-4 mb-3 text-[10px] text-gray-400">
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-orange-400/80" />{isAr ? "الميزانية" : "Budget"}</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-blue-400/80" />{isAr ? "الفعلي" : "Actual"}</div>
        </div>
      )}

      {/* Empty */}
      {items.length === 0 && !addOpen && (
        <div className="py-8 text-center">
          <BarChart3 className="w-8 h-8 text-gray-700 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-1">{isAr ? "لا توجد مراحل بعد" : "No phases yet"}</p>
          <p className="text-xs text-gray-600">{isAr ? "أضف مراحل لمقارنة الميزانية بالفعلي" : "Add phases to compare budget vs actual"}</p>
        </div>
      )}

      {/* Rows */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <motion.div key={`phase-${i}-${item.phase}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 16, height: 0 }}
              transition={{ duration: 0.18 }}
            >
              {editingIdx === i ? (
                /* ── Edit form ── */
                <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">{isAr ? "اسم المرحلة" : "Phase Name"}</p>
                    <input type="text" value={editDraft.phase} autoFocus
                      onChange={(e) => { setEditDraft((d) => ({ ...d, phase: e.target.value })); setErrors((e2) => ({ ...e2, phase: undefined })); }}
                      className={inp(errors.phase)} />
                    {errors.phase && <p className="text-[10px] text-red-400 mt-0.5">{errors.phase}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-gray-500 mb-1">{isAr ? "الميزانية (ر.س)" : "Budget (SAR)"}</p>
                      <input type="number" dir="ltr" min={0} value={editDraft.budget}
                        onChange={(e) => { setEditDraft((d) => ({ ...d, budget: e.target.value })); setErrors((e2) => ({ ...e2, budget: undefined })); }}
                        className={inp(errors.budget)} />
                      {errors.budget && <p className="text-[10px] text-red-400 mt-0.5">{errors.budget}</p>}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 mb-1">{isAr ? "الفعلي (ر.س)" : "Actual (SAR)"}</p>
                      <input type="number" dir="ltr" min={0} value={editDraft.actual}
                        onChange={(e) => { setEditDraft((d) => ({ ...d, actual: e.target.value })); setErrors((e2) => ({ ...e2, actual: undefined })); }}
                        className={inp(errors.actual)} />
                      {errors.actual && <p className="text-[10px] text-red-400 mt-0.5">{errors.actual}</p>}
                    </div>
                  </div>
                  {/* Live variance preview */}
                  {editDraft.budget && editDraft.actual && (
                    <div className={`text-xs px-2.5 py-1.5 rounded-lg border ${
                      parseFloat(editDraft.actual) > parseFloat(editDraft.budget)
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    }`}>
                      {isAr ? "الفرق:" : "Variance:"}{" "}
                      {parseFloat(editDraft.actual) > parseFloat(editDraft.budget) ? "▲" : "▼"}{" "}
                      {fmt(Math.abs(parseFloat(editDraft.actual) - parseFloat(editDraft.budget)))} {isAr ? "ر.س" : "SAR"}
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveEdit} disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                      {saving ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      {isAr ? "حفظ" : "Save"}
                    </button>
                    <button onClick={() => { setEditingIdx(null); setErrors({}); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs transition-colors">
                      <X className="w-3.5 h-3.5" /> {isAr ? "إلغاء" : "Cancel"}
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Display row ── */
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] group hover:border-white/10 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-200 font-medium">{item.phase}</span>
                    <div className="flex items-center gap-3">
                      {/* Variance chip */}
                      {item.actual > item.budget ? (
                        <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-md font-mono">
                          ▲ {fmt(item.actual - item.budget)}
                        </span>
                      ) : item.actual < item.budget ? (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-mono">
                          ▼ {fmt(item.budget - item.actual)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-mono">–</span>
                      )}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(i)}
                          className="p-1.5 hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 rounded-lg transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteItem(i)}
                          className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Bar: budget */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-14 shrink-0">{isAr ? "الميزانية" : "Budget"}</span>
                      <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400/80 rounded-full transition-all duration-500"
                          style={{ width: `${(item.budget / maxVal) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 w-20 text-right font-mono shrink-0">{fmt(item.budget)}</span>
                    </div>
                    {/* Bar: actual */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-14 shrink-0">{isAr ? "الفعلي" : "Actual"}</span>
                      <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${
                          item.actual > item.budget ? "bg-red-400/80" : "bg-blue-400/80"
                        }`}
                          style={{ width: `${(item.actual / maxVal) * 100}%` }} />
                      </div>
                      <span className={`text-[10px] w-20 text-right font-mono shrink-0 ${
                        item.actual > item.budget ? "text-red-400" : "text-blue-400"
                      }`}>{fmt(item.actual)}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add form */}
        <AnimatePresence>
          {addOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
              <p className="text-xs font-medium text-blue-300">{isAr ? "إضافة مرحلة جديدة" : "New Phase"}</p>
              <div>
                <p className="text-[10px] text-gray-500 mb-1">{isAr ? "اسم المرحلة" : "Phase Name"}</p>
                <input type="text" value={addDraft.phase} autoFocus
                  placeholder={isAr ? "مثال: المرحلة الأولى" : "e.g. Phase 1"}
                  onChange={(e) => { setAddDraft((d) => ({ ...d, phase: e.target.value })); setErrors((e2) => ({ ...e2, phase: undefined })); }}
                  className={inp(errors.phase)} />
                {errors.phase && <p className="text-[10px] text-red-400 mt-0.5">{errors.phase}</p>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">{isAr ? "الميزانية (ر.س)" : "Budget (SAR)"}</p>
                  <input type="number" dir="ltr" min={0} value={addDraft.budget}
                    onChange={(e) => { setAddDraft((d) => ({ ...d, budget: e.target.value })); setErrors((e2) => ({ ...e2, budget: undefined })); }}
                    className={inp(errors.budget)} />
                  {errors.budget && <p className="text-[10px] text-red-400 mt-0.5">{errors.budget}</p>}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">{isAr ? "الفعلي (ر.س)" : "Actual (SAR)"}</p>
                  <input type="number" dir="ltr" min={0} value={addDraft.actual}
                    onChange={(e) => { setAddDraft((d) => ({ ...d, actual: e.target.value })); setErrors((e2) => ({ ...e2, actual: undefined })); }}
                    className={inp(errors.actual)} />
                  {errors.actual && <p className="text-[10px] text-red-400 mt-0.5">{errors.actual}</p>}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={saveAdd} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                  {saving ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  {isAr ? "إضافة" : "Add"}
                </button>
                <button onClick={() => { setAddOpen(false); setAddDraft(BLANK); setErrors({}); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs transition-colors">
                  <X className="w-3.5 h-3.5" /> {isAr ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
