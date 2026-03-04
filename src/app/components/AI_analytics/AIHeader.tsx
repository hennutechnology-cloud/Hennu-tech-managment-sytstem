// ============================================================
// AIHeader.tsx
// ============================================================
import { Sparkles, Zap } from "lucide-react";

export default function AIHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#F97316]" />
          التحليلات الذكية (AI)
        </h1>
        <p className="text-gray-400">رؤى متقدمة مدعومة بالذكاء الاصطناعي</p>
      </div>
      <div className="px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white
                      rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        <span>مدعوم بـ GPT-4</span>
      </div>
    </div>
  );
}
