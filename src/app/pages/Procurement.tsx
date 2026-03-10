// ============================================================
// Procurement.tsx — page
// Single fetchAll() call → one loading state for the whole page.
// Manages modal state; all mutations go through procurementService.
// ============================================================
import { useEffect, useState } from "react";
import ProcurementHeader    from "../components/procurement/ProcurementHeader";
import AiBanner             from "../components/procurement/AiBanner";
import SummaryCards         from "../components/procurement/SummaryCards";
import SuppliersTable       from "../components/procurement/SuppliersTable";
import PriceTrendChart      from "../components/procurement/PriceTrendChart";
import RecommendationCards  from "../components/procurement/RecommendationCards";
import SupplierModal        from "../components/procurement/SupplierModal";
import DeleteConfirmModal   from "../components/procurement/DeleteConfirmModal";
import { procurementService } from "../core/services/procurement.service";
import { useLang }            from "../core/context/LangContext";
import { tPro }               from "../core/i18n/procurement.i18n";
import type {
  ProcurementData,
  Supplier,
  SupplierFormData,
} from "../core/models/procurement.types";

// ── Modal state shape ─────────────────────────────────────────
type ModalState =
  | { kind: "none" }
  | { kind: "add" }
  | { kind: "edit"; supplier: Supplier }
  | { kind: "delete"; supplier: Supplier };

export default function Procurement() {
  const { lang } = useLang();

  const [data,    setData]    = useState<ProcurementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [modal,   setModal]   = useState<ModalState>({ kind: "none" });

  // ── Initial load ─────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(false);
    procurementService
      .fetchAll()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // ── Helpers to refresh the supplier list + summary ───────
  const refreshSuppliers = async () => {
    const [suppliers, summary, bestSupplier] = await Promise.all([
      procurementService.getSuppliers(),
      procurementService.getSummary(),
      procurementService.getBestSupplier(),
    ]);
    setData((prev) => prev ? { ...prev, suppliers, summary, bestSupplier } : prev);
  };

  // ── CRUD handlers ─────────────────────────────────────────
  const handleSave = async (formData: SupplierFormData) => {
    if (modal.kind === "add") {
      await procurementService.addSupplier(formData);
    } else if (modal.kind === "edit") {
      await procurementService.updateSupplier(modal.supplier.id, formData);
    }
    await refreshSuppliers();
    setModal({ kind: "none" });
  };

  const handleConfirmDelete = async () => {
    if (modal.kind !== "delete") return;
    await procurementService.deleteSupplier(modal.supplier.id);
    await refreshSuppliers();
    setModal({ kind: "none" });
  };

  // ── Loading skeleton ──────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-24 rounded-2xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-72 rounded-2xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-40 rounded-2xl bg-white/5 animate-pulse" />
        </div>
        <p className="text-center text-gray-500 text-sm">{tPro(lang, "loading")}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{tPro(lang, "loadError")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProcurementHeader
        lang={lang}
        onAdd={() => setModal({ kind: "add" })}
      />

      {/* AI Banner */}
      <AiBanner
        lang={lang}
        onCreateOrder={() => {/* future: open create-order flow */}}
      />

      {/* Summary KPI cards */}
      <SummaryCards summary={data.summary} lang={lang} />

      {/* Suppliers table */}
      <SuppliersTable
        suppliers={data.suppliers}
        lang={lang}
        onEdit={(s) => setModal({ kind: "edit", supplier: s })}
        onDelete={(s) => setModal({ kind: "delete", supplier: s })}
      />

      {/* Price trend chart */}
      <PriceTrendChart data={data.priceTrend} lang={lang} />

      {/* Recommendation cards */}
      <RecommendationCards
        bestSupplier={data.bestSupplier}
        savingOpportunities={data.savingOpportunities}
        lang={lang}
      />

      {/* ── Modals ── */}
      {(modal.kind === "add" || modal.kind === "edit") && (
        <SupplierModal
          lang={lang}
          initial={modal.kind === "edit" ? modal.supplier : null}
          onSave={handleSave}
          onClose={() => setModal({ kind: "none" })}
        />
      )}

      {modal.kind === "delete" && (
        <DeleteConfirmModal
          lang={lang}
          supplierName={modal.supplier.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setModal({ kind: "none" })}
        />
      )}
    </div>
  );
}
