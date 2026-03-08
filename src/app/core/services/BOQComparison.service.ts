// ============================================================
// BOQComparison.service.ts
// Currently uses static mock data.
// Each method is a self-contained async call — swap the body
// for a real fetch() / axios call when the API is ready.
//
// Convention matches dashboard.service.ts:
//   • delay() simulates network latency in dev
//   • fetchAll() runs every sub-call in parallel
// ============================================================
import type {
  BOQItem,
  SavingsSummary,
  OptimisationSuggestion,
  BOQComparisonData,
  UploadStatus,
} from "../models/BOQComparison.types";

// ── Dev helper ───────────────────────────────────────────────
const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

// ── API base (swap to real URL when backend is ready) ────────
// const API = "https://api.hennu.tech/v1/boq";

class BOQComparisonService {

  // ── Items ─────────────────────────────────────────────────
  async getItems(): Promise<BOQItem[]> {
    // TODO: return fetch(`${API}/items`).then(r => r.json())
    return delay([
      {
        id:    "1",
        item:  "خرسانة مسلحة للأساسات",
        quantity: "8,900 م³",
        estimated: 320,
        suppliers: [
          { id: "supplier1", name: "مورد 1", unitPrice: 315 },
          { id: "supplier2", name: "مورد 2", unitPrice: 325 },
          { id: "supplier3", name: "مورد 3", unitPrice: 310 },
        ],
        bestSupplierId: "supplier3",
        savings: 89_000,
      },
      {
        id:    "2",
        item:  "حديد تسليح قطر 16-32 مم",
        quantity: "560 طن",
        estimated: 4_200,
        suppliers: [
          { id: "supplier1", name: "مورد 1", unitPrice: 4_350 },
          { id: "supplier2", name: "مورد 2", unitPrice: 4_150 },
          { id: "supplier3", name: "مورد 3", unitPrice: 4_100 },
        ],
        bestSupplierId: "supplier3",
        savings: 56_000,
      },
      {
        id:    "3",
        item:  "بلوك خفيف 20 سم",
        quantity: "18,500 م²",
        estimated: 85,
        suppliers: [
          { id: "supplier1", name: "مورد 1", unitPrice: 88 },
          { id: "supplier2", name: "مورد 2", unitPrice: 82 },
          { id: "supplier3", name: "مورد 3", unitPrice: 84 },
        ],
        bestSupplierId: "supplier2",
        savings: 55_500,
      },
    ]);
  }

  // ── Savings summary ───────────────────────────────────────
  async getSummary(): Promise<SavingsSummary> {
    // TODO: return fetch(`${API}/summary`).then(r => r.json())
    return delay({
      totalSavings:  200_500,
      itemCount:     3,
      aiAccuracyPct: 95,
    });
  }

  // ── Optimisation suggestions ──────────────────────────────
  async getSuggestions(): Promise<OptimisationSuggestion[]> {
    // TODO: return fetch(`${API}/suggestions`).then(r => r.json())
    return delay([
      {
        id:   "s1",
        type: "saving",
        text: "التعامل مع المورد 3 لبنود الحديد والخرسانة يوفر 8.5% من التكلفة الإجمالية",
      },
      {
        id:   "s2",
        type: "risk",
        text: "المورد 1 يعرض أسعار أعلى من المتوسط بنسبة 3.5% - يُنصح بالتفاوض",
      },
    ]);
  }

  // ── Upload BOQ file ───────────────────────────────────────
  async uploadBOQ(file: File): Promise<{ status: UploadStatus }> {
    // TODO:
    // const form = new FormData();
    // form.append("file", file);
    // return fetch(`${API}/upload/boq`, { method: "POST", body: form }).then(r => r.json());
    return delay({ status: "success" as UploadStatus }, 800);
  }

  // ── Upload supplier quotes ────────────────────────────────
  async uploadQuotes(file: File): Promise<{ status: UploadStatus }> {
    // TODO:
    // const form = new FormData();
    // form.append("file", file);
    // return fetch(`${API}/upload/quotes`, { method: "POST", body: form }).then(r => r.json());
    return delay({ status: "success" as UploadStatus }, 800);
  }

  // ── Trigger AI optimisation ───────────────────────────────
  async runAIOptimise(): Promise<{ ok: boolean }> {
    // TODO: return fetch(`${API}/optimise`, { method: "POST" }).then(r => r.json())
    return delay({ ok: true }, 1_200);
  }

  // ── Single parallel fetch for page-level loading state ───
  async fetchAll(): Promise<BOQComparisonData> {
    const [items, summary, suggestions] = await Promise.all([
      this.getItems(),
      this.getSummary(),
      this.getSuggestions(),
    ]);
    return { items, summary, suggestions };
  }
}

export const boqComparisonService = new BOQComparisonService();
