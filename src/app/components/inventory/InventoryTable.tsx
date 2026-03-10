// ============================================================
// InventoryTable.tsx
// ============================================================
import { useState, useMemo } from "react";
import { Search, Pencil, Trash2, ArrowLeftRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import {
  tInv,
  STOCK_STATUS_STYLES,
  stockStatusLabel,
} from "../../core/i18n/inventory.i18n";
import { formatNum } from "../../core/i18n/dashboard.i18n";
import type { InventoryTableProps, StockStatus } from "../../core/models/inventory.types";

type StatusFilter = StockStatus | "all";

export default function InventoryTable({ items, lang, onEdit, onDelete, onMove }: InventoryTableProps) {
  const isAr = lang === "ar";
  const [search,         setSearch]         = useState("");
  const [statusFilter,   setStatusFilter]   = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Derive unique categories
  const categories = useMemo(
    () => ["all", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );

  // Filter logic
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((item) => {
      const matchSearch   = !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      const matchStatus   = statusFilter   === "all" || item.status   === statusFilter;
      const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [items, search, statusFilter, categoryFilter]);

  const selectCls = `bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300
                     focus:outline-none focus:border-orange-500/50 transition-colors
                     ${isAr ? "text-right" : "text-left"}`;

  const statusOptions: { value: StatusFilter; labelKey: "filterAll" | "filterInStock" | "filterLow" | "filterOut" }[] = [
    { value: "all",          labelKey: "filterAll"     },
    { value: "in_stock",     labelKey: "filterInStock" },
    { value: "low_stock",    labelKey: "filterLow"     },
    { value: "out_of_stock", labelKey: "filterOut"     },
  ];

  return (
    <GlassCard className="overflow-hidden">
      {/* ── Header + filters ── */}
      <div className="p-5 sm:p-6 border-b border-white/10 space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          {tInv(lang, "tableItemsTitle")}
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500
                               ${isAr ? "right-3" : "left-3"}`} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tInv(lang, "searchPlaceholder")}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm
                          text-white placeholder-gray-600 focus:outline-none
                          focus:border-orange-500/50 transition-colors
                          ${isAr ? "pr-9 pl-4 text-right" : "pl-9 pr-4 text-left"}`}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className={selectCls}
            dir={isAr ? "rtl" : "ltr"}
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{tInv(lang, o.labelKey)}</option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={selectCls}
            dir={isAr ? "rtl" : "ltr"}
          >
            <option value="all">{tInv(lang, "allCategories")}</option>
            {categories.filter((c) => c !== "all").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]" dir={isAr ? "rtl" : "ltr"}>
          <thead>
            <tr className="border-b border-white/10">
              {(["colName","colCategory","colQuantity","colUnitCost","colTotalValue","colLocation","colStatus","colActions"] as const).map((k) => (
                <th
                  key={k}
                  className={`px-4 sm:px-5 py-3 text-xs font-semibold text-gray-400 whitespace-nowrap
                              ${isAr ? "text-right" : "text-left"}`}
                >
                  {tInv(lang, k)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm">
                    {tInv(lang, "noItems")}
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {/* Name + SKU */}
                    <td className="px-4 sm:px-5 py-3">
                      <p className="text-white text-sm font-semibold leading-tight">{item.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 font-mono">{item.sku}</p>
                    </td>

                    {/* Category */}
                    <td className="px-4 sm:px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-gray-300 whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-4 sm:px-5 py-3">
                      <p className="text-white text-sm font-semibold">
                        {formatNum(item.quantity, lang)}{" "}
                        <span className="text-gray-400 text-xs">{item.unit}</span>
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {tInv(lang, "minQtyLabel")} {item.minQuantity}
                      </p>
                    </td>

                    {/* Unit cost */}
                    <td className="px-4 sm:px-5 py-3 text-gray-300 text-sm whitespace-nowrap">
                      {formatNum(item.unitCost, lang)} {tInv(lang, "currency")}
                    </td>

                    {/* Total value */}
                    <td className="px-4 sm:px-5 py-3 text-white text-sm font-semibold whitespace-nowrap">
                      {formatNum(item.totalValue, lang)} {tInv(lang, "currency")}
                    </td>

                    {/* Location */}
                    <td className="px-4 sm:px-5 py-3 text-gray-300 text-sm whitespace-nowrap">
                      {item.location}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 sm:px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap
                                       ${STOCK_STATUS_STYLES[item.status]}`}>
                        {stockStatusLabel(lang, item.status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 sm:px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onMove(item)}
                          title={tInv(lang, "btnMove")}
                          className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-400
                                     hover:text-emerald-300 transition-colors"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          title={tInv(lang, "btnEdit")}
                          className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400
                                     hover:text-blue-300 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          title={tInv(lang, "btnDelete")}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400
                                     hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
