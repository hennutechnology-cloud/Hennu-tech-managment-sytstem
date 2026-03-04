// ============================================================
// TrialBalance.tsx  (page)
// ============================================================
import { useEffect, useState, useCallback } from "react";
import TrialHeader       from "../components/trial_balance/TrialHeader";
import TrialDateFilter   from "../components/trial_balance/TrialDateFilter";
import BalanceStatus     from "../components/trial_balance/BalanceStatus";
import TrialTable        from "../components/trial_balance/TrialTable";
import TrialNoDataAlert  from "../components/trial_balance/TrialNoDataAlert";
import { exportTrialExcel } from "../components/trial_balance/exportTrialExcel";
import { fetchTrialBalance } from "../core/services/TrialBalance.service";
import type {
  TrialBalanceItem,
  TrialBalanceFilters,
  TrialBalanceSummary,
} from "../core/models/TrialBalance.types";;

// ── Default date range: first of current month → today ──────────────────
function firstOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeSummary(items: TrialBalanceItem[]): TrialBalanceSummary {
  const totalDebit  = items.reduce((s, i) => s + i.debit,  0);
  const totalCredit = items.reduce((s, i) => s + i.credit, 0);
  const difference  = Math.abs(totalDebit - totalCredit);
  return {
    totalDebit,
    totalCredit,
    isBalanced: totalDebit === totalCredit,
    difference,
  };
}

export default function TrialBalance() {
  const [items,      setItems]      = useState<TrialBalanceItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [exporting,  setExporting]  = useState(false);
  const [noDataOpen, setNoDataOpen] = useState(false);

  const [filters, setFilters] = useState<TrialBalanceFilters>({
    dateFrom: firstOfMonth(),
    dateTo:   today(),
  });
  // Applied separately so table only reloads on "تطبيق" click
  const [appliedFilters, setAppliedFilters] = useState<TrialBalanceFilters>(filters);

  const loadData = useCallback(async (f: TrialBalanceFilters) => {
    setLoading(true);
    try {
      const data = await fetchTrialBalance(f);
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = () => {
    setAppliedFilters(filters);
    loadData(filters);
  };

  const handleExport = async () => {
    if (!items.length) {
      setNoDataOpen(true);
      return;
    }
    setExporting(true);
    try {
      await exportTrialExcel(items, appliedFilters, computeSummary(items));
    } finally {
      setExporting(false);
    }
  };

  const summary = computeSummary(items);

  return (
    <div className="space-y-8">
      <TrialHeader onExport={handleExport} exporting={exporting} />

      <TrialDateFilter
        filters={filters}
        onChange={setFilters}
        onApply={handleApply}
      />

      {!loading && <BalanceStatus summary={summary} />}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center gap-3 text-gray-400">
            <span className="w-5 h-5 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin" />
            جارٍ التحميل…
          </div>
        </div>
      ) : (
        <TrialTable items={items} summary={summary} />
      )}

      <TrialNoDataAlert
        isOpen={noDataOpen}
        onClose={() => setNoDataOpen(false)}
      />
    </div>
  );
}
