// ============================================================
// TrialBalance.tsx  (page)
// useLang() drives the lang prop passed to every child.
// ============================================================
import { useEffect, useState, useCallback } from "react";
import { useLang }           from "../core/context/LangContext";
import { tTB }               from "../core/i18n/trialBalance.i18n";
import TrialHeader           from "../components/trial_balance/TrialHeader";
import TrialDateFilter       from "../components/trial_balance/TrialDateFilter";
import BalanceStatus         from "../components/trial_balance/BalanceStatus";
import TrialTable            from "../components/trial_balance/TrialTable";
import TrialNoDataAlert      from "../components/trial_balance/TrialNoDataAlert";
import { exportTrialExcel }  from "../components/trial_balance/exportTrialExcel";
import { fetchTrialBalance } from "../core/services/TrialBalance.service";
import type {
  TrialBalanceItem, TrialBalanceFilters, TrialBalanceSummary,
} from "../core/models/TrialBalance.types";

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
  return {
    totalDebit,
    totalCredit,
    isBalanced: totalDebit === totalCredit,
    difference: Math.abs(totalDebit - totalCredit),
  };
}

export default function TrialBalance() {
  const { lang } = useLang();

  const [items,      setItems]      = useState<TrialBalanceItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [exporting,  setExporting]  = useState(false);
  const [noDataOpen, setNoDataOpen] = useState(false);

  const [filters, setFilters] = useState<TrialBalanceFilters>({
    dateFrom: firstOfMonth(),
    dateTo:   today(),
  });
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

  // Load on mount
  useEffect(() => { loadData(filters); }, []); // eslint-disable-line

  const handleApply = () => {
    setAppliedFilters(filters);
    loadData(filters);
  };

  const handleExport = async () => {
    if (!items.length) { setNoDataOpen(true); return; }
    setExporting(true);
    try {
      // Pass lang so the exported file matches the UI language
      await exportTrialExcel(items, appliedFilters, computeSummary(items), lang);
    } finally {
      setExporting(false);
    }
  };

  const summary = computeSummary(items);

  return (
    <div className="space-y-8">

      <TrialHeader
        lang={lang}
        onExport={handleExport}
        exporting={exporting}
      />

      <TrialDateFilter
        lang={lang}
        filters={filters}
        onChange={setFilters}
        onApply={handleApply}
      />

      {!loading && <BalanceStatus lang={lang} summary={summary} />}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center gap-3 text-gray-400">
            <span className="w-5 h-5 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin" />
            {tTB(lang, "loading")}
          </div>
        </div>
      ) : (
        <TrialTable lang={lang} items={items} summary={summary} />
      )}

      <TrialNoDataAlert
        lang={lang}
        isOpen={noDataOpen}
        onClose={() => setNoDataOpen(false)}
      />

    </div>
  );
}
