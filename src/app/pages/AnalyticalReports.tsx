// ============================================================
// AnalyticalReports.tsx — page entry point
// ============================================================
import { AnalyticalReportsProvider } from "../components/analytical_reports/AnalyticalReportsProvider";
import AnalyticalReportsHeader       from "../components/analytical_reports/AnalyticalReportsHeader";
import AnalyticalReportsFilter       from "../components/analytical_reports/AnalyticalReportsFilter";
import AnalyticalReportsQuickReports from "../components/analytical_reports/AnalyticalReportsQuickReports";
import AnalyticalReportsExport       from "../components/analytical_reports/AnalyticalReportsExport";
import AnalyticalReportsCharts       from "../components/analytical_reports/AnalyticalReportsCharts";

export default function AnalyticalReports() {
  return (
    <AnalyticalReportsProvider>
      <div className="space-y-8">
        <AnalyticalReportsHeader />
        <AnalyticalReportsFilter />
        <AnalyticalReportsQuickReports />
        <AnalyticalReportsExport />
        <AnalyticalReportsCharts />
      </div>
    </AnalyticalReportsProvider>
  );
}
