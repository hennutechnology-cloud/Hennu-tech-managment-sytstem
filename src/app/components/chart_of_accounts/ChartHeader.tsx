import { Plus } from "lucide-react";
import type { ChartHeaderProps } from "../../core/models/ChartOfAccounts.types";

export default function ChartHeader({
  title = "دليل الحسابات",
  subtitle = "الهيكل الكامل للحسابات المالية",
  onAddAccount,
}: ChartHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400">{subtitle}</p>
      </div>
      <button
        onClick={onAddAccount}
        className="px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
                   hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        إضافة حساب جديد
      </button>
    </div>
  );
}
