// ============================================================
// DepreciationHeader.tsx
// ============================================================
import { Plus } from "lucide-react";
import { useDepreciation } from "../../core/services/Depreciation.service";

export default function DepreciationHeader() {
  const { openCreate } = useDepreciation();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">نظام الإهلاك</h1>
        <p className="text-gray-400">إدارة إهلاك الأصول الثابتة</p>
      </div>
      <button
        onClick={openCreate}
        className="px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
          hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        إضافة أصل جديد
      </button>
    </div>
  );
}
