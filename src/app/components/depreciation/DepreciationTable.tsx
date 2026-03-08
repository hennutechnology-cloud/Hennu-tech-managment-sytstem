// ============================================================
// DepreciationTable.tsx — Responsive
// ============================================================
import { useState }                from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Pencil }     from "lucide-react";
import GlassCard                   from "../../core/shared/components/GlassCard";
import { useDepreciation }         from "../../core/services/Depreciation.service";
import { tDep, formatNum, resolveMethod } from "../../core/i18n/depreciation.i18n";
import type { DepreciationAsset, DepreciationTableProps } from "../../core/models/Depreciation.types";
import type { Lang }               from "../../core/models/Settings.types";

// ── Shared detail panel (used in both mobile card and desktop expanded row) ──
function AssetDetails({ asset, lang }: { asset: DepreciationAsset; lang: Lang }) {
  const depreciationPct = Math.round((asset.accumulated / asset.cost) * 100);
  const yearsUsed       = Math.round(asset.accumulated / asset.annualDepreciation);
  const yearsRemaining  = Math.max(0, asset.usefulLife - yearsUsed);
  const cur             = tDep(lang, "currency");
  const yr              = tDep(lang, "yearUnit");

  return (
    <div className="bg-white/5 rounded-xl p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 border border-white/10">
      <div className="space-y-1">
        <p className="text-xs text-gray-400">{tDep(lang, "detailSalvageValue")}</p>
        <p className="text-white font-semibold text-sm">{formatNum(asset.salvageValue, lang)} {cur}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-gray-400">{tDep(lang, "detailDepreciable")}</p>
        <p className="text-white font-semibold text-sm">{formatNum(asset.cost - asset.salvageValue, lang)} {cur}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-gray-400">{tDep(lang, "detailAccumPct")}</p>
        <p className="text-orange-400 font-semibold text-sm">{depreciationPct}%</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-gray-400">{tDep(lang, "detailYearsLeft")}</p>
        <p className="text-emerald-400 font-semibold text-sm">{yearsRemaining} {yr}</p>
      </div>
      <div className="col-span-2 md:col-span-4 space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{tDep(lang, "detailConsumPct")}</span>
          <span>{depreciationPct}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${depreciationPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-l from-[#F97316] to-[#EA580C]"
          />
        </div>
      </div>
    </div>
  );
}

// ── Mobile Asset Card ──────────────────────────────────────────────────────
function AssetCard({ asset, onEdit, lang }: { asset: DepreciationAsset; onEdit: (a: DepreciationAsset) => void; lang: Lang }) {
  const [expanded, setExpanded] = useState(false);
  const cur = tDep(lang, "currency");
  const yr  = tDep(lang, "yearUnit");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white/[0.04] border border-white/10 overflow-hidden"
    >
      {/* Card header — tap to expand */}
      <button
        className="w-full flex items-start gap-3 px-4 py-4 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="mt-0.5 shrink-0">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">{asset.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {tDep(lang, "purchaseDateLabel")}: {asset.purchaseDate}
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(asset); }}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-orange-400 shrink-0"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </button>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 gap-2 px-4 pb-3">
        <div className="bg-white/[0.04] rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{tDep(lang, "colCost")}</p>
          <p className="text-xs text-white font-semibold">{formatNum(asset.cost, lang)} {cur}</p>
        </div>
        <div className="bg-white/[0.04] rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{tDep(lang, "colUsefulLife")}</p>
          <p className="text-xs text-white font-semibold">{asset.usefulLife} {yr}</p>
        </div>
        <div className="bg-white/[0.04] rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{tDep(lang, "colAnnualDep")}</p>
          <p className="text-xs text-[#F97316] font-semibold">{formatNum(asset.annualDepreciation, lang)} {cur}</p>
        </div>
        <div className="bg-white/[0.04] rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{tDep(lang, "colBookValue")}</p>
          <p className="text-xs text-emerald-400 font-semibold">{formatNum(asset.bookValue, lang)} {cur}</p>
        </div>
      </div>

      {/* Method badge + accumulated */}
      <div className="flex items-center justify-between px-4 pb-3 gap-2">
        <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs">
          {resolveMethod(lang, asset.method)}
        </span>
        <span className="text-xs text-red-400 font-medium">
          {tDep(lang, "colAccumulated")}: {formatNum(asset.accumulated, lang)} {cur}
        </span>
      </div>

      {/* Expandable detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden px-4 pb-4"
          >
            <AssetDetails asset={asset} lang={lang} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Desktop Table Row (original, unchanged) ────────────────────────────────
function AssetRow({ asset, onEdit, lang }: { asset: DepreciationAsset; onEdit: (a: DepreciationAsset) => void; lang: Lang }) {
  const [expanded, setExpanded] = useState(false);
  const cur = tDep(lang, "currency");
  const yr  = tDep(lang, "yearUnit");

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
            <div>
              <div className="text-white font-medium">{asset.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {tDep(lang, "purchaseDateLabel")}: {asset.purchaseDate}
              </div>
            </div>
          </div>
        </td>
        <td className="py-4 px-4 text-white">{formatNum(asset.cost, lang)} {cur}</td>
        <td className="py-4 px-4 text-white">{asset.usefulLife} {yr}</td>
        <td className="py-4 px-4">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm">
            {resolveMethod(lang, asset.method)}
          </span>
        </td>
        <td className="py-4 px-4 text-[#F97316]">{formatNum(asset.annualDepreciation, lang)} {cur}</td>
        <td className="py-4 px-4 text-red-400">{formatNum(asset.accumulated, lang)} {cur}</td>
        <td className="py-4 px-4 text-emerald-400 font-medium">{formatNum(asset.bookValue, lang)} {cur}</td>
        <td className="py-4 px-4">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(asset); }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-orange-400"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </td>
      </motion.tr>

      <AnimatePresence>
        {expanded && (
          <motion.tr key={`detail-${asset.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <td colSpan={8} className="px-4 pb-4 pt-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <AssetDetails asset={asset} lang={lang} />
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Exported component ─────────────────────────────────────────────────────
export default function DepreciationTable({ lang }: DepreciationTableProps) {
  const { data, openEdit } = useDepreciation();
  if (!data) return null;

  return (
    <GlassCard>
      <h2 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-6">
        {tDep(lang, "tableTitle")}
      </h2>

      {/* ── MOBILE CARD VIEW (< md) ── */}
      <div className="md:hidden flex flex-col gap-3">
        {data.assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} onEdit={openEdit} lang={lang} />
        ))}
      </div>

      {/* ── TABLE VIEW (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right py-4 px-4 text-gray-400 font-medium">{tDep(lang, "colAssetName")}</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">{tDep(lang, "colCost")}</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">{tDep(lang, "colUsefulLife")}</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">{tDep(lang, "colMethod")}</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">{tDep(lang, "colAnnualDep")}</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">{tDep(lang, "colAccumulated")}</th>
              <th className="text-right py-4 px-4 text-gray-400 font-medium">{tDep(lang, "colBookValue")}</th>
              <th className="py-4 px-4" />
            </tr>
          </thead>
          <tbody>
            {data.assets.map((asset) => (
              <AssetRow key={asset.id} asset={asset} onEdit={openEdit} lang={lang} />
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
