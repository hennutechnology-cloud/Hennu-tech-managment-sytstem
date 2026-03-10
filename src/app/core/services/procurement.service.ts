// ============================================================
// procurement.service.ts
// Static mock data — replace fetch() calls for real API later.
// All name / category / description strings are already in
// Arabic (matching the user's language setting).  When the API
// is live, the server should return strings in the requested lang.
// ============================================================
import type {
  Supplier,
  PriceTrendPoint,
  ProcurementSummary,
  SavingOpportunity,
  BestSupplierCard,
  ProcurementData,
} from "../models/procurement.types";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

// ── Helpers ───────────────────────────────────────────────────
let _nextId = 7; // starts after the 6 seed rows
const nextId = () => String(_nextId++);

class ProcurementService {

  private suppliers: Supplier[] = [
    {
      id: "1",
      name: "شركة البناء السريع",
      category: "مواد البناء",
      avgPrice: 4_750,
      deliveryTime: 5,
      performanceRating: 4.8,
      onTimeDelivery: 96,
      aiScore: 95,
      totalOrders: 142,
    },
    {
      id: "2",
      name: "مؤسسة الخليج للمواد",
      category: "مواد البناء",
      avgPrice: 4_920,
      deliveryTime: 7,
      performanceRating: 4.5,
      onTimeDelivery: 89,
      aiScore: 87,
      totalOrders: 98,
    },
    {
      id: "3",
      name: "شركة النخبة للتوريد",
      category: "الخرسانة",
      avgPrice: 3_600,
      deliveryTime: 4,
      performanceRating: 4.9,
      onTimeDelivery: 98,
      aiScore: 93,
      totalOrders: 210,
    },
    {
      id: "4",
      name: "مجموعة الرافدين",
      category: "الحديد والصلب",
      avgPrice: 6_200,
      deliveryTime: 10,
      performanceRating: 4.1,
      onTimeDelivery: 82,
      aiScore: 78,
      totalOrders: 55,
    },
    {
      id: "5",
      name: "شركة الفجر للمعدات",
      category: "المعدات والآلات",
      avgPrice: 12_000,
      deliveryTime: 14,
      performanceRating: 4.3,
      onTimeDelivery: 85,
      aiScore: 82,
      totalOrders: 33,
    },
    {
      id: "6",
      name: "مؤسسة الأمانة للخدمات",
      category: "خدمات النقل",
      avgPrice: 1_800,
      deliveryTime: 2,
      performanceRating: 4.6,
      onTimeDelivery: 94,
      aiScore: 91,
      totalOrders: 320,
    },
  ];

  // ── Suppliers CRUD ────────────────────────────────────────

  async getSuppliers(): Promise<Supplier[]> {
    return delay([...this.suppliers]);
  }

  async addSupplier(data: Omit<Supplier, "id">): Promise<Supplier> {
    const newSupplier: Supplier = { id: nextId(), ...data };
    this.suppliers = [...this.suppliers, newSupplier];
    return delay(newSupplier);
  }

  async updateSupplier(id: string, data: Omit<Supplier, "id">): Promise<Supplier> {
    const updated: Supplier = { id, ...data };
    this.suppliers = this.suppliers.map((s) => (s.id === id ? updated : s));
    return delay(updated);
  }

  async deleteSupplier(id: string): Promise<void> {
    this.suppliers = this.suppliers.filter((s) => s.id !== id);
    return delay(undefined);
  }

  // ── Price trend ───────────────────────────────────────────

  async getPriceTrend(): Promise<PriceTrendPoint[]> {
    return delay([
      { month: 1, price: 4_850 },
      { month: 2, price: 4_920 },
      { month: 3, price: 4_780 },
      { month: 4, price: 4_850 },
      { month: 5, price: 4_680 },
      { month: 6, price: 4_750 },
    ]);
  }

  // ── Summary ───────────────────────────────────────────────

  async getSummary(): Promise<ProcurementSummary> {
    const s = this.suppliers;
    return delay({
      totalSuppliers:  s.length,
      avgRating:       parseFloat(
        (s.reduce((a, x) => a + x.performanceRating, 0) / s.length).toFixed(1),
      ),
      avgDeliveryDays: Math.round(
        s.reduce((a, x) => a + x.deliveryTime, 0) / s.length,
      ),
      annualSaving: 12.3,
    });
  }

  // ── Saving opportunities ──────────────────────────────────

  async getSavingOpportunities(): Promise<SavingOpportunity[]> {
    return delay([
      { id: "o1", description: "شراء الخرسانة من المورد 3 يوفر 145,000 ر.س" },
      { id: "o2", description: "الطلبات الكبيرة تحصل على خصم 7% إضافي" },
      { id: "o3", description: "دمج طلبات الحديد مع النقل يوفر 3% من التكلفة الكلية" },
    ]);
  }

  // ── Best supplier card ────────────────────────────────────

  async getBestSupplier(): Promise<BestSupplierCard> {
    return delay({
      supplierId:   "1",
      supplierName: "شركة البناء السريع",
      reason:       "أفضل سعر + توصيل سريع",
      aiScore:      95,
    });
  }

  // ── Single fetch for page-level loading ───────────────────

  async fetchAll(): Promise<ProcurementData> {
    const [suppliers, priceTrend, summary, savingOpportunities, bestSupplier] =
      await Promise.all([
        this.getSuppliers(),
        this.getPriceTrend(),
        this.getSummary(),
        this.getSavingOpportunities(),
        this.getBestSupplier(),
      ]);
    return { suppliers, priceTrend, summary, savingOpportunities, bestSupplier };
  }
}

export const procurementService = new ProcurementService();
