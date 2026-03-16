// ============================================================
// subcontractor.service.ts
// ============================================================
import type {
  Subcontractor,
  SubcontractorData,
  SubcontractorFormData,
} from "../models/subcontractor.types";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

// ── In-memory store ──────────────────────────────────────────

let _subcontractors: Subcontractor[] = [
  {
    id: "1",
    name: "شركة البناء الحديث",
    specialty: "خرسانة",
    contactPerson: "أحمد علي",
    phone: "0100000000",
    email: "modern@build.com",
    address: "القاهرة",
  },
  {
    id: "2",
    name: "المقاولون العرب",
    specialty: "تشطيبات",
    contactPerson: "محمد حسن",
    phone: "0110000000",
    email: "arab@contract.com",
    address: "الجيزة",
  },
];

let _contracts = [
  { id: "1", subcontractorId: "1", contractValue: 500000 },
  { id: "2", subcontractorId: "1", contractValue: 300000 },
  { id: "3", subcontractorId: "2", contractValue: 200000 },
];

let _payments = [
  { id: "1", subcontractorId: "1", amount: 200000 },
  { id: "2", subcontractorId: "2", amount: 100000 },
];

let _nextId = 3;

// ── Service class ─────────────────────────────────────────────

class SubcontractorService {

  async fetchAll(): Promise<SubcontractorData> {
    return delay({
      subcontractors: [..._subcontractors],
      contracts:      [..._contracts],
      payments:       [..._payments],
    });
  }

  async add(data: SubcontractorFormData): Promise<SubcontractorData> {
    const newSub: Subcontractor = { id: String(++_nextId), ...data };
    _subcontractors = [..._subcontractors, newSub];
    return this.fetchAll();
  }

  async update(data: Subcontractor): Promise<SubcontractorData> {
    _subcontractors = _subcontractors.map((s) => (s.id === data.id ? { ...data } : s));
    return this.fetchAll();
  }

  async delete(id: string): Promise<SubcontractorData> {
    _subcontractors = _subcontractors.filter((s) => s.id !== id);
    _contracts      = _contracts.filter((c) => c.subcontractorId !== id);
    _payments       = _payments.filter((p) => p.subcontractorId !== id);
    return this.fetchAll();
  }
}

export const subcontractorService = new SubcontractorService();
