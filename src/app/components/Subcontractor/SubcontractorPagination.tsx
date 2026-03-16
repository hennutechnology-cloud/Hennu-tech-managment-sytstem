// ============================================================
// SubcontractorPagination.tsx
// ============================================================
import { tSub } from "../../core/i18n/subcontractor.i18n";
import type { PaginationProps } from "../../core/models/subcontractor.types";
import { useLang } from "../../core/context/LangContext";

export default function SubcontractorPagination({ page, totalPages, onNext, onPrev }: PaginationProps) {
  const { lang } = useLang();

  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        disabled={page === 1}
        onClick={onPrev}
        className="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-40 hover:bg-white/20 transition-colors"
      >
        {tSub(lang, "prev")}
      </button>

      <span className="text-gray-400 self-center">
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={onNext}
        className="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-40 hover:bg-white/20 transition-colors"
      >
        {tSub(lang, "next")}
      </button>
    </div>
  );
}
