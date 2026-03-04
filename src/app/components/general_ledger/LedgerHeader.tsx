// ============================================================
// LedgerHeader.tsx
// ============================================================
import { Download } from "lucide-react";
import type { LedgerHeaderProps } from "../../core/models/GeneralLedger.types";

export default function LedgerHeader({ onExportPdf, exporting }: LedgerHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">الأستاذ العام</h1>
        <p className="text-gray-400">سجل تفصيلي لحركات الحسابات</p>
      </div>
      <button
        onClick={onExportPdf}
        disabled={exporting}
        className="px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
                   hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {exporting
          ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Download className="w-5 h-5" />}
        {exporting ? "جارٍ التصدير…" : "تصدير PDF"}
      </button>
    </div>
  );
}
