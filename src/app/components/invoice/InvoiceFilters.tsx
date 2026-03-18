// ============================================================
// InvoiceFilters.tsx
// ============================================================
import { Search, X }  from "lucide-react";
import GlassCard       from "../../core/shared/components/GlassCard";
import { tInv }        from "../../core/i18n/invoice.i18n";
import type { InvoiceFiltersProps, InvoiceStatus, InvoiceAccountType } from "../../core/models/invoice.types";

export default function InvoiceFilters({
  search, onSearch,
  statusFilter, onStatus,
  typeFilter, onType,
  lang,
}: InvoiceFiltersProps) {
  const isRtl = lang === "ar";

  const statusOptions: { value: InvoiceStatus | "all"; label: string }[] = [
    { value: "all",     label: tInv(lang, "statusAll")     },
    { value: "paid",    label: tInv(lang, "statusPaid")    },
    { value: "partial", label: tInv(lang, "statusPartial") },
    { value: "pending", label: tInv(lang, "statusPending") },
    { value: "overdue", label: tInv(lang, "statusOverdue") },
  ];

  const typeOptions: { value: InvoiceAccountType | "all"; label: string }[] = [
    { value: "all",     label: tInv(lang, "filterAll")     },
    { value: "revenue", label: tInv(lang, "filterRevenue") },
    { value: "expense", label: tInv(lang, "filterExpense") },
  ];

  const statusColors: Record<string, string> = {
    all:     "bg-white/8 border-white/15 text-gray-200",
    paid:    "bg-emerald-500/15 border-emerald-500/35 text-emerald-300",
    partial: "bg-blue-500/15 border-blue-500/35 text-blue-300",
    pending: "bg-amber-500/15 border-amber-500/35 text-amber-300",
    overdue: "bg-red-500/15 border-red-500/35 text-red-300",
  };

  return (
    <GlassCard className="p-4">
      <div className={`flex flex-col gap-3 ${isRtl ? "items-end" : "items-start"}`}>

        {/* Search bar */}
        <div className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl
                          bg-white/5 border border-white/10 focus-within:border-orange-500/50 transition-colors
                          ${isRtl ? "flex-row-reverse" : ""}`}>
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text" dir={isRtl ? "rtl" : "ltr"}
            value={search} onChange={(e) => onSearch(e.target.value)}
            placeholder={tInv(lang, "searchPH")}
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500 min-w-0"
          />
          {search && (
            <button onClick={() => onSearch("")} className="text-gray-500 hover:text-white transition-colors shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status pills */}
        <div className={`flex flex-wrap gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatus(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border
                           ${statusFilter === opt.value
                             ? statusColors[opt.value]
                             : "bg-white/[0.04] border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/8"
                           }`}
            >
              {opt.label}
            </button>
          ))}

          <div className="w-px h-6 bg-white/10 self-center mx-1" />

          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onType(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border
                           ${typeFilter === opt.value
                             ? opt.value === "revenue"
                               ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-300"
                               : opt.value === "expense"
                               ? "bg-red-500/15 border-red-500/35 text-red-300"
                               : "bg-white/8 border-white/15 text-gray-200"
                             : "bg-white/[0.04] border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/8"
                           }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
