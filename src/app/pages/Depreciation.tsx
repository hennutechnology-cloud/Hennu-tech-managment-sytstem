// ============================================================
// Depreciation.tsx — page
// ============================================================
import { DepreciationProvider } from "../components/depreciation/DepreciationProvider";
import { useDepreciation }      from "../core/services/Depreciation.service";
import DepreciationHeader       from "../components/depreciation/DepreciationHeader";
import DepreciationSummary      from "../components/depreciation/DepreciationSummary";
import DepreciationChart        from "../components/depreciation/DepreciationChart";
import DepreciationTable        from "../components/depreciation/DepreciationTable";
import DepreciationModal        from "../components/depreciation/DepreciationModal";

function DepreciationContent() {
  const { modalOpen, editAsset, closeModal, handleSave, handleDelete } = useDepreciation();

  return (
    <div className="space-y-8">
      <DepreciationHeader />
      <DepreciationSummary />
      <DepreciationChart />
      <DepreciationTable />
      <DepreciationModal
        isOpen={modalOpen}
        editAsset={editAsset}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default function Depreciation() {
  return (
    <DepreciationProvider>
      <DepreciationContent />
    </DepreciationProvider>
  );
}
