import { useEffect, useState } from "react";
import ChartHeader   from "../components/chart_of_accounts/ChartHeader";
import AccountsTree  from "../components/chart_of_accounts/AccountsTree";
import SummaryCards  from "../components/chart_of_accounts/SummaryCards";
import AccountModal  from "../components/chart_of_accounts/AccountModal";
import DeleteConfirm from "../components/chart_of_accounts/DeleteConfirm";
import {
  fetchAccounts,
  fetchAccountSummary,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../core/services/ChartOfAccounts.service";
import type {
  Account,
  AccountSummary,
  AccountFormValues,
} from "../core/models/ChartOfAccounts.types";

// Always ensure we store an array no matter what the service returns
function safeArray(val: unknown): Account[] {
  return Array.isArray(val) ? (val as Account[]) : [];
}

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [summary,  setSummary]  = useState<AccountSummary | null>(null);
  const [loading,  setLoading]  = useState(true);

  const [modalOpen,   setModalOpen]   = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [deleteOpen,   setDeleteOpen]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);

  useEffect(() => {
    Promise.all([fetchAccounts(), fetchAccountSummary()])
      .then(([accs, sum]) => {
        setAccounts(safeArray(accs));
        setSummary(sum);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddAccount = () => {
    setEditAccount(null);
    setModalOpen(true);
  };

  const handleEdit = (account: Account) => {
    setEditAccount(account);
    setModalOpen(true);
  };

  const handleDeleteRequest = (account: Account) => {
    setDeleteTarget(account);
    setDeleteOpen(true);
  };

  const handleSave = async (values: AccountFormValues) => {
    let updated: Account[];
    if (editAccount) {
      updated = safeArray(await updateAccount(values));
    } else {
      updated = safeArray(await createAccount(values));
    }
    setAccounts(updated);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const updated = safeArray(await deleteAccount(deleteTarget.code));
    setAccounts(updated);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <span className="w-5 h-5 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin" />
          جارٍ التحميل…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ChartHeader onAddAccount={handleAddAccount} />

      <AccountsTree
        accounts={accounts}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      {summary && <SummaryCards summary={summary} />}

      <AccountModal
        isOpen={modalOpen}
        editAccount={editAccount}
        accounts={accounts}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirm
        isOpen={deleteOpen}
        account={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteOpen(false); setDeleteTarget(null); }}
      />
    </div>
  );
}
