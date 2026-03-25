// ============================================================
// BOQProgressModal.tsx  — 3-page inner navigation
// ============================================================
import { useState, useEffect }     from "react";
import { motion, AnimatePresence }  from "motion/react";
import {
  X, Plus, Trash2, Building2, Users,
  ChevronDown, ChevronUp, AlertCircle,
  Edit2, Check, XCircle, TrendingUp, TrendingDown,
  ArrowLeft, ArrowRight, FileText,
} from "lucide-react";
import DatePicker          from "../../core/shared/components/DatePicker";
import SearchableDropdown  from "../../core/shared/components/SearchableDropdown"; // ← shared
import {
  tBOQMgt, formatNum, formatCurrency,
  resolveUnit, progressColor, progressTextColor,
} from "../../core/i18n/boqManagement.i18n";
import type {
  BOQProgressModalProps,
  BOQProgressFormValues,
  BOQProgressFormErrors,
  BOQProgressEntry,
  ProgressExecutorType,
} from "../../core/models/BOQManagement.types";

// ── Types & helpers ───────────────────────────────────────────
type Page = "overview" | "log" | "form";

const TODAY_ISO = new Date().toISOString().slice(0, 10) + "T00:00:00";

const emptyForm = (): BOQProgressFormValues => ({
  executorType: "own", executorName: "", subcontractorId: "",
  unitPrice: "", quantity: "", date: TODAY_ISO, notes: "",
});

const entryToForm = (e: BOQProgressEntry): BOQProgressFormValues => ({
  executorType: e.executorType, executorName: e.executorName,
  subcontractorId: e.subcontractorId ?? "",
  unitPrice: String(e.unitPrice), quantity: String(e.quantity),
  date: e.date, notes: e.notes,
});

const inp = (err: boolean) =>
  `w-full bg-white/5 border ${err ? "border-red-500/50" : "border-white/10"}
   rounded-xl px-3 py-2.5 text-white placeholder-gray-500 text-sm
   focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition-all`;

// ── Small shared sub-components ───────────────────────────────

function Field({ label, error, children }: {
  label?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-gray-400">{label}</label>}
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="w-3 h-3 shrink-0" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 42; const cx = 48; const circ = 2 * Math.PI * r;
  const color = pct >= 100 ? "#10b981" : pct >= 75 ? "#3b82f6" : pct >= 40 ? "#f97316" : "#ef4444";
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
      <motion.circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (Math.min(pct, 100) / 100) * circ }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ transform: "rotate(-90deg)", transformOrigin: "48px 48px" }} />
      <text x={cx} y={cx + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="14" fontWeight="700">{Math.min(pct, 100).toFixed(0)}%</text>
    </svg>
  );
}

function ExecutorToggle({ value, onChange, lang }: {
  value: ProgressExecutorType; onChange: (v: ProgressExecutorType) => void; lang: string;
}) {
  const isRtl = lang === "ar";
  return (
    <div className={`flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
      {(["own", "subcontract"] as ProgressExecutorType[]).map((type) => {
        const active = value === type;
        const Icon   = type === "own" ? Building2 : Users;
        return (
          <button key={type} type="button" onClick={() => onChange(type)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                         transition-all border ${active
                           ? "bg-orange-500/15 border-orange-500/40 text-orange-300"
                           : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                         } ${isRtl ? "flex-row-reverse" : ""}`}>
            <Icon className="w-4 h-4 shrink-0" />
            {type === "own" ? tBOQMgt(lang as any, "executorOwn") : tBOQMgt(lang as any, "executorSub")}
          </button>
        );
      })}
    </div>
  );
}

function CostComparison({ estimatedCost, executionCost, lang }: {
  estimatedCost: number; executionCost: number; lang: string;
}) {
  const isRtl = lang === "ar";
  const diff  = executionCost - estimatedCost;
  const pct   = estimatedCost > 0 ? (diff / estimatedCost) * 100 : 0;
  const over  = diff > 0; const equal = diff === 0;
  const color = equal ? "text-gray-400" : over ? "text-red-400" : "text-emerald-400";
  const bg    = equal ? "bg-white/5 border-white/10" : over ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20";
  const Icon  = over ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {tBOQMgt(lang as any, "costCompTitle")}
        </p>
      </div>
      <div className="divide-y divide-white/6">
        {[
          { label: tBOQMgt(lang as any, "costEstimated"), value: formatCurrency(estimatedCost, lang as any), tc: "text-blue-400"   },
          { label: tBOQMgt(lang as any, "costExecution"), value: formatCurrency(executionCost, lang as any), tc: "text-orange-400" },
        ].map((r) => (
          <div key={r.label} className={`flex items-center justify-between px-4 py-3 ${isRtl ? "flex-row-reverse" : ""}`}>
            <span className="text-xs text-gray-400">{r.label}</span>
            <span className={`text-sm font-bold ${r.tc}`}>{r.value}</span>
          </div>
        ))}
        <div className={`flex items-center justify-between px-4 py-3 ${isRtl ? "flex-row-reverse" : ""}`}>
          <span className="text-xs text-gray-400">{tBOQMgt(lang as any, "costDifference")}</span>
          <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
            <span className={`text-sm font-bold ${color}`}>{over ? "+" : ""}{formatCurrency(diff, lang as any)}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${color} ${bg}`}>
              {!equal && <Icon className="w-3 h-3" />}
              {equal ? "0%" : `${over ? "+" : ""}${pct.toFixed(1)}%`}
            </span>
          </div>
        </div>
      </div>
      <div
        className={`px-4 py-2 border-t border-white/10 flex items-center justify-center gap-2 ${color} ${bg}`}
        style={{ background: over ? "rgba(239,68,68,0.05)" : equal ? "rgba(255,255,255,0.02)" : "rgba(16,185,129,0.05)" }}
      >
        {!equal && <Icon className="w-3.5 h-3.5" />}
        <span className="text-xs font-semibold">
          {equal ? tBOQMgt(lang as any, "costOnTrack") : over ? tBOQMgt(lang as any, "costOver") : tBOQMgt(lang as any, "costUnder")}
        </span>
      </div>
    </div>
  );
}

function EntryRow({ entry, onEdit, onDelete, lang, unit }: {
  entry: BOQProgressEntry; onEdit: (e: BOQProgressEntry) => void;
  onDelete: (id: string) => void; lang: string; unit: string;
}) {
  const isRtl     = lang === "ar";
  const [exp, setExp] = useState(false);
  const Icon      = entry.executorType === "own" ? Building2 : Users;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-white/5 transition-colors ${isRtl ? "flex-row-reverse" : ""}`}
        onClick={() => setExp(v => !v)}
      >
        <div className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium
                          ${entry.executorType === "own"
                            ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                            : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                          } ${isRtl ? "flex-row-reverse" : ""}`}>
          <Icon className="w-3 h-3" />
          {entry.executorType === "own" ? tBOQMgt(lang as any, "executorOwn") : tBOQMgt(lang as any, "executorSub")}
        </div>
        <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : "text-left"}`}>
          <p className="text-sm text-white font-medium truncate">{entry.executorName}</p>
          <p className="text-xs text-gray-500">{entry.date.split("T")[0]}</p>
        </div>
        <div className={`shrink-0 ${isRtl ? "text-left" : "text-right"}`}>
          <p className="text-sm font-semibold text-white">
            {formatNum(entry.quantity, lang as any)}{" "}
            <span className="text-gray-500 text-xs">{unit}</span>
          </p>
          <p className="text-xs text-orange-400">{formatCurrency(entry.totalCost, lang as any)}</p>
        </div>
        <span className="text-gray-500 shrink-0">
          {exp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </div>
      <AnimatePresence>
        {exp && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-2 border-t border-white/8 space-y-3">
              <div className={`flex items-center justify-between text-xs text-gray-400 ${isRtl ? "flex-row-reverse" : ""}`}>
                <span>{tBOQMgt(lang as any, "progFieldUnitPrice")}</span>
                <span className="text-white">{formatCurrency(entry.unitPrice, lang as any)} / {unit}</span>
              </div>
              {entry.notes && (
                <p className={`text-xs text-gray-400 italic ${isRtl ? "text-right" : ""}`}>{entry.notes}</p>
              )}
              <div className={`flex gap-2 ${isRtl ? "justify-start flex-row-reverse" : "justify-end"}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(entry); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />{tBOQMgt(lang as any, "progEditEntry")}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />{tBOQMgt(lang as any, "progDeleteEntry")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────
export default function BOQProgressModal({
  isOpen, item, progress, subcontractors,
  onClose, onAddEntry, onUpdateEntry, onDeleteEntry, lang,
}: BOQProgressModalProps) {
  const isRtl = lang === "ar";

  const [page,      setPage]      = useState<Page>("overview");
  const [direction, setDirection] = useState(1);
  const [form,      setForm]      = useState<BOQProgressFormValues>(emptyForm());
  const [errors,    setErrors]    = useState<BOQProgressFormErrors>({});
  const [saving,    setSaving]    = useState(false);
  const [editId,    setEditId]    = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPage("overview"); setDirection(1);
      setForm(emptyForm()); setErrors({}); setEditId(null);
    }
  }, [isOpen, item]);

  if (!item) return null;

  const unitLabel = resolveUnit(lang, item.unit);
  const pct       = progress?.percentComplete ?? 0;
  const processed = progress?.totalProcessed  ?? 0;
  const remaining = progress?.remaining        ?? item.quantity;
  const execCost  = progress?.totalCost        ?? 0;
  const entries   = progress?.entries          ?? [];
  const isEdit    = !!editId;

  const goTo = (p: Page, dir: number) => { setDirection(dir); setPage(p); };

  // ── Validation (unchanged) ────────────────────────────────
  const validate = () => {
    const e: BOQProgressFormErrors = {};
    if (form.executorType === "own") {
      if (!form.executorName.trim()) e.executorName = tBOQMgt(lang, "errExecNameReq");
    } else {
      if (!form.subcontractorId) e.subcontractorId = tBOQMgt(lang, "errSubReq");
    }
    const qty = parseFloat(form.quantity);
    if (!form.quantity.trim())       e.quantity = tBOQMgt(lang, "errProgQtyReq");
    else if (isNaN(qty) || qty <= 0) e.quantity = tBOQMgt(lang, "errProgQtyInvalid");
    else {
      const orig = isEdit ? (entries.find(en => en.id === editId)?.quantity ?? 0) : 0;
      if (qty > remaining + orig)    e.quantity = tBOQMgt(lang, "errProgQtyExceeds");
    }
    const price = parseFloat(form.unitPrice);
    if (!form.unitPrice.trim())          e.unitPrice = tBOQMgt(lang, "errProgPriceReq");
    else if (isNaN(price) || price <= 0) e.unitPrice = tBOQMgt(lang, "errProgPriceInvalid");
    if (!form.date) e.date = tBOQMgt(lang, "errProgDateReq");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const sf = (k: keyof BOQProgressFormValues, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k as keyof BOQProgressFormErrors])
      setErrors(p => ({ ...p, [k]: undefined }));
  };

  const setExType = (v: ProgressExecutorType) => {
    setForm(f => ({ ...f, executorType: v, executorName: "", subcontractorId: "" }));
    setErrors(p => ({ ...p, executorName: undefined, subcontractorId: undefined }));
  };

  // ── This is the ONLY logic bridge needed ─────────────────
  // The shared SearchableDropdown calls onChange(id, label).
  // We map that directly into the same two form fields that
  // the old SubcontractorDropdown called setSub(id, name) for.
  const handleSubChange = (id: string, name: string) => {
    setForm(f => ({ ...f, subcontractorId: id, executorName: name }));
    setErrors(p => ({ ...p, subcontractorId: undefined }));
  };

  // ── Build option list for the dropdown ───────────────────
  // Mapped once per render from the same `subcontractors` prop
  // that was passed to the old SubcontractorDropdown.
  const subOptions = subcontractors.map(s => ({
    id:    s.id,
    label: s.name,
    sub:   s.specialty,
    icon:  <Users className="w-3.5 h-3.5" />,
  }));

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      isEdit && editId
        ? await onUpdateEntry(item.id, editId, form)
        : await onAddEntry(item.id, form);
      setForm(emptyForm()); setEditId(null); goTo("log", -1);
    } finally { setSaving(false); }
  };

  const openEdit = (entry: BOQProgressEntry) => {
    setEditId(entry.id); setForm(entryToForm(entry)); setErrors({}); goTo("form", 1);
  };

  const liveCost = (parseFloat(form.quantity) || 0) * (parseFloat(form.unitPrice) || 0);

  const pages: Page[] = ["overview", "log", "form"];
  const pageTitle: Record<Page, string> = {
    overview: tBOQMgt(lang, "progressTitle"),
    log:      tBOQMgt(lang, "progressEntries"),
    form:     isEdit ? tBOQMgt(lang, "progEditEntry") : tBOQMgt(lang, "progressAddEntry"),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />

          <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center sm:p-4 pointer-events-none">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              dir={isRtl ? "rtl" : "ltr"}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto
                         w-full sm:max-w-xl
                         flex flex-col
                         bg-[#0d0f18]
                         border border-white/10
                         rounded-t-2xl sm:rounded-2xl
                         shadow-2xl shadow-black/70
                         max-h-[90dvh] sm:h-[82dvh]"
              style={{ borderTopColor: "rgba(249,115,22,0.35)" }}
            >
              {/* Mobile drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/25" />
              </div>

              {/* ── HEADER ── */}
              <div className={`flex items-center gap-3 px-5 py-4 sm:px-6
                               border-b border-white/10 shrink-0
                               bg-gradient-to-r from-orange-500/8 to-transparent
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                <AnimatePresence mode="popLayout">
                  {page !== "overview" && (
                    <motion.button key="back"
                      initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }} transition={{ duration: 0.15 }}
                      onClick={() => {
                        if (page === "form") {
                          if (isEdit) { setEditId(null); setForm(emptyForm()); setErrors({}); }
                          goTo("log", -1);
                        } else {
                          goTo("overview", -1);
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white shrink-0">
                      {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    </motion.button>
                  )}
                </AnimatePresence>

                <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : "text-left"}`}>
                  <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {pageTitle[page]}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    <span dir="ltr" className="font-mono text-orange-400/80">{item.code}</span>
                    <span className="mx-2 text-white/20">·</span>
                    {item.description}
                  </p>
                </div>

                <div className={`flex items-center gap-1.5 shrink-0 ${isRtl ? "flex-row-reverse" : ""}`}>
                  {pages.map((p) => (
                    <div key={p} className={`rounded-full transition-all duration-300
                                             ${page === p ? "w-5 h-1.5 bg-orange-500" : "w-1.5 h-1.5 bg-white/20"}`} />
                  ))}
                </div>

                <button onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white shrink-0">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* ── PAGE BODY ── */}
              <div className="flex-1 min-h-0 relative">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={page}
                    custom={direction}
                    variants={{
                      enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
                      center: { opacity: 1, x: 0 },
                      exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
                    }}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute inset-0 overflow-y-auto"
                  >

                    {/* ══════════ PAGE 1 — OVERVIEW ══════════ */}
                    {page === "overview" && (
                      <div className="px-5 py-6 sm:px-6 space-y-6">
                        <div className={`flex items-center gap-5 ${isRtl ? "flex-row-reverse" : ""}`}>
                          <ProgressRing pct={pct} />
                          <div className="flex-1 grid grid-cols-2 gap-2.5">
                            {[
                              { label: tBOQMgt(lang, "progressTotalQty"), value: formatNum(item.quantity, lang), unit: unitLabel, color: "text-white"       },
                              { label: tBOQMgt(lang, "progressDone"),      value: formatNum(processed, lang),     unit: unitLabel, color: "text-orange-400"  },
                              { label: tBOQMgt(lang, "progressRemaining"), value: formatNum(remaining, lang),     unit: unitLabel, color: "text-blue-400"    },
                              { label: tBOQMgt(lang, "progressTotalCost"), value: formatCurrency(execCost, lang), unit: "",        color: "text-emerald-400" },
                            ].map((s) => (
                              <div key={s.label} className="bg-white/[0.04] rounded-xl px-3 py-3 border border-white/8">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                                <p className={`text-sm font-bold leading-tight ${s.color}`}>
                                  {s.value}
                                  {s.unit && <span className="text-gray-500 text-xs font-normal ml-1">{s.unit}</span>}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className={`flex items-center justify-between text-xs mb-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                            <span className="text-gray-400">{tBOQMgt(lang, "progressPercent")}</span>
                            <span className={`font-bold ${progressTextColor(pct)}`}>{Math.min(pct, 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div className={`h-full rounded-full ${progressColor(pct)}`}
                              initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }}
                              transition={{ duration: 0.9, ease: "easeOut" }} />
                          </div>
                        </div>

                        <CostComparison estimatedCost={item.totalCost} executionCost={execCost} lang={lang} />

                        {entries.length > 0 && (() => {
                          const map: Record<string, { qty: number; type: ProgressExecutorType }> = {};
                          entries.forEach(e => {
                            const k = `${e.executorType}:${e.executorName}`;
                            if (!map[k]) map[k] = { qty: 0, type: e.executorType };
                            map[k].qty += e.quantity;
                          });
                          return (
                            <div className="rounded-xl border border-white/10 overflow-hidden">
                              <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/10">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                  {tBOQMgt(lang, "progressEntries")}
                                </p>
                              </div>
                              {Object.entries(map).map(([k, v]) => {
                                const [, name] = k.split(":");
                                const BIcon    = v.type === "own" ? Building2 : Users;
                                const bp       = item.quantity > 0 ? (v.qty / item.quantity) * 100 : 0;
                                return (
                                  <div key={k} className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 ${isRtl ? "flex-row-reverse" : ""}`}>
                                    <BIcon className={`w-4 h-4 shrink-0 ${v.type === "own" ? "text-blue-400" : "text-purple-400"}`} />
                                    <div className="flex-1 min-w-0">
                                      <div className={`flex items-center justify-between mb-1 ${isRtl ? "flex-row-reverse" : ""}`}>
                                        <span className="text-xs text-white truncate">{name}</span>
                                        <span className="text-xs text-gray-400 ml-2 shrink-0">{formatNum(v.qty, lang)} {unitLabel}</span>
                                      </div>
                                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${v.type === "own" ? "bg-blue-500" : "bg-purple-500"}`}
                                          style={{ width: `${Math.min(bp, 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}

                        <div className="h-2" />
                      </div>
                    )}

                    {/* ══════════ PAGE 2 — LOG ══════════ */}
                    {page === "log" && (
                      <div className="px-5 py-5 sm:px-6 space-y-3">
                        {entries.length === 0 ? (
                          <div className="flex flex-col items-center justify-center gap-3 h-64">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-500">{tBOQMgt(lang, "progressNoEntries")}</p>
                          </div>
                        ) : (
                          entries.map(entry => (
                            <EntryRow key={entry.id} entry={entry}
                              onEdit={openEdit}
                              onDelete={(id) => onDeleteEntry(item.id, id)}
                              lang={lang} unit={unitLabel} />
                          ))
                        )}
                        <div className="h-2" />
                      </div>
                    )}

                    {/* ══════════ PAGE 3 — FORM ══════════ */}
                    {page === "form" && (
                      <div className="px-5 py-5 sm:px-6 space-y-5">

                        {isEdit && (
                          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/8 border border-blue-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
                            <Edit2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <p className="text-xs text-blue-300 flex-1">{tBOQMgt(lang, "progEditEntry")}</p>
                            <button
                              onClick={() => { setEditId(null); setForm(emptyForm()); setErrors({}); }}
                              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-0.5" />{tBOQMgt(lang, "progCancelEdit")}
                            </button>
                          </div>
                        )}

                        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-500/8 border border-orange-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
                          <p className="text-xs text-orange-300">
                            {tBOQMgt(lang, "progressRemaining")}:{" "}
                            <span className="font-bold">{formatNum(remaining, lang)} {unitLabel}</span>
                          </p>
                        </div>

                        <Field>
                          <ExecutorToggle value={form.executorType} onChange={setExType} lang={lang} />
                        </Field>

                        {form.executorType === "own" ? (
                          <Field label={tBOQMgt(lang, "executorNameLabel")} error={errors.executorName}>
                            <input type="text" value={form.executorName}
                              onChange={e => sf("executorName", e.target.value)}
                              placeholder={tBOQMgt(lang, "executorNamePH")}
                              className={inp(!!errors.executorName)} />
                          </Field>
                        ) : (
                          // ── REPLACED: SubcontractorDropdown → SearchableDropdown ──
                          // Props mapping:
                          //   subcontractors → options (mapped to DropdownOption[])
                          //   value          → value   (subcontractorId, unchanged)
                          //   onChange(id,name) stays identical via handleSubChange
                          //   error          → error   (unchanged)
                          //   lang           → lang    (unchanged)
                          <Field label={tBOQMgt(lang, "subcontractorLabel")} error={errors.subcontractorId}>
                            <SearchableDropdown
                              options={subOptions}
                              value={form.subcontractorId}
                              onChange={handleSubChange}
                              placeholder={tBOQMgt(lang as any, "subcontractorPH")}
                              searchPlaceholder={tBOQMgt(lang as any, "subcontractorPH")}
                              emptyText={tBOQMgt(lang as any, "noSubcontractors")}
                              error={errors.subcontractorId}
                              lang={lang}
                              accentColor="violet"
                            />
                          </Field>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <Field label={tBOQMgt(lang, "progFieldQty")} error={errors.quantity}>
                            <input type="number" dir="ltr" min="0" step="any" value={form.quantity}
                              onChange={e => sf("quantity", e.target.value)} placeholder="0"
                              className={inp(!!errors.quantity)} />
                          </Field>
                          <Field label={tBOQMgt(lang, "progFieldUnitPrice")} error={errors.unitPrice}>
                            <input type="number" dir="ltr" min="0" step="any" value={form.unitPrice}
                              onChange={e => sf("unitPrice", e.target.value)} placeholder="0"
                              className={inp(!!errors.unitPrice)} />
                          </Field>
                        </div>

                        <AnimatePresence>
                          {liveCost > 0 && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 ${isRtl ? "flex-row-reverse" : ""}`}>
                              <span className="text-xs text-gray-400">{tBOQMgt(lang, "progressTotalCost")}</span>
                              <span className="text-sm font-bold text-emerald-400">{formatCurrency(liveCost, lang)}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Field label={tBOQMgt(lang, "progFieldDate")} error={errors.date}>
                          <DatePicker value={form.date} onChange={v => sf("date", v)}
                            lang={lang as any} error={errors.date} />
                        </Field>

                        <Field label={tBOQMgt(lang, "progFieldNotes")}>
                          <textarea rows={3} value={form.notes}
                            onChange={e => sf("notes", e.target.value)}
                            placeholder={tBOQMgt(lang, "progFieldNotesPH")}
                            className={inp(false) + " resize-none"} />
                        </Field>

                        <div className="h-2" />
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── FOOTER ── */}
              <div className={`shrink-0 px-5 py-4 sm:px-6 border-t border-white/10 bg-[#0d0f18]
                               flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>

                {page === "overview" && <>
                  <button onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm shrink-0">
                    {tBOQMgt(lang, "cancel")}
                  </button>
                  <button onClick={() => goTo("log", 1)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/8 border border-white/15 text-gray-200 text-sm font-medium hover:bg-white/12 transition-all ${isRtl ? "flex-row-reverse" : ""}`}>
                    <FileText className="w-4 h-4" />
                    {tBOQMgt(lang, "progressEntries")}
                    <span className="text-xs text-gray-500 bg-white/10 px-1.5 py-0.5 rounded-full">{entries.length}</span>
                  </button>
                  <button onClick={() => { setEditId(null); setForm(emptyForm()); setErrors({}); goTo("form", 1); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-l from-orange-500 to-orange-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all ${isRtl ? "flex-row-reverse" : ""}`}>
                    <Plus className="w-4 h-4" />{tBOQMgt(lang, "progressAddEntry")}
                  </button>
                </>}

                {page === "log" && <>
                  <button onClick={() => goTo("overview", -1)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm shrink-0 ${isRtl ? "flex-row-reverse" : ""}`}>
                    {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    {tBOQMgt(lang, "progressOverview")}
                  </button>
                  <button onClick={() => { setEditId(null); setForm(emptyForm()); setErrors({}); goTo("form", 1); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-l from-orange-500 to-orange-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all ${isRtl ? "flex-row-reverse" : ""}`}>
                    <Plus className="w-4 h-4" />{tBOQMgt(lang, "progressAddEntry")}
                  </button>
                </>}

                {page === "form" && <>
                  <button
                    onClick={() => {
                      if (isEdit) { setEditId(null); setForm(emptyForm()); setErrors({}); }
                      goTo("log", -1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm shrink-0 ${isRtl ? "flex-row-reverse" : ""}`}>
                    {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    {tBOQMgt(lang, "cancel")}
                  </button>
                  <button onClick={handleSubmit} disabled={saving}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-l from-orange-500 to-orange-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isRtl ? "flex-row-reverse" : ""}`}>
                    {saving
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : isEdit ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />
                    }
                    <span>
                      {saving
                        ? tBOQMgt(lang, "progSaving")
                        : isEdit
                        ? tBOQMgt(lang, "progUpdateEntry")
                        : tBOQMgt(lang, "progSaveEntry")}
                    </span>
                  </button>
                </>}

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
