// ============================================================
// Categories.tsx
// ============================================================
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence }      from "motion/react";

import CategoryHeader        from "../components/category/CategoryHeader";
import CategorySearchBar     from "../components/category/CategorySearchBar";
import CategoryGrid          from "../components/category/CategoryGrid";
import CategoryModal         from "../components/category/CategoryModal";
import CategoryDeleteConfirm from "../components/category/CategoryDeleteConfirm";

import { categoryService }  from "../core/services/category.service";
import { useLang }          from "../core/context/LangContext";
import { tCat }             from "../core/i18n/category.i18n";
import type {
  Category,
  CategoryFormData,
  CategoryModalMode,
} from "../core/models/category.types";

export default function CategoriesPage() {
  const { lang } = useLang();

  // ── Data ───────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);

  // ── Search ─────────────────────────────────────────────────
  const [search, setSearch] = useState("");

  // ── Add / Edit modal ───────────────────────────────────────
  const [modalOpen,   setModalOpen]   = useState(false);
  const [modalMode,   setModalMode]   = useState<CategoryModalMode>("add");
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  // ── Delete modal ───────────────────────────────────────────
  const [deleteOpen,   setDeleteOpen]   = useState(false);
  const [deleteCat,    setDeleteCat]    = useState<Category | null>(null);

  // ── Fetch ──────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    categoryService.fetchAll()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  // ── Filtered ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q),
    );
  }, [categories, search]);

  // ── Handlers ───────────────────────────────────────────────
  const handleOpenAdd = () => {
    setSelectedCat(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setSelectedCat(cat);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleOpenDelete = (cat: Category) => {
    setDeleteCat(cat);
    setDeleteOpen(true);
  };

  const handleSave = async (data: CategoryFormData, id?: string) => {
    if (id) {
      const updated = await categoryService.update(id, data);
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } else {
      const created = await categoryService.add(data);
      setCategories((prev) => [...prev, created]);
    }
  };

  const handleDelete = async () => {
    if (!deleteCat) return;
    await categoryService.delete(deleteCat.id);
    setCategories((prev) => prev.filter((c) => c.id !== deleteCat.id));
  };

  // ── Loading skeleton ───────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-12 rounded-2xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm">{tCat(lang, "loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <CategoryHeader
        lang={lang}
        total={categories.length}
        onAdd={handleOpenAdd}
      />

      {/* Search */}
      <CategorySearchBar
        value={search}
        onChange={setSearch}
        lang={lang}
      />

      {/* No results message */}
      <AnimatePresence>
        {search.trim() && filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center text-sm text-gray-500 py-2"
          >
            {tCat(lang, "noResults")}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Grid */}
      <CategoryGrid
        categories={filtered}
        lang={lang}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit modal */}
      <CategoryModal
        isOpen={modalOpen}
        mode={modalMode}
        category={selectedCat}
        lang={lang}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {/* Delete confirmation */}
      <CategoryDeleteConfirm
        isOpen={deleteOpen}
        category={deleteCat}
        lang={lang}
        onClose={() => { setDeleteOpen(false); setDeleteCat(null); }}
        onConfirm={handleDelete}
      />

    </div>
  );
}
