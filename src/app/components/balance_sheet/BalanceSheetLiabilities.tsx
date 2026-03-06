// ============================================================
// BalanceSheetLiabilities.tsx
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

function Subtotal({
  label, value, lang, color = "text-red-400",
}: { label: string; value: number; lang: Lang; color?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-t border-white/10">
      <span className="text-white font-bold">{label}</span>
      <span className={`${color} font-bold`}>{formatNum(value, lang)}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-8 rounded-lg bg-white/5" />
      ))}
    </div>
  );
}

export default function BalanceSheetLiabilities({ lang }: Props) {
  const { data, loading } = useBalanceSheet();

  return (
    <GlassCard>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">
          {tBS(lang, "liabilitiesEquityTitle")}
        </h2>

        {loading && <Skeleton />}

        {!loading && data && (
          <>
            {/* Current liabilities */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">{tBS(lang, "currentLiabTitle")}</h3>
              <div className="space-y-1 pr-6">
                <Row label={tBS(lang, "payables")}       value={data.liabilities.currentLiabilities.payables}       lang={lang} />
                <Row label={tBS(lang, "shortTermLoans")} value={data.liabilities.currentLiabilities.shortTermLoans} lang={lang} />
                <Row label={tBS(lang, "taxes")}          value={data.liabilities.currentLiabilities.taxes}          lang={lang} />
                <Subtotal label={tBS(lang, "totalCurrentLiab")} value={data.liabilities.currentLiabilities.total} lang={lang} />
              </div>
            </div>

            {/* Long-term liabilities */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">{tBS(lang, "longTermLiabTitle")}</h3>
              <div className="space-y-1 pr-6">
                <Row label={tBS(lang, "longTermLoans")} value={data.liabilities.longTermLiabilities.longTermLoans} lang={lang} />
                <Row label={tBS(lang, "bonds")}         value={data.liabilities.longTermLiabilities.bonds}         lang={lang} />
                <Subtotal label={tBS(lang, "totalLongTermLiab")} value={data.liabilities.longTermLiabilities.total} lang={lang} />
              </div>
            </div>

            {/* Total liabilities highlight */}
            <div className="py-3 bg-red-500/10 rounded-xl px-4 border border-red-500/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{tBS(lang, "totalLiabilities")}</span>
                <span className="text-red-400 font-bold text-lg">
                  {formatNum(data.liabilities.totalLiabilities, lang)}
                </span>
              </div>
            </div>

            {/* Equity */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">{tBS(lang, "equityTitle")}</h3>
              <div className="space-y-1 pr-6">
                <Row label={tBS(lang, "capital")}          value={data.equity.capital}          lang={lang} />
                <Row label={tBS(lang, "retainedEarnings")} value={data.equity.retainedEarnings} lang={lang} />
                <Subtotal
                  label={tBS(lang, "totalEquity")}
                  value={data.equity.totalEquity}
                  lang={lang}
                  color="text-blue-400"
                />
              </div>
            </div>

            {/* Grand total */}
            <div className="py-4 bg-[#F97316]/10 rounded-xl px-4 border border-[#F97316]/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-xl">{tBS(lang, "totalLiabilitiesEquity")}</span>
                <span className="text-[#F97316] font-bold text-2xl">
                  {formatNum(data.totalLiabilitiesAndEquity, lang)}
                </span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </GlassCard>
  );
}
