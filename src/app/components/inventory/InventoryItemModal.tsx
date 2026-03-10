// ============================================================
// InventoryItemModal.tsx — Add / Edit inventory item
// Updated: uses DatePicker component + matches ProjectModal style
// ============================================================
import { useState, useEffect }     from "react";
import { X }                       from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { tInv }  from "../../core/i18n/inventory.i18n";
import DatePicker from "../../core/shared/components/DatePicker"; // adjust path as needed
import type { InventoryItemModalProps, InventoryItemFormData } from "../../core/models/inventory.types";

const BLANK: InventoryItemFormData = {
  name:          "",
  sku:           "",
  category:      "",
  unit:          "",
  quantity:      0,
  minQuantity:   0,
  unitCost:      0,
  location:      "",
  supplier:      "",
  lastUpdated:   new Date().toISOString().split("T")[0],
  notes:         "",
};

export default function InventoryItemModal({
  lang, initial, onSave, onClose,
}: InventoryItemModalProps) {
  const isAr   = lang === "ar";
  const isEdit = !!initial;
  const dir    = isAr ? "rtl" : "ltr";

  const [form, setForm] = useState<InventoryItemFormData>(
    initial
      ? { name: initial.name, sku: initial.sku, category: initial.category,
          unit: initial.unit, quantity: initial.quantity, minQuantity: initial.minQuantity,
          unitCost: initial.unitCost, location: initial.location, supplier: initial.supplier,
          lastUpdated: initial.lastUpdated, notes: initial.notes ?? "" }
      : BLANK,
  );

  useEffect(() => {
    setForm(
      initial
        ? { name: initial.name, sku: initial.sku, category: initial.category,
            unit: initial.unit, quantity: initial.quantity, minQuantity: initial.minQuantity,
            unitCost: initial.unitCost, location: initial.location, supplier: initial.supplier,
            lastUpdated: initial.lastUpdated, notes: initial.notes ?? "" }
        : BLANK,
    );
  }, [initial]);

  const set = <K extends keyof InventoryItemFormData>(k: K, v: InventoryItemFormData[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.sku.trim()) return;
    onSave(form);
  };

  const labelCls = `block text-sm font-medium text-gray-300 mb-1.5`;
  const inputCls = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                    text-white text-sm placeholder-gray-500 focus:outline-none
                    focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30
                    transition-all`;

  const header = (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent shrink-0">
      <div dir={dir}>
        <h2 className="text-base sm:text-lg font-bold text-white">
          {tInv(lang, isEdit ? "modalEditTitle" : "modalAddTitle")}
        </h2>
        {initial && (
          <p className="text-xs text-orange-400 mt-0.5 font-mono">{initial.name}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  const formBody = (
    <div dir={dir} className="space-y-4">

      {/* Name + SKU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>{tInv(lang, "fieldName")} *</label>
          <input className={inputCls} value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={tInv(lang, "fieldName")} />
        </div>
        <div>
          <label className={labelCls}>{tInv(lang, "fieldSku")} *</label>
          <input className={`${inputCls} font-mono`} value={form.sku}
            onChange={(e) => set("sku", e.target.value.toUpperCase())}
            placeholder="STL-016" />
        </div>
      </div>

      {/* Category + Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>{tInv(lang, "fieldCategory")}</label>
          <input className={inputCls} value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder={tInv(lang, "fieldCategory")} />
        </div>
        <div>
          <label className={labelCls}>{tInv(lang, "fieldUnit")}</label>
          <input className={inputCls} value={form.unit}
            onChange={(e) => set("unit", e.target.value)}
            placeholder="طن / م³ / قطعة" />
        </div>
      </div>

      {/* Qty + Min qty + Unit cost */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>{tInv(lang, "fieldQuantity")}</label>
          <input type="number" min={0} className={inputCls} value={form.quantity}
            onChange={(e) => set("quantity", parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className={labelCls}>{tInv(lang, "fieldMinQty")}</label>
          <input type="number" min={0} className={inputCls} value={form.minQuantity}
            onChange={(e) => set("minQuantity", parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className={labelCls}>{tInv(lang, "fieldUnitCost")}</label>
          <input type="number" min={0} className={inputCls} value={form.unitCost}
            onChange={(e) => set("unitCost", parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      {/* Location + Supplier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>{tInv(lang, "fieldLocation")}</label>
          <input className={inputCls} value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder={tInv(lang, "fieldLocation")} />
        </div>
        <div>
          <label className={labelCls}>{tInv(lang, "fieldSupplier")}</label>
          <input className={inputCls} value={form.supplier}
            onChange={(e) => set("supplier", e.target.value)}
            placeholder={tInv(lang, "fieldSupplier")} />
        </div>
      </div>

      {/* Last Updated (DatePicker) + Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <DatePicker
            lang={lang}
            label={tInv(lang, "fieldLastUpdated")}
            value={form.lastUpdated}
            onChange={(v) => set("lastUpdated", v)}
          />
        </div>
        <div>
          <label className={labelCls}>{tInv(lang, "fieldNotes")}</label>
          <input className={inputCls} value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            placeholder={tInv(lang, "fieldNotes")} />
        </div>
      </div>

    </div>
  );

  const footer = (
    <div dir={dir} className="flex items-center justify-end gap-3">
      <button
        onClick={onClose}
        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10
                   text-gray-300 hover:bg-white/5 transition-colors text-sm"
      >
        {tInv(lang, "btnCancel")}
      </button>
      <button
        onClick={handleSubmit}
        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl
                   bg-gradient-to-l from-[#F97316] to-[#EA580C]
                   text-white text-sm font-medium flex items-center justify-center gap-2
                   hover:shadow-lg hover:shadow-orange-500/30 transition-all"
      >
        {tInv(lang, "btnSave")}
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="inv-modal-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />

      {/* Mobile — bottom sheet */}
      <motion.div
        key="inv-modal-mobile"
        dir={dir}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-[#0f1117] border-t border-white/10
                   rounded-t-2xl shadow-2xl max-h-[96dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#F97316] to-[#EA580C]" />
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        {header}
        <div className="overflow-y-auto flex-1 px-5 py-5">{formBody}</div>
        <div className="px-5 py-4 border-t border-white/10 shrink-0
                        pb-[max(1rem,env(safe-area-inset-bottom))]">
          {footer}
        </div>
      </motion.div>

      {/* Desktop — centered dialog */}
      <motion.div
        key="inv-modal-desktop"
        dir={dir}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{   opacity: 0, scale: 0.95, y: 20  }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="hidden sm:flex fixed inset-0 z-50 items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-2xl bg-[#0f1117] border border-white/10 rounded-2xl
                        shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] shrink-0" />
          {header}
          <div className="overflow-y-auto flex-1 px-6 py-6">{formBody}</div>
          <div className="px-6 py-4 border-t border-white/10 shrink-0">{footer}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
