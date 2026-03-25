// ============================================================
// ContractsPanel.tsx
// ============================================================
import { useState }                from "react";
import { motion, AnimatePresence }  from "motion/react";
import {
  Layers, Plus, Edit2, Trash2, FileText,
  TrendingUp, TrendingDown, ChevronDown, ChevronUp,
} from "lucide-react";
import GlassCard          from "../../core/shared/components/GlassCard";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { tInv, formatCurrency }  from "../../core/i18n/invoice.i18n";
import { STATUS_STYLES }          from "../../core/i18n/invoice.i18n";
import type { ContractsPanelProps, ContractSummary } from "../../core/models/invoice.types";
import type { Lang } from "../../core/models/Settings.types";

const STATUS_LABELS: Record<string, Record<Lang, string>> = {
  paid:    { ar: "مسددة",   en: "Paid"    },
  partial: { ar: "جزئية",  en: "Partial" },
  pending: { ar: "معلقة",  en: "Pending" },
  overdue: { ar: "متأخرة", en: "Overdue" },
};

function ContractCard({
  cs, lang, isRtl,
  onAddInvoice, onEdit, onDelete,
}: {
  cs: ContractSummary;
  lang: Lang;
  isRtl: boolean;
  onAddInvoice: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { contract, totalProgress, remainingWork, progressPct, invoices } = cs;

  const barColor =
    progressPct >= 100 ? "bg-emerald-500"
    : progressPct >= 70 ? "bg-blue-500"
    : progressPct >= 40 ? "bg-orange-500"
    : "bg-red-500/60";

  const Icon = contract.accountType === "revenue" ? TrendingUp : TrendingDown;
  const accentClass = contract.accountType === "revenue" ? "text-emerald-400" : "text-red-400";
  const accentBorder = contract.accountType === "revenue"
    ? "border-t-emerald-500/50"
    : "border-t-red-500/50";

  return (
    <div className={`rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden ${accentBorder} border-t-2`}>
      {/* Header */}
      <div className={`flex items-start gap-3 px-4 pt-4 pb-3 ${isRtl ? "flex-row-reverse" : ""}`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                         ${contract.accountType === "revenue"
                           ? "bg-emerald-500/10 border border-emerald-500/20"
                           : "bg-red-500/10 border border-red-500/20"}`}>
          <Icon className={`w-4 h-4 ${accentClass}`} />
        </div>
        <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : ""}`}>
          <p className="text-sm font-bold text-white leading-snug">{contract.name}</p>
          {contract.description && (
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">{contract.description}</p>
          )}
        </div>
        <div className={`flex items-center gap-1 shrink-0 ${isRtl ? "flex-row-reverse" : ""}`}>
          <button onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-blue-500/15 text-gray-500 hover:text-blue-400 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/15 text-gray-500 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Amounts grid */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-3">
        {[
          { label: tInv(lang, "contractTotal"),     value: formatCurrency(contract.totalAmount, lang),  color: "text-white"       },
          { label: tInv(lang, "contractProgress"),  value: formatCurrency(totalProgress, lang),         color: "text-violet-400"  },
          { label: tInv(lang, "contractRemaining"), value: formatCurrency(remainingWork, lang),          color: "text-orange-400"  },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.04] rounded-xl px-2 py-2.5 border border-white/8 text-center">
            <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className={`flex items-center justify-between text-xs mb-1.5 ${isRtl ? "flex-row-reverse" : ""}`}>
          <span className="text-gray-500">{tInv(lang, "contractPct")}</span>
          <span className="font-bold text-white">{progressPct.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between px-4 pb-4 pt-1 border-t border-white/5
                       ${isRtl ? "flex-row-reverse" : ""}`}>
        <button
          onClick={() => setExpanded(v => !v)}
          className={`flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors
                       ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <FileText className="w-3.5 h-3.5" />
          {tInv(lang, "contractInvoices")} ({invoices.length})
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        <button
          onClick={onAddInvoice}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
                       bg-violet-500/15 border border-violet-500/30 text-violet-300
                       hover:bg-violet-500/25 transition-all ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <Plus className="w-3.5 h-3.5" />
          {tInv(lang, "addProgressInvoice")}
        </button>
      </div>

      {/* Expandable invoice list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/8"
          >
            <div className="px-4 py-3 space-y-2">
              {invoices.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-3">
                  {tInv(lang, "noInvoices")}
                </p>
              ) : (
                invoices.map((inv) => {
                  const ss = STATUS_STYLES[inv.status];
                  return (
                    <div
                      key={inv.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                                   bg-white/[0.03] border border-white/8
                                   ${isRtl ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`flex-1 min-w-0 ${isRtl ? "text-right" : ""}`}>
                        <p className="text-xs font-mono font-semibold text-white">{inv.invoiceNumber}</p>
                        <p className="text-[10px] text-gray-500 truncate">{inv.description}</p>
                      </div>
                      <div className={`flex items-center gap-2 shrink-0 ${isRtl ? "flex-row-reverse" : ""}`}>
                        <p className="text-xs font-bold text-violet-400">{formatCurrency(inv.totalAmount, lang)}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ss.bg} ${ss.border} ${ss.text}`}>
                          {STATUS_LABELS[inv.status]?.[lang] ?? inv.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContractsPanel({
  contracts, lang, onAddInvoice, onEdit, onDelete,
}: ContractsPanelProps) {
  const isRtl = lang === "ar";
  const [deleteTarget, setDeleteTarget] = useState<ContractSummary | null>(null);

  return (
    <>
      <GlassCard className="overflow-hidden">
        {/* Panel header */}
        <div className={`flex items-center gap-3 px-5 py-4 border-b border-white/10
                         bg-gradient-to-r from-violet-500/8 to-transparent
                         ${isRtl ? "flex-row-reverse" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700
                          flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className={`flex-1 ${isRtl ? "text-right" : ""}`}>
            <h2 className="text-sm font-bold text-white">{tInv(lang, "contractsPanel")}</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {contracts.length} {lang === "ar" ? "عقد نشط" : "active contracts"}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {contracts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 rounded-xl border border-dashed border-white/10">
              <Layers className="w-8 h-8 text-gray-600" />
              <p className="text-sm text-gray-500">{tInv(lang, "noContracts")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contracts.map((cs) => (
                <ContractCard
                  key={cs.contract.id}
                  cs={cs}
                  lang={lang}
                  isRtl={isRtl}
                  onAddInvoice={() => onAddInvoice(cs.contract)}
                  onEdit={() => onEdit(cs.contract)}
                  onDelete={() => setDeleteTarget(cs)}
                />
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={tInv(lang, "deleteContract")}
        description={tInv(lang, "deleteContractMsg")}
        lang={lang}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget.contract);
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
