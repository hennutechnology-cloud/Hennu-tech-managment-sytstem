// ============================================================
// IncomeStatement.tsx  (page)
// ============================================================
import { useEffect, useState } from "react";
import IncomeHeader        from "../components/income_statement/IncomeHeader";
import PeriodSelector      from "../components/income_statement/PeriodSelector";
import IncomeStatementBody from "../components/income_statement/IncomeStatementBody";
import IncomeNoDataAlert   from "../components/income_statement/IncomeNoDataAlert";
import { buildIncomePdf }  from "../components/income_statement/buildIncomePdf";
import { exportPdf }       from "../core/shared/components/exportPdf";
import {
  fetchIncomeStatement,
  PERIODS,
} from "../core/services/IncomeStatement.service";
import type {
  IncomeStatementData,
  PeriodKey,
} from "../core/models/IncomeStatement.types";

export default function IncomeStatement() {
  const [period,     setPeriod]     = useState<PeriodKey>("annual_2026");
  const [data,       setData]       = useState<IncomeStatementData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [exporting,  setExporting]  = useState(false);
  const [noDataOpen, setNoDataOpen] = useState(false);

  const loadData = async (p: PeriodKey) => {
    setLoading(true);
    try {
      const result = await fetchIncomeStatement(p);
      setData(result ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(period); }, []); // eslint-disable-line

  const handlePeriodChange = (p: PeriodKey) => {
    setPeriod(p);
    loadData(p);
  };

  const handleExport = () => {
    if (!data) { setNoDataOpen(true); return; }
    setExporting(true);
    try {
      // buildIncomePdf  → converts data to ExportPdfOptions
      // exportPdf       → shared engine renders A4 HTML + opens print dialog
      exportPdf(buildIncomePdf(data, period));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <IncomeHeader onExport={handleExport} exporting={exporting} />

      <PeriodSelector
        selected={period}
        periods={PERIODS}
        onChange={handlePeriodChange}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-400">
            <span className="w-5 h-5 border-2 border-gray-600 border-t-orange-500
                             rounded-full animate-spin" />
            جارٍ التحميل…
          </div>
        </div>
      ) : data ? (
        <IncomeStatementBody data={data} />
      ) : (
        <p className="text-center text-gray-500 py-16">لا توجد بيانات</p>
      )}

      <IncomeNoDataAlert
        isOpen={noDataOpen}
        onClose={() => setNoDataOpen(false)}
      />
    </div>
  );
}
