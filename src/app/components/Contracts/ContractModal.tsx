// ============================================================
// ContractModal.tsx — Responsive modal (bottom sheet / dialog)
// ============================================================
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { tContract, dirAttr } from "../../core/i18n/contracts.i18n";
import { contractsService }   from "../../core/services/contracts.service";
import ContractDetail         from "./ContractDetail";
import type {
  ContractModalProps, ChangeOrder, PaymentCertificate,
} from "../../core/models/contracts.types";

export default function ContractModal({ isOpen, contract, lang, onClose }: ContractModalProps) {
  const [changeOrders,  setChangeOrders]  = useState<ChangeOrder[]>([]);
  const [certificates,  setCertificates]  = useState<PaymentCertificate[]>([]);
  const [loading,       setLoading]       = useState(false);

  useEffect(() => {
    if (!isOpen || !contract) return;
    setLoading(true);
    Promise.all([
      contractsService.fetchChangeOrders(contract.id),
      contractsService.fetchCertificates(contract.id),
    ]).then(([co, cert]) => {
      setChangeOrders(co);
      setCertificates(cert);
    }).finally(() => setLoading(false));
  }, [isOpen, contract?.id]);

  if (!isOpen || !contract) return null;

  const inner = (
    <div dir={dirAttr(lang)}>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : (
        <ContractDetail
          contract={contract}
          changeOrders={changeOrders}
          certificates={certificates}
          lang={lang}
        />
      )}
    </div>
  );

  const header = (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-gradient-to-l from-orange-500/10 to-transparent shrink-0">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-white">
          {tContract(lang, "detailTitle")}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          <span className="font-mono text-orange-400">{contract.contractNumber}</span>
          {" · "}{contract.contractorName}
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="contract-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Mobile: bottom sheet */}
          <motion.div
            key="contract-mobile"
            dir={dirAttr(lang)}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-[#0f1117] border-t border-white/10 rounded-t-2xl shadow-2xl max-h-[96dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#F97316] to-[#EA580C]" />
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            {header}
            <div className="overflow-y-auto flex-1 px-5 py-5">
              {inner}
            </div>
            <div className="px-5 py-4 border-t border-white/10 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors text-sm"
              >
                {tContract(lang, "close")}
              </button>
            </div>
          </motion.div>

          {/* sm+: large centered dialog */}
          <motion.div
            key="contract-dialog"
            dir={dirAttr(lang)}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: 20  }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hidden sm:flex fixed inset-0 z-50 items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-5xl bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="h-1 w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] shrink-0" />
              {header}
              <div className="overflow-y-auto flex-1 px-6 py-6">
                {inner}
              </div>
              <div className="px-6 py-4 border-t border-white/10 shrink-0 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors text-sm"
                >
                  {tContract(lang, "close")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
