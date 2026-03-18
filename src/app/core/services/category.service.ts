// ============================================================
// category.service.ts
// In-memory store — swap method bodies for fetch() later.
// ============================================================
import type { Category, CategoryFormData } from "../models/category.types";

const delay = <T>(data: T, ms = 280): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

// ── Seed data ─────────────────────────────────────────────────
let _categories: Category[] = [
  { id: "1",  name: "الحديد والصلب",  nameEn: "Iron & Steel",        icon: "🔩", color: "orange",  usageCount: 24, createdAt: "2024-01-10T00:00:00" },
  { id: "2",  name: "مواد البناء",    nameEn: "Building Materials",  icon: "🧱", color: "amber",   usageCount: 18, createdAt: "2024-01-12T00:00:00" },
  { id: "3",  name: "الخرسانة",       nameEn: "Concrete",            icon: "🏗️", color: "blue",    usageCount: 31, createdAt: "2024-01-15T00:00:00" },
  { id: "4",  name: "أخشاب",          nameEn: "Wood",                icon: "🪵", color: "emerald", usageCount: 9,  createdAt: "2024-02-01T00:00:00" },
  { id: "5",  name: "سباكة",          nameEn: "Plumbing",            icon: "🔧", color: "cyan",    usageCount: 14, createdAt: "2024-02-05T00:00:00" },
  { id: "6",  name: "كهرباء",         nameEn: "Electrical",          icon: "⚡", color: "violet",  usageCount: 22, createdAt: "2024-02-10T00:00:00" },
  { id: "7",  name: "ركام",           nameEn: "Aggregates",          icon: "🪨", color: "amber",   usageCount: 7,  createdAt: "2024-02-18T00:00:00" },
  { id: "8",  name: "طلاء",           nameEn: "Paint",               icon: "🎨", color: "pink",    usageCount: 11, createdAt: "2024-03-01T00:00:00" },
  { id: "9",  name: "تشطيبات",        nameEn: "Finishing",           icon: "🏠", color: "rose",    usageCount: 16, createdAt: "2024-03-05T00:00:00" },
  { id: "10", name: "عوازل",          nameEn: "Insulation",          icon: "🛡️", color: "emerald", usageCount: 8,  createdAt: "2024-03-10T00:00:00" },
];

let _nextId = 11;

class CategoryService {

  async fetchAll(): Promise<Category[]> {
    return delay([..._categories]);
  }

  async add(data: CategoryFormData): Promise<Category> {
    const newCat: Category = {
      id:         String(_nextId++),
      name:       data.name.trim(),
      nameEn:     data.nameEn.trim(),
      icon:       data.icon,
      color:      data.color,
      usageCount: 0,
      createdAt:  new Date().toISOString(),
    };
    _categories = [..._categories, newCat];
    return delay(newCat, 400);
  }

  async update(id: string, data: CategoryFormData): Promise<Category> {
    const updated = _categories.find((c) => c.id === id);
    if (!updated) throw new Error("Category not found");
    const next: Category = {
      ...updated,
      name:   data.name.trim(),
      nameEn: data.nameEn.trim(),
      icon:   data.icon,
      color:  data.color,
    };
    _categories = _categories.map((c) => (c.id === id ? next : c));
    return delay(next, 400);
  }

  async delete(id: string): Promise<void> {
    _categories = _categories.filter((c) => c.id !== id);
    return delay(undefined as void, 350);
  }
}

export const categoryService = new CategoryService();
