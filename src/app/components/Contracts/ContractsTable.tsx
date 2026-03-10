// ============================================================
// ContractsTable.tsx — Responsive: mobile cards / desktop table
// ============================================================
import { motion }    from "motion/react";
import { Eye, AlertTriangle } from "lucide-react";
import GlassCard     from "../../core/shared/components/GlassCard";
import ContractCard  from "./ContractCard";
import {
  tContract, resolveContractStatusBadge, formatContractDate, dirAttr, flip,
} from "../../core/i18n/contracts.i18n";
import { formatNum } from "../../core/i18n/projects.i18n";
import type { ContractsTableProps } from "../../core/models/contracts.types";

export default function ContractsTable({
  contracts, lang, selectedContractId, onSelect, onView,
}: ContractsTableProps) {
  const fmt  = (n: number) => formatNum(n, lang);
  const isAr = lang === "ar";

  if (contracts.length === 0) {
    return (
      <GlassCard>
        <p className="text-center text-gray-500 py-10 text-sm">
          {tContract(lang, "noContracts")}
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      {/* ── MOBILE CARD VIEW (< md) ── */}
      <div className="md:hidden flex flex-col gap-4" dir={dirAttr(lang)}>
        {contracts.map((contract, index) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            lang={lang}
            selected={contract.id === selectedContractId}
            onSelect={() => onSelect(contract)}
            onView={() => onView(contract)}
            index={index}
          />
        ))}
      </div>

      {/* ── DESKTOP TABLE VIEW (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" dir={dirAttr(lang)}>
          <thead>
            <tr className="border-b border-white/10">
              {[
                "colContractNo", "colContractor", "colScope",
                "colCurrentValue", "colPaidToDate", "colRetention",
                "colStatus", "colEndDate", "colActions",
              ].map((key) => (
                <th
                  key={key}
                  className={`py-4 px-4 text-gray-400 font-medium text-sm ${flip(lang, "text-left", "text-right")}`}
                >
                  {tContract(lang, key as any)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, index) => {
              const badge      = resolveContractStatusBadge(lang, contract.status);
              const isSelected = contract.id === selectedContractId;
              const paidPct    = contract.currentValue > 0
                ? Math.min(100, (contract.paidToDate / contract.currentValue) * 100)
                : 0;

              return (
                <motion.tr
                  key={contract.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  onClick={() => onSelect(contract)}
                  className={`border-b border-white/5 transition-colors cursor-pointer group ${
                    isSelected
                      ? "bg-orange-500/10 border-l-2 border-l-orange-500"
                      : "hover:bg-white/5"
                  }`}
                >
                  {/* Contract No. */}
                  <td className="py-4 px-4">
                    <div>
                      <p className={`font-mono text-xs ${isSelected ? "text-orange-400" : "text-gray-400"}`}>
                        {contract.contractNumber}
                      </p>
                      {isSelected && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                          {tContract(lang, "detailTitle")}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Contractor */}
                  <td className="py-4 px-4">
                    <p className={`font-medium text-sm ${isSelected ? "text-orange-200" : "text-white"}`}>
                      {contract.contractorName}
                    </p>
                  </td>

                  {/* Scope */}
                  <td className="py-4 px-4 max-w-[200px]">
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                      {contract.scopeDescription}
                    </p>
                  </td>

                  {/* Current Value */}
                  <td className="py-4 px-4 text-white whitespace-nowrap text-sm">
                    {fmt(contract.currentValue)}{" "}
                    <span className="text-gray-500 text-xs">{tContract(lang, "currency")}</span>
                  </td>

                  {/* Paid to Date + mini progress */}
                  <td className="py-4 px-4 min-w-[140px]">
                    <div>
                      <p className="text-emerald-400 text-sm font-medium whitespace-nowrap">
                        {fmt(contract.paidToDate)}{" "}
                        <span className="text-gray-500 text-xs">{tContract(lang, "currency")}</span>
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#F97316] to-[#10B981] h-full rounded-full transition-all"
                            style={{ width: `${paidPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-9 shrink-0">{paidPct.toFixed(0)}%</span>
                      </div>
                    </div>
                  </td>

                  {/* Retention */}
                  <td className="py-4 px-4 text-yellow-400 whitespace-nowrap text-sm">
                    {fmt(contract.retention)}{" "}
                    <span className="text-gray-500 text-xs">{tContract(lang, "currency")}</span>
                  </td>

                  {/* Status badge */}
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg border text-xs ${badge.className}`}>
                      {badge.label}
                    </span>
                    {contract.penalties > 0 && (
                      <div className="flex items-center gap-1 mt-1.5 text-red-400">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span className="text-[10px]">{fmt(contract.penalties)}</span>
                      </div>
                    )}
                  </td>

                  {/* End Date */}
                  <td className="py-4 px-4 text-gray-400 text-sm whitespace-nowrap">
                    {formatContractDate(contract.endDate, lang)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className={`flex items-center gap-2 ${isAr ? "justify-start" : "justify-end"}`}>
                      <button
                        onClick={() => onView(contract)}
                        title={tContract(lang, "view")}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
