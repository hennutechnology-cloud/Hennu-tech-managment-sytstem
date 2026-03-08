// ============================================================
// AIHeader.tsx — responsive: mobile / tablet / desktop
// Mobile:  stacked column, badge below title
// Tablet+: row with space-between
// RTL:     full flex-row-reverse support
// ============================================================
import { Sparkles, Zap } from "lucide-react";
import { tAI }           from "../../core/i18n/aiAnalytics.i18n";
import type { Lang }     from "../../core/models/Settings.types";

interface AIHeaderProps { lang: Lang; }

export default function AIHeader({ lang }: AIHeaderProps) {
  const isRtl = lang === "ar";

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
                     ${isRtl ? "sm:flex-row-reverse" : ""}`}>

      {/* Title + subtitle */}
      <div className={isRtl ? "text-right" : "text-left"}>
        <h1 className={`text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2
                        flex items-center gap-2 sm:gap-3
                        ${isRtl ? "flex-row-reverse" : ""}`}>
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#F97316] shrink-0" />
          <span>{tAI(lang, "headerTitle")}</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          {tAI(lang, "headerSubtitle")}
        </p>
      </div>

      {/* "Powered by" badge — full width on mobile, auto on sm+ */}
      <div className={`flex items-center justify-center gap-2
                       px-4 sm:px-6 py-2.5 sm:py-3
                       bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white
                       rounded-xl shadow-lg shadow-orange-500/30
                       text-sm sm:text-base w-full sm:w-auto shrink-0
                       ${isRtl ? "flex-row-reverse" : ""}`}>
        <Zap className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span className="font-medium">{tAI(lang, "poweredBy")}</span>
      </div>
    </div>
  );
}
