// ============================================================
// ProjectContractsWidget.tsx
// Compact contracts panel embedded in the Projects page.
// Receives projectId (from selectedProject) and renders the
// contract list + inline detail for that project only.
// ============================================================
import { useEffect, useState } from "react";
import { motion }              from "motion/react";
import GlassCard               from "../../core/shared/components/GlassCard";
import ContractCard            from "./ContractCard";
import ContractDetail          from "./ContractDetail";
import ContractModal           from "./ContractModal";
import { contractsService }    from "../../core/services/contracts.service";
import { tContract, dirAttr }  from "../../core/i18n/contracts.i18n";
import { formatNum }           from "../../core/i18n/projects.i18n";
import type {
  Contract, ChangeOrder, PaymentCertificate, ContractStats,
  ProjectContractsWidgetProps,
} from "../../core/models/contracts.types";

export default function ProjectContractsWidget({ projectId, lang }: ProjectContractsWidgetProps) {
  const [contracts,    setContracts]    = useState<Contract[]>([]);
  const [stats,        setStats]        = useState<ContractStats | null>(null);
  const [selectedId,   setSelectedId]   = useState<number | null>(null);
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
  const [certificates, setCertificates] = useState<PaymentCertificate[]>([]);
  const [modalC,       setModalC]       = useState<Contract | null>(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    setLoading(true);
    setSelectedId(null);
    Promise.all([
      contractsService.fetchByProject(projectId),
      contractsService.fetchStatsByProject(projectId),
    ]).then(([c, s]) => { setContracts(c); setStats(s); })
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    if (selectedId == null) return;
    Promise.all([
      contractsService.fetchChangeOrders(selectedId),
      contractsService.fetchCertificates(selectedId),
    ]).then(([co, cert]) => {
      setChangeOrders(co);
      setCertificates(cert);
    });
  }, [selectedId]);

  const selectedContract = contracts.find((c) => c.id === selectedId) ?? null;
  const fmt = (n: number) => formatNum(n, lang);
  const cur = tContract(lang, "currency");

  return (
    <div dir={dirAttr(lang)} className="space-y-4 sm:space-y-5">
      {/* Section title */}
      <h2 className="text-lg sm:text-xl font-bold text-white">
        {tContract(lang, "widgetTitle")}
        {stats && (
          <span className="ms-2 text-sm font-normal text-gray-400">
            ({stats.totalContracts})
          </span>
        )}
      </h2>

      {/* Mini stats row */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: tContract(lang, "statsTotalValue"),    value: fmt(stats.totalValue),     color: "text-orange-400" },
            { label: tContract(lang, "statsTotalPaid"),     value: fmt(stats.totalPaid),      color: "text-emerald-400" },
            { label: tContract(lang, "statsTotalRetention"),value: fmt(stats.totalRetention), color: "text-yellow-400" },
            { label: tContract(lang, "statsTotalPending"),  value: fmt(stats.totalPending),   color: "text-blue-400" },
          ].map(({ label, value, color }) => (
            <GlassCard key={label}>
              <p className="text-xs text-gray-400 mb-1 leading-snug">{label}</p>
              <p className={`text-base sm:text-lg font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{cur}</p>
            </GlassCard>
          ))}
        </motion.div>
      )}

      {/* Contract list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-7 h-7 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : contracts.length === 0 ? (
        <GlassCard>
          <p className="text-center text-gray-500 py-8 text-sm">{tContract(lang, "noContracts")}</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((contract, index) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              lang={lang}
              selected={contract.id === selectedId}
              onSelect={() => setSelectedId((prev) => prev === contract.id ? null : contract.id)}
              onView={() => setModalC(contract)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Inline detail for selected contract */}
      {selectedContract && (
        <ContractDetail
          contract={selectedContract}
          changeOrders={changeOrders}
          certificates={certificates}
          lang={lang}
        />
      )}

      {/* Full modal */}
      <ContractModal
        isOpen={modalC !== null}
        contract={modalC}
        lang={lang}
        onClose={() => setModalC(null)}
      />
    </div>
  );
}
