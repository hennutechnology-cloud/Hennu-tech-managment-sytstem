// ============================================================
// TrialHeader.tsx
// ============================================================
import { Download } from "lucide-react";
import type { TrialHeaderProps } from "../../core/models/TrialBalance.types";

export default function TrialHeader({ onExport, exporting }: TrialHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">ميزان المراجعة</h1>
        <p className="text-gray-400">التحقق من توازن الحسابات</p>
      </div>
      <button
        onClick={onExport}
        disabled={exporting}
        className="px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
                   hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {exporting
          ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Download className="w-5 h-5" />}
        {exporting ? "جارٍ التصدير…" : "تصدير Excel"}
      </button>
    </div>
  );
}
