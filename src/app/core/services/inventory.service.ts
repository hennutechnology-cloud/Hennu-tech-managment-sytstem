// ============================================================
// inventory.service.ts
// ============================================================
import type {
  InventoryItem,
  InventoryMovement,
  InventorySummary,
  InventoryData,
  InventoryItemFormData,
  MovementType,
  StockStatus,
} from "../models/inventory.types";
import { deriveStatus } from "../i18n/inventory.i18n";
const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

let _itemId = 13;
let _moveId = 9;
const nextItemId = () => String(_itemId++);
const nextMoveId = () => String(_moveId++);

const today = new Date().toISOString().split("T")[0];

// ── Helpers ───────────────────────────────────────────────────
function computeStatus(qty: number, min: number): StockStatus {
  return deriveStatus(qty, min);
}

class InventoryService {

  // ── Seed data ─────────────────────────────────────────────
  private items: InventoryItem[] = [
    { id:"1",  name:"حديد تسليح Ø16",       sku:"STL-016",  category:"الحديد والصلب",   unit:"طن",      quantity:42,   minQuantity:10,  unitCost:3_800, totalValue:159_600, location:"مستودع أ",    supplier:"مجموعة الرافدين",           lastUpdated:"2026-03-01", status:"in_stock"     },
    { id:"2",  name:"أسمنت بورتلاندي",        sku:"CEM-001",  category:"مواد البناء",    unit:"كيس",     quantity:850,  minQuantity:200, unitCost:22,    totalValue:18_700,  location:"مستودع ب",    supplier:"شركة البناء السريع",         lastUpdated:"2026-03-03", status:"in_stock"     },
    { id:"3",  name:"خرسانة جاهزة C30",       sku:"CON-C30",  category:"الخرسانة",       unit:"م³",      quantity:0,    minQuantity:50,  unitCost:285,   totalValue:0,       location:"الموقع 1",   supplier:"شركة النخبة للتوريد",        lastUpdated:"2026-02-28", status:"out_of_stock"  },
    { id:"4",  name:"طوب طيني",              sku:"BRK-RED",  category:"مواد البناء",    unit:"ألف قطعة",quantity:18,   minQuantity:5,   unitCost:1_200, totalValue:21_600,  location:"مستودع أ",    supplier:"شركة البناء السريع",         lastUpdated:"2026-03-05", status:"in_stock"     },
    { id:"5",  name:"ألواح خشب قالب",         sku:"WOD-FRM",  category:"أخشاب",          unit:"م²",      quantity:320,  minQuantity:100, unitCost:55,    totalValue:17_600,  location:"مستودع ج",    supplier:"مؤسسة الخليج للمواد",        lastUpdated:"2026-03-02", status:"in_stock"     },
    { id:"6",  name:"أنابيب PVC Ø110",       sku:"PVC-110",  category:"سباكة",          unit:"م.ط",     quantity:180,  minQuantity:50,  unitCost:35,    totalValue:6_300,   location:"مستودع ب",    supplier:"مؤسسة الأمانة للخدمات",      lastUpdated:"2026-03-04", status:"in_stock"     },
    { id:"7",  name:"كابلات كهربائية 4×16mm", sku:"ELC-416",  category:"كهرباء",         unit:"م.ط",     quantity:8,    minQuantity:30,  unitCost:48,    totalValue:384,     location:"مخزن الكهرباء",supplier:"شركة الفجر للمعدات",         lastUpdated:"2026-03-06", status:"low_stock"    },
    { id:"8",  name:"رمل ناعم",              sku:"SND-FNE",  category:"ركام",           unit:"م³",      quantity:95,   minQuantity:20,  unitCost:65,    totalValue:6_175,   location:"الموقع 2",   supplier:"مؤسسة الخليج للمواد",        lastUpdated:"2026-02-25", status:"in_stock"     },
    { id:"9",  name:"زلط 20mm",              sku:"AGG-020",  category:"ركام",           unit:"م³",      quantity:12,   minQuantity:15,  unitCost:70,    totalValue:840,     location:"الموقع 2",   supplier:"مؤسسة الخليج للمواد",        lastUpdated:"2026-02-27", status:"low_stock"    },
    { id:"10", name:"طلاء خارجي أبيض",        sku:"PNT-EXT",  category:"طلاء",           unit:"لتر",     quantity:0,    minQuantity:100, unitCost:28,    totalValue:0,       location:"مستودع ج",    supplier:"مؤسسة الأمانة للخدمات",      lastUpdated:"2026-03-01", status:"out_of_stock"  },
    { id:"11", name:"لوح جبس",               sku:"GYP-STD",  category:"تشطيبات",        unit:"لوح",     quantity:640,  minQuantity:100, unitCost:42,    totalValue:26_880,  location:"مستودع ب",    supplier:"شركة البناء السريع",         lastUpdated:"2026-03-07", status:"in_stock"     },
    { id:"12", name:"عازل مائي",             sku:"WTR-ISO",  category:"عوازل",          unit:"م²",      quantity:210,  minQuantity:80,  unitCost:38,    totalValue:7_980,   location:"مستودع أ",    supplier:"مؤسسة الخليج للمواد",        lastUpdated:"2026-03-05", status:"in_stock"     },
  ];

  private movements: InventoryMovement[] = [
    { id:"m1", itemId:"1",  itemName:"حديد تسليح Ø16",       type:"in",         quantity:20,  date:"2026-03-01", reference:"PO-2026-041", performedBy:"أحمد السالم"  },
    { id:"m2", itemId:"3",  itemName:"خرسانة جاهزة C30",      type:"out",        quantity:60,  date:"2026-02-28", reference:"WO-2026-018", performedBy:"محمد العتيبي" },
    { id:"m3", itemId:"7",  itemName:"كابلات كهربائية 4×16mm",type:"out",        quantity:22,  date:"2026-03-06", reference:"WO-2026-022", performedBy:"سالم الزهراني"},
    { id:"m4", itemId:"2",  itemName:"أسمنت بورتلاندي",        type:"in",         quantity:200, date:"2026-03-03", reference:"PO-2026-039", performedBy:"أحمد السالم"  },
    { id:"m5", itemId:"9",  itemName:"زلط 20mm",              type:"adjustment", quantity:-3,  date:"2026-02-27", reference:"ADJ-2026-005",performedBy:"عبدالله الدوسري"},
    { id:"m6", itemId:"11", itemName:"لوح جبس",               type:"in",         quantity:300, date:"2026-03-07", reference:"PO-2026-042", performedBy:"أحمد السالم"  },
    { id:"m7", itemId:"10", itemName:"طلاء خارجي أبيض",        type:"out",        quantity:100, date:"2026-03-01", reference:"WO-2026-019", performedBy:"محمد العتيبي" },
    { id:"m8", itemId:"5",  itemName:"ألواح خشب قالب",         type:"out",        quantity:80,  date:"2026-03-02", reference:"WO-2026-020", performedBy:"سالم الزهراني"},
  ];

  // ── Private helpers ───────────────────────────────────────
  private buildSummary(): InventorySummary {
    const cats = new Set(this.items.map((i) => i.category));
    return {
      totalItems:      this.items.length,
      totalValue:      this.items.reduce((a, i) => a + i.totalValue, 0),
      lowStockCount:   this.items.filter((i) => i.status === "low_stock").length,
      outOfStockCount: this.items.filter((i) => i.status === "out_of_stock").length,
      totalCategories: cats.size,
    };
  }

  // ── Read ──────────────────────────────────────────────────
  async getItems(): Promise<InventoryItem[]> {
    return delay([...this.items]);
  }

  async getMovements(): Promise<InventoryMovement[]> {
    return delay([...this.movements].sort((a, b) => b.date.localeCompare(a.date)));
  }

  async getSummary(): Promise<InventorySummary> {
    return delay(this.buildSummary());
  }

  async fetchAll(): Promise<InventoryData> {
    const [items, movements, summary] = await Promise.all([
      this.getItems(),
      this.getMovements(),
      this.getSummary(),
    ]);
    return { items, movements, summary };
  }

  // ── Create ────────────────────────────────────────────────
  async addItem(data: InventoryItemFormData): Promise<InventoryItem> {
    const item: InventoryItem = {
      id:          nextItemId(),
      totalValue:  data.quantity * data.unitCost,
      status:      computeStatus(data.quantity, data.minQuantity),
      ...data,
    };
    this.items = [...this.items, item];
    return delay(item);
  }

  // ── Update ────────────────────────────────────────────────
  async updateItem(id: string, data: InventoryItemFormData): Promise<InventoryItem> {
    const updated: InventoryItem = {
      id,
      totalValue: data.quantity * data.unitCost,
      status:     computeStatus(data.quantity, data.minQuantity),
      ...data,
    };
    this.items = this.items.map((i) => (i.id === id ? updated : i));
    return delay(updated);
  }

  // ── Delete ────────────────────────────────────────────────
  async deleteItem(id: string): Promise<void> {
    this.items     = this.items.filter((i) => i.id !== id);
    this.movements = this.movements.filter((m) => m.itemId !== id);
    return delay(undefined);
  }

  // ── Stock movement ─────────────────────────────────────────
  async recordMovement(
    itemId:    string,
    type:      MovementType,
    qty:       number,
    reference: string,
    notes:     string,
    performedBy = "المستخدم الحالي",
  ): Promise<void> {
    // Update item quantity
    this.items = this.items.map((item) => {
      if (item.id !== itemId) return item;
      const delta   = type === "in" ? qty : type === "out" ? -qty : qty; // adjustment uses signed qty
      const newQty  = Math.max(0, item.quantity + delta);
      return {
        ...item,
        quantity:     newQty,
        totalValue:   newQty * item.unitCost,
        status:       computeStatus(newQty, item.minQuantity),
        lastUpdated:  today,
      };
    });

    // Record movement log
    const target = this.items.find((i) => i.id === itemId);
    const move: InventoryMovement = {
      id:          nextMoveId(),
      itemId,
      itemName:    target?.name ?? "",
      type,
      quantity:    type === "out" ? qty : qty,
      date:        today,
      reference,
      notes,
      performedBy,
    };
    this.movements = [move, ...this.movements];

    return delay(undefined);
  }
}

export const inventoryService = new InventoryService();
