// ============================================================
// BackupModal.tsx
// ============================================================
import { useState, useEffect } from "react";
import { DatabaseBackup, CheckCircle } from "lucide-react";
import SettingsModal from "./SettingsModal";
import { t } from "../../core/i18n/settings.i18n";
import type { BackupModalProps } from "../../core/models/Settings.types";

export default function BackupModal({ isOpen, onClose, lang }: BackupModalProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setProgress(0); setDone(false);
    const timer = setInterval(() => {
      setProgress((p) => { if (p >= 100) { clearInterval(timer); setDone(true); return 100; } return p + 4; });
    }, 80);
    return () => clearInterval(timer);
  }, [isOpen]);

  return (
    <SettingsModal isOpen={isOpen} onClose={done ? onClose : () => {}}
                   title={t(lang, "backupTitle")} accentColor="from-cyan-500 to-cyan-400" lang={lang}>
      <div className="flex flex-col items-center text-center py-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5
                         ${done ? "bg-emerald-500/10 border border-emerald-500/20"
                                : "bg-cyan-500/10 border border-cyan-500/20"}`}>
          {done
            ? <CheckCircle className="w-8 h-8 text-emerald-400" />
            : <DatabaseBackup className="w-8 h-8 text-cyan-400 animate-pulse" />}
        </div>
        <p className="text-white font-semibold mb-1">
          {done ? t(lang, "backupDone") : t(lang, "backupProgress")}
        </p>
        <p className="text-sm text-gray-400 mb-6">
          {done ? t(lang, "backupDoneDesc") : t(lang, "backupDontClose")}
        </p>
        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
          <div className={`h-2 rounded-full transition-all duration-150
                           ${done ? "bg-emerald-500" : "bg-cyan-500"}`}
               style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-gray-500">{progress}%</p>
        {done && (
          <button onClick={onClose}
                  className="mt-6 px-8 py-2.5 rounded-xl bg-gradient-to-l from-emerald-500 to-emerald-600
                             text-white text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
            {t(lang, "close")}
          </button>
        )}
      </div>
    </SettingsModal>
  );
}
