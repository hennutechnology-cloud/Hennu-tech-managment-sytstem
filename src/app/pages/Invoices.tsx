// ============================================================
// InvoicesPage.tsx  (updated)
// ============================================================
import { useEffect, useState, useMemo } from "react";
import { Receipt, Layers }               from "lucide-react";

import InvoiceSummaryCards  from "../components/invoice/InvoiceSummaryCards";
import InvoiceFilters       from "../components/invoice/InvoiceFilters";
import InvoiceTable         from "../components/invoice/InvoiceTable";
import InvoiceModal         from "../components/invoice/InvoiceModal";
import InvoiceDetailsModal  from "../components/invoice/InvoiceDetailsModal";
import PaymentModal         from "../components/invoice/PaymentModal";
import ContractsPanel       from "../components/invoice/ContractsPanel";
import ContractModal        from "../components/invoice/ContractModal";

import { invoiceService }       from "../core/services/invoice.service";
import { subcontractorService } from "../core/services/subcontractor.service";
import { exportInvoicePdf }     from "../components/invoice/invoice.pdf";
import { useLang }              from "../core/context/LangContext";
import { tInv }                 from "../core/i18n/invoice.i18n";
import type {
  Invoice, InvoiceSummary, InvoiceStatus,
  InvoiceAccountType, InvoiceFormValues,
  PaymentFormValues, PaymentRecord,
  Contract, ContractFormValues, ContractSummary,
  InvoiceKind,
} from "../core/models/invoice.types";

const PROJECTS = [
  { id: "p1", name: "برج الأعمال المركزي"  },
  { id: "p2", name: "مجمع الشقق السكنية"  },
  { id: "p3", name: "مستودعات صناعية"     },
  { id: "p4", name: "مركز التسوق الجديد"  },
];

function resolveNames(
  inv: Invoice,
  subcontractors: { id: string; name: string }[],
): Invoice {
  const partyName = inv.partyType === "subcontractor"
    ? subcontractors.find(s => s.id === inv.partyId)?.name ?? inv.partyId
    : (({ c1: "مجموعة الإعمار", c2: "شركة النخيل العقارية", c3: "الشركة الوطنية للإنشاء" } as Record<string, string>)[inv.partyId] ?? inv.partyId);
  const projectName = PROJECTS.find(p => p.id === inv.projectId)?.name ?? inv.projectId;
  return { ...inv, partyName, projectName };
}

export default function InvoicesPage() {
  const { lang } = useLang();

  // ── Data ───────────────────────────────────────────────────
  const [invoices,         setInvoices]         = useState<Invoice[]>([]);
  const [summary,          setSummary]          = useState<InvoiceSummary | null>(null);
  const [subcontractors,   setSubcontractors]   = useState<{ id: string; name: string; specialty: string }[]>([]);
  const [contractSummaries,setContractSummaries]= useState<ContractSummary[]>([]);
  const [loading,          setLoading]          = useState(true);

  // ── Filters ────────────────────────────────────────────────
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [typeFilter,   setTypeFilter]   = useState<InvoiceAccountType | "all">("all");
  const [kindFilter,   setKindFilter]   = useState<InvoiceKind | "all">("all");

  // ── Invoice modal (create / edit) ──────────────────────────
  const [invoiceModalOpen,    setInvoiceModalOpen]    = useState(false);
  const [editInvoice,         setEditInvoice]         = useState<Invoice | null>(null);
  /** Pre-set a contract when opening modal from ContractsPanel */
  const [presetContractId,    setPresetContractId]    = useState<string | null>(null);

  // ── Details modal ──────────────────────────────────────────
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);

  // ── Payment modal ─────────────────────────────────────────
  const [paymentOpen,  setPaymentOpen]  = useState(false);
  const [editPayment,  setEditPayment]  = useState<PaymentRecord | null>(null);
  const [paymentInv,   setPaymentInv]   = useState<Invoice | null>(null);

  // ── Contract modal ─────────────────────────────────────────
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [editContract,      setEditContract]      = useState<Contract | null>(null);

  // ── Show/hide contracts panel ──────────────────────────────
  const [showContracts, setShowContracts] = useState(true);

  // ── Fetch ──────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    Promise.all([
      invoiceService.fetchAll(),
      subcontractorService.fetchAll(),
      invoiceService.fetchContracts(),
    ]).then(([invData, subData, conData]) => {
      setInvoices(invData.invoices);
      setSummary(invData.summary);
      setSubcontractors(subData.subcontractors.map(s => ({ id: s.id, name: s.name, specialty: s.specialty })));
      setContractSummaries(conData);
    }).finally(() => setLoading(false));
  }, []);

  // ── Derived filtered list ──────────────────────────────────
  const filtered = useMemo(() => {
    let list = invoices;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.partyName.toLowerCase().includes(q) ||
        i.projectName.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") list = list.filter(i => i.status === statusFilter);
    if (typeFilter   !== "all") list = list.filter(i => i.accountType === typeFilter);
    if (kindFilter   !== "all") list = list.filter(i => i.invoiceKind === kindFilter);
    return list;
  }, [invoices, search, statusFilter, typeFilter, kindFilter]);

  // ── Sync selectedInv ──────────────────────────────────────
  const syncedSelectedInv = useMemo(
    () => selectedInv ? invoices.find(i => i.id === selectedInv.id) ?? selectedInv : null,
    [selectedInv, invoices],
  );

  // Contract for selectedInv (if progress invoice)
  const selectedInvContract = useMemo(() => {
    if (!syncedSelectedInv?.contractId) return null;
    return contractSummaries.find(cs => cs.contract.id === syncedSelectedInv.contractId)?.contract ?? null;
  }, [syncedSelectedInv, contractSummaries]);

  // ── Contracts as flat list ────────────────────────────────
  const contracts = useMemo(
    () => contractSummaries.map(cs => cs.contract),
    [contractSummaries],
  );

  // Refresh contract summaries from service
  const refreshContracts = () => {
    setContractSummaries(invoiceService.getContractSummaries());
  };

  // ── Invoice CRUD ───────────────────────────────────────────
  const openCreate = (preContractId?: string) => {
    setEditInvoice(null);
    setPresetContractId(preContractId ?? null);
    setInvoiceModalOpen(true);
  };
  const openEdit = (inv: Invoice) => { setEditInvoice(inv); setInvoiceModalOpen(true); };

  const handleInvoiceSave = async (values: InvoiceFormValues, id?: string) => {
    if (id) {
      const updated  = await invoiceService.update(id, values);
      const resolved = resolveNames(updated, subcontractors);
      setInvoices(prev => prev.map(i => i.id === id ? resolved : i));
    } else {
      const created  = await invoiceService.create(values);
      const resolved = resolveNames(created, subcontractors);
      setInvoices(prev => [...prev, resolved]);
    }
    setSummary(invoiceService.getSummary());
    refreshContracts();
  };

  const handleDeleteInvoice = async (inv: Invoice) => {
    await invoiceService.delete(inv.id);
    setInvoices(prev => prev.filter(i => i.id !== inv.id));
    setSummary(invoiceService.getSummary());
    refreshContracts();
    setDetailsOpen(false);
    setSelectedInv(null);
  };

  // ── Details ────────────────────────────────────────────────
  const openDetails = (inv: Invoice) => { setSelectedInv(inv); setDetailsOpen(true); };

  // ── Payment handlers ───────────────────────────────────────
  const openAddPayment = (inv: Invoice) => {
    setPaymentInv(inv); setEditPayment(null); setPaymentOpen(true);
  };
  const openEditPayment = (inv: Invoice, pay: PaymentRecord) => {
    setPaymentInv(inv); setEditPayment(pay); setPaymentOpen(true);
  };
  const handleDeletePayment = async (inv: Invoice, paymentId: string) => {
    const updated  = await invoiceService.deletePayment(inv.id, paymentId);
    const resolved = resolveNames(updated, subcontractors);
    setInvoices(prev => prev.map(i => i.id === inv.id ? resolved : i));
    setSummary(invoiceService.getSummary());
  };
  const handlePaymentSave = async (invoiceId: string, values: PaymentFormValues, paymentId?: string) => {
    const updated  = paymentId
      ? await invoiceService.updatePayment(invoiceId, paymentId, values)
      : await invoiceService.addPayment(invoiceId, values);
    const resolved = resolveNames(updated, subcontractors);
    setInvoices(prev => prev.map(i => i.id === invoiceId ? resolved : i));
    setSummary(invoiceService.getSummary());
  };

  // ── Contract CRUD ──────────────────────────────────────────
  const openCreateContract = () => { setEditContract(null); setContractModalOpen(true); };
  const openEditContract   = (c: Contract) => { setEditContract(c); setContractModalOpen(true); };

  const handleContractSave = async (values: ContractFormValues, id?: string) => {
    if (id) {
      await invoiceService.updateContract(id, values);
    } else {
      await invoiceService.createContract(values);
    }
    setSummary(invoiceService.getSummary());
    refreshContracts();
  };

  const handleDeleteContract = async (c: Contract) => {
    await invoiceService.deleteContract(c.id);
    // Unlink invoices in local state
    setInvoices(prev => prev.map(i =>
      i.contractId === c.id ? { ...i, contractId: undefined, invoiceKind: "normal" as const } : i,
    ));
    setSummary(invoiceService.getSummary());
    refreshContracts();
  };

  const handleExportPdf = (inv: Invoice) => exportInvoicePdf(inv, lang);

  // ── Loading ────────────────────────────────────────────────
  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <div className="h-14 rounded-2xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="h-12 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
        <p className="text-center text-gray-500 text-sm">{tInv(lang, "loading")}</p>
      </div>
    );
  }

  const isRtl = lang === "ar";

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
        <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700
                          flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div className={isRtl ? "text-right" : "text-left"}>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{tInv(lang, "title")}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{tInv(lang, "subtitle")}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 w-full sm:w-auto ${isRtl ? "flex-row-reverse" : ""}`}>
          {/* Toggle contracts panel */}
          <button
            onClick={() => setShowContracts(v => !v)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                         border text-sm font-medium transition-all shrink-0
                         ${showContracts
                           ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
                           : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                         } ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <Layers className="w-4 h-4" />
            {tInv(lang, "contractsPanel")}
          </button>
          {/* New contract */}
          <button
            onClick={openCreateContract}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl shrink-0
                         bg-gradient-to-l from-violet-500 to-violet-600
                         hover:shadow-lg hover:shadow-violet-500/25 text-white text-sm font-medium transition-all
                         ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <span className="text-lg leading-none">+</span>
            {tInv(lang, "newContract")}
          </button>
          {/* New invoice */}
          <button
            onClick={() => openCreate()}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl shrink-0
                         bg-gradient-to-l from-orange-500 to-orange-600
                         hover:shadow-lg hover:shadow-orange-500/30 text-white text-sm font-medium transition-all
                         ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <span className="text-lg leading-none">+</span>
            {tInv(lang, "newInvoice")}
          </button>
        </div>
      </div>

      <InvoiceSummaryCards summary={summary} lang={lang} />

      {/* Contracts panel (collapsible) */}
      {showContracts && (
        <ContractsPanel
          contracts={contractSummaries}
          lang={lang}
          onAddInvoice={(contract) => openCreate(contract.id)}
          onEdit={openEditContract}
          onDelete={handleDeleteContract}
        />
      )}

      <InvoiceFilters
        search={search} onSearch={setSearch}
        statusFilter={statusFilter} onStatus={setStatusFilter}
        typeFilter={typeFilter} onType={setTypeFilter}
        kindFilter={kindFilter} onKind={setKindFilter}
        lang={lang}
      />

      <InvoiceTable
        invoices={filtered}
        contracts={contracts}
        lang={lang}
        onDetails={openDetails}
        onAddPayment={openAddPayment}
        onExportPdf={handleExportPdf}
      />

      {/* Create / Edit invoice */}
      <InvoiceModal
        isOpen={invoiceModalOpen}
        editInvoice={editInvoice}
        lang={lang}
        subcontractors={subcontractors}
        projects={PROJECTS}
        contracts={contracts}
        onClose={() => { setInvoiceModalOpen(false); setPresetContractId(null); }}
        onSave={handleInvoiceSave}
      />

      {/* Details */}
      <InvoiceDetailsModal
        isOpen={detailsOpen}
        invoice={syncedSelectedInv}
        contract={selectedInvContract}
        lang={lang}
        subcontractors={subcontractors}
        projects={PROJECTS}
        onClose={() => { setDetailsOpen(false); setSelectedInv(null); }}
        onEdit={openEdit}
        onDelete={handleDeleteInvoice}
        onAddPayment={openAddPayment}
        onEditPayment={openEditPayment}
        onDeletePayment={handleDeletePayment}
        onExportPdf={handleExportPdf}
      />

      {/* Add / Edit payment */}
      <PaymentModal
        isOpen={paymentOpen}
        invoice={paymentInv}
        editPayment={editPayment}
        lang={lang}
        onClose={() => { setPaymentOpen(false); setEditPayment(null); setPaymentInv(null); }}
        onSave={handlePaymentSave}
      />

      {/* Create / Edit contract */}
      <ContractModal
        isOpen={contractModalOpen}
        editContract={editContract}
        lang={lang}
        subcontractors={subcontractors}
        projects={PROJECTS}
        onClose={() => setContractModalOpen(false)}
        onSave={handleContractSave}
      />

    </div>
  );
}
