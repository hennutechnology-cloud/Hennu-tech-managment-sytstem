// ============================================================
// SystemSection.tsx
// ============================================================
import { Server, Trash2 } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { SelectField, Toggle, ActionRow } from "./SettingsField";
import { t } from "../../core/i18n/settings.i18n";
import type { SystemSectionProps } from "../../core/models/Settings.types";

export default function SystemSection({ data, onChange, onBackupNow, onResetData, lang }: SystemSectionProps) {
  function set<K extends keyof typeof data>(key: K, value: typeof data[K]) {
    onChange({ ...data, [key]: value });
  }
  const freqOptions = [
    { value: "daily",   label: t(lang, "freqDaily")   },
    { value: "weekly",  label: t(lang, "freqWeekly")  },
    { value: "monthly", label: t(lang, "freqMonthly") },
  ];
  return (
    <SettingsSection title={t(lang, "systemTitle")} subtitle={t(lang, "systemSub")}
                     icon={Server} iconColor="text-cyan-400" lang={lang}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <SelectField label={t(lang, "backupFreq")} value={data.backupFrequency}
                     onChange={(e) => set("backupFrequency", e.target.value as typeof data.backupFrequency)}
                     options={freqOptions} />
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">{t(lang, "backupRetention")}</label>
          <input type="number" min={7} max={365} value={data.backupRetention}
                 onChange={(e) => set("backupRetention", Number(e.target.value))}
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                            text-white text-sm focus:outline-none focus:border-[#F97316] transition-colors" />
        </div>
      </div>
      <ActionRow label={t(lang, "backupNow")} description={t(lang, "backupNowDesc")}
                 buttonLabel={t(lang, "backupNowBtn")} onClick={onBackupNow} variant="slate" />
      <Toggle label={t(lang, "maintenanceMode")} description={t(lang, "maintenanceDesc")}
              checked={data.maintenanceMode} onChange={(v) => set("maintenanceMode", v)} accent="bg-amber-500" />
      <Toggle label={t(lang, "debugMode")} description={t(lang, "debugDesc")}
              checked={data.debugMode} onChange={(v) => set("debugMode", v)} accent="bg-purple-500" />
      {/* Danger zone */}
      <div className="mt-6 pt-5 border-t border-red-500/20">
        <p className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          {t(lang, "dangerZone")}
        </p>
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
          <ActionRow label={t(lang, "resetData")} description={t(lang, "resetDataDesc")}
                     buttonLabel={t(lang, "resetBtn")} onClick={onResetData} variant="red" />
        </div>
      </div>
    </SettingsSection>
  );
}
