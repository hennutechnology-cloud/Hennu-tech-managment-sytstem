// ============================================================
// ContractDetail.tsx
// Full detail panel. Users can:
//  - Edit & delete change orders inline
//  - Edit & delete payment certificates inline
//  - Edit & delete direct payments inline
//  - Add payment / certificate / change order / edit contract
// ============================================================
import { useState, useEffect }   from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle, Plus, Pencil, DollarSign,
  Trash2, Check, X, ChevronDown,
} from "lucide-react";
import GlassCard                 from "../../core/shared/components/GlassCard";
import AddCertModal              from "./AddCertModal";
import AddChangeOrderModal       from "./AddChangeOrderModal";
import AddPaymentModal           from "./AddPaymentModal";
import EditContractModal         from "./EditContractModal";
import {
  tContract, resolveContractStatusBadge, resolvePaymentStatusBadge,
  formatContractDate, dirAttr,
} from "../../core/i18n/contracts.i18n";
import { formatNum }             from "../../core/i18n/projects.i18n";
import { contractsService }      from "../../core/services/contracts.service";
import type {
  ContractDetailProps,
  ChangeOrder, PaymentCertificate, DirectPayment,
  ChangeOrderFormValues, CertFormValues, DirectPaymentFormValues,
} from "../../core/models/contracts.types";

// ── Shared helpers ────────────────────────────────────────────
function InfoRow({ label, value, valueClass = "text-white" }: {
  label: string; value: React.ReactNode; valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm shrink-0">{label}</span>
      <span className={`text-sm font-medium text-right ${valueClass}`}>{value}</span>
    </div>
  );
}

function StatTile({ label, value, sub, valueClass = "text-white" }: {
  label: string; value: string; sub?: string; valueClass?: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.07]">
      <p className="text-xs text-gray-400 mb-1.5 leading-snug">{label}</p>
      <p className={`text-lg font-bold leading-none ${valueClass}`}>{value}</p>
      {sub && <p className="text-[11px] text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

/** Mini confirm popover rendered below an action row */
function DeleteConfirmRow({ message, onConfirm, onCancel, busy }: {
  message: string; onConfirm: () => void; onCancel: () => void; busy: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-1 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-3">
        <p className="text-xs text-red-300 flex-1">{message}</p>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            {busy
              ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              : <Trash2 className="w-3 h-3" />}
            {busy ? "..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-white/10 text-gray-400 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Date input triplet ─────────────────────────────────────────
function DateInput({ day, month, year, onChange, error }: {
  day: string; month: string; year: string;
  onChange: (d: { day?: string; month?: string; year?: string }) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex gap-1.5">
        <input type="number" min={1} max={31} value={day} placeholder="DD"
          onChange={(e) => onChange({ day: e.target.value })}
          className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500/50 transition-all text-center" />
        <input type="number" min={1} max={12} value={month} placeholder="MM"
          onChange={(e) => onChange({ month: e.target.value })}
          className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500/50 transition-all text-center" />
        <input type="number" min={2000} max={2100} value={year} placeholder="YYYY"
          onChange={(e) => onChange({ year: e.target.value })}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500/50 transition-all" />
      </div>
      {error && <p className="text-[10px] text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full bg-white/5 border ${err ? "border-red-500/60" : "border-white/10"} rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500/50 transition-all`;

// ── Status selector ────────────────────────────────────────────
const CO_STATUSES = ["approved", "pending", "rejected"] as const;
const CERT_STATUSES = ["paid", "pending", "overdue", "partial"] as const;

function StatusButtons<T extends string>({ value, options, onChange, colorMap }: {
  value: T; options: readonly T[];
  onChange: (v: T) => void;
  colorMap: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((s) => (
        <button key={s} onClick={() => onChange(s)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
            value === s ? colorMap[s] : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
          }`}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </button>
      ))}
    </div>
  );
}

const CO_COLOR: Record<string, string> = {
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending:  "bg-orange-500/20  text-orange-400  border-orange-500/30",
  rejected: "bg-red-500/20     text-red-400     border-red-500/30",
};
const CERT_COLOR: Record<string, string> = {
  paid:    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-orange-500/20  text-orange-400  border-orange-500/30",
  overdue: "bg-red-500/20     text-red-400     border-red-500/30",
  partial: "bg-blue-500/20    text-blue-400    border-blue-500/30",
};

// ═════════════════════════════════════════════════════════════════
// Main component
// ═════════════════════════════════════════════════════════════════
export default function ContractDetail({
  contract: initialContract,
  changeOrders: initialChangeOrders,
  certificates: initialCertificates,
  lang,
  onCertAdded,
  onChangeOrderAdded,
  onContractUpdated,
}: ContractDetailProps) {
  const [contract,     setContract]     = useState(initialContract);
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(initialChangeOrders);
  const [certificates, setCertificates] = useState<PaymentCertificate[]>(initialCertificates);
  const [payments,     setPayments]     = useState<DirectPayment[]>([]);

  // Sync when parent switches selection
  if (initialContract.id !== contract.id) {
    setContract(initialContract);
    setChangeOrders(initialChangeOrders);
    setCertificates(initialCertificates);
    setPayments([]);
  }

  useEffect(() => {
    contractsService.fetchPayments(initialContract.id).then(setPayments);
  }, [initialContract.id]);

  // ── Add-modal states ────────────────────────────────────────
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [coModalOpen,   setCoModalOpen]   = useState(false);
  const [payModalOpen,  setPayModalOpen]  = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // ── Inline-edit states ──────────────────────────────────────
  // Change orders
  const [editingCoId, setEditingCoId] = useState<number | null>(null);
  const [coDraft,     setCoDraft]     = useState<ChangeOrderFormValues | null>(null);
  const [coErrors,    setCoErrors]    = useState<Record<string,string>>({});
  const [deletingCoId,setDeletingCoId]= useState<number | null>(null);
  const [coDeleteBusy,setCoDeleteBusy]= useState(false);

  // Certificates
  const [editingCertId, setEditingCertId] = useState<number | null>(null);
  const [certDraft,     setCertDraft]     = useState<CertFormValues | null>(null);
  const [certErrors,    setCertErrors]    = useState<Record<string,string>>({});
  const [deletingCertId,setDeletingCertId]= useState<number | null>(null);
  const [certDeleteBusy,setCertDeleteBusy]= useState(false);

  // Direct payments
  const [editingPmtId, setEditingPmtId] = useState<number | null>(null);
  const [pmtDraft,     setPmtDraft]     = useState<DirectPaymentFormValues | null>(null);
  const [pmtErrors,    setPmtErrors]    = useState<Record<string,string>>({});
  const [deletingPmtId,setDeletingPmtId]= useState<number | null>(null);
  const [pmtDeleteBusy,setPmtDeleteBusy]= useState(false);

  const [savingId, setSavingId] = useState<number | null>(null);

  const fmt       = (n: number) => formatNum(n, lang);
  const cur       = tContract(lang, "currency");
  const t         = (k: any) => tContract(lang, k);
  const badge     = resolveContractStatusBadge(lang, contract.status);
  const remaining = Math.max(0, contract.currentValue - contract.paidToDate);
  const paidPct   = contract.currentValue > 0
    ? Math.min(100, (contract.paidToDate / contract.currentValue) * 100)
    : 0;

  const refresh = async () => {
    const fresh = await contractsService.refetchContract(contract.id);
    if (fresh) { setContract(fresh); onContractUpdated?.(fresh); }
  };

  // ── Add handlers ───────────────────────────────────────────
  const handleCertSaved = async (cert: PaymentCertificate) => {
    setCertificates((p) => [...p, cert]);
    await refresh();
    onCertAdded?.(cert);
  };
  const handleCoSaved = async (co: ChangeOrder) => {
    setChangeOrders((p) => [...p, co]);
    await refresh();
    onChangeOrderAdded?.(co);
  };
  const handlePaymentSaved = async (pmt: DirectPayment) => {
    setPayments((p) => [...p, pmt]);
    await refresh();
  };
  const handleContractEdited = (updated: typeof contract) => {
    setContract(updated);
    onContractUpdated?.(updated);
  };

  // ── Change order edit ──────────────────────────────────────
  const startCoEdit = (co: ChangeOrder) => {
    setEditingCoId(co.id);
    setCoDraft({
      description:   co.description,
      amount:        String(co.amount),
      status:        co.status,
      approvedDay:   String(co.approvedOn.day),
      approvedMonth: String(co.approvedOn.month),
      approvedYear:  String(co.approvedOn.year),
    });
    setCoErrors({});
    setDeletingCoId(null);
  };
  const saveCoEdit = async (co: ChangeOrder) => {
    if (!coDraft) return;
    if (!coDraft.description.trim()) { setCoErrors({ description: t("errRequired") }); return; }
    if (!coDraft.amount || +coDraft.amount <= 0) { setCoErrors({ amount: t("errPositiveNumber") }); return; }
    setSavingId(co.id);
    try {
      const updated = await contractsService.updateChangeOrder(contract.id, co.id, coDraft);
      setChangeOrders((p) => p.map((c) => c.id === co.id ? updated : c));
      await refresh();
      setEditingCoId(null);
    } finally { setSavingId(null); }
  };
  const confirmDeleteCo = async (co: ChangeOrder) => {
    setCoDeleteBusy(true);
    try {
      await contractsService.deleteChangeOrder(contract.id, co.id);
      setChangeOrders((p) => p.filter((c) => c.id !== co.id));
      await refresh();
      setDeletingCoId(null);
    } finally { setCoDeleteBusy(false); }
  };

  // ── Certificate edit ───────────────────────────────────────
  const startCertEdit = (cert: PaymentCertificate) => {
    setEditingCertId(cert.id);
    setCertDraft({
      periodFromDay:   String(cert.periodFrom.day),
      periodFromMonth: String(cert.periodFrom.month),
      periodFromYear:  String(cert.periodFrom.year),
      periodToDay:     String(cert.periodTo.day),
      periodToMonth:   String(cert.periodTo.month),
      periodToYear:    String(cert.periodTo.year),
      grossAmount:     String(cert.grossAmount),
      deductions:      String(cert.deductions),
      status:          cert.status,
    });
    setCertErrors({});
    setDeletingCertId(null);
  };
  const saveCertEdit = async (cert: PaymentCertificate) => {
    if (!certDraft) return;
    if (!certDraft.grossAmount || +certDraft.grossAmount <= 0) { setCertErrors({ grossAmount: t("errPositiveNumber") }); return; }
    setSavingId(cert.id);
    try {
      const updated = await contractsService.updateCertificate(contract.id, cert.id, certDraft);
      setCertificates((p) => p.map((c) => c.id === cert.id ? updated : c));
      await refresh();
      setEditingCertId(null);
    } finally { setSavingId(null); }
  };
  const confirmDeleteCert = async (cert: PaymentCertificate) => {
    setCertDeleteBusy(true);
    try {
      await contractsService.deleteCertificate(contract.id, cert.id);
      setCertificates((p) => p.filter((c) => c.id !== cert.id));
      await refresh();
      setDeletingCertId(null);
    } finally { setCertDeleteBusy(false); }
  };

  // ── Direct payment edit ────────────────────────────────────
  const startPmtEdit = (pmt: DirectPayment) => {
    setEditingPmtId(pmt.id);
    setPmtDraft({
      amount:      String(pmt.amount),
      type:        pmt.type,
      description: pmt.description,
      paidDay:     String(pmt.paidOn.day),
      paidMonth:   String(pmt.paidOn.month),
      paidYear:    String(pmt.paidOn.year),
      reference:   pmt.reference,
    });
    setPmtErrors({});
    setDeletingPmtId(null);
  };
  const savePmtEdit = async (pmt: DirectPayment) => {
    if (!pmtDraft) return;
    if (!pmtDraft.description.trim()) { setPmtErrors({ description: t("errRequired") }); return; }
    if (!pmtDraft.reference.trim())   { setPmtErrors({ reference: t("errRequired") }); return; }
    if (pmtDraft.type === "partial" && (!pmtDraft.amount || +pmtDraft.amount <= 0)) {
      setPmtErrors({ amount: t("errPositiveNumber") }); return;
    }
    setSavingId(pmt.id);
    try {
      const updated = await contractsService.updateDirectPayment(contract.id, pmt.id, pmtDraft);
      setPayments((p) => p.map((pm) => pm.id === pmt.id ? updated : pm));
      await refresh();
      setEditingPmtId(null);
    } finally { setSavingId(null); }
  };
  const confirmDeletePmt = async (pmt: DirectPayment) => {
    setPmtDeleteBusy(true);
    try {
      await contractsService.deleteDirectPayment(contract.id, pmt.id);
      setPayments((p) => p.filter((pm) => pm.id !== pmt.id));
      await refresh();
      setDeletingPmtId(null);
    } finally { setPmtDeleteBusy(false); }
  };

  // ── i18n label helpers (use correct keys) ──────────────────
  const coDescLabel    = lang === "ar" ? "الوصف"            : "Description";
  const coAmountLabel  = lang === "ar" ? "المبلغ"           : "Amount";
  const coStatusLabel  = lang === "ar" ? "الحالة"           : "Status";
  const coDateLabel    = lang === "ar" ? "تاريخ الاعتماد"   : "Approved On";
  const pmtDescLabel   = lang === "ar" ? "وصف الدفعة"       : "Description";
  const pmtRefLabel    = lang === "ar" ? "رقم المرجع"       : "Reference";
  const pmtDateLabel   = lang === "ar" ? "تاريخ الدفع"      : "Payment Date";
  const pmtTypeLabel   = lang === "ar" ? "نوع الدفعة"       : "Payment Type";
  const periodFromLbl  = lang === "ar" ? "بداية الفترة"     : "Period From";
  const periodToLbl    = lang === "ar" ? "نهاية الفترة"     : "Period To";
  const grossLbl       = lang === "ar" ? "المبلغ الإجمالي"  : "Gross Amount";
  const dedLbl         = lang === "ar" ? "الخصومات"         : "Deductions";

  const coBadgeLabel = {
    approved: t("coApproved"),
    pending:  t("coPending"),
    rejected: t("coRejected"),
  } as const;

  return (
    <div dir={dirAttr(lang)} className="space-y-5 sm:space-y-6">

      {/* ── Title bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-2xl font-bold text-white">{t("detailTitle")}</h2>
            <span className={`px-3 py-1 rounded-lg border text-xs ${badge.className}`}>{badge.label}</span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">
            <span className="font-mono text-orange-400">{contract.contractNumber}</span>
            {" · "}{contract.contractorName}
          </p>
        </div>
        <button onClick={() => setEditModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl text-sm font-medium transition-colors">
          <Pencil className="w-4 h-4" />
          {t("edit")}
        </button>
      </div>

      {/* ── Financial stat tiles ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatTile label={t("originalValue")}      value={fmt(contract.originalValue)}  sub={cur} />
        <StatTile label={t("approvedVariations")} value={fmt(contract.variations)}     sub={cur} valueClass="text-emerald-400" />
        <StatTile label={t("currentValue")}       value={fmt(contract.currentValue)}   sub={cur} valueClass="text-orange-400" />
        <StatTile label={t("advancePayment")}     value={fmt(contract.advancePayment)} sub={cur} valueClass="text-blue-400" />
        <StatTile label={t("retentionAmount")}    value={fmt(contract.retention)}      sub={`${contract.retentionPercent}%`} valueClass="text-yellow-400" />
        <StatTile label={t("penaltiesApplied")}   value={fmt(contract.penalties)}      sub={cur} valueClass={contract.penalties > 0 ? "text-red-400" : "text-gray-500"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

        {/* ── Payment progress ── */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white">{t("paymentProgress")}</h3>
            {remaining > 0 && (
              <button onClick={() => setPayModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-medium transition-colors">
                <DollarSign className="w-3.5 h-3.5" />
                {t("addPayment")}
              </button>
            )}
          </div>
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{t("paymentRate")}</span>
              <span className="text-sm font-bold text-white">{paidPct.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#F97316] to-[#10B981] rounded-full transition-all duration-700"
                style={{ width: `${paidPct}%` }} />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{t("paidLabel")}: {fmt(contract.paidToDate)} {cur}</span>
              <span>{t("remainingLabel")}: {fmt(remaining)} {cur}</span>
            </div>
          </div>
          <InfoRow label={t("paidToDate")}       value={`${fmt(contract.paidToDate)} ${cur}`} valueClass="text-emerald-400" />
          <InfoRow label={t("pendingAmount")}    value={`${fmt(remaining)} ${cur}`}            valueClass="text-orange-400" />
          <InfoRow label={t("retentionPercent")} value={`${contract.retentionPercent}%`} />
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">{t("contractDates")}</h4>
            <InfoRow label={t("colStartDate")} value={formatContractDate(contract.startDate, lang)} />
            <InfoRow label={t("colEndDate")}   value={formatContractDate(contract.endDate, lang)} />
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-1">{t("colScope")}</p>
            <p className="text-sm text-gray-200 leading-relaxed">{contract.scopeDescription}</p>
          </div>
          {contract.penalties > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{t("penaltyAlert")}: {fmt(contract.penalties)} {cur}</p>
            </div>
          )}
        </GlassCard>

        {/* ── Change Orders ── */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t("changeOrdersTitle")}
              <span className="ms-2 text-sm font-normal text-gray-400">({changeOrders.length})</span>
            </h3>
            <button onClick={() => setCoModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 rounded-xl text-xs font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" />
              {t("addChangeOrder")}
            </button>
          </div>

          {changeOrders.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">{t("noChangeOrders")}</p>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {changeOrders.map((co) => (
                  <motion.div key={co.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 16, height: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {editingCoId === co.id && coDraft ? (
                      /* ── Edit form ── */
                      <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2.5">
                        <p className="text-xs font-semibold text-blue-300">
                          {lang === "ar" ? "تعديل أمر التغيير" : "Edit Change Order"}
                        </p>
                        <div>
                          <p className="text-[10px] text-gray-500 mb-1">{coDescLabel}</p>
                          <input type="text" value={coDraft.description}
                            onChange={(e) => { setCoDraft((d) => d && ({ ...d, description: e.target.value })); setCoErrors({}); }}
                            className={inputCls(coErrors.description)} />
                          {coErrors.description && <p className="text-[10px] text-red-400 mt-0.5">{coErrors.description}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[10px] text-gray-500 mb-1">{coAmountLabel}</p>
                            <input type="number" dir="ltr" min={0} value={coDraft.amount}
                              onChange={(e) => { setCoDraft((d) => d && ({ ...d, amount: e.target.value })); setCoErrors({}); }}
                              className={inputCls(coErrors.amount)} />
                            {coErrors.amount && <p className="text-[10px] text-red-400 mt-0.5">{coErrors.amount}</p>}
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 mb-1">{coStatusLabel}</p>
                            <StatusButtons
                              value={coDraft.status}
                              options={CO_STATUSES}
                              onChange={(s) => setCoDraft((d) => d && ({ ...d, status: s }))}
                              colorMap={CO_COLOR}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 mb-1">{coDateLabel}</p>
                          <DateInput
                            day={coDraft.approvedDay} month={coDraft.approvedMonth} year={coDraft.approvedYear}
                            onChange={(v) => setCoDraft((d) => d && ({
                              ...d,
                              approvedDay:   v.day   ?? d.approvedDay,
                              approvedMonth: v.month ?? d.approvedMonth,
                              approvedYear:  v.year  ?? d.approvedYear,
                            }))}
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => saveCoEdit(co)} disabled={savingId === co.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                            {savingId === co.id
                              ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                              : <Check className="w-3.5 h-3.5" />}
                            {t("save")}
                          </button>
                          <button onClick={() => setEditingCoId(null)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs transition-colors">
                            <X className="w-3.5 h-3.5" /> {t("cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Display row ── */
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] group">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-mono text-xs text-orange-400">{co.orderNumber}</span>
                              <span className={`px-2 py-0.5 rounded-md border text-[10px] ${CO_COLOR[co.status]}`}>
                                {coBadgeLabel[co.status]}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300 leading-snug">{co.description}</p>
                            <p className="text-[11px] text-gray-500 mt-1">
                              {t("coApprovedOn")}: {formatContractDate(co.approvedOn, lang)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-emerald-400">+{fmt(co.amount)}</p>
                              <p className="text-[10px] text-gray-500">{cur}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startCoEdit(co)}
                                className="p-1.5 hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 rounded-lg transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setDeletingCoId(deletingCoId === co.id ? null : co.id)}
                                className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <AnimatePresence>
                          {deletingCoId === co.id && (
                            <DeleteConfirmRow
                              message={t("deleteCoQuestion")}
                              onConfirm={() => confirmDeleteCo(co)}
                              onCancel={() => setDeletingCoId(null)}
                              busy={coDeleteBusy}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </GlassCard>
      </div>

      {/* ── Payment Certificates ── */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white">
            {t("certificatesTitle")}
            <span className="ms-2 text-sm font-normal text-gray-400">({certificates.length})</span>
          </h3>
          <button onClick={() => setCertModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-medium transition-colors">
            <Plus className="w-3.5 h-3.5" />
            {t("addCertificate")}
          </button>
        </div>

        {certificates.length === 0 ? (
          <p className="text-gray-500 text-sm py-6 text-center">{t("noCertificates")}</p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {certificates.map((cert) => {
                const pb = resolvePaymentStatusBadge(lang, cert.status);
                return (
                  <motion.div key={cert.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 16, height: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {editingCertId === cert.id && certDraft ? (
                      /* ── Edit form ── */
                      <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
                        <p className="text-xs font-semibold text-emerald-300">
                          {lang === "ar" ? "تعديل شهادة الدفع" : "Edit Certificate"}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] text-gray-500 mb-1">{periodFromLbl}</p>
                            <DateInput
                              day={certDraft.periodFromDay} month={certDraft.periodFromMonth} year={certDraft.periodFromYear}
                              onChange={(v) => setCertDraft((d) => d && ({
                                ...d,
                                periodFromDay:   v.day   ?? d.periodFromDay,
                                periodFromMonth: v.month ?? d.periodFromMonth,
                                periodFromYear:  v.year  ?? d.periodFromYear,
                              }))}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 mb-1">{periodToLbl}</p>
                            <DateInput
                              day={certDraft.periodToDay} month={certDraft.periodToMonth} year={certDraft.periodToYear}
                              onChange={(v) => setCertDraft((d) => d && ({
                                ...d,
                                periodToDay:   v.day   ?? d.periodToDay,
                                periodToMonth: v.month ?? d.periodToMonth,
                                periodToYear:  v.year  ?? d.periodToYear,
                              }))}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[10px] text-gray-500 mb-1">{grossLbl}</p>
                            <input type="number" dir="ltr" min={0} value={certDraft.grossAmount}
                              onChange={(e) => { setCertDraft((d) => d && ({ ...d, grossAmount: e.target.value })); setCertErrors({}); }}
                              className={inputCls(certErrors.grossAmount)} />
                            {certErrors.grossAmount && <p className="text-[10px] text-red-400 mt-0.5">{certErrors.grossAmount}</p>}
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 mb-1">{dedLbl}</p>
                            <input type="number" dir="ltr" min={0} value={certDraft.deductions}
                              onChange={(e) => setCertDraft((d) => d && ({ ...d, deductions: e.target.value }))}
                              className={inputCls()} />
                          </div>
                        </div>
                        {certDraft.grossAmount && (
                          <p className="text-xs text-gray-400">
                            {t("certNetCalc")}: <span className="text-emerald-400 font-semibold">
                              {fmt(Math.max(0, (+certDraft.grossAmount || 0) - (+certDraft.deductions || 0)))} {cur}
                            </span>
                          </p>
                        )}
                        <div>
                          <p className="text-[10px] text-gray-500 mb-1">{coStatusLabel}</p>
                          <StatusButtons
                            value={certDraft.status}
                            options={CERT_STATUSES}
                            onChange={(s) => setCertDraft((d) => d && ({ ...d, status: s }))}
                            colorMap={CERT_COLOR}
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => saveCertEdit(cert)} disabled={savingId === cert.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                            {savingId === cert.id
                              ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                              : <Check className="w-3.5 h-3.5" />}
                            {t("save")}
                          </button>
                          <button onClick={() => setEditingCertId(null)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs transition-colors">
                            <X className="w-3.5 h-3.5" /> {t("cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Display row ── */
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] group">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-mono text-xs text-orange-400">{cert.certNumber}</span>
                              <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] ${pb.className}`}>{pb.label}</span>
                            </div>
                            <p className="text-[11px] text-gray-500">
                              {formatContractDate(cert.periodFrom, lang)} {t("dateSeparator")} {formatContractDate(cert.periodTo, lang)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="grid grid-cols-3 gap-3 text-center text-xs">
                              <div>
                                <p className="text-[10px] text-gray-500">{t("certGross")}</p>
                                <p className="text-white font-medium mt-0.5">{fmt(cert.grossAmount)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500">{t("certDeductions")}</p>
                                <p className="text-red-400 font-medium mt-0.5">-{fmt(cert.deductions)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500">{t("certNet")}</p>
                                <p className="text-emerald-400 font-semibold mt-0.5">{fmt(cert.netAmount)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startCertEdit(cert)}
                                className="p-1.5 hover:bg-emerald-500/20 text-gray-500 hover:text-emerald-400 rounded-lg transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setDeletingCertId(deletingCertId === cert.id ? null : cert.id)}
                                className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <AnimatePresence>
                          {deletingCertId === cert.id && (
                            <DeleteConfirmRow
                              message={t("deleteCertQuestion")}
                              onConfirm={() => confirmDeleteCert(cert)}
                              onCancel={() => setDeletingCertId(null)}
                              busy={certDeleteBusy}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>

      {/* ── Direct Payments ── */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white">
            {t("paymentsTitle")}
            <span className="ms-2 text-sm font-normal text-gray-400">({payments.length})</span>
          </h3>
          {remaining > 0 && (
            <button onClick={() => setPayModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" />
              {t("addPayment")}
            </button>
          )}
        </div>

        {payments.length === 0 ? (
          <p className="text-gray-500 text-sm py-6 text-center">{t("noPayments")}</p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {payments.map((pmt) => (
                <motion.div key={pmt.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {editingPmtId === pmt.id && pmtDraft ? (
                    /* ── Edit form ── */
                    <div className="p-3 rounded-xl border border-orange-500/30 bg-orange-500/5 space-y-2.5">
                      <p className="text-xs font-semibold text-orange-300">
                        {lang === "ar" ? "تعديل الدفعة" : "Edit Payment"}
                      </p>
                      <div>
                        <p className="text-[10px] text-gray-500 mb-1">{pmtTypeLabel}</p>
                        <div className="flex gap-2">
                          {(["partial", "full"] as const).map((type) => (
                            <button key={type} onClick={() => setPmtDraft((d) => d && ({ ...d, type }))}
                              className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                pmtDraft.type === type
                                  ? type === "full"
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                    : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                              }`}>
                              {type === "full" ? t("paymentTypeFull") : t("paymentTypePartial")}
                            </button>
                          ))}
                        </div>
                      </div>
                      {pmtDraft.type === "partial" && (
                        <div>
                          <p className="text-[10px] text-gray-500 mb-1">{t("fieldPaymentAmount")}</p>
                          <input type="number" dir="ltr" min={0} value={pmtDraft.amount}
                            onChange={(e) => { setPmtDraft((d) => d && ({ ...d, amount: e.target.value })); setPmtErrors({}); }}
                            className={inputCls(pmtErrors.amount)} />
                          {pmtErrors.amount && <p className="text-[10px] text-red-400 mt-0.5">{pmtErrors.amount}</p>}
                        </div>
                      )}
                      {pmtDraft.type === "full" && (
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-xs text-emerald-400">{t("fullPaymentNote")}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] text-gray-500 mb-1">{pmtDescLabel}</p>
                        <input type="text" value={pmtDraft.description}
                          onChange={(e) => { setPmtDraft((d) => d && ({ ...d, description: e.target.value })); setPmtErrors({}); }}
                          className={inputCls(pmtErrors.description)} />
                        {pmtErrors.description && <p className="text-[10px] text-red-400 mt-0.5">{pmtErrors.description}</p>}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 mb-1">{pmtRefLabel}</p>
                        <input type="text" value={pmtDraft.reference}
                          onChange={(e) => { setPmtDraft((d) => d && ({ ...d, reference: e.target.value })); setPmtErrors({}); }}
                          className={inputCls(pmtErrors.reference)} />
                        {pmtErrors.reference && <p className="text-[10px] text-red-400 mt-0.5">{pmtErrors.reference}</p>}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 mb-1">{pmtDateLabel}</p>
                        <DateInput
                          day={pmtDraft.paidDay} month={pmtDraft.paidMonth} year={pmtDraft.paidYear}
                          onChange={(v) => setPmtDraft((d) => d && ({
                            ...d,
                            paidDay:   v.day   ?? d.paidDay,
                            paidMonth: v.month ?? d.paidMonth,
                            paidYear:  v.year  ?? d.paidYear,
                          }))}
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => savePmtEdit(pmt)} disabled={savingId === pmt.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                          {savingId === pmt.id
                            ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            : <Check className="w-3.5 h-3.5" />}
                          {t("save")}
                        </button>
                        <button onClick={() => setEditingPmtId(null)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs transition-colors">
                          <X className="w-3.5 h-3.5" /> {t("cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Display row ── */
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] group">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`px-2 py-0.5 rounded-md border text-[10px] ${
                              pmt.type === "full"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                            }`}>
                              {pmt.type === "full" ? t("paymentTypeFull") : t("paymentTypePartial")}
                            </span>
                            <span className="font-mono text-[10px] text-gray-500">{pmt.reference}</span>
                          </div>
                          <p className="text-sm text-gray-300">{pmt.description}</p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            {pmtDateLabel}: {formatContractDate(pmt.paidOn, lang)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-emerald-400">+{fmt(pmt.amount)}</p>
                            <p className="text-[10px] text-gray-500">{cur}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startPmtEdit(pmt)}
                              className="p-1.5 hover:bg-orange-500/20 text-gray-500 hover:text-orange-400 rounded-lg transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeletingPmtId(deletingPmtId === pmt.id ? null : pmt.id)}
                              className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <AnimatePresence>
                        {deletingPmtId === pmt.id && (
                          <DeleteConfirmRow
                            message={t("deletePaymentQuestion")}
                            onConfirm={() => confirmDeletePmt(pmt)}
                            onCancel={() => setDeletingPmtId(null)}
                            busy={pmtDeleteBusy}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>

      {/* ── Modals ── */}
      <AddCertModal
        isOpen={certModalOpen} contractId={contract.id} lang={lang}
        onClose={() => setCertModalOpen(false)} onSaved={handleCertSaved}
      />
      <AddChangeOrderModal
        isOpen={coModalOpen} contractId={contract.id} lang={lang}
        onClose={() => setCoModalOpen(false)} onSaved={handleCoSaved}
      />
      <AddPaymentModal
        isOpen={payModalOpen} contractId={contract.id} remainingAmount={remaining} lang={lang}
        onClose={() => setPayModalOpen(false)} onSaved={handlePaymentSaved}
      />
      <EditContractModal
        isOpen={editModalOpen} contract={contract} lang={lang}
        onClose={() => setEditModalOpen(false)} onSaved={handleContractEdited}
      />
    </div>
  );
}
