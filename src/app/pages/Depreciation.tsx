// ============================================================
// Depreciation.tsx — page
// Single loading state lives here. All components receive lang
// as a prop and data via context — none have their own
// loading spinners or data fetches.
// ============================================================
import { DepreciationProvider }   from "../components/depreciation/DepreciationProvider";
import { useDepreciation }        from "../core/services/Depreciation.service";
import { useLang }                from "../core/context/LangContext";
import { tDep }                   from "../core/i18n/depreciation.i18n";
import DepreciationHeader         from "../components/depreciation/DepreciationHeader";
import DepreciationSummary        from "../components/depreciation/DepreciationSummary";
import DepreciationChart          from "../components/depreciation/DepreciationChart";
import DepreciationTable          from "../components/depreciation/DepreciationTable";
import DepreciationModal          from "../components/depreciation/DepreciationModal";

// ── Inner content — runs inside the provider ─────────────────
function DepreciationContent() {
  const { lang } = useLang();
  const { loading, error, modalOpen, editAsset, closeModal, handleSave, handleDelete } =
    useDepreciation();

  // ── Single full-page loading skeleton ──────────────────────
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-48 rounded-xl bg-white/5 animate-pulse" />
            <div className="h-4 w-64 rounded-lg bg-white/5 animate-pulse" />
          </div>
          <div className="h-12 w-36 rounded-xl bg-white/5 animate-pulse" />
        </div>
        {/* Summary skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        {/* Chart skeleton */}
        <div className="h-[360px] rounded-2xl bg-white/5 animate-pulse" />
        {/* Table skeletons */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm">{tDep(lang, "loading")}</p>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{tDep(lang, "loadError")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DepreciationHeader lang={lang} />
      <DepreciationSummary lang={lang} />
      <DepreciationChart lang={lang} />
      <DepreciationTable lang={lang} />
      <DepreciationModal
        lang={lang}
        isOpen={modalOpen}
        editAsset={editAsset}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

// ── Page root — wraps everything in the provider ─────────────
export default function Depreciation() {
  return (
    <DepreciationProvider>
      <DepreciationContent />
    </DepreciationProvider>
  );
}
