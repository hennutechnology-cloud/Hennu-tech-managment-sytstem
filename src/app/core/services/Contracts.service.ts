// ============================================================
// contracts.service.ts
// In-memory store. Starts EMPTY — all data entered via forms.
// Full edit + delete on change orders, certificates, direct payments.
// ============================================================
import type {
  Contract, ChangeOrder, PaymentCertificate, ContractStats,
  ContractFormValues, CertFormValues, ChangeOrderFormValues,
  ContractEditValues, DirectPayment, DirectPaymentFormValues,
} from "../models/contracts.types";

const delay = <T>(data: T, ms = 200): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

let nextContractId    = 1;
let nextCertId        = 1;
let nextChangeOrderId = 1;
let nextPaymentId     = 1;

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }

// ── Stores ────────────────────────────────────────────────────
let CONTRACTS: Contract[]                               = [];
let CHANGE_ORDERS: Record<number, ChangeOrder[]>        = {};
let CERTIFICATES:  Record<number, PaymentCertificate[]> = {};
let PAYMENTS:      Record<number, DirectPayment[]>      = {};

// ── Helpers ───────────────────────────────────────────────────
function nextOrderNumber(contractId: number): string {
  const n = (CHANGE_ORDERS[contractId] ?? []).length + 1;
  return `CO-${String(n).padStart(3, "0")}`;
}
function nextCertNumber(contractId: number): string {
  const n = (CERTIFICATES[contractId] ?? []).length + 1;
  return `IPC-${String(n).padStart(2, "0")}`;
}
function nextContractNumber(projectId: number): string {
  const year = new Date().getFullYear();
  const n    = CONTRACTS.filter((c) => c.projectId === projectId).length + 1;
  return `CON-${year}-${String(n).padStart(3, "0")}`;
}

function recomputeContract(contractId: number): void {
  const idx = CONTRACTS.findIndex((c) => c.id === contractId);
  if (idx === -1) return;

  const cos   = CHANGE_ORDERS[contractId] ?? [];
  const certs = CERTIFICATES[contractId]  ?? [];
  const pmts  = PAYMENTS[contractId]      ?? [];

  const approvedVariations = cos
    .filter((co) => co.status === "approved")
    .reduce((s, co) => s + co.amount, 0);

  const paidViaCerts  = certs.reduce((s, c) => s + c.netAmount, 0);
  const paidViaDirect = pmts.reduce((s, p)  => s + p.amount,   0);

  const c            = CONTRACTS[idx];
  const currentValue = c.originalValue + approvedVariations;
  const retention    = (currentValue * c.retentionPercent) / 100;

  CONTRACTS[idx] = {
    ...c,
    variations:   approvedVariations,
    currentValue,
    retention,
    paidToDate: paidViaCerts + paidViaDirect,
  };
}

// ── Service ───────────────────────────────────────────────────
class ContractsService {

  // ── Reads ─────────────────────────────────────────────────
  async fetchByProject(projectId: number): Promise<Contract[]> {
    return delay(clone(CONTRACTS.filter((c) => c.projectId === projectId)));
  }
  async fetchAll(): Promise<Contract[]> {
    return delay(clone(CONTRACTS));
  }
  async fetchById(id: number): Promise<Contract | null> {
    return delay(CONTRACTS.find((c) => c.id === id) ?? null);
  }
  async fetchChangeOrders(contractId: number): Promise<ChangeOrder[]> {
    return delay(clone(CHANGE_ORDERS[contractId] ?? []));
  }
  async fetchCertificates(contractId: number): Promise<PaymentCertificate[]> {
    return delay(clone(CERTIFICATES[contractId] ?? []));
  }
  async fetchPayments(contractId: number): Promise<DirectPayment[]> {
    return delay(clone(PAYMENTS[contractId] ?? []));
  }
  async fetchStats(): Promise<ContractStats> {
    return delay(computeStats(CONTRACTS));
  }
  async fetchStatsByProject(projectId: number): Promise<ContractStats> {
    return delay(computeStats(CONTRACTS.filter((c) => c.projectId === projectId)));
  }
  async refetchContract(contractId: number): Promise<Contract | null> {
    return delay(CONTRACTS.find((c) => c.id === contractId) ?? null);
  }

  // ── Contract CRUD ─────────────────────────────────────────
  async createContract(projectId: number, values: ContractFormValues): Promise<Contract> {
    const id               = nextContractId++;
    const originalValue    = parseFloat(values.originalValue)    || 0;
    const advancePayment   = parseFloat(values.advancePayment)   || 0;
    const retentionPercent = parseFloat(values.retentionPercent) || 5;
    const penalties        = parseFloat(values.penalties)        || 0;

    const c: Contract = {
      id, projectId,
      contractNumber:   nextContractNumber(projectId),
      contractorName:   values.contractorName.trim(),
      scopeDescription: values.scopeDescription.trim(),
      status:           values.status,
      startDate: {
        year:  parseInt(values.startYear, 10),
        month: parseInt(values.startMonth, 10),
        day:   parseInt(values.startDay, 10),
      },
      endDate: {
        year:  parseInt(values.endYear, 10),
        month: parseInt(values.endMonth, 10),
        day:   parseInt(values.endDay, 10),
      },
      originalValue,
      variations:       0,
      currentValue:     originalValue,
      advancePayment,
      retentionPercent,
      retention:        (originalValue * retentionPercent) / 100,
      paidToDate:       0,
      penalties,
    };
    CONTRACTS.push(c);
    CHANGE_ORDERS[id] = [];
    CERTIFICATES[id]  = [];
    PAYMENTS[id]      = [];
    return delay(clone(c));
  }

  async updateContract(contractId: number, values: ContractEditValues): Promise<Contract> {
    const idx = CONTRACTS.findIndex((c) => c.id === contractId);
    if (idx === -1) throw new Error("Contract not found");
    const c                = CONTRACTS[idx];
    const retentionPercent = parseFloat(values.retentionPercent) || c.retentionPercent;
    const penalties        = parseFloat(values.penalties)        || 0;
    CONTRACTS[idx] = {
      ...c,
      contractorName:   values.contractorName.trim(),
      scopeDescription: values.scopeDescription.trim(),
      status:           values.status,
      endDate: {
        year:  parseInt(values.endYear, 10),
        month: parseInt(values.endMonth, 10),
        day:   parseInt(values.endDay, 10),
      },
      retentionPercent,
      retention: (c.currentValue * retentionPercent) / 100,
      penalties,
    };
    return delay(clone(CONTRACTS[idx]));
  }

  async deleteContract(contractId: number): Promise<void> {
    CONTRACTS = CONTRACTS.filter((c) => c.id !== contractId);
    delete CHANGE_ORDERS[contractId];
    delete CERTIFICATES[contractId];
    delete PAYMENTS[contractId];
    return delay(undefined as any);
  }

  // ── Change Order CRUD ─────────────────────────────────────
  async createChangeOrder(contractId: number, values: ChangeOrderFormValues): Promise<ChangeOrder> {
    const co: ChangeOrder = {
      id:          nextChangeOrderId++,
      contractId,
      orderNumber: nextOrderNumber(contractId),
      description: values.description.trim(),
      amount:      parseFloat(values.amount) || 0,
      approvedOn: {
        year:  parseInt(values.approvedYear, 10),
        month: parseInt(values.approvedMonth, 10),
        day:   parseInt(values.approvedDay, 10),
      },
      status: values.status,
    };
    if (!CHANGE_ORDERS[contractId]) CHANGE_ORDERS[contractId] = [];
    CHANGE_ORDERS[contractId].push(co);
    recomputeContract(contractId);
    return delay(clone(co));
  }

  async updateChangeOrder(contractId: number, coId: number, values: ChangeOrderFormValues): Promise<ChangeOrder> {
    const list = CHANGE_ORDERS[contractId] ?? [];
    const idx  = list.findIndex((c) => c.id === coId);
    if (idx === -1) throw new Error("Change order not found");
    list[idx] = {
      ...list[idx],
      description: values.description.trim(),
      amount:      parseFloat(values.amount) || 0,
      approvedOn: {
        year:  parseInt(values.approvedYear, 10),
        month: parseInt(values.approvedMonth, 10),
        day:   parseInt(values.approvedDay, 10),
      },
      status: values.status,
    };
    recomputeContract(contractId);
    return delay(clone(list[idx]));
  }

  async deleteChangeOrder(contractId: number, coId: number): Promise<void> {
    CHANGE_ORDERS[contractId] = (CHANGE_ORDERS[contractId] ?? []).filter((c) => c.id !== coId);
    recomputeContract(contractId);
    return delay(undefined as any);
  }

  // ── Certificate CRUD ──────────────────────────────────────
  async createCertificate(contractId: number, values: CertFormValues): Promise<PaymentCertificate> {
    const gross      = parseFloat(values.grossAmount) || 0;
    const deductions = parseFloat(values.deductions)  || 0;
    const today      = new Date();

    const cert: PaymentCertificate = {
      id:          nextCertId++,
      contractId,
      certNumber:  nextCertNumber(contractId),
      periodFrom: {
        year:  parseInt(values.periodFromYear, 10),
        month: parseInt(values.periodFromMonth, 10),
        day:   parseInt(values.periodFromDay, 10),
      },
      periodTo: {
        year:  parseInt(values.periodToYear, 10),
        month: parseInt(values.periodToMonth, 10),
        day:   parseInt(values.periodToDay, 10),
      },
      grossAmount: gross,
      deductions,
      netAmount:   Math.max(0, gross - deductions),
      status:      values.status,
      issuedOn: {
        year:  today.getFullYear(),
        month: today.getMonth() + 1,
        day:   today.getDate(),
      },
    };
    if (!CERTIFICATES[contractId]) CERTIFICATES[contractId] = [];
    CERTIFICATES[contractId].push(cert);
    recomputeContract(contractId);
    return delay(clone(cert));
  }

  async updateCertificate(contractId: number, certId: number, values: CertFormValues): Promise<PaymentCertificate> {
    const list = CERTIFICATES[contractId] ?? [];
    const idx  = list.findIndex((c) => c.id === certId);
    if (idx === -1) throw new Error("Certificate not found");
    const gross      = parseFloat(values.grossAmount) || 0;
    const deductions = parseFloat(values.deductions)  || 0;
    list[idx] = {
      ...list[idx],
      periodFrom: {
        year:  parseInt(values.periodFromYear, 10),
        month: parseInt(values.periodFromMonth, 10),
        day:   parseInt(values.periodFromDay, 10),
      },
      periodTo: {
        year:  parseInt(values.periodToYear, 10),
        month: parseInt(values.periodToMonth, 10),
        day:   parseInt(values.periodToDay, 10),
      },
      grossAmount: gross,
      deductions,
      netAmount:   Math.max(0, gross - deductions),
      status:      values.status,
    };
    recomputeContract(contractId);
    return delay(clone(list[idx]));
  }

  async deleteCertificate(contractId: number, certId: number): Promise<void> {
    CERTIFICATES[contractId] = (CERTIFICATES[contractId] ?? []).filter((c) => c.id !== certId);
    recomputeContract(contractId);
    return delay(undefined as any);
  }

  // ── Direct Payment CRUD ───────────────────────────────────
  async createDirectPayment(contractId: number, values: DirectPaymentFormValues): Promise<DirectPayment> {
    const contract = CONTRACTS.find((c) => c.id === contractId);
    if (!contract) throw new Error("Contract not found");
    const remaining = contract.currentValue - contract.paidToDate;
    let amount      = parseFloat(values.amount) || 0;
    if (values.type === "full") amount = remaining;
    else amount = Math.min(amount, remaining);

    const pmt: DirectPayment = {
      id:          nextPaymentId++,
      contractId,
      amount,
      type:        values.type,
      description: values.description.trim(),
      paidOn: {
        year:  parseInt(values.paidYear, 10),
        month: parseInt(values.paidMonth, 10),
        day:   parseInt(values.paidDay, 10),
      },
      reference: values.reference.trim(),
    };
    if (!PAYMENTS[contractId]) PAYMENTS[contractId] = [];
    PAYMENTS[contractId].push(pmt);
    recomputeContract(contractId);
    return delay(clone(pmt));
  }

  async updateDirectPayment(contractId: number, pmtId: number, values: DirectPaymentFormValues): Promise<DirectPayment> {
    const list = PAYMENTS[contractId] ?? [];
    const idx  = list.findIndex((p) => p.id === pmtId);
    if (idx === -1) throw new Error("Payment not found");

    // Recompute remaining excluding the current payment
    const contract = CONTRACTS.find((c) => c.id === contractId);
    if (!contract) throw new Error("Contract not found");
    const paidExcludingThis = (PAYMENTS[contractId] ?? [])
      .filter((p) => p.id !== pmtId)
      .reduce((s, p) => s + p.amount, 0)
      + (CERTIFICATES[contractId] ?? []).reduce((s, c) => s + c.netAmount, 0);
    const remaining = Math.max(0, contract.originalValue + contract.variations - paidExcludingThis);

    let amount = parseFloat(values.amount) || list[idx].amount;
    if (values.type === "full") amount = remaining;
    else amount = Math.min(amount, remaining);

    list[idx] = {
      ...list[idx],
      amount,
      type:        values.type,
      description: values.description.trim(),
      paidOn: {
        year:  parseInt(values.paidYear, 10),
        month: parseInt(values.paidMonth, 10),
        day:   parseInt(values.paidDay, 10),
      },
      reference: values.reference.trim(),
    };
    recomputeContract(contractId);
    return delay(clone(list[idx]));
  }

  async deleteDirectPayment(contractId: number, pmtId: number): Promise<void> {
    PAYMENTS[contractId] = (PAYMENTS[contractId] ?? []).filter((p) => p.id !== pmtId);
    recomputeContract(contractId);
    return delay(undefined as any);
  }
}

function computeStats(all: Contract[]): ContractStats {
  return {
    totalContracts:  all.length,
    activeContracts: all.filter((c) => c.status === "active").length,
    totalValue:      all.reduce((s, c) => s + c.currentValue, 0),
    totalPaid:       all.reduce((s, c) => s + c.paidToDate, 0),
    totalRetention:  all.reduce((s, c) => s + c.retention, 0),
    totalPending:    all.reduce((s, c) => s + (c.currentValue - c.paidToDate), 0),
  };
}

export const contractsService = new ContractsService();
