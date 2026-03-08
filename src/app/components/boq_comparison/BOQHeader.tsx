// ============================================================
// BOQHeader.tsx
// Static page title + subtitle — driven entirely by i18n.
// Mirrors DashboardHeader pattern: receives only `lang` prop.
// ============================================================
import { GitCompareArrows } from "lucide-react";
import { tBOQ }             from "../../core/i18n/boqComparison.i18n";
import type { BOQHeaderProps } from "../../core/models/BOQComparison.types";

export default function BOQHeader({ lang }: BOQHeaderProps) {
  const isRtl = lang === "ar";

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
      {/* Left / leading side */}
      <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700
                        flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
          <GitCompareArrows className="w-5 h-5 text-white" />
        </div>
        <div className={isRtl ? "text-right" : "text-left"}>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {tBOQ(lang, "pageTitle")}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {tBOQ(lang, "pageSubtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
