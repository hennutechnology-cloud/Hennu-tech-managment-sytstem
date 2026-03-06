// ============================================================
// GeneralLedger.tsx — page
// Single loading spinner lives here. All components receive
// lang as a prop — none render their own loading states.
// ============================================================
import { useEffect, useState, useCallback } from "react";
import { useLang }        from "../core/context/LangContext";
import { tGL }            from "../core/i18n/generalLedger.i18n";
import LedgerHeader       from "../components/general_ledger/LedgerHeader";
import LedgerFilters      from "../components/general_ledger/LedgerFilters";
import LedgerTable        from "../components/general_ledger/LedgerTable";
import NoDataAlert        from "../components/general_ledger/NoDataAlert";
import { exportLedgerPdf } from "../components/general_ledger/exportLedgerPdf";
import {
  fetchLedgerEntries,
  fetchLedgerAccounts,
} from "../core/services/GeneralLedger.service";
import type {
  LedgerEntry,
  LedgerAccount,
  LedgerFilters as Filters,
  LedgerSummary,
} from "../core/models/GeneralLedger.types";

// ── Date helpers (no language dependency) ────────────────────
function firstOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeSummary(entries: LedgerEntry[]): LedgerSummary {
  if (!entries.length) return { totalDebit: 0, totalCredit: 0, openingBalance: 0, closingBalance: 0 };
  const totalDebit     = entries.reduce((s, e) => s + e.debit,  0);
  const totalCredit    = entries.reduce((s, e) => s + e.credit, 0);
  const openingBalance = entries[0].balance - entries[0].debit + entries[0].credit;
  const closingBalance = entries.at(-1)!.balance;
  return { totalDebit, totalCredit, openingBalance, closingBalance };
}

export default function GeneralLedger() {
  const { lang } = useLang();

  const [accounts,    setAccounts]    = useState<LedgerAccount[]>([]);
  const [entries,     setEntries]     = useState<LedgerEntry[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [exporting,   setExporting]   = useState(false);
  const [noDataOpen,  setNoDataOpen]  = useState(false);

  const [filters, setFilters] = useState<Filters>({
    accountCode: "1101",
    dateFrom:    firstOfMonth(),
    dateTo:      todayIso(),
  });
  const [appliedFilters, setAppliedFilters] = useState<Filters>(filters);

  const loadEntries = useCallback(async (f: Filters) => {
    setLoading(true);
    try {
      const data = await fetchLedgerEntries(f);
      setEntries(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load — accounts + entries together so there's one loading phase
  useEffect(() => {
    Promise.all([fetchLedgerAccounts(), fetchLedgerEntries(filters)])
      .then(([accs, data]) => {
        setAccounts(accs);
        setEntries(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = () => {
    setAppliedFilters(filters);
    loadEntries(filters);
  };

  const handleExport = async () => {
    if (!entries.length) { setNoDataOpen(true); return; }
    setExporting(true);
    try {
      const account = accounts.find((a) => a.code === appliedFilters.accountCode);
      const name    = account?.name ?? appliedFilters.accountCode;
      await exportLedgerPdf(entries, appliedFilters, name, computeSummary(entries), lang);
    } finally {
      setExporting(false);
    }
  };

  // accountName built from API strings — rendered directly in LedgerTable
  const currentAccount = accounts.find((a) => a.code === appliedFilters.accountCode);
  const accountName    = currentAccount
    ? `${currentAccount.code} - ${currentAccount.name}`
    : appliedFilters.accountCode;

  return (
    <div className="space-y-8">
      <LedgerHeader lang={lang} onExportPdf={handleExport} exporting={exporting} />

      <LedgerFilters
        lang={lang}
        filters={filters}
        accounts={accounts}
        onChange={setFilters}
        onApply={handleApply}
      />

      {/* ── Single page-level loading state ── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center gap-3 text-gray-400">
            <span className="w-5 h-5 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin" />
            {tGL(lang, "loading")}
          </div>
        </div>
      ) : (
        <LedgerTable
          lang={lang}
          entries={entries}
          summary={computeSummary(entries)}
          accountName={accountName}
          filters={appliedFilters}
        />
      )}

      <NoDataAlert
        lang={lang}
        isOpen={noDataOpen}
        onClose={() => setNoDataOpen(false)}
      />
    </div>
  );
}
