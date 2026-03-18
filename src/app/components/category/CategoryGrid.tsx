// ============================================================
// CategoryGrid.tsx
// ============================================================
import { AnimatePresence, motion } from "motion/react";
import { Tag }                     from "lucide-react";
import CategoryCard                from "./CategoryCard";
import { tCat }                    from "../../core/i18n/category.i18n";
import type { CategoryGridProps }  from "../../core/models/category.types";

export default function CategoryGrid({ categories, lang, onEdit, onDelete }: CategoryGridProps) {
  const isRtl = lang === "ar";

  if (categories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-20
                   rounded-2xl border border-dashed border-white/10"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10
                        flex items-center justify-center">
          <Tag className="w-6 h-6 text-gray-500" />
        </div>
        <p className={`text-sm text-gray-500 ${isRtl ? "text-right" : "text-left"}`}>
          {tCat(lang, "noCategories")}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            lang={lang}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
