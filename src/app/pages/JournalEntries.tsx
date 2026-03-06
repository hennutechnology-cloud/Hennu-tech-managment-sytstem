// ============================================================
// JournalEntries.tsx
// ============================================================
import { useEffect, useState } from "react";
import JournalHeader        from "../components/journal_entries/JournalHeader";
import EntryForm            from "../components/journal_entries/EntryForm";
import RecentEntries        from "../components/journal_entries/RecentEntries";
import EntryDetailModal     from "../components/journal_entries/EntryDetailModal";
import EntryEditModal       from "../components/journal_entries/EntryEditModal";
import JournalDeleteConfirm from "../components/journal_entries/JournalDeleteConfirm";
import {
  fetchJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "../core/services/JournalEntries.service";
import type { JournalEntry, JournalEntryFormValues } from "../core/models/JournalEntries.types";
import { useLang } from "../core/context/LangContext";
import { tJE }    from "../core/i18n/journalEntries.i18n";

function safeArray(val: unknown): JournalEntry[] {
  return Array.isArray(val) ? (val as JournalEntry[]) : [];
}

export default function JournalEntries() {
  const { lang } = useLang();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail modal
  const [detailOpen,  setDetailOpen]  = useState(false);
  const [detailEntry, setDetailEntry] = useState<JournalEntry | null>(null);

  // Edit modal
  const [editOpen,  setEditOpen]  = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);

  // Delete confirm
  const [deleteOpen,   setDeleteOpen]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JournalEntry | null>(null);

  useEffect(() => {
    fetchJournalEntries()
      .then((data) => setEntries(safeArray(data)))
      .finally(() => setLoading(false));
  }, []);

  // ── Handlers ────────────────────────────────────────────
  const handleCreate = async (values: JournalEntryFormValues) => {
    const updated = safeArray(await createJournalEntry(values));
    setEntries(updated);
  };

  const handleView = (entry: JournalEntry) => {
    setDetailEntry(entry);
    setDetailOpen(true);
  };

  const handleEditFromDetail = (entry: JournalEntry) => {
    setDetailOpen(false);
    setEditEntry(entry);
    setEditOpen(true);
  };

  const handleEditSave = async (id: number, values: JournalEntryFormValues) => {
    const updated = safeArray(await updateJournalEntry(id, values));
    setEntries(updated);
  };

  const handleDeleteRequest = (entry: JournalEntry) => {
    setDetailOpen(false);
    setDeleteTarget(entry);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const updated = safeArray(await deleteJournalEntry(deleteTarget.id));
    setEntries(updated);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <span className="w-5 h-5 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin" />
          {tJE(lang, "loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <JournalHeader lang={lang} />

      <EntryForm lang={lang} onSave={handleCreate} />

      <RecentEntries
        lang={lang}
        entries={entries}
        onView={handleView}
        onDelete={handleDeleteRequest}
      />

      <EntryDetailModal
        lang={lang}
        isOpen={detailOpen}
        entry={detailEntry}
        onClose={() => setDetailOpen(false)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteRequest}
      />

      <EntryEditModal
        lang={lang}
        isOpen={editOpen}
        entry={editEntry}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
      />

      <JournalDeleteConfirm
        lang={lang}
        isOpen={deleteOpen}
        entry={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteOpen(false); setDeleteTarget(null); }}
      />
    </div>
  );
}
