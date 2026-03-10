// ============================================================
// SupplierModal.tsx — Add / Edit supplier
// ============================================================
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { tPro }   from "../../core/i18n/procurement.i18n";
import { tUtil }  from "../../core/i18n/util.i18n";
import type { SupplierModalProps, SupplierFormData } from "../../core/models/procurement.types";

const BLANK: SupplierFormData = {
  name:              "",
  category:          "",
  avgPrice:          0,
  deliveryTime:      0,
  performanceRating: 0,
  onTimeDelivery:    0,
  aiScore:           0,
  totalOrders:       0,
};

export default function SupplierModal({ lang, initial, onSave, onClose }: SupplierModalProps) {
  const isAr    = lang === "ar";
  const isEdit  = !!initial;
  const [form, setForm] = useState<SupplierFormData>(initial ? { ...initial } : BLANK);

  // Sync when `initial` changes (e.g. switching between edit targets)
  useEffect(() => {
    setForm(initial ? { ...initial } : BLANK);
  }, [initial]);

  const set = (field: keyof SupplierFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.category.trim()) return;
    onSave(form);
  };

  const numFields: { key: keyof SupplierFormData; labelKey: "fieldAvgPrice" | "fieldDeliveryTime" | "fieldRating" | "fieldOnTime" | "fieldAiScore" | "fieldTotalOrders" }[] = [
    { key: "avgPrice",          labelKey: "fieldAvgPrice"     },
    { key: "deliveryTime",      labelKey: "fieldDeliveryTime" },
    { key: "performanceRating", labelKey: "fieldRating"       },
    { key: "onTimeDelivery",    labelKey: "fieldOnTime"       },
    { key: "aiScore",           labelKey: "fieldAiScore"      },
    { key: "totalOrders",       labelKey: "fieldTotalOrders"  },
  ];

  const labelCls = `block text-xs sm:text-sm text-gray-400 mb-1 ${isAr ? "text-right" : "text-left"}`;
  const inputCls = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                    text-white text-sm placeholder-gray-600 focus:outline-none
                    focus:border-orange-500/50 focus:bg-white/8 transition-colors
                    ${isAr ? "text-right" : "text-left"}`;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Panel */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{   opacity: 0, scale: 0.95, y: 20  }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        dir={isAr ? "rtl" : "ltr"}
        className="fixed inset-0 z-[51] flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-lg bg-gradient-to-b from-[#0F172A] to-[#1A2236]
                        border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

          {/* Title bar */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10">
            <h2 className="text-base sm:text-lg font-bold text-white">
              {tPro(lang, isEdit ? "modalEditTitle" : "modalAddTitle")}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Form body */}
          <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            {/* Name */}
            <div>
              <label className={labelCls}>{tPro(lang, "fieldName")}</label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder={tPro(lang, "fieldName")}
              />
            </div>

            {/* Category */}
            <div>
              <label className={labelCls}>{tPro(lang, "fieldCategory")}</label>
              <input
                className={inputCls}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder={tPro(lang, "fieldCategory")}
              />
            </div>

            {/* Numeric fields — 2-column grid */}
            <div className="grid grid-cols-2 gap-4">
              {numFields.map(({ key, labelKey }) => (
                <div key={key}>
                  <label className={labelCls}>{tPro(lang, labelKey)}</label>
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    value={form[key] as number}
                    onChange={(e) => set(key, parseFloat(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300
                         hover:bg-white/5 transition-colors text-sm"
            >
              {tPro(lang, "btnCancel")}
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C]
                         text-white hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm font-medium"
            >
              {tPro(lang, "btnSave")}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
