// ============================================================
// AnalyticalReports.tsx  (page)
// ============================================================
import { AnalyticalReportsProvider }  from "../components/analytical_reports/AnalyticalReportsProvider";
import AnalyticalReportsHeader        from "../components/analytical_reports/AnalyticalReportsHeader";
import AnalyticalReportsFilter        from "../components/analytical_reports/AnalyticalReportsFilter";
import AnalyticalReportsQuickReports  from "../components/analytical_reports/AnalyticalReportsQuickReports";
import AnalyticalReportsCharts        from "../components/analytical_reports/AnalyticalReportsCharts";
import AnalyticalReportsExport        from "../components/analytical_reports/AnalyticalReportsExport";
import { useLang }                    from "../core/context/LangContext";

export default function AnalyticalReports() {
  const { lang } = useLang();

  return (
    <AnalyticalReportsProvider>
      <div className="space-y-6">
        <AnalyticalReportsHeader lang={lang} />
        <AnalyticalReportsFilter lang={lang} />
        <AnalyticalReportsQuickReports lang={lang} />
        <AnalyticalReportsCharts lang={lang} />
        <AnalyticalReportsExport lang={lang} />
      </div>
    </AnalyticalReportsProvider>
  );
}
