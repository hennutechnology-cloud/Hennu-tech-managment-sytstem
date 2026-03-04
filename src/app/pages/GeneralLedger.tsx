// ============================================================
// GeneralLedger.tsx  (page)
// ============================================================
import { useEffect, useState, useCallback } from "react";
import LedgerHeader  from "../components/general_ledger/LedgerHeader";
import LedgerFilters from "../components/general_ledger/LedgerFilters";
import LedgerTable   from "../components/general_ledger/LedgerTable";
import NoDataAlert   from "../components/general_ledger/NoDataAlert";
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

function firstOfMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
function today(): string {
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
  const [accounts,  setAccounts]  = useState<LedgerAccount[]>([]);
  const [entries,   setEntries]   = useState<LedgerEntry[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [exporting, setExporting] = useState(false);
  const [noDataOpen, setNoDataOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    accountCode: "1101",
    dateFrom: firstOfMonth(),
    dateTo:   today(),
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

  useEffect(() => {
    fetchLedgerAccounts().then(setAccounts);
    loadEntries(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = () => {
    setAppliedFilters(filters);
    loadEntries(filters);
  };

  const handleExport = async () => {
    // Show alert if no data
    if (!entries.length) {
      setNoDataOpen(true);
      return;
    }
    setExporting(true);
    try {
      const account = accounts.find((a) => a.code === appliedFilters.accountCode);
      const name    = account?.name ?? appliedFilters.accountCode;
      await exportLedgerPdf(entries, appliedFilters, name, computeSummary(entries));
    } finally {
      setExporting(false);
    }
  };

  const currentAccount = accounts.find((a) => a.code === appliedFilters.accountCode);
  const accountName    = currentAccount
    ? `${currentAccount.code} - ${currentAccount.name}`
    : appliedFilters.accountCode;

  return (
    <div className="space-y-8">
      <LedgerHeader onExportPdf={handleExport} exporting={exporting} />

      <LedgerFilters
        filters={filters}
        accounts={accounts}
        onChange={setFilters}
        onApply={handleApply}
      />

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center gap-3 text-gray-400">
            <span className="w-5 h-5 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin" />
            جارٍ التحميل…
          </div>
        </div>
      ) : (
        <LedgerTable
          entries={entries}
          summary={computeSummary(entries)}
          accountName={accountName}
          filters={appliedFilters}
        />
      )}

      {/* No-data alert */}
      <NoDataAlert
        isOpen={noDataOpen}
        onClose={() => setNoDataOpen(false)}
      />
    </div>
  );
}
