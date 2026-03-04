// ============================================================
// PreferencesSection.tsx
// ============================================================
import { SlidersHorizontal } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { SelectField, Toggle } from "./SettingsField";
import { t, CURRENCIES, currencyName } from "../../core/i18n/settings.i18n";
import type { PreferencesSectionProps } from "../../core/models/Settings.types";

const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];
const NUMBER_FORMATS = [
  { value: "1,234.56", label: "1,234.56" },
  { value: "1.234,56", label: "1.234,56" },
  { value: "1234.56",  label: "1234.56"  },
];

export default function PreferencesSection({ data, onChange, lang }: PreferencesSectionProps) {
  function set<K extends keyof typeof data>(key: K, value: typeof data[K]) {
    onChange({ ...data, [key]: value });
  }

  // Build currency options in the current language
  const currencyOptions = Object.keys(CURRENCIES).map((code) => ({
    value: code,
    label: currencyName(code, lang),
  }));

  // Build fiscal year options in the current language
  const fiscalOptions = [
    { value: "01-01", label: t(lang, "janLabel") },
    { value: "04-01", label: t(lang, "aprLabel") },
    { value: "07-01", label: t(lang, "julLabel") },
    { value: "10-01", label: t(lang, "octLabel") },
  ];

  return (
    <SettingsSection title={t(lang, "prefTitle")} subtitle={t(lang, "prefSub")}
                     icon={SlidersHorizontal} iconColor="text-purple-400" lang={lang}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <SelectField label={t(lang, "currency")}        value={data.currency}        onChange={(e) => set("currency", e.target.value)}        options={currencyOptions} />
        <SelectField label={t(lang, "dateFormat")}      value={data.dateFormat}      onChange={(e) => set("dateFormat", e.target.value)}      options={DATE_FORMATS} />
        <SelectField label={t(lang, "numberFormat")}    value={data.numberFormat}    onChange={(e) => set("numberFormat", e.target.value)}    options={NUMBER_FORMATS} />
        <SelectField label={t(lang, "fiscalYearStart")} value={data.fiscalYearStart} onChange={(e) => set("fiscalYearStart", e.target.value)} options={fiscalOptions} />
      </div>
      <Toggle label={t(lang, "sidebarCollapsed")} description={t(lang, "sidebarCollDesc")}
              checked={data.sidebarCollapsed} onChange={(v) => set("sidebarCollapsed", v)} />
    </SettingsSection>
  );
}
