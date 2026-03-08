// ============================================================
// BOQComparison.tsx — page
// Single fetchAll() on mount → one loading state for the page.
// Upload handlers call service methods and update local status.
// All data passed down as props — no component fetches itself.
// Mirrors the Dashboard.tsx pattern exactly.
// ============================================================
import { useEffect, useState } from "react";

import BOQHeader           from "../components/boq_comparison/BOQHeader";
import BOQUploadArea       from "../components/boq_comparison/BOQUploadArea";
import BOQSavingsSummary   from "../components/boq_comparison/BOQSavingsSummary";
import BOQComparisonTable  from "../components/boq_comparison/BOQComparisonTable";
import BOQOptimisation     from "../components/boq_comparison/BOQOptimisation";

import { boqComparisonService }     from "../core/services/BOQComparison.service";
import { useLang }                  from "../core/context/LangContext";
import { tBOQ }                     from "../core/i18n/boqComparison.i18n";
import type { BOQComparisonData, UploadStatus }
                                    from "../core/models/BOQComparison.types";

export default function BOQComparison() {
  const { lang } = useLang();

  // ── Page data ──────────────────────────────────────────────
  const [data,    setData]    = useState<BOQComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  // ── Upload states ──────────────────────────────────────────
  const [boqStatus,    setBOQStatus]    = useState<UploadStatus>("idle");
  const [quotesStatus, setQuotesStatus] = useState<UploadStatus>("idle");

  const bothUploaded =
    boqStatus    === "success" &&
    quotesStatus === "success";

  // ── Initial data fetch ─────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(false);
    boqComparisonService.fetchAll()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // ── Upload handlers ────────────────────────────────────────
  const handleBOQUpload = async (file: File) => {
    setBOQStatus("uploading");
    try {
      await boqComparisonService.uploadBOQ(file);
      setBOQStatus("success");
    } catch {
      setBOQStatus("error");
    }
  };

  const handleQuotesUpload = async (file: File) => {
    setQuotesStatus("uploading");
    try {
      await boqComparisonService.uploadQuotes(file);
      setQuotesStatus("success");
    } catch {
      setQuotesStatus("error");
    }
  };

  // ── AI optimise handler ────────────────────────────────────
  const handleAIOptimise = async () => {
    await boqComparisonService.runAIOptimise();
    // In production: refetch data after optimisation
  };

  // ── Loading skeleton ───────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <BOQHeader lang={lang} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {[0, 1].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-white/5 animate-pulse" />
        <p className="text-center text-gray-500 text-sm">{tBOQ(lang, "loading")}</p>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{tBOQ(lang, "loadError")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <BOQHeader lang={lang} />

      {/* Upload area — always visible */}
      <BOQUploadArea
        boqStatus={boqStatus}
        quotesStatus={quotesStatus}
        onBOQUpload={handleBOQUpload}
        onQuotesUpload={handleQuotesUpload}
        lang={lang}
      />

      {/* Below sections revealed only after both uploads succeed */}
      {bothUploaded ? (
        <>
          {/* KPI summary */}
          <BOQSavingsSummary summary={data.summary} lang={lang} />

          {/* Comparison table */}
          <BOQComparisonTable
            items={data.items}
            onAIOptimise={handleAIOptimise}
            lang={lang}
          />

          {/* Optimisation suggestions */}
          <BOQOptimisation suggestions={data.suggestions} lang={lang} />
        </>
      ) : (
        /* Friendly prompt until both files are uploaded */
        <div className="flex items-center justify-center h-32 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-gray-500 text-sm text-center px-4">
            {tBOQ(lang, "awaitingUpload")}
          </p>
        </div>
      )}
    </div>
  );
}
