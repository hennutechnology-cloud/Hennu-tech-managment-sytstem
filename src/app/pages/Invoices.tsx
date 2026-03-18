// ============================================================
// InvoicesPage.tsx
// ============================================================
import { useEffect, useState, useMemo } from "react";
import { Receipt }                       from "lucide-react";

import InvoiceSummaryCards  from "../components/invoice/InvoiceSummaryCards";
import InvoiceFilters       from "../components/invoice/InvoiceFilters";
import InvoiceTable         from "../components/invoice/InvoiceTable";
import InvoiceModal         from "../components/invoice/InvoiceModal";
import InvoiceDetailsModal  from "../components/invoice/InvoiceDetailsModal";
import PaymentModal         from "../components/invoice/PaymentModal";

import { invoiceService }       from "../core/services/invoice.service";
import { subcontractorService } from "../core/services/subcontractor.service";
import { exportInvoicePdf }     from "../components/invoice/invoice.pdf";
import { useLang }              from "../core/context/LangContext";
import { tInv }                 from "../core/i18n/invoice.i18n";
import type {
  Invoice, InvoiceSummary, InvoiceStatus,
  InvoiceAccountType, InvoiceFormValues,
  PaymentFormValues, PaymentRecord,
} from "../core/models/invoice.types";

const PROJECTS = [
  { id: "p1", name: "برج الأعمال المركزي"  },
  { id: "p2", name: "مجمع الشقق السكنية"  },
  { id: "p3", name: "مستودعات صناعية"     },
  { id: "p4", name: "مركز التسوق الجديد"  },
];

// Helper: resolve party & project display names from ids
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
  const [invoices,       setInvoices]       = useState<Invoice[]>([]);
  const [summary,        setSummary]        = useState<InvoiceSummary | null>(null);
  const [subcontractors, setSubcontractors] = useState<{ id: string; name: string; specialty: string }[]>([]);
  const [loading,        setLoading]        = useState(true);

  // ── Filters ────────────────────────────────────────────────
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [typeFilter,   setTypeFilter]   = useState<InvoiceAccountType | "all">("all");

  // ── Invoice modal (create / edit) ──────────────────────────
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [editInvoice,      setEditInvoice]      = useState<Invoice | null>(null);

  // ── Details modal ──────────────────────────────────────────
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);

  // ── Payment modal (add / edit) ────────────────────────────
  const [paymentOpen,  setPaymentOpen]  = useState(false);
  const [editPayment,  setEditPayment]  = useState<PaymentRecord | null>(null);
  const [paymentInv,   setPaymentInv]   = useState<Invoice | null>(null);

  // ── Fetch ──────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    Promise.all([invoiceService.fetchAll(), subcontractorService.fetchAll()])
      .then(([invData, subData]) => {
        setInvoices(invData.invoices);
        setSummary(invData.summary);
        setSubcontractors(subData.subcontractors.map(s => ({ id: s.id, name: s.name, specialty: s.specialty })));
      })
      .finally(() => setLoading(false));
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
    return list;
  }, [invoices, search, statusFilter, typeFilter]);

  // ── Sync selectedInv with latest invoices state ────────────
  // (so Details modal reflects edits/payments without closing)
  const syncedSelectedInv = useMemo(
    () => selectedInv ? invoices.find(i => i.id === selectedInv.id) ?? selectedInv : null,
    [selectedInv, invoices],
  );

  // ── Invoice CRUD ───────────────────────────────────────────
  const openCreate = () => { setEditInvoice(null); setInvoiceModalOpen(true); };
  const openEdit   = (inv: Invoice) => { setEditInvoice(inv); setInvoiceModalOpen(true); };

  const handleInvoiceSave = async (values: InvoiceFormValues, id?: string) => {
    if (id) {
      const updated = await invoiceService.update(id, values);
      const resolved = resolveNames(updated, subcontractors);
      setInvoices(prev => prev.map(i => i.id === id ? resolved : i));
    } else {
      const created  = await invoiceService.create(values);
      const resolved = resolveNames(created, subcontractors);
      setInvoices(prev => [...prev, resolved]);
    }
    setSummary(invoiceService.getSummary());
  };

  const handleDeleteInvoice = async (inv: Invoice) => {
    await invoiceService.delete(inv.id);
    setInvoices(prev => prev.filter(i => i.id !== inv.id));
    setSummary(invoiceService.getSummary());
    setDetailsOpen(false);
    setSelectedInv(null);
  };

  // ── Details ────────────────────────────────────────────────
  const openDetails = (inv: Invoice) => { setSelectedInv(inv); setDetailsOpen(true); };

  // ── Payment handlers ───────────────────────────────────────
  const openAddPayment = (inv: Invoice) => {
    setPaymentInv(inv);
    setEditPayment(null);
    setPaymentOpen(true);
  };

  const openEditPayment = (inv: Invoice, pay: PaymentRecord) => {
    setPaymentInv(inv);
    setEditPayment(pay);
    setPaymentOpen(true);
  };

  const handleDeletePayment = async (inv: Invoice, paymentId: string) => {
    const updated  = await invoiceService.deletePayment(inv.id, paymentId);
    const resolved = resolveNames(updated, subcontractors);
    setInvoices(prev => prev.map(i => i.id === inv.id ? resolved : i));
    setSummary(invoiceService.getSummary());
  };

  const handlePaymentSave = async (invoiceId: string, values: PaymentFormValues, paymentId?: string) => {
    const updated = paymentId
      ? await invoiceService.updatePayment(invoiceId, paymentId, values)
      : await invoiceService.addPayment(invoiceId, values);
    const resolved = resolveNames(updated, subcontractors);
    setInvoices(prev => prev.map(i => i.id === invoiceId ? resolved : i));
    setSummary(invoiceService.getSummary());
  };

  const handleExportPdf = (inv: Invoice) => exportInvoicePdf(inv, lang);

  // ── Loading ────────────────────────────────────────────────
  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <div className="h-14 rounded-2xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
                       ${isRtl ? "sm:flex-row-reverse" : ""}`}>
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
        <button
          onClick={openCreate}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl w-full sm:w-auto shrink-0
                       bg-gradient-to-l from-orange-500 to-orange-600
                       hover:shadow-lg hover:shadow-orange-500/30 text-white text-sm font-medium transition-all
                       ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <span className="text-lg leading-none">+</span>
          {tInv(lang, "newInvoice")}
        </button>
      </div>

      <InvoiceSummaryCards summary={summary} lang={lang} />

      <InvoiceFilters
        search={search} onSearch={setSearch}
        statusFilter={statusFilter} onStatus={setStatusFilter}
        typeFilter={typeFilter} onType={setTypeFilter}
        lang={lang}
      />

      <InvoiceTable
        invoices={filtered}
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
        onClose={() => setInvoiceModalOpen(false)}
        onSave={handleInvoiceSave}
      />

      {/* Details */}
      <InvoiceDetailsModal
        isOpen={detailsOpen}
        invoice={syncedSelectedInv}
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

    </div>
  );
}
