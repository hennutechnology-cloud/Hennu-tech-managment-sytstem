// ============================================================
// SecuritySection.tsx
// ============================================================
import { Shield, CheckCircle, XCircle } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { Field, Toggle, ActionRow } from "./SettingsField";
import { t } from "../../core/i18n/settings.i18n";
import type { SecuritySectionProps } from "../../core/models/Settings.types";

export default function SecuritySection({
  data, onChange, onChangePassword, onSetupTwoFactor, lang,
}: SecuritySectionProps) {
  function set<K extends keyof typeof data>(key: K, value: typeof data[K]) {
    onChange({ ...data, [key]: value });
  }
  return (
    <SettingsSection title={t(lang, "securityTitle")} subtitle={t(lang, "securitySub")}
                     icon={Shield} iconColor="text-emerald-400" lang={lang}>
      {/* 2FA banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl mb-5 border
                       ${data.twoFactorEnabled
                         ? "bg-emerald-500/10 border-emerald-500/20"
                         : "bg-amber-500/10 border-amber-500/20"}`}>
        {data.twoFactorEnabled
          ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          : <XCircle     className="w-5 h-5 text-amber-400  flex-shrink-0" />}
        <div className="flex-1">
          <p className={`text-sm font-medium ${data.twoFactorEnabled ? "text-emerald-400" : "text-amber-400"}`}>
            {data.twoFactorEnabled ? t(lang, "twoFactorOn") : t(lang, "twoFactorOff")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {data.twoFactorEnabled ? t(lang, "twoFactorOnDesc") : t(lang, "twoFactorOffDesc")}
          </p>
        </div>
        <button
          onClick={onSetupTwoFactor}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium flex-shrink-0 transition-all
                      ${data.twoFactorEnabled
                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"}`}>
          {data.twoFactorEnabled ? t(lang, "manage") : t(lang, "activate")}
        </button>
      </div>
      <ActionRow label={t(lang, "changePassword")} description={t(lang, "lastChanged")}
                 buttonLabel={t(lang, "changePassword")} onClick={onChangePassword} variant="orange" />
      <Toggle label={t(lang, "loginNotif")} description={t(lang, "loginNotifDesc")}
              checked={data.loginNotification} onChange={(v) => set("loginNotification", v)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">{t(lang, "sessionTimeout")}</label>
          <input type="number" min={5} max={480} value={data.sessionTimeout}
                 onChange={(e) => set("sessionTimeout", Number(e.target.value))}
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                            text-white text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
        </div>
        <Field label={t(lang, "ipWhitelist")} value={data.ipWhitelist}
               onChange={(e) => set("ipWhitelist", e.target.value)}
               placeholder="192.168.1.1" hint={t(lang, "ipHint")} />
      </div>
    </SettingsSection>
  );
}
