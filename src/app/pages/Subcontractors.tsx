// ============================================================
// SubcontractorsPage.tsx
// ============================================================
import { useEffect, useState } from "react";
import { subcontractorService } from "../core/services/subcontractor.service";
import SubcontractorHeader from "../components/Subcontractor/SubcontractorHeader";
import SubcontractorGrid from "../components/Subcontractor/SubcontractorGrid";
import SubcontractorPagination from "../components/Subcontractor/SubcontractorPagination";
import SubcontractorModal from "../components/Subcontractor/SubcontractorModal";
import { useLang } from "../core/context/LangContext";
import type {
  Subcontractor,
  SubcontractorData,
  SubcontractorStats,
  SubcontractorModalMode,
  SubcontractorSavePayload,
} from "../core/models/subcontractor.types";

const PAGE_SIZE = 6;

export default function SubcontractorsPage() {
  const { lang } = useLang();

  const [data, setData]           = useState<SubcontractorData | null>(null);
  const [page, setPage]           = useState<number>(1);

  // Modal state
  const [modalOpen, setModalOpen]     = useState<boolean>(false);
  const [modalMode, setModalMode]     = useState<SubcontractorModalMode>("add");
  const [selectedSub, setSelectedSub] = useState<Subcontractor | null>(null);

  useEffect(() => {
    subcontractorService.fetchAll().then(setData);
  }, []);

  if (!data) return <div className="text-white p-8">loading...</div>;

  // ── Stats map ─────────────────────────────────────────────

  const statsMap: Record<string, SubcontractorStats> = {};

  data.subcontractors.forEach((s: Subcontractor) => {
    const contracts = data.contracts.filter((c) => c.subcontractorId === s.id);
    const totalPaid = data.payments
      .filter((p) => p.subcontractorId === s.id)
      .reduce((sum, p) => sum + p.amount, 0);
    const totalContractValue = contracts.reduce((sum, c) => sum + c.contractValue, 0);

    statsMap[s.id] = { contracts: contracts.length, totalPaid, totalContractValue };
  });

  // ── Pagination ────────────────────────────────────────────

  const totalPages = Math.ceil(data.subcontractors.length / PAGE_SIZE);
  const paginated  = data.subcontractors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Modal handlers ────────────────────────────────────────

  const handleOpenAdd = () => {
    setSelectedSub(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleOpenDetails = (id: string) => {
    const sub = data.subcontractors.find((s) => s.id === id) ?? null;
    setSelectedSub(sub);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleSave = async (payload: SubcontractorSavePayload) => {
    const updated =
      "id" in payload
        ? await subcontractorService.update(payload as Subcontractor)
        : await subcontractorService.add(payload);
    setData(updated);
  };

  const handleDelete = async (id: string) => {
    const updated = await subcontractorService.delete(id);
    setData(updated);
    const newTotal = Math.ceil(updated.subcontractors.length / PAGE_SIZE);
    if (page > newTotal) setPage(Math.max(newTotal, 1));
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-8">

      <SubcontractorHeader lang={lang} onAdd={handleOpenAdd} />

      <SubcontractorGrid
        subcontractors={paginated}
        statsMap={statsMap}
        onDetails={handleOpenDetails}
      />

      <SubcontractorPagination
        page={page}
        totalPages={totalPages}
        onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
        onPrev={() => setPage((p) => Math.max(p - 1, 1))}
      />

      {modalOpen && (
        <SubcontractorModal
          subcontractor={selectedSub}
          stats={selectedSub ? statsMap[selectedSub.id] : undefined}
          mode={modalMode}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
}
