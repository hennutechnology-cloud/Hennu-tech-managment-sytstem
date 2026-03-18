// ============================================================
// InvoiceSummaryCards.tsx
// ============================================================
import { TrendingUp, TrendingDown, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";
import GlassCard           from "../../core/shared/components/GlassCard";
import { tInv, formatCurrency } from "../../core/i18n/invoice.i18n";
import type { InvoiceSummaryCardsProps } from "../../core/models/invoice.types";

export default function InvoiceSummaryCards({ summary, lang }: InvoiceSummaryCardsProps) {
  const isRtl = lang === "ar";

  const cards = [
    {
      icon:       <FileText className="w-5 h-5 text-white" />,
      iconBg:     "from-orange-500 to-orange-600",
      label:      tInv(lang, "totalInvoices"),
      value:      String(summary.totalInvoices),
      sub:        null as string | null,
      valueColor: "text-white",
    },
    {
      icon:       <TrendingUp className="w-5 h-5 text-white" />,
      iconBg:     "from-emerald-500 to-emerald-600",
      label:      tInv(lang, "totalRevenues"),
      value:      formatCurrency(summary.totalRevenues, lang),
      sub:        `${tInv(lang, "totalReceivable")}: ${formatCurrency(summary.totalReceivable, lang)}`,
      valueColor: "text-emerald-400",
    },
    {
      icon:       <TrendingDown className="w-5 h-5 text-white" />,
      iconBg:     "from-red-500 to-red-600",
      label:      tInv(lang, "totalExpenses"),
      value:      formatCurrency(summary.totalExpenses, lang),
      sub:        `${tInv(lang, "totalPayable")}: ${formatCurrency(summary.totalPayable, lang)}`,
      valueColor: "text-red-400",
    },
    {
      icon:       <CheckCircle2 className="w-5 h-5 text-white" />,
      iconBg:     "from-blue-500 to-blue-600",
      label:      tInv(lang, "fullyPaid"),
      value:      String(summary.fullyPaid),
      sub:        null,
      valueColor: "text-blue-400",
    },
    {
      icon:       <Clock className="w-5 h-5 text-white" />,
      iconBg:     "from-amber-500 to-amber-600",
      label:      tInv(lang, "pendingInvoices"),
      value:      String(summary.pending + summary.partiallyPaid),
      sub:        null,
      valueColor: "text-amber-400",
    },
    {
      icon:       <AlertCircle className="w-5 h-5 text-white" />,
      iconBg:     "from-rose-500 to-rose-600",
      label:      tInv(lang, "overdueInvoices"),
      value:      String(summary.overdue),
      sub:        null,
      valueColor: "text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => (
        <GlassCard key={card.label} className="p-4">
          <div className={`flex items-center gap-2 mb-3 ${isRtl ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.iconBg} flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <p className={`text-xs text-gray-400 leading-snug ${isRtl ? "text-right" : "text-left"}`}>
              {card.label}
            </p>
          </div>
          <p className={`text-lg sm:text-xl font-bold tabular-nums leading-tight ${card.valueColor} ${isRtl ? "text-right" : "text-left"}`}>
            {card.value}
          </p>
          {card.sub && (
            <p className={`text-[10px] text-gray-500 mt-1 ${isRtl ? "text-right" : "text-left"}`}>
              {card.sub}
            </p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
