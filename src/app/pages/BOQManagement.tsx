// ============================================================
// BOQManagement.tsx — page
// ============================================================
import { useEffect, useState, useMemo } from "react";

import BOQManagementHeader from "../components/boq_management/BOQManagementHeader";
import BOQSummaryCards     from "../components/boq_management/BOQSummaryCards";
import BOQFilters          from "../components/boq_management/BOQFilters";
import BOQTable            from "../components/boq_management/BOQTable";
import BOQItemModal        from "../components/boq_management/BOQItemModal";
import BOQDeleteConfirm    from "../components/boq_management/BOQDeleteConfirm";
import BOQProgressModal    from "../components/boq_management/BOQProgressModal";

import { boqManagementService } from "../core/services/BOQManagement.service";
import { subcontractorService } from "../core/services/subcontractor.service";
import { useLang }              from "../core/context/LangContext";
import { tBOQMgt }              from "../core/i18n/boqManagement.i18n";
import type {
  BOQManagementData,
  BOQSection,
  BOQSummary,
  BOQItem,
  BOQItemProgress,
  BOQItemFormValues,
  BOQProgressFormValues,
  ViewMode,
} from "../core/models/BOQManagement.types";
import type { Subcontractor } from "../core/models/subcontractor.types";

export default function BOQManagement() {
  const { lang } = useLang();

  // ── BOQ data ───────────────────────────────────────────────
  const [sections, setSections] = useState<BOQSection[]>([]);
  const [summary,  setSummary]  = useState<BOQSummary | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  // ── Subcontractors list ────────────────────────────────────
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);

  // ── Progress map: itemId → BOQItemProgress ─────────────────
  const [progressMap, setProgressMap] = useState<Record<string, BOQItemProgress>>({});

  // ── UI state ───────────────────────────────────────────────
  const [search,           setSearch]           = useState("");
  const [viewMode,         setViewMode]         = useState<ViewMode>("standard");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["01", "02"]));

  // ── Item modal ─────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem,  setEditItem]  = useState<BOQItem | null>(null);

  // ── Delete modal ───────────────────────────────────────────
  const [deleteOpen,   setDeleteOpen]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BOQItem | null>(null);

  // ── Progress modal ─────────────────────────────────────────
  const [progressOpen,   setProgressOpen]   = useState(false);
  const [progressTarget, setProgressTarget] = useState<BOQItem | null>(null);

  // ── Initial fetch ──────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      boqManagementService.fetchAll(),
      subcontractorService.fetchAll(),
    ])
      .then(([boqData, subData]: [BOQManagementData, any]) => {
        setSections(boqData.sections);
        setSummary(boqData.summary);
        setSubcontractors(subData.subcontractors ?? []);
        const allItems = boqData.sections.flatMap((s) => s.items);
        setProgressMap(boqManagementService.getProgressMap(allItems));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // ── Filtered sections ──────────────────────────────────────
  const filteredSections = useMemo(() => {
    if (!search.trim()) return sections;
    const q = search.toLowerCase();
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (i) => i.code.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, search]);

  const recomputeSummary = (secs: BOQSection[]): BOQSummary => {
    const items = secs.flatMap((s) => s.items);
    const est   = items.reduce((a, i) => a + i.totalCost, 0);
    const act   = items.reduce((a, i) => a + i.actualCost, 0);
    return { totalEstimated: est, totalActual: act, totalVariance: est > 0 ? ((act / est) - 1) * 100 : 0 };
  };

  const toggleSection = (code: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  // ── Item CRUD ──────────────────────────────────────────────
  const handleAdd  = () => { setEditItem(null); setModalOpen(true); };
  const handleEdit = (item: BOQItem) => { setEditItem(item); setModalOpen(true); };

  const handleDeleteRequest = (item: BOQItem) => { setDeleteTarget(item); setDeleteOpen(true); };
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await boqManagementService.deleteItem(deleteTarget.id);
    const updated = sections.map((s) => ({
      ...s, items: s.items.filter((i) => i.id !== deleteTarget.id),
    }));
    setSections(updated);
    setSummary(recomputeSummary(updated));
    setProgressMap((prev) => { const n = { ...prev }; delete n[deleteTarget.id]; return n; });
  };

  const handleSave = async (values: BOQItemFormValues) => {
    if (editItem) {
      const updated = await boqManagementService.updateItem(editItem.id, values);
      const newSecs = sections.map((s) => ({
        ...s, items: s.items.map((i) => (i.id === updated.id ? updated : i)),
      }));
      setSections(newSecs);
      setSummary(recomputeSummary(newSecs));
      setProgressMap((prev) => ({
        ...prev,
        [updated.id]: boqManagementService.getProgress(updated.id, updated.quantity),
      }));
    } else {
      const newItem = await boqManagementService.addItem(values);
      const newSecs = sections.map((s) =>
        s.code === newItem.sectionCode ? { ...s, items: [...s.items, newItem] } : s
      );
      setSections(newSecs);
      setSummary(recomputeSummary(newSecs));
      setExpandedSections((prev) => new Set([...prev, newItem.sectionCode]));
      setProgressMap((prev) => ({
        ...prev,
        [newItem.id]: boqManagementService.getProgress(newItem.id, newItem.quantity),
      }));
    }
  };

  // ── Progress handlers ──────────────────────────────────────
  const handleProgressOpen = (item: BOQItem) => {
    setProgressTarget(item);
    setProgressOpen(true);
  };

  const handleAddProgressEntry = async (itemId: string, values: BOQProgressFormValues) => {
    const item = sections.flatMap((s) => s.items).find((i) => i.id === itemId);
    if (!item) return;
    const newProgress = await boqManagementService.addProgressEntry(itemId, item.quantity, values);
    setProgressMap((prev) => ({ ...prev, [itemId]: newProgress }));
  };

  const handleUpdateProgressEntry = async (
    itemId: string,
    entryId: string,
    values: BOQProgressFormValues,
  ) => {
    const item = sections.flatMap((s) => s.items).find((i) => i.id === itemId);
    if (!item) return;
    const newProgress = await boqManagementService.updateProgressEntry(
      itemId, entryId, item.quantity, values,
    );
    setProgressMap((prev) => ({ ...prev, [itemId]: newProgress }));
  };

  const handleDeleteProgressEntry = (itemId: string, entryId: string) => {
    const item = sections.flatMap((s) => s.items).find((i) => i.id === itemId);
    if (!item) return;
    const newProgress = boqManagementService.deleteProgressEntry(itemId, entryId, item.quantity);
    setProgressMap((prev) => ({ ...prev, [itemId]: newProgress }));
  };

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="h-16 rounded-2xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
        <div className="h-14 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-96 rounded-2xl bg-white/5 animate-pulse" />
        <p className="text-center text-gray-500 text-sm">{tBOQMgt(lang, "loading")}</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{tBOQMgt(lang, "loadError")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">

      <BOQManagementHeader onAdd={handleAdd} lang={lang} />
      <BOQSummaryCards summary={summary} lang={lang} />
      <BOQFilters search={search} onSearch={setSearch} viewMode={viewMode} onViewMode={setViewMode} lang={lang} />

      {filteredSections.length > 0 ? (
        <BOQTable
          sections={filteredSections}
          viewMode={viewMode}
          expandedSections={expandedSections}
          onToggleSection={toggleSection}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onProgress={handleProgressOpen}
          progressMap={progressMap}
          lang={lang}
        />
      ) : (
        <div className="flex items-center justify-center h-40 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-gray-500 text-sm">{tBOQMgt(lang, "noResults")}</p>
        </div>
      )}

      <BOQItemModal
        isOpen={modalOpen} editItem={editItem} sections={sections}
        onClose={() => setModalOpen(false)} onSave={handleSave} lang={lang}
      />

      <BOQDeleteConfirm
        isOpen={deleteOpen} item={deleteTarget}
        onClose={() => { setDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm} lang={lang}
      />

      <BOQProgressModal
        isOpen={progressOpen}
        item={progressTarget}
        progress={progressTarget ? progressMap[progressTarget.id] ?? null : null}
        subcontractors={subcontractors}
        onClose={() => { setProgressOpen(false); setProgressTarget(null); }}
        onAddEntry={handleAddProgressEntry}
        onUpdateEntry={handleUpdateProgressEntry}
        onDeleteEntry={handleDeleteProgressEntry}
        lang={lang}
      />

    </div>
  );
}
