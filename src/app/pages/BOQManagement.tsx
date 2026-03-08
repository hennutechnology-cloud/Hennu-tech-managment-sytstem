// ============================================================
// BOQManagement.tsx — page
// Single fetchAll() on mount → one loading state.
// All state for modals, filters, expand/collapse lives here.
// Components receive data as props — nothing fetches itself.
// ============================================================
import { useEffect, useState, useMemo } from "react";

import BOQManagementHeader from "../components/boq_management/BOQManagementHeader";
import BOQSummaryCards     from "../components/boq_management/BOQSummaryCards";
import BOQFilters          from "../components/boq_management/BOQFilters";
import BOQTable            from "../components/boq_management/BOQTable";
import BOQItemModal        from "../components/boq_management/BOQItemModal";
import BOQDeleteConfirm    from "../components/boq_management/BOQDeleteConfirm";

import { boqManagementService }     from "../core/services/BOQManagement.service";
import { useLang }                  from "../core/context/LangContext";
import { tBOQMgt }                  from "../core/i18n/boqManagement.i18n";
import type {
  BOQManagementData,
  BOQSection,
  BOQSummary,
  BOQItem,
  BOQItemFormValues,
  ViewMode,
} from "../core/models/BOQManagement.types";

export default function BOQManagement() {
  const { lang } = useLang();

  // ── Remote data ────────────────────────────────────────────
  const [sections, setSections] = useState<BOQSection[]>([]);
  const [summary,  setSummary]  = useState<BOQSummary | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  // ── UI state ───────────────────────────────────────────────
  const [search,            setSearch]            = useState("");
  const [viewMode,          setViewMode]          = useState<ViewMode>("standard");
  const [expandedSections,  setExpandedSections]  = useState<Set<string>>(new Set(["01", "02"]));

  // ── Modal state ────────────────────────────────────────────
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editItem,     setEditItem]     = useState<BOQItem | null>(null);
  const [deleteOpen,   setDeleteOpen]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BOQItem | null>(null);

  // ── Initial fetch ──────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(false);
    boqManagementService.fetchAll()
      .then((data: BOQManagementData) => {
        setSections(data.sections);
        setSummary(data.summary);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // ── Filtered sections (client-side search) ─────────────────
  const filteredSections = useMemo(() => {
    if (!search.trim()) return sections;
    const q = search.toLowerCase();
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (i) =>
            i.code.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, search]);

  // ── Expand / collapse ──────────────────────────────────────
  const toggleSection = (code: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  // ── Add handler ────────────────────────────────────────────
  const handleAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  // ── Edit handler ───────────────────────────────────────────
  const handleEdit = (item: BOQItem) => {
    setEditItem(item);
    setModalOpen(true);
  };

  // ── Delete handler ─────────────────────────────────────────
  const handleDeleteRequest = (item: BOQItem) => {
    setDeleteTarget(item);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await boqManagementService.deleteItem(deleteTarget.id);
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        items: s.items.filter((i) => i.id !== deleteTarget.id),
      }))
    );
    // Recalculate summary
    const updated = sections.map((s) => ({
      ...s,
      items: s.items.filter((i) => i.id !== deleteTarget.id),
    }));
    const allItems = updated.flatMap((s) => s.items);
    const est = allItems.reduce((a, i) => a + i.totalCost, 0);
    const act = allItems.reduce((a, i) => a + i.actualCost, 0);
    setSummary({ totalEstimated: est, totalActual: act, totalVariance: ((act / est) - 1) * 100 });
  };

  // ── Save (add / edit) handler ──────────────────────────────
  const handleSave = async (values: BOQItemFormValues) => {
    if (editItem) {
      // Edit
      const updated = await boqManagementService.updateItem(editItem.id, values);
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === updated.id ? updated : i)),
        }))
      );
    } else {
      // Add
      const newItem = await boqManagementService.addItem(values);
      setSections((prev) =>
        prev.map((s) =>
          s.code === newItem.sectionCode
            ? { ...s, items: [...s.items, newItem] }
            : s
        )
      );
      // Auto-expand the target section
      setExpandedSections((prev) => new Set([...prev, newItem.sectionCode]));
    }
    // Refresh summary
    const allItems = sections.flatMap((s) => s.items);
    const est = allItems.reduce((a, i) => a + i.totalCost, 0);
    const act = allItems.reduce((a, i) => a + i.actualCost, 0);
    setSummary({ totalEstimated: est, totalActual: act, totalVariance: ((act / est) - 1) * 100 });
  };

  // ── Loading skeleton ───────────────────────────────────────
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

  // ── Error state ────────────────────────────────────────────
  if (error || !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{tBOQMgt(lang, "loadError")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <BOQManagementHeader onAdd={handleAdd} lang={lang} />

      {/* Summary KPIs */}
      <BOQSummaryCards summary={summary} lang={lang} />

      {/* Filters */}
      <BOQFilters
        search={search}
        onSearch={setSearch}
        viewMode={viewMode}
        onViewMode={setViewMode}
        lang={lang}
      />

      {/* Table */}
      {filteredSections.length > 0 ? (
        <BOQTable
          sections={filteredSections}
          viewMode={viewMode}
          expandedSections={expandedSections}
          onToggleSection={toggleSection}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          lang={lang}
        />
      ) : (
        <div className="flex items-center justify-center h-40 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-gray-500 text-sm">{tBOQMgt(lang, "noResults")}</p>
        </div>
      )}

      {/* Add / Edit modal */}
      <BOQItemModal
        isOpen={modalOpen}
        editItem={editItem}
        sections={sections}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        lang={lang}
      />

      {/* Delete confirmation */}
      <BOQDeleteConfirm
        isOpen={deleteOpen}
        item={deleteTarget}
        onClose={() => { setDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm}
        lang={lang}
      />
    </div>
  );
}
