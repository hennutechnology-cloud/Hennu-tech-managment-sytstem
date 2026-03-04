// ============================================================
// ChangePasswordModal.tsx
// ============================================================
import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import SettingsModal from "./SettingsModal";
import { t } from "../../core/i18n/settings.i18n";
import type { ChangePasswordModalProps } from "../../core/models/Settings.types";

export default function ChangePasswordModal({ isOpen, onClose, onSubmit, lang }: ChangePasswordModalProps) {
  const [form, setForm]   = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow]   = useState({ current: false, new: false, confirm: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => { setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setError(""); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    setError("");
    if (!form.currentPassword) return setError(t(lang, "errCurrentPwd"));
    if (form.newPassword.length < 8) return setError(t(lang, "errPwdLength"));
    if (form.newPassword !== form.confirmPassword) return setError(t(lang, "errPwdMatch"));
    setLoading(true);
    try {
      await onSubmit(form);
      handleClose();
    } catch {
      setError(t(lang, "errCurrentPwd"));
    } finally {
      setLoading(false);
    }
  };

  const PwdField = ({ label, fkey, skey }: { label: string; fkey: keyof typeof form; skey: keyof typeof show }) => (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        <input type={show[skey] ? "text" : "password"} value={form[fkey]}
               onChange={(e) => setForm((p) => ({ ...p, [fkey]: e.target.value }))}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                          text-white text-sm focus:outline-none focus:border-[#F97316] transition-colors pl-10" />
        <button onClick={() => setShow((p) => ({ ...p, [skey]: !p[skey] }))}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
          {show[skey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <SettingsModal isOpen={isOpen} onClose={handleClose} title={t(lang, "changePwdTitle")} lang={lang}>
      <div className="flex flex-col items-center mb-5">
        <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20
                        flex items-center justify-center mb-3">
          <KeyRound className="w-6 h-6 text-[#F97316]" />
        </div>
        <p className="text-sm text-gray-400 text-center">{t(lang, "changePwdDesc")}</p>
      </div>
      <div className="space-y-4">
        <PwdField label={t(lang, "currentPwd")} fkey="currentPassword" skey="current" />
        <PwdField label={t(lang, "newPwd")}     fkey="newPassword"     skey="new" />
        <PwdField label={t(lang, "confirmPwd")} fkey="confirmPassword" skey="confirm" />
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20
                      rounded-xl px-4 py-2">{error}</p>
      )}
      <div className="flex gap-3 mt-6">
        <button onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10
                           border border-white/10 text-gray-300 text-sm transition-all">
          {t(lang, "cancel")}
        </button>
        <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-[#F97316] to-[#EA580C]
                           text-white text-sm font-medium flex items-center justify-center gap-2
                           hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-60">
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {loading ? t(lang, "changingPwd") : t(lang, "changePassword")}
        </button>
      </div>
    </SettingsModal>
  );
}
