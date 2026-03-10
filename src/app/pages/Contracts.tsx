// ============================================================
// Contracts.tsx — Standalone contracts page
// Features: view all, select for inline detail,
//           add contract (with project picker), edit, add cert/CO/payment.
// ============================================================
import { useEffect, useState } from "react";
import { Plus }                from "lucide-react";
import { useLang }             from "../core/context/LangContext";
import { useProjectContext }   from "../core/context/ProjectContext";
import { contractsService }    from "../core/services/contracts.service";
import { projectsService }     from "../core/services/project.service";
import { tContract, dirAttr }  from "../core/i18n/contracts.i18n";
import ContractsHeader         from "../components/Contracts/ContractsHeader";
import ContractsTable          from "../components/Contracts/ContractsTable";
import ContractDetail          from "../components/Contracts/ContractDetail";
import ContractModal           from "../components/Contracts/ContractModal";
import AddContractModal        from "../components/Contracts/AddContractModal";
import type {
  Contract, ChangeOrder, PaymentCertificate, ContractStats,
} from "../core/models/contracts.types";
import type { Project } from "../core/models/projects.types";

function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-2xl bg-white/5 animate-pulse ${className}`} />;
}

export default function Contracts() {
  const { lang }            = useLang();
  const { selectedProject } = useProjectContext();

  const [contracts,    setContracts]    = useState<Contract[]>([]);
  const [stats,        setStats]        = useState<ContractStats | null>(null);
  const [selectedId,   setSelectedId]   = useState<number | null>(null);
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
  const [certificates, setCertificates] = useState<PaymentCertificate[]>([]);
  const [modalContract,setModalContract]= useState<Contract | null>(null);
  const [addOpen,      setAddOpen]      = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(false);

  // Projects list for the AddContractModal dropdown
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    Promise.all([
      contractsService.fetchAll(),
      contractsService.fetchStats(),
      projectsService.fetchProjects(),
    ])
      .then(([c, s, p]) => {
        setContracts(c);
        setStats(s);
        setProjects(p);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

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

  const refreshStats = async () => {
    const s = await contractsService.fetchStats();
    setStats(s);
  };

  const handleContractAdded = async (contract: Contract) => {
    setContracts((prev) => [...prev, contract]);
    await refreshStats();
  };

  const handleContractUpdated = async (updated: Contract) => {
    setContracts((prev) => prev.map((c) => c.id === updated.id ? updated : c));
    await refreshStats();
  };

  if (loading) {
    return (
      <div className="space-y-6" dir={dirAttr(lang)}>
        <Skeleton className="h-16" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
        <p className="text-center text-gray-500 text-sm">{tContract(lang, "loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{tContract(lang, "loadError")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8" dir={dirAttr(lang)}>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {tContract(lang, "pageTitle")}
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            {tContract(lang, "pageSubtitle")}
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all font-medium shrink-0"
        >
          <Plus className="w-5 h-5" />
          {tContract(lang, "addContract")}
        </button>
      </div>

      {/* Stats */}
      {stats && <ContractsHeader stats={stats} lang={lang} />}

      {/* Contracts table */}
      <ContractsTable
        contracts={contracts}
        lang={lang}
        selectedContractId={selectedId}
        onSelect={(c) => setSelectedId((prev) => prev === c.id ? null : c.id)}
        onView={setModalContract}
      />

      {/* Inline detail panel */}
      {selectedContract && (
        <ContractDetail
          contract={selectedContract}
          changeOrders={changeOrders}
          certificates={certificates}
          lang={lang}
          onContractUpdated={handleContractUpdated}
          onCertAdded={refreshStats}
          onChangeOrderAdded={refreshStats}
        />
      )}

      {/* Add contract modal — passes full projects list for dropdown */}
      <AddContractModal
        isOpen={addOpen}
        projectId={selectedProject?.id ?? 0}
        projects={projects}
        lang={lang}
        onClose={() => setAddOpen(false)}
        onSaved={handleContractAdded}
      />

      {/* Full-detail view modal */}
      <ContractModal
        isOpen={modalContract !== null}
        contract={modalContract}
        lang={lang}
        onClose={() => setModalContract(null)}
      />
    </div>
  );
}
