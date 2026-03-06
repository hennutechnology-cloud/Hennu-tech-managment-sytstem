// ============================================================
// BalanceSheetAssets.tsx
// ============================================================
import { motion }          from "motion/react";
import GlassCard           from "../../core/shared/components/GlassCard";
import { useBalanceSheet } from "../../core/services/BalanceSheet.service";
import { tBS, formatNum }  from "../../core/i18n/balanceSheet.i18n";
import type { Lang }       from "../../core/models/Settings.types";

interface Props { lang: Lang; }

function Row({ label, value, lang }: { label: string; value: number; lang: Lang }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-300">{label}</span>
      <span className="text-white font-medium">{formatNum(value, lang)}</span>
    </div>
  );
}

function Subtotal({ label, value, lang }: { label: string; value: number; lang: Lang }) {
  return (
    <div className="flex items-center justify-between py-3 border-t border-white/10">
      <span className="text-white font-bold">{label}</span>
      <span className="text-emerald-400 font-bold">{formatNum(value, lang)}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-8 rounded-lg bg-white/5" />
      ))}
    </div>
  );
}

export default function BalanceSheetAssets({ lang }: Props) {
  const { data, loading } = useBalanceSheet();

  return (
    <GlassCard>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">
          {tBS(lang, "assetsTitle")}
        </h2>

        {loading && <Skeleton />}

        {!loading && data && (
          <>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">{tBS(lang, "currentAssetsTitle")}</h3>
              <div className="space-y-1 pr-6">
                <Row label={tBS(lang, "cash")}        value={data.assets.currentAssets.cash}        lang={lang} />
                <Row label={tBS(lang, "bank1")}       value={data.assets.currentAssets.bank1}       lang={lang} />
                <Row label={tBS(lang, "bank2")}       value={data.assets.currentAssets.bank2}       lang={lang} />
                <Row label={tBS(lang, "receivables")} value={data.assets.currentAssets.receivables} lang={lang} />
                <Row label={tBS(lang, "inventory")}   value={data.assets.currentAssets.inventory}   lang={lang} />
                <Subtotal label={tBS(lang, "totalCurrentAssets")} value={data.assets.currentAssets.total} lang={lang} />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">{tBS(lang, "fixedAssetsTitle")}</h3>
              <div className="space-y-1 pr-6">
                <Row label={tBS(lang, "land")}      value={data.assets.fixedAssets.land}      lang={lang} />
                <Row label={tBS(lang, "buildings")} value={data.assets.fixedAssets.buildings} lang={lang} />
                <Row label={tBS(lang, "equipment")} value={data.assets.fixedAssets.equipment} lang={lang} />
                <Row label={tBS(lang, "vehicles")}  value={data.assets.fixedAssets.vehicles}  lang={lang} />
                <Subtotal label={tBS(lang, "totalFixedAssets")} value={data.assets.fixedAssets.total} lang={lang} />
              </div>
            </div>

            <div className="py-4 bg-emerald-500/10 rounded-xl px-4 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-xl">{tBS(lang, "totalAssets")}</span>
                <span className="text-emerald-400 font-bold text-2xl">
                  {formatNum(data.assets.totalAssets, lang)}
                </span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </GlassCard>
  );
}
