// ============================================================
// BOQManagement.service.ts
// ============================================================
import type {
  BOQSection,
  BOQSummary,
  BOQManagementData,
  BOQItemFormValues,
  BOQItem,
  BOQProgressEntry,
  BOQProgressFormValues,
  BOQItemProgress,
} from "../models/BOQManagement.types";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

// ── Static seed data ──────────────────────────────────────────
const SEED_SECTIONS: BOQSection[] = [
  {
    code: "01", name: "أعمال الخرسانة",
    items: [
      { id: "1", code: "01.001", sectionCode: "01", description: "خرسانة مسلحة للأساسات",   unit: "m3",  quantity: 8_900, unitPrice: 320,   totalCost: 2_848_000, actualCost: 2_900_000, variance:  1.83, month: 1 },
      { id: "2", code: "01.002", sectionCode: "01", description: "خرسانة عادية للعزل",       unit: "m3",  quantity: 1_200, unitPrice: 180,   totalCost:   216_000, actualCost:   210_000, variance: -2.78, month: 2 },
      { id: "3", code: "01.003", sectionCode: "01", description: "خرسانة مسلحة للأعمدة",     unit: "m3",  quantity: 3_400, unitPrice: 380,   totalCost: 1_292_000, actualCost: 1_350_000, variance:  4.49, month: 3 },
    ],
  },
  {
    code: "02", name: "أعمال الحديد",
    items: [
      { id: "4", code: "02.001", sectionCode: "02", description: "حديد تسليح قطر 16-32 مم",   unit: "ton", quantity:   560, unitPrice: 4_200, totalCost: 2_352_000, actualCost: 2_296_000, variance: -2.38, month: 2 },
      { id: "5", code: "02.002", sectionCode: "02", description: "حديد تسليح قطر 10-14 مم",   unit: "ton", quantity:   210, unitPrice: 4_350, totalCost:   913_500, actualCost:   945_000, variance:  3.45, month: 3 },
    ],
  },
  {
    code: "03", name: "أعمال البناء والمباني",
    items: [
      { id: "6", code: "03.001", sectionCode: "03", description: "بلوك خفيف 20 سم",            unit: "m2",  quantity: 18_500, unitPrice:  85,   totalCost: 1_572_500, actualCost: 1_516_700, variance: -3.55, month: 4 },
      { id: "7", code: "03.002", sectionCode: "03", description: "طوب احمر 25 سم",             unit: "m2",  quantity:  4_200, unitPrice: 110,   totalCost:   462_000, actualCost:   475_000, variance:  2.81, month: 4 },
    ],
  },
  {
    code: "04", name: "أعمال التشطيبات",
    items: [
      { id: "8", code: "04.001", sectionCode: "04", description: "بلاط سيراميك 60×60 سم",      unit: "m2",  quantity:  9_800, unitPrice: 120,   totalCost: 1_176_000, actualCost: 1_200_000, variance:  2.04, month: 5 },
      { id: "9", code: "04.002", sectionCode: "04", description: "دهان بلاستيك داخلي",          unit: "m2",  quantity: 22_000, unitPrice:  35,   totalCost:   770_000, actualCost:   755_000, variance: -1.95, month: 6 },
    ],
  },
];

// ── In-memory progress store ──────────────────────────────────
let _progressStore: Record<string, BOQProgressEntry[]> = {};

function computeProgress(itemId: string, itemQuantity: number): BOQItemProgress {
  const entries        = _progressStore[itemId] ?? [];
  const totalProcessed = entries.reduce((s, e) => s + e.quantity, 0);
  const totalCost      = entries.reduce((s, e) => s + e.totalCost, 0);
  const percentComplete = itemQuantity > 0
    ? Math.min((totalProcessed / itemQuantity) * 100, 100)
    : 0;
  return {
    itemId,
    entries,
    totalProcessed,
    totalCost,
    percentComplete,
    remaining: Math.max(itemQuantity - totalProcessed, 0),
  };
}

class BOQManagementService {

  async getSections(): Promise<BOQSection[]> {
    return delay(structuredClone(SEED_SECTIONS));
  }

  async getSummary(): Promise<BOQSummary> {
    const sections       = await this.getSections();
    const items          = sections.flatMap((s) => s.items);
    const totalEstimated = items.reduce((a, i) => a + i.totalCost, 0);
    const totalActual    = items.reduce((a, i) => a + i.actualCost, 0);
    const totalVariance  = ((totalActual / totalEstimated) - 1) * 100;
    return delay({ totalEstimated, totalActual, totalVariance });
  }

  async fetchAll(): Promise<BOQManagementData> {
    const [sections, summary] = await Promise.all([this.getSections(), this.getSummary()]);
    return { sections, summary };
  }

  async addItem(values: BOQItemFormValues): Promise<BOQItem> {
    const quantity   = parseFloat(values.quantity);
    const unitPrice  = parseFloat(values.unitPrice);
    const actualCost = parseFloat(values.actualCost);
    const totalCost  = quantity * unitPrice;
    return delay({
      id: crypto.randomUUID(),
      code: values.code, sectionCode: values.sectionCode,
      description: values.description, unit: values.unit,
      quantity, unitPrice, totalCost, actualCost,
      variance: ((actualCost / totalCost) - 1) * 100,
      month: parseInt(values.month, 10),
    } as BOQItem, 500);
  }

  async updateItem(id: string, values: BOQItemFormValues): Promise<BOQItem> {
    const quantity   = parseFloat(values.quantity);
    const unitPrice  = parseFloat(values.unitPrice);
    const actualCost = parseFloat(values.actualCost);
    const totalCost  = quantity * unitPrice;
    return delay({
      id, code: values.code, sectionCode: values.sectionCode,
      description: values.description, unit: values.unit,
      quantity, unitPrice, totalCost, actualCost,
      variance: ((actualCost / totalCost) - 1) * 100,
      month: parseInt(values.month, 10),
    } as BOQItem, 500);
  }

  async deleteItem(id: string): Promise<void> {
    delete _progressStore[id];
    return delay(undefined as void, 400);
  }

  // ── Progress ───────────────────────────────────────────────

  getProgress(itemId: string, itemQuantity: number): BOQItemProgress {
    return computeProgress(itemId, itemQuantity);
  }

  getProgressMap(items: BOQItem[]): Record<string, BOQItemProgress> {
    const map: Record<string, BOQItemProgress> = {};
    items.forEach((item) => { map[item.id] = computeProgress(item.id, item.quantity); });
    return map;
  }

  async addProgressEntry(
    itemId: string,
    itemQuantity: number,
    values: BOQProgressFormValues,
  ): Promise<BOQItemProgress> {
    const quantity  = parseFloat(values.quantity);
    const unitPrice = parseFloat(values.unitPrice);
    const entry: BOQProgressEntry = {
      id:              crypto.randomUUID(),
      itemId,
      executorType:    values.executorType,
      executorName:    values.executorName.trim(),
      subcontractorId: values.subcontractorId || undefined,
      unitPrice,
      quantity,
      totalCost:       quantity * unitPrice,
      date:            values.date,
      notes:           values.notes.trim(),
    };
    if (!_progressStore[itemId]) _progressStore[itemId] = [];
    _progressStore[itemId] = [..._progressStore[itemId], entry];
    return delay(computeProgress(itemId, itemQuantity), 400);
  }

  async updateProgressEntry(
    itemId: string,
    entryId: string,
    itemQuantity: number,
    values: BOQProgressFormValues,
  ): Promise<BOQItemProgress> {
    const quantity  = parseFloat(values.quantity);
    const unitPrice = parseFloat(values.unitPrice);
    if (_progressStore[itemId]) {
      _progressStore[itemId] = _progressStore[itemId].map((e) =>
        e.id === entryId
          ? {
              ...e,
              executorType:    values.executorType,
              executorName:    values.executorName.trim(),
              subcontractorId: values.subcontractorId || undefined,
              unitPrice,
              quantity,
              totalCost:       quantity * unitPrice,
              date:            values.date,
              notes:           values.notes.trim(),
            }
          : e
      );
    }
    return delay(computeProgress(itemId, itemQuantity), 400);
  }

  deleteProgressEntry(itemId: string, entryId: string, itemQuantity: number): BOQItemProgress {
    if (_progressStore[itemId]) {
      _progressStore[itemId] = _progressStore[itemId].filter((e) => e.id !== entryId);
    }
    return computeProgress(itemId, itemQuantity);
  }
}

export const boqManagementService = new BOQManagementService();
