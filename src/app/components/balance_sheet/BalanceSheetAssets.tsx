// ============================================================
// BalanceSheetLiabilities.tsx — responsive
// ============================================================
import { motion }          from "motion/react";
import GlassCard           from "../../core/shared/components/GlassCard";
import { useBalanceSheet } from "../../core/services/BalanceSheet.service";
import { tBS, formatNum }  from "../../core/i18n/balanceSheet.i18n";
import type { Lang }       from "../../core/models/Settings.types";

interface Props { lang: Lang; }

function Row({ label, value, lang }: { label: string; value: number; lang: Lang }) {
  const isRtl = lang === "ar";
  return (
    <div className={`flex items-center justify-between py-1.5 sm:py-2 gap-2
                     ${isRtl ? "flex-row-reverse" : ""}`}>
      <span className="text-gray-300 text-sm sm:text-base">{label}</span>
      <span className="text-white font-medium text-sm sm:text-base tabular-nums shrink-0">
        {formatNum(value, lang)}
      </span>
    </div>
  );
}

function Subtotal({
  label, value, lang, color = "text-red-400",
}: { label: string; value: number; lang: Lang; color?: string }) {
  const isRtl = lang === "ar";
  return (
    <div className={`flex items-center justify-between py-2 sm:py-3
                     border-t border-white/10 gap-2
                     ${isRtl ? "flex-row-reverse" : ""}`}>
      <span className="text-white font-bold text-sm sm:text-base">{label}</span>
      <span className={`${color} font-bold text-sm sm:text-base tabular-nums shrink-0`}>
        {formatNum(value, lang)}
      </span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 sm:space-y-4 animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-7 sm:h-8 rounded-lg bg-white/5" />
      ))}
    </div>
  );
}

export default function BalanceSheetLiabilities({ lang }: Props) {
  const { data, loading } = useBalanceSheet();
  const isRtl = lang === "ar";

  const indentCls = isRtl
    ? "pl-0 sm:pl-3 md:pl-6"
    : "pr-0 sm:pr-3 md:pr-6";

  const sectionTitleCls = `text-base sm:text-lg font-bold text-white mb-3 sm:mb-4
                           ${isRtl ? "text-right" : "text-left"}`;

  return (
    <GlassCard className="p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        <h2 className={`text-xl sm:text-2xl font-bold text-white
                         border-b border-white/10 pb-3 sm:pb-4
                         ${isRtl ? "text-right" : "text-left"}`}>
          {tBS(lang, "liabilitiesEquityTitle")}
        </h2>

        {loading && <Skeleton />}

        {!loading && data && (
          <>
            {/* Current Liabilities */}
            <div>
              <h3 className={sectionTitleCls}>{tBS(lang, "currentLiabTitle")}</h3>
              <div className={`space-y-0.5 ${indentCls}`}>
                <Row label={tBS(lang, "payables")}       value={data.liabilities.currentLiabilities.payables}       lang={lang} />
                <Row label={tBS(lang, "shortTermLoans")} value={data.liabilities.currentLiabilities.shortTermLoans} lang={lang} />
                <Row label={tBS(lang, "taxes")}          value={data.liabilities.currentLiabilities.taxes}          lang={lang} />
                <Subtotal label={tBS(lang, "totalCurrentLiab")} value={data.liabilities.currentLiabilities.total} lang={lang} />
              </div>
            </div>

            {/* Long-term Liabilities */}
            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <h3 className={sectionTitleCls}>{tBS(lang, "longTermLiabTitle")}</h3>
              <div className={`space-y-0.5 ${indentCls}`}>
                <Row label={tBS(lang, "longTermLoans")} value={data.liabilities.longTermLiabilities.longTermLoans} lang={lang} />
                <Row label={tBS(lang, "bonds")}         value={data.liabilities.longTermLiabilities.bonds}         lang={lang} />
                <Subtotal label={tBS(lang, "totalLongTermLiab")} value={data.liabilities.longTermLiabilities.total} lang={lang} />
              </div>
            </div>

            {/* Total Liabilities highlight */}
            <div className={`py-2.5 sm:py-3 bg-red-500/10 rounded-xl px-3 sm:px-4
                             border border-red-500/20`}>
              <div className={`flex items-center justify-between gap-2
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                <span className="text-white font-bold text-sm sm:text-base">
                  {tBS(lang, "totalLiabilities")}
                </span>
                <span className="text-red-400 font-bold text-base sm:text-lg tabular-nums shrink-0">
                  {formatNum(data.liabilities.totalLiabilities, lang)}
                </span>
              </div>
            </div>

            {/* Equity */}
            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <h3 className={sectionTitleCls}>{tBS(lang, "equityTitle")}</h3>
              <div className={`space-y-0.5 ${indentCls}`}>
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

            {/* Grand total highlight */}
            <div className={`py-3 sm:py-4 bg-[#F97316]/10 rounded-xl px-3 sm:px-4
                             border border-[#F97316]/20`}>
              <div className={`flex items-center justify-between gap-2
                               ${isRtl ? "flex-row-reverse" : ""}`}>
                <span className="text-white font-bold text-base sm:text-xl leading-tight">
                  {tBS(lang, "totalLiabilitiesEquity")}
                </span>
                <span className="text-[#F97316] font-bold text-lg sm:text-2xl tabular-nums shrink-0">
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
