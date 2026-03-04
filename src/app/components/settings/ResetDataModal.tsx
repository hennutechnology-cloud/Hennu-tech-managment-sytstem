// ============================================================
// ResetDataModal.tsx
// ============================================================
import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import SettingsModal from "./SettingsModal";
import { t } from "../../core/i18n/settings.i18n";
import type { ResetDataModalProps } from "../../core/models/Settings.types";

export default function ResetDataModal({ isOpen, onClose, onConfirm, lang }: ResetDataModalProps) {
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const CONFIRM_WORD = t(lang, "resetConfirmWord");
  const isMatch = input === CONFIRM_WORD;

  const handleClose = () => { setInput(""); onClose(); };
  const handleConfirm = async () => {
    if (!isMatch) return;
    setLoading(true);
    try { await onConfirm(); handleClose(); }
    finally { setLoading(false); }
  };

  return (
    <SettingsModal isOpen={isOpen} onClose={handleClose} title={t(lang, "resetModalTitle")}
                   accentColor="from-red-500 to-red-600" lang={lang}>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20
                        flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h4 className="text-white font-bold mb-2">{t(lang, "resetWarning")}</h4>
        <p className="text-sm text-gray-400 leading-relaxed">
          {t(lang, "resetWarningDesc")} —
          <span className="text-red-400 font-semibold"> {t(lang, "resetData")}</span>
        </p>
      </div>
      <div className="mb-5">
        <label className="block text-sm text-gray-400 mb-1.5">
          {t(lang, "resetConfirmHint")} <span className="text-red-400 font-mono font-semibold">{CONFIRM_WORD}</span>
        </label>
        <input value={input} onChange={(e) => setInput(e.target.value)}
               placeholder={CONFIRM_WORD}
               className="w-full bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-2.5
                          text-white text-sm placeholder-gray-600
                          focus:outline-none focus:border-red-400 transition-colors" />
      </div>
      <div className="flex gap-3">
        <button onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10
                           border border-white/10 text-gray-300 text-sm transition-all">
          {t(lang, "cancel")}
        </button>
        <button onClick={handleConfirm} disabled={!isMatch || loading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-red-600 to-red-500
                           text-white text-sm font-medium flex items-center justify-center gap-2
                           hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-40">
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          <Trash2 className="w-4 h-4" />
          {loading ? t(lang, "deletingData") : t(lang, "resetBtn")}
        </button>
      </div>
    </SettingsModal>
  );
}
