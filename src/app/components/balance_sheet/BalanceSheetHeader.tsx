// ============================================================
// BalanceSheetHeader.tsx
// ============================================================
import { Download } from "lucide-react";
import { useBalanceSheet } from "../../core/services/BalanceSheet.service";
import { exportPdf } from "../../core/shared/components/exportPdf";
import { buildBalanceSheetPdf } from "./buildBalanceSheetPdf";

const MONTHS_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

function formatAsOf(v: string): string {
  if (!v) return "";
  const [y, m, d] = v.split("-");
  return `${parseInt(d)} ${MONTHS_AR[parseInt(m) - 1]} ${y}`;
}

export default function BalanceSheetHeader() {
  const { data, loading, asOf } = useBalanceSheet();

  function handleExport() {
    if (!data) return;
    exportPdf(buildBalanceSheetPdf(data, formatAsOf(asOf)));
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">الميزانية العمومية</h1>
        <p className="text-gray-400">المركز المالي للشركة</p>
      </div>
      <button
        onClick={handleExport}
        disabled={!data || loading}
        className="px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
          hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading
          ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Download className="w-5 h-5" />
        }
        تصدير PDF
      </button>
    </div>
  );
}
