// ============================================================
// ContractCard.tsx — Mobile card view of a single contract
// ============================================================
import { motion }    from "motion/react";
import { Eye, AlertTriangle } from "lucide-react";
import {
  tContract, resolveContractStatusBadge, formatContractDate, dirAttr,
} from "../../core/i18n/contracts.i18n";
import { formatNum } from "../../core/i18n/projects.i18n";
import type { ContractCardProps } from "../../core/models/contracts.types";

export default function ContractCard({
  contract, lang, selected, onSelect, onView, index = 0,
}: ContractCardProps & { index?: number }) {
  const badge    = resolveContractStatusBadge(lang, contract.status);
  const paidPct  = contract.currentValue > 0
    ? Math.min(100, (contract.paidToDate / contract.currentValue) * 100)
    : 0;
  const fmt = (n: number) => formatNum(n, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onSelect}
      className={`rounded-2xl border cursor-pointer transition-all active:scale-[0.99] overflow-hidden ${
        selected
          ? "border-orange-500/50 shadow-lg shadow-orange-500/10"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      {selected && (
        <div className="h-0.5 w-full bg-gradient-to-r from-[#F97316] to-[#EA580C]" />
      )}

      <div className={`px-4 py-4 flex flex-col gap-3 ${selected ? "bg-orange-500/[0.07]" : "bg-white/[0.03]"}`}>
        {/* Row 1: contract number + status badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className={`text-xs font-mono ${selected ? "text-orange-400" : "text-gray-400"}`}>
              {contract.contractNumber}
            </p>
            <p className={`font-semibold text-sm leading-snug truncate mt-0.5 ${selected ? "text-orange-200" : "text-white"}`}>
              {contract.contractorName}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-lg border text-xs font-medium shrink-0 ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        {/* Scope */}
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {contract.scopeDescription}
        </p>

        {/* Financial grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/[0.05] rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-500">{tContract(lang, "colCurrentValue")}</span>
            <span className="text-xs font-semibold text-white mt-0.5">{fmt(contract.currentValue)}</span>
            <span className="text-[10px] text-gray-600">{tContract(lang, "currency")}</span>
          </div>
          <div className="bg-white/[0.05] rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-500">{tContract(lang, "colPaidToDate")}</span>
            <span className="text-xs font-semibold text-emerald-400 mt-0.5">{fmt(contract.paidToDate)}</span>
            <span className="text-[10px] text-gray-600">{tContract(lang, "currency")}</span>
          </div>
          <div className="bg-white/[0.05] rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
            <span className="text-[10px] text-gray-500">{tContract(lang, "colRetention")}</span>
            <span className="text-xs font-semibold text-yellow-400 mt-0.5">{fmt(contract.retention)}</span>
            <span className="text-[10px] text-gray-600">{tContract(lang, "currency")}</span>
          </div>
        </div>

        {/* Payment progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-500">{tContract(lang, "paymentProgress")}</span>
            <span className={`text-xs font-bold ${selected ? "text-orange-300" : "text-white"}`}>
              {paidPct.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-700/60 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${paidPct}%` }}
              transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.06 + 0.1 }}
              className="bg-gradient-to-l from-[#F97316] to-[#10B981] h-full rounded-full"
            />
          </div>
        </div>

        {/* Dates row */}
        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span>{formatContractDate(contract.startDate, lang)}</span>
          <span className="text-gray-600">→</span>
          <span>{formatContractDate(contract.endDate, lang)}</span>
        </div>

        {/* Penalties alert + view action */}
        <div
          className="flex items-center justify-between pt-1 border-t border-white/8 gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1">
            {contract.penalties > 0 && (
              <div className="flex items-center gap-1.5 text-red-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs">{tContract(lang, "penaltyAlert")}: {fmt(contract.penalties)}</span>
              </div>
            )}
          </div>
          <button
            onClick={onView}
            className="flex items-center justify-center gap-1.5 py-2 px-4 bg-blue-500/10 hover:bg-blue-500/20 active:bg-blue-500/30 border border-blue-500/20 rounded-xl transition-colors text-blue-400 text-xs font-medium"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            {tContract(lang, "view")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
