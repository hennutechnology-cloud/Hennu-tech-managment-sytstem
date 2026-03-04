// ============================================================
// SettingsModal.tsx — Shared modal shell
// ============================================================
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { Lang } from "../../core/models/Settings.types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  accentColor?: string;
  maxWidth?: string;
  lang: Lang;
  children: ReactNode;
}

export default function SettingsModal({
  isOpen, onClose, title, lang,
  accentColor = "from-[#F97316] to-[#EA580C]",
  maxWidth = "max-w-md",
  children,
}: SettingsModalProps) {
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="sm-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            key="sm-dialog"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit  ={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-0 z-[51] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              dir={dir}
              className={`w-full ${maxWidth} bg-[#0f1117] border border-white/10
                           rounded-2xl shadow-2xl overflow-hidden`}
            >
              <div className={`h-1 w-full bg-gradient-to-l ${accentColor}`} />
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                             bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-6 py-5">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
