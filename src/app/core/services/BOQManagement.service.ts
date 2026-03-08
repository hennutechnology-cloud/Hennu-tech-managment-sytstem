// ============================================================
// BOQManagement.service.ts
// Static mock data now — swap each method body for fetch() later.
// month is always a number 1–12. Section/item names are plain strings.
// ============================================================
import type {
  BOQSection,
  BOQSummary,
  BOQManagementData,
  BOQItemFormValues,
  BOQItem,
} from "../models/BOQManagement.types";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

// ── Static seed data ──────────────────────────────────────────
const SEED_SECTIONS: BOQSection[] = [
  {
    code: "01",
    name: "أعمال الخرسانة",
    items: [
      { id: "1", code: "01.001", sectionCode: "01", description: "خرسانة مسلحة للأساسات",       unit: "m3",  quantity: 8_900, unitPrice: 320, totalCost: 2_848_000, actualCost: 2_900_000, variance:  1.83, month: 1 },
      { id: "2", code: "01.002", sectionCode: "01", description: "خرسانة عادية للعزل",           unit: "m3",  quantity: 1_200, unitPrice: 180, totalCost:   216_000, actualCost:   210_000, variance: -2.78, month: 2 },
      { id: "3", code: "01.003", sectionCode: "01", description: "خرسانة مسلحة للأعمدة",         unit: "m3",  quantity: 3_400, unitPrice: 380, totalCost: 1_292_000, actualCost: 1_350_000, variance:  4.49, month: 3 },
    ],
  },
  {
    code: "02",
    name: "أعمال الحديد",
    items: [
      { id: "4", code: "02.001", sectionCode: "02", description: "حديد تسليح قطر 16-32 مم",       unit: "ton", quantity:   560, unitPrice: 4_200, totalCost: 2_352_000, actualCost: 2_296_000, variance: -2.38, month: 2 },
      { id: "5", code: "02.002", sectionCode: "02", description: "حديد تسليح قطر 10-14 مم",       unit: "ton", quantity:   210, unitPrice: 4_350, totalCost:   913_500, actualCost:   945_000, variance:  3.45, month: 3 },
    ],
  },
  {
    code: "03",
    name: "أعمال البناء والمباني",
    items: [
      { id: "6", code: "03.001", sectionCode: "03", description: "بلوك خفيف 20 سم",               unit: "m2",  quantity: 18_500, unitPrice:  85, totalCost: 1_572_500, actualCost: 1_516_700, variance: -3.55, month: 4 },
      { id: "7", code: "03.002", sectionCode: "03", description: "طوب احمر 25 سم",                unit: "m2",  quantity:  4_200, unitPrice: 110, totalCost:   462_000, actualCost:   475_000, variance:  2.81, month: 4 },
    ],
  },
  {
    code: "04",
    name: "أعمال التشطيبات",
    items: [
      { id: "8", code: "04.001", sectionCode: "04", description: "بلاط سيراميك 60×60 سم",          unit: "m2",  quantity:  9_800, unitPrice: 120, totalCost: 1_176_000, actualCost: 1_200_000, variance:  2.04, month: 5 },
      { id: "9", code: "04.002", sectionCode: "04", description: "دهان بلاستيك داخلي",              unit: "m2",  quantity: 22_000, unitPrice:  35, totalCost:   770_000, actualCost:   755_000, variance: -1.95, month: 6 },
    ],
  },
];

class BOQManagementService {

  async getSections(): Promise<BOQSection[]> {
    // TODO: return fetch(`${API}/boq/sections`).then(r => r.json())
    return delay(structuredClone(SEED_SECTIONS));
  }

  async getSummary(): Promise<BOQSummary> {
    // TODO: return fetch(`${API}/boq/summary`).then(r => r.json())
    const sections = await this.getSections();
    const items    = sections.flatMap((s) => s.items);
    const totalEstimated = items.reduce((a, i) => a + i.totalCost, 0);
    const totalActual    = items.reduce((a, i) => a + i.actualCost, 0);
    const totalVariance  = ((totalActual / totalEstimated) - 1) * 100;
    return delay({ totalEstimated, totalActual, totalVariance });
  }

  async fetchAll(): Promise<BOQManagementData> {
    const [sections, summary] = await Promise.all([
      this.getSections(),
      this.getSummary(),
    ]);
    return { sections, summary };
  }

  async addItem(values: BOQItemFormValues): Promise<BOQItem> {
    // TODO: return fetch(`${API}/boq/items`, { method: "POST", body: JSON.stringify(values) }).then(r => r.json())
    const quantity   = parseFloat(values.quantity);
    const unitPrice  = parseFloat(values.unitPrice);
    const actualCost = parseFloat(values.actualCost);
    const totalCost  = quantity * unitPrice;
    const variance   = ((actualCost / totalCost) - 1) * 100;
    const newItem: BOQItem = {
      id:          crypto.randomUUID(),
      code:        values.code,
      sectionCode: values.sectionCode,
      description: values.description,
      unit:        values.unit,
      quantity,
      unitPrice,
      totalCost,
      actualCost,
      variance,
      month:       parseInt(values.month, 10),
    };
    return delay(newItem, 500);
  }

  async updateItem(id: string, values: BOQItemFormValues): Promise<BOQItem> {
    // TODO: return fetch(`${API}/boq/items/${id}`, { method: "PUT", body: JSON.stringify(values) }).then(r => r.json())
    const quantity   = parseFloat(values.quantity);
    const unitPrice  = parseFloat(values.unitPrice);
    const actualCost = parseFloat(values.actualCost);
    const totalCost  = quantity * unitPrice;
    const variance   = ((actualCost / totalCost) - 1) * 100;
    return delay({
      id, code: values.code, sectionCode: values.sectionCode,
      description: values.description, unit: values.unit,
      quantity, unitPrice, totalCost, actualCost, variance,
      month: parseInt(values.month, 10),
    } as BOQItem, 500);
  }

  async deleteItem(id: string): Promise<void> {
    // TODO: return fetch(`${API}/boq/items/${id}`, { method: "DELETE" })
    return delay(undefined as void, 400);
  }
}

export const boqManagementService = new BOQManagementService();
