// ============================================================
// TwoFactorModal.tsx
// ============================================================
import { useState } from "react";
import { ShieldCheck, Smartphone } from "lucide-react";
import SettingsModal from "./SettingsModal";
import { t } from "../../core/i18n/settings.i18n";
import type { TwoFactorModalProps } from "../../core/models/Settings.types";

export default function TwoFactorModal({ isOpen, onClose, onEnable, isEnabled, lang }: TwoFactorModalProps) {
  const [code, setCode]   = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => { setCode(""); setError(""); onClose(); };
  const handleSubmit = async () => {
    setError("");
    if (code.length !== 6) return setError(t(lang, "errCodeLen"));
    setLoading(true);
    try { await onEnable(code); handleClose(); }
    catch { setError(t(lang, "errCodeLen")); }
    finally { setLoading(false); }
  };

  const title = isEnabled ? t(lang, "twoFactorMgTitle") : t(lang, "twoFactorTitle");

  return (
    <SettingsModal isOpen={isOpen} onClose={handleClose} title={title}
                   accentColor="from-emerald-500 to-emerald-400" lang={lang}>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20
                        flex items-center justify-center mb-4">
          {isEnabled
            ? <ShieldCheck className="w-8 h-8 text-emerald-400" />
            : <Smartphone  className="w-8 h-8 text-emerald-400" />}
        </div>
        {isEnabled ? (
          <p className="text-sm text-gray-400">{t(lang, "twoFactorMgDesc")}</p>
        ) : (
          <>
            <p className="text-sm text-gray-300 font-medium mb-1">{t(lang, "scanQr")}</p>
            <p className="text-sm text-gray-400 mb-4">{t(lang, "scanQrApp")}</p>
            {/* QR placeholder */}
            <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center mb-4 p-2">
              <div className="grid grid-cols-5 gap-0.5 w-full h-full">
                {Array.from({ length: 25 }, (_, i) => (
                  <div key={i} className={`rounded-sm ${[0,1,2,5,7,12,14,17,22,23,24].includes(i) ? "bg-black" : "bg-white"}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">{t(lang, "enterCode")}</p>
            {/* OTP boxes */}
            <div dir="ltr" className="flex gap-2 justify-center mb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <input key={i} type="text" maxLength={1} inputMode="numeric"
                       value={code[i] ?? ""}
                       onChange={(e) => {
                         const next = code.split("");
                         next[i] = e.target.value.replace(/[^0-9]/, "");
                         setCode(next.join("").slice(0, 6));
                         if (e.target.value && i < 5)
                           (e.target.nextElementSibling as HTMLInputElement)?.focus();
                       }}
                       className="w-10 h-12 bg-white/5 border border-white/10 rounded-xl text-center
                                  text-white text-lg font-bold focus:outline-none focus:border-emerald-400
                                  transition-colors" />
              ))}
            </div>
          </>
        )}
      </div>
      {!isEnabled && error && (
        <p className="text-sm text-red-400 text-center mb-4">{error}</p>
      )}
      {!isEnabled ? (
        <div className="flex gap-3">
          <button onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10
                             border border-white/10 text-gray-300 text-sm transition-all">
            {t(lang, "cancel")}
          </button>
          <button onClick={handleSubmit} disabled={loading || code.length !== 6}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-emerald-500 to-emerald-600
                             text-white text-sm font-medium flex items-center justify-center gap-2
                             hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-60">
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? t(lang, "verifying") : t(lang, "enable")}
          </button>
        </div>
      ) : (
        <button onClick={handleClose}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10
                           border border-white/10 text-gray-300 text-sm transition-all">
          {t(lang, "close")}
        </button>
      )}
    </SettingsModal>
  );
}
