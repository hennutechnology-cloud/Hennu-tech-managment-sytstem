// ============================================================
// DepreciationTable.tsx
// asset.name and asset.purchaseDate are plain API strings — rendered directly.
// asset.method is a neutral key — resolved by resolveMethod().
// All labels and column headers go through tDep().
// ============================================================
import { useState }            from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Pencil } from "lucide-react";
import GlassCard               from "../../core/shared/components/GlassCard";
import { useDepreciation }     from "../../core/services/Depreciation.service";
import { tDep, formatNum, resolveMethod } from "../../core/i18n/depreciation.i18n";
import type { DepreciationAsset, DepreciationTableProps } from "../../core/models/Depreciation.types";
import type { Lang }           from "../../core/models/Settings.types";

interface AssetRowProps {
  asset:  DepreciationAsset;
  onEdit: (a: DepreciationAsset) => void;
  lang:   Lang;
}

function AssetRow({ asset, onEdit, lang }: AssetRowProps) {
  const [expanded, setExpanded] = useState(false);

  const depreciationPct = Math.round((asset.accumulated / asset.cost) * 100);
  const yearsUsed       = Math.round(asset.accumulated / asset.annualDepreciation);
  const yearsRemaining  = Math.max(0, asset.usefulLife - yearsUsed);
  const cur             = tDep(lang, "currency");
  const yr              = tDep(lang, "yearUnit");

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
              {/* asset.name is a plain API string */}
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
                <div className="bg-white/5 rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 border border-white/10">

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">{tDep(lang, "detailSalvageValue")}</p>
                    <p className="text-white font-semibold">{formatNum(asset.salvageValue, lang)} {cur}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">{tDep(lang, "detailDepreciable")}</p>
                    <p className="text-white font-semibold">{formatNum(asset.cost - asset.salvageValue, lang)} {cur}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">{tDep(lang, "detailAccumPct")}</p>
                    <p className="text-orange-400 font-semibold">{depreciationPct}%</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">{tDep(lang, "detailYearsLeft")}</p>
                    <p className="text-emerald-400 font-semibold">{yearsRemaining} {yr}</p>
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
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function DepreciationTable({ lang }: DepreciationTableProps) {
  const { data, openEdit } = useDepreciation();
  if (!data) return null;

  return (
    <GlassCard>
      <h2 className="text-xl font-bold text-white mb-6">{tDep(lang, "tableTitle")}</h2>
      <div className="overflow-x-auto">
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
