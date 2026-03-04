// ============================================================
// NotificationsSection.tsx
// ============================================================
import { Bell } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { Toggle } from "./SettingsField";
import { t } from "../../core/i18n/settings.i18n";
import type { NotificationsSectionProps } from "../../core/models/Settings.types";

export default function NotificationsSection({ data, onChange, lang }: NotificationsSectionProps) {
  function set<K extends keyof typeof data>(key: K, v: boolean) {
    onChange({ ...data, [key]: v });
  }
  return (
    <SettingsSection title={t(lang, "notifTitle")} subtitle={t(lang, "notifSub")}
                     icon={Bell} iconColor="text-yellow-400" lang={lang}>
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-medium">
        {t(lang, "channelsLabel")}
      </p>
      <Toggle label={t(lang, "emailAlerts")} description={t(lang, "emailAlertDesc")} checked={data.emailAlerts}   onChange={(v) => set("emailAlerts", v)} />
      <Toggle label={t(lang, "smsAlerts")}   description={t(lang, "smsAlertDesc")}   checked={data.smsAlerts}     onChange={(v) => set("smsAlerts", v)} />
      <Toggle label={t(lang, "pushAlerts")}  description={t(lang, "pushAlertDesc")}  checked={data.pushAlerts}    onChange={(v) => set("pushAlerts", v)} />
      <p className="text-xs text-gray-500 uppercase tracking-widest mt-5 mb-2 font-medium">
        {t(lang, "typesLabel")}
      </p>
      <Toggle label={t(lang, "reportReady")}   description={t(lang, "reportReadyDesc")} checked={data.reportReady}   onChange={(v) => set("reportReady", v)} />
      <Toggle label={t(lang, "budgetWarning")} description={t(lang, "budgetWarnDesc")}  checked={data.budgetWarning} onChange={(v) => set("budgetWarning", v)} />
      <Toggle label={t(lang, "invoiceDue")}    description={t(lang, "invoiceDueDesc")}  checked={data.invoiceDue}    onChange={(v) => set("invoiceDue", v)} />
      <Toggle label={t(lang, "systemUpdates")} description={t(lang, "systemUpdDesc")}   checked={data.systemUpdates} onChange={(v) => set("systemUpdates", v)} />
    </SettingsSection>
  );
}
