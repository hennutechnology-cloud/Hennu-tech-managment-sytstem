// ============================================================
// MovementModal.tsx — Record a stock movement for an item
// ============================================================
import { useState }            from "react";
import { X, ArrowLeftRight }   from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { tInv, MOVEMENT_STYLES, movementLabel } from "../../core/i18n/inventory.i18n";
import { formatNum } from "../../core/i18n/dashboard.i18n";
import type { MovementModalProps, MovementType } from "../../core/models/inventory.types";

const TYPES: MovementType[] = ["in", "out", "adjustment"];

export default function MovementModal({ lang, item, onSave, onClose }: MovementModalProps) {
  const isAr = lang === "ar";
  const [type,      setType]      = useState<MovementType>("in");
  const [qty,       setQty]       = useState(1);
  const [reference, setReference] = useState("");
  const [notes,     setNotes]     = useState("");

  const handleSubmit = () => {
    if (qty <= 0) return;
    onSave(type, qty, reference, notes);
  };

  const inputCls = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                    text-white text-sm placeholder-gray-600 focus:outline-none
                    focus:border-orange-500/50 focus:bg-white/8 transition-colors
                    ${isAr ? "text-right" : "text-left"}`;
  const labelCls = `block text-xs sm:text-sm text-gray-400 mb-1 ${isAr ? "text-right" : "text-left"}`;

  return (
    <AnimatePresence>
      <motion.div
        key="mv-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      <motion.div
        key="mv-panel"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{   opacity: 0, scale: 0.95, y: 20  }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        dir={isAr ? "rtl" : "ltr"}
        className="fixed inset-0 z-[51] flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-md bg-gradient-to-b from-[#0F172A] to-[#1A2236]
                        border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

          {/* Title bar */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-emerald-400 shrink-0" />
              <h2 className="text-base font-bold text-white">{tInv(lang, "modalMoveTitle")}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Item info */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{item.sku}</p>
              <p className="text-xs text-gray-400 mt-1">
                {tInv(lang, "currentStock")}{" "}
                <span className="text-white font-semibold">
                  {formatNum(item.quantity, lang)} {item.unit}
                </span>
              </p>
            </div>

            {/* Movement type selector */}
            <div>
              <label className={labelCls}>{tInv(lang, "moveType")}</label>
              <div className="flex gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all
                                ${type === t ? MOVEMENT_STYLES[t] : "border-white/10 text-gray-400 hover:bg-white/5"}`}
                  >
                    {movementLabel(lang, t)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className={labelCls}>{tInv(lang, "moveQty")}</label>
              <input type="number" min={1} className={inputCls} value={qty}
                onChange={(e) => setQty(parseFloat(e.target.value) || 1)} />
            </div>

            {/* Reference */}
            <div>
              <label className={labelCls}>{tInv(lang, "moveRef")}</label>
              <input className={`${inputCls} font-mono`} value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="PO-2026-001" />
            </div>

            {/* Notes */}
            <div>
              <label className={labelCls}>{tInv(lang, "moveNotes")}</label>
              <input className={inputCls} value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={tInv(lang, "moveNotes")} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/10">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300
                         hover:bg-white/5 transition-colors text-sm">
              {tInv(lang, "btnCancel")}
            </button>
            <button onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C]
                         text-white hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm font-medium">
              {tInv(lang, "btnSave")}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
