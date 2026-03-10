// ============================================================
// Inventory.tsx — page
// Single fetchAll() → one loading state.
// Tab switch between Items and Movements.
// All CRUD + movement recording flow through inventoryService.
// ============================================================
import { useEffect, useState } from "react";
import { Package, ArrowLeftRight } from "lucide-react";
import InventoryHeader           from "../components/inventory/InventoryHeader";
import InventorySummaryCards     from "../components/inventory/InventorySummaryCards";
import InventoryTable            from "../components/inventory/InventoryTable";
import MovementsTable            from "../components/inventory/MovementsTable";
import InventoryItemModal        from "../components/inventory/InventoryItemModal";
import MovementModal             from "../components/inventory/MovementModal";
import InventoryDeleteConfirmModal from "../components/inventory/InventoryDeleteConfirmModal";
import { inventoryService }      from "../core/services/inventory.service";
import { useLang }               from "../core/context/LangContext";
import { tInv }                  from "../core/i18n/inventory.i18n";
import type {
  InventoryData,
  InventoryItem,
  InventoryItemFormData,
  MovementType,
} from "../core/models/inventory.types";

// ── Modal state ───────────────────────────────────────────────
type ModalState =
  | { kind: "none" }
  | { kind: "add" }
  | { kind: "edit";   item: InventoryItem }
  | { kind: "delete"; item: InventoryItem }
  | { kind: "move";   item: InventoryItem };

type ActiveTab = "items" | "movements";

export default function Inventory() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const [data,    setData]    = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [modal,   setModal]   = useState<ModalState>({ kind: "none" });
  const [tab,     setTab]     = useState<ActiveTab>("items");

  // ── Initial load ─────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(false);
    inventoryService.fetchAll()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // ── Refresh helpers ───────────────────────────────────────
  const refreshAll = async () => {
    const [items, movements, summary] = await Promise.all([
      inventoryService.getItems(),
      inventoryService.getMovements(),
      inventoryService.getSummary(),
    ]);
    setData((prev) => prev ? { ...prev, items, movements, summary } : prev);
  };

  // ── CRUD handlers ─────────────────────────────────────────
  const handleSave = async (formData: InventoryItemFormData) => {
    if (modal.kind === "add") {
      await inventoryService.addItem(formData);
    } else if (modal.kind === "edit") {
      await inventoryService.updateItem(modal.item.id, formData);
    }
    await refreshAll();
    setModal({ kind: "none" });
  };

  const handleConfirmDelete = async () => {
    if (modal.kind !== "delete") return;
    await inventoryService.deleteItem(modal.item.id);
    await refreshAll();
    setModal({ kind: "none" });
  };

  const handleMovement = async (
    type: MovementType,
    qty: number,
    reference: string,
    notes: string,
  ) => {
    if (modal.kind !== "move") return;
    await inventoryService.recordMovement(modal.item.id, type, qty, reference, notes);
    await refreshAll();
    setModal({ kind: "none" });
  };

  // ── Loading skeleton ──────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 rounded-2xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="h-[500px] rounded-2xl bg-white/5 animate-pulse" />
        <p className="text-center text-gray-500 text-sm">{tInv(lang, "loading")}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{tInv(lang, "loadError")}</p>
      </div>
    );
  }

  // ── Tab button styles ─────────────────────────────────────
  const tabBtn = (active: boolean) =>
    `flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all
     ${active
       ? "bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/20"
       : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <InventoryHeader lang={lang} onAdd={() => setModal({ kind: "add" })} />

      {/* Summary cards */}
      <InventorySummaryCards summary={data.summary} lang={lang} />

      {/* Tab switcher */}
      <div className={`flex gap-2 ${isAr ? "flex-row-reverse sm:flex-row" : ""}`}>
        <button className={tabBtn(tab === "items")} onClick={() => setTab("items")}>
          <Package className="w-4 h-4 shrink-0" />
          {tInv(lang, "tabItems")}
        </button>
        <button className={tabBtn(tab === "movements")} onClick={() => setTab("movements")}>
          <ArrowLeftRight className="w-4 h-4 shrink-0" />
          {tInv(lang, "tabMovements")}
        </button>
      </div>

      {/* Tab content */}
      {tab === "items" ? (
        <InventoryTable
          items={data.items}
          lang={lang}
          onEdit={(item) => setModal({ kind: "edit",   item })}
          onDelete={(item) => setModal({ kind: "delete", item })}
          onMove={(item) => setModal({ kind: "move",   item })}
        />
      ) : (
        <MovementsTable movements={data.movements} lang={lang} />
      )}

      {/* ── Modals ── */}
      {(modal.kind === "add" || modal.kind === "edit") && (
        <InventoryItemModal
          lang={lang}
          initial={modal.kind === "edit" ? modal.item : null}
          onSave={handleSave}
          onClose={() => setModal({ kind: "none" })}
        />
      )}

      {modal.kind === "move" && (
        <MovementModal
          lang={lang}
          item={modal.item}
          onSave={handleMovement}
          onClose={() => setModal({ kind: "none" })}
        />
      )}

      {modal.kind === "delete" && (
        <InventoryDeleteConfirmModal
          lang={lang}
          itemName={modal.item.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setModal({ kind: "none" })}
        />
      )}
    </div>
  );
}
