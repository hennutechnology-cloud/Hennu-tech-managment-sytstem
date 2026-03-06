// ============================================================
// AnalyticalReportsHeader.tsx
// ============================================================
import { tAR }       from "../../core/i18n/analyticalReports.i18n";
import type { Lang } from "../../core/models/Settings.types";

interface Props { lang: Lang; }

export default function AnalyticalReportsHeader({ lang }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{tAR(lang, "pageTitle")}</h1>
        <p className="text-gray-400">{tAR(lang, "pageSubtitle")}</p>
      </div>
    </div>
  );
}
