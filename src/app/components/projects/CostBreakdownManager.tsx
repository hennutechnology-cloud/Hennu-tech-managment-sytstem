// ============================================================
// CostBreakdownManager.tsx
// Inline CRUD panel for cost-breakdown items.
// Users add, edit, and delete rows. Live donut preview.
// ============================================================
import { useState }               from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Check, X, PieChart } from "lucide-react";
import { projectsService }        from "../../core/services/project.service";
import GlassCard                  from "../../core/shared/components/GlassCard";
import type { CostBreakdownItem } from "../../core/models/projects.types";
import type { Lang }              from "../../core/models/Settings.types";

const COLORS = [
  "#F97316","#10B981","#3B82F6","#8B5CF6",
  "#EC4899","#F59E0B","#14B8A6","#EF4444",
  "#6366F1","#84CC16","#06B6D4","#A78BFA",
];

interface Props {
  projectId: number;
  items:     CostBreakdownItem[];
  lang:      Lang;
  onSaved:   (items: CostBreakdownItem[]) => void;
}

type Draft = { name: string; value: string; color: string };
const BLANK: Draft = { name: "", value: "", color: "#F97316" };

const inp = (err?: string) =>
  `w-full bg-white/5 border ${err ? "border-red-500/60" : "border-white/10"} rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500/50 transition-all`;

export default function CostBreakdownManager({ projectId, items, lang, onSaved }: Props) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editDraft,  setEditDraft]  = useState<Draft>(BLANK);
  const [addDraft,   setAddDraft]   = useState<Draft>(BLANK);
  const [addOpen,    setAddOpen]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState<{ name?: string; value?: string }>({});

  const isAr  = lang === "ar";
  const total = items.reduce((s, i) => s + i.value, 0);

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-SA" : "en-US", { maximumFractionDigits: 0 });

  function validate(d: Draft) {
    const e: { name?: string; value?: string } = {};
    if (!d.name.trim()) e.name = isAr ? "هذا الحقل مطلوب" : "Required";
    if (!d.value || isNaN(+d.value) || +d.value <= 0) e.value = isAr ? "رقم موجب مطلوب" : "Must be a positive number";
    return e;
  }

  // ── Start edit ──────────────────────────────────────────────
  const startEdit = (i: number) => {
    setEditingIdx(i);
    setEditDraft({ name: items[i].name, value: String(items[i].value), color: items[i].color });
    setErrors({});
    setAddOpen(false);
  };

  // ── Save edit ───────────────────────────────────────────────
  const saveEdit = async () => {
    const errs = validate(editDraft);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const next = items.map((item, i) =>
        i === editingIdx
          ? { name: editDraft.name.trim(), value: parseFloat(editDraft.value), color: editDraft.color }
          : item
      );
      onSaved(await projectsService.saveCostBreakdown(projectId, next));
      setEditingIdx(null);
    } finally { setSaving(false); }
  };

  // ── Delete ──────────────────────────────────────────────────
  const deleteItem = async (i: number) => {
    onSaved(await projectsService.saveCostBreakdown(projectId, items.filter((_, idx) => idx !== i)));
    if (editingIdx === i) setEditingIdx(null);
  };

  // ── Add ─────────────────────────────────────────────────────
  const saveAdd = async () => {
    const errs = validate(addDraft);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const next = [...items, { name: addDraft.name.trim(), value: parseFloat(addDraft.value), color: addDraft.color }];
      onSaved(await projectsService.saveCostBreakdown(projectId, next));
      setAddDraft(BLANK);
      setAddOpen(false);
      setErrors({});
    } finally { setSaving(false); }
  };

  // ── Donut ───────────────────────────────────────────────────
  const DonutMini = () => {
    if (items.length === 0) return null;
    let angle = 0;
    const stops = items.map((item) => {
      const deg = (item.value / total) * 360;
      const s   = `${item.color} ${angle}deg ${angle + deg}deg`;
      angle += deg;
      return s;
    });
    return (
      <div className="w-20 h-20 rounded-full shrink-0"
        style={{ background: `conic-gradient(${stops.join(", ")})` }}>
        <div className="w-full h-full rounded-full flex items-center justify-center"
          style={{ background: "radial-gradient(circle, #0f1117 52%, transparent 52%)" }}>
          <span className="text-[9px] text-gray-500 font-mono">{items.length}</span>
        </div>
      </div>
    );
  };

  // ── Color picker ────────────────────────────────────────────
  const ColorPicker = ({ value, onChange }: { value: string; onChange: (c: string) => void }) => (
    <div className="flex flex-wrap gap-1.5">
      {COLORS.map((c) => (
        <button key={c} onClick={() => onChange(c)}
          className={`w-5 h-5 rounded-full transition-transform ${
            value === c ? "scale-125 ring-2 ring-white/50 ring-offset-1 ring-offset-[#0f1117]" : "hover:scale-110"
          }`}
          style={{ backgroundColor: c }} />
      ))}
    </div>
  );

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-bold text-white">
            {isAr ? "توزيع التكاليف" : "Cost Breakdown"}
          </h3>
          <span className="text-xs text-gray-500">({items.length})</span>
        </div>
        {!addOpen && (
          <button onClick={() => { setAddOpen(true); setEditingIdx(null); setErrors({}); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 rounded-xl text-xs font-medium transition-colors">
            <Plus className="w-3.5 h-3.5" />
            {isAr ? "إضافة بند" : "Add Item"}
          </button>
        )}
      </div>

      {/* Donut + legend */}
      {items.length > 0 && (
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/8">
          <DonutMini />
          <div className="flex-1 min-w-0 space-y-1.5">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-300 truncate">{item.name}</span>
                </div>
                <span className="text-gray-500 shrink-0">
                  {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {items.length === 0 && !addOpen && (
        <div className="py-8 text-center">
          <PieChart className="w-8 h-8 text-gray-700 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-1">{isAr ? "لا توجد بنود تكاليف" : "No cost items yet"}</p>
          <p className="text-xs text-gray-600">{isAr ? "أضف بنوداً لتتبع توزيع الميزانية" : "Add items to track budget distribution"}</p>
        </div>
      )}

      {/* Rows */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <motion.div key={`item-${i}-${item.name}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 16, height: 0 }}
              transition={{ duration: 0.18 }}
            >
              {editingIdx === i ? (
                <div className="p-3 rounded-xl border border-orange-500/30 bg-orange-500/5 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-gray-500 mb-1">{isAr ? "اسم البند" : "Item Name"}</p>
                      <input type="text" value={editDraft.name} autoFocus
                        onChange={(e) => { setEditDraft((d) => ({ ...d, name: e.target.value })); setErrors((e2) => ({ ...e2, name: undefined })); }}
                        className={inp(errors.name)} />
                      {errors.name && <p className="text-[10px] text-red-400 mt-0.5">{errors.name}</p>}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 mb-1">{isAr ? "القيمة (ر.س)" : "Value (SAR)"}</p>
                      <input type="number" dir="ltr" min={0} value={editDraft.value}
                        onChange={(e) => { setEditDraft((d) => ({ ...d, value: e.target.value })); setErrors((e2) => ({ ...e2, value: undefined })); }}
                        className={inp(errors.value)} />
                      {errors.value && <p className="text-[10px] text-red-400 mt-0.5">{errors.value}</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1.5">{isAr ? "اللون" : "Color"}</p>
                    <ColorPicker value={editDraft.color} onChange={(c) => setEditDraft((d) => ({ ...d, color: c }))} />
                  </div>
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
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] group hover:border-white/10 transition-all">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="flex-1 text-sm text-gray-200 truncate">{item.name}</span>
                  <span className="text-xs text-gray-400 font-mono shrink-0">{fmt(item.value)} {isAr ? "ر.س" : "SAR"}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(i)}
                      className="p-1.5 hover:bg-orange-500/20 text-gray-500 hover:text-orange-400 rounded-lg transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteItem(i)}
                      className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add row */}
        <AnimatePresence>
          {addOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="p-3 rounded-xl border border-orange-500/30 bg-orange-500/5 space-y-2">
              <p className="text-xs font-medium text-orange-300">{isAr ? "إضافة بند جديد" : "New Item"}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">{isAr ? "اسم البند" : "Item Name"}</p>
                  <input type="text" value={addDraft.name} autoFocus
                    placeholder={isAr ? "مثال: مواد البناء" : "e.g. Materials"}
                    onChange={(e) => { setAddDraft((d) => ({ ...d, name: e.target.value })); setErrors((e2) => ({ ...e2, name: undefined })); }}
                    className={inp(errors.name)} />
                  {errors.name && <p className="text-[10px] text-red-400 mt-0.5">{errors.name}</p>}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">{isAr ? "القيمة (ر.س)" : "Value (SAR)"}</p>
                  <input type="number" dir="ltr" min={0} value={addDraft.value}
                    onChange={(e) => { setAddDraft((d) => ({ ...d, value: e.target.value })); setErrors((e2) => ({ ...e2, value: undefined })); }}
                    className={inp(errors.value)} />
                  {errors.value && <p className="text-[10px] text-red-400 mt-0.5">{errors.value}</p>}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 mb-1.5">{isAr ? "اللون" : "Color"}</p>
                <ColorPicker value={addDraft.color} onChange={(c) => setAddDraft((d) => ({ ...d, color: c }))} />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={saveAdd} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
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

      {/* Total */}
      {items.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between">
          <span className="text-xs text-gray-500">{isAr ? "الإجمالي" : "Total"}</span>
          <span className="text-sm font-bold text-orange-400">{fmt(total)} {isAr ? "ر.س" : "SAR"}</span>
        </div>
      )}
    </GlassCard>
  );
}
