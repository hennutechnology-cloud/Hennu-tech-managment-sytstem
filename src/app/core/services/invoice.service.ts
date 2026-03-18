// ============================================================
// invoice.service.ts
// ============================================================
import type {
  Invoice, InvoiceFormValues, InvoiceSummary,
  PaymentRecord, PaymentFormValues, InvoiceStatus,
} from "../models/invoice.types";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

function computeStatus(total: number, paid: number, dueDate: string): InvoiceStatus {
  if (paid >= total) return "paid";
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate.split("T")[0]); due.setHours(0, 0, 0, 0);
  if (paid > 0)  return "partial";
  if (due < now) return "overdue";
  return "pending";
}

// ── Seed data ─────────────────────────────────────────────────
let _invoices: Invoice[] = [
  {
    id: "1", invoiceNumber: "INV-2024-001",
    accountType: "revenue", partyType: "client",
    partyId: "c1", partyName: "مجموعة الإعمار",
    partyEntity: "شركة الإعمار للتطوير العقاري",
    projectId: "p1", projectName: "برج الأعمال المركزي",
    date: "2024-02-01T00:00:00", dueDate: "2024-03-01T00:00:00",
    totalAmount: 850000, paidAmount: 850000, remainingAmount: 0,
    status: "paid", description: "دفعة أولى لأعمال الخرسانة",
    payments: [
      { id: "pay1", invoiceId: "1", amount: 500000, date: "2024-02-10T00:00:00", note: "دفعة مقدمة",   method: "bank_transfer" },
      { id: "pay2", invoiceId: "1", amount: 350000, date: "2024-02-25T00:00:00", note: "تسوية نهائية", method: "bank_transfer" },
    ],
    createdAt: "2024-02-01T00:00:00",
  },
  {
    id: "2", invoiceNumber: "INV-2024-002",
    accountType: "expense", partyType: "subcontractor",
    partyId: "1", partyName: "شركة البناء الحديث",
    partyEntity: "شركة البناء الحديث للمقاولات",
    projectId: "p1", projectName: "برج الأعمال المركزي",
    date: "2024-02-05T00:00:00", dueDate: "2024-03-05T00:00:00",
    totalAmount: 320000, paidAmount: 200000, remainingAmount: 120000,
    status: "partial", description: "مستخلص أعمال خرسانة الأساسات",
    payments: [
      { id: "pay3", invoiceId: "2", amount: 200000, date: "2024-02-20T00:00:00", note: "دفعة جزئية", method: "bank_transfer" },
    ],
    createdAt: "2024-02-05T00:00:00",
  },
  {
    id: "3", invoiceNumber: "INV-2024-003",
    accountType: "revenue", partyType: "client",
    partyId: "c2", partyName: "شركة النخيل العقارية",
    partyEntity: "النخيل للتطوير العقاري",
    projectId: "p2", projectName: "مجمع الشقق السكنية",
    date: "2024-03-01T00:00:00", dueDate: "2024-04-01T00:00:00",
    totalAmount: 1200000, paidAmount: 600000, remainingAmount: 600000,
    status: "partial", description: "أعمال الهيكل الإنشائي - الدور الأول",
    payments: [
      { id: "pay4", invoiceId: "3", amount: 600000, date: "2024-03-15T00:00:00", note: "", method: "check" },
    ],
    createdAt: "2024-03-01T00:00:00",
  },
  {
    id: "4", invoiceNumber: "INV-2024-004",
    accountType: "expense", partyType: "subcontractor",
    partyId: "2", partyName: "المقاولون العرب",
    partyEntity: "شركة المقاولون العرب",
    projectId: "p2", projectName: "مجمع الشقق السكنية",
    date: "2024-03-10T00:00:00", dueDate: "2024-04-10T00:00:00",
    totalAmount: 180000, paidAmount: 0, remainingAmount: 180000,
    status: "pending", description: "أعمال تشطيبات الواجهات",
    payments: [],
    createdAt: "2024-03-10T00:00:00",
  },
  {
    id: "5", invoiceNumber: "INV-2024-005",
    accountType: "revenue", partyType: "client",
    partyId: "c3", partyName: "الشركة الوطنية للإنشاء",
    partyEntity: "الشركة الوطنية للإنشاء والتطوير",
    projectId: "p3", projectName: "مستودعات صناعية",
    date: "2024-01-15T00:00:00", dueDate: "2024-02-15T00:00:00",
    totalAmount: 450000, paidAmount: 0, remainingAmount: 450000,
    status: "overdue", description: "دفعة تأمين المشروع",
    payments: [],
    createdAt: "2024-01-15T00:00:00",
  },
];

let _nextId    = 6;
let _nextPayId = 10;
let _invoiceSeq = 6;

function recalc(inv: Invoice): Invoice {
  const paid      = inv.payments.reduce((s, p) => s + p.amount, 0);
  const remaining = Math.max(inv.totalAmount - paid, 0);
  return {
    ...inv,
    paidAmount:      paid,
    remainingAmount: remaining,
    status:          computeStatus(inv.totalAmount, paid, inv.dueDate),
  };
}

function buildSummary(): InvoiceSummary {
  const rev  = _invoices.filter(i => i.accountType === "revenue");
  const exp  = _invoices.filter(i => i.accountType === "expense");
  return {
    totalInvoices:   _invoices.length,
    totalRevenues:   rev.reduce((s, i) => s + i.totalAmount, 0),
    totalExpenses:   exp.reduce((s, i) => s + i.totalAmount, 0),
    fullyPaid:       _invoices.filter(i => i.status === "paid").length,
    partiallyPaid:   _invoices.filter(i => i.status === "partial").length,
    pending:         _invoices.filter(i => i.status === "pending").length,
    overdue:         _invoices.filter(i => i.status === "overdue").length,
    totalReceivable: rev.reduce((s, i) => s + i.remainingAmount, 0),
    totalPayable:    exp.reduce((s, i) => s + i.remainingAmount, 0),
  };
}

class InvoiceService {

  async fetchAll(): Promise<{ invoices: Invoice[]; summary: InvoiceSummary }> {
    return delay({ invoices: [..._invoices], summary: buildSummary() });
  }

  async create(values: InvoiceFormValues): Promise<Invoice> {
    const seq   = String(_invoiceSeq++).padStart(3, "0");
    const year  = new Date().getFullYear();
    const total = parseFloat(values.totalAmount);
    const inv: Invoice = {
      id:              String(_nextId++),
      invoiceNumber:   `INV-${year}-${seq}`,
      accountType:     values.accountType,
      partyType:       values.partyType,
      partyId:         values.partyId,
      partyName:       values.partyId,
      partyEntity:     values.partyEntity,
      projectId:       values.projectId,
      projectName:     values.projectId,
      date:            values.date,
      dueDate:         values.dueDate,
      totalAmount:     total,
      paidAmount:      0,
      remainingAmount: total,
      status:          computeStatus(total, 0, values.dueDate),
      description:     values.description,
      payments:        [],
      createdAt:       new Date().toISOString(),
    };
    _invoices = [..._invoices, inv];
    return delay(inv, 400);
  }

  async update(id: string, values: InvoiceFormValues): Promise<Invoice> {
    const existing = _invoices.find(i => i.id === id);
    if (!existing) throw new Error("Invoice not found");
    const total    = parseFloat(values.totalAmount);
    const updated  = recalc({
      ...existing,
      accountType:  values.accountType,
      partyType:    values.partyType,
      partyId:      values.partyId,
      partyEntity:  values.partyEntity,
      projectId:    values.projectId,
      date:         values.date,
      dueDate:      values.dueDate,
      totalAmount:  total,
      description:  values.description,
    });
    _invoices = _invoices.map(i => i.id === id ? updated : i);
    return delay(updated, 400);
  }

  async delete(id: string): Promise<void> {
    _invoices = _invoices.filter(i => i.id !== id);
    return delay(undefined as void, 300);
  }

  async addPayment(invoiceId: string, values: PaymentFormValues): Promise<Invoice> {
    const pay: PaymentRecord = {
      id:        `pay${_nextPayId++}`,
      invoiceId,
      amount:    parseFloat(values.amount),
      date:      values.date,
      note:      values.note,
      method:    values.method,
    };
    _invoices = _invoices.map(inv => {
      if (inv.id !== invoiceId) return inv;
      return recalc({ ...inv, payments: [...inv.payments, pay] });
    });
    return delay(_invoices.find(i => i.id === invoiceId)!, 400);
  }

  async updatePayment(invoiceId: string, paymentId: string, values: PaymentFormValues): Promise<Invoice> {
    _invoices = _invoices.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const payments = inv.payments.map(p =>
        p.id === paymentId
          ? { ...p, amount: parseFloat(values.amount), date: values.date, note: values.note, method: values.method }
          : p,
      );
      return recalc({ ...inv, payments });
    });
    return delay(_invoices.find(i => i.id === invoiceId)!, 400);
  }

  async deletePayment(invoiceId: string, paymentId: string): Promise<Invoice> {
    _invoices = _invoices.map(inv => {
      if (inv.id !== invoiceId) return inv;
      return recalc({ ...inv, payments: inv.payments.filter(p => p.id !== paymentId) });
    });
    return delay(_invoices.find(i => i.id === invoiceId)!, 300);
  }

  getSummary(): InvoiceSummary { return buildSummary(); }
}

export const invoiceService = new InvoiceService();
